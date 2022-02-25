<template>
  <div>
    <l-map
      ref="map"
      :zoom="zoom"
      :center="center"
      style="height: calc(100vh - 70px); width: calc(100vw - 15px);">
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    </l-map>
    <div class="custom-toolbox">
      <div v-if="segment && segment.isEditable" @click="onDeleteSegment" class="delete">
        <q-icon color="black" name="delete" />
      </div>
    </div>
    <div class="toolbar">
      <span v-if="currentPosition">
        Coordonnées centre: {{roundedLat}}, {{roundedLng}}
      </span>
      <span v-if="segment">
        {{segment.object.feature.properties.name}}: {{segment.object.feature.geometry.coordinates}}
      </span>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import L from 'leaflet';
import 'leaflet-draw';
import '../../constants/leaflet-lang-fr';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';

import { LMap, LImageOverlay, LTileLayer, LMarker, LPopup, LPolyline } from 'vue2-leaflet';

const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem('sig_auth_token')}` },
};

const geojsonFeature = [];

// const geojsonStyle = {
//   color: '#FF7800',
//   weight: 2,
//   opacity: 0.65,
// };

export default {
  name: 'CcSegments',
  components: {
    LMap,
    LImageOverlay,
    LTileLayer,
    LMarker,
    LPopup,
    LPolyline,
  },
  data() {
    return {
      projectId: this.$route.params.id,
      geojsonFeature: null,
      segment: null,
      segmentsGroup: null,
      map: null,
      // url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 18,
      center: [45.0579, -0.3375],
      colors: {
        polygon: '#F2C037',
        rectangle: '#E91C63',
        circle: '#E91C63',
      },
      currentPosition: null,
      closestPoint: null,
    };
  },
  computed: {
    roundedLat() {
      return this.currentPosition.lat.toFixed(4);
    },
    roundedLng() {
      return this.currentPosition.lng.toFixed(4);
    },
  },
  watch: {
  },
  async mounted() {
    let lastSegmentID;
    try {
      const segments = await this.$axiosSIG.get(`/gis/segments?id=${this.projectId}`, config);
      lastSegmentID = _.last(segments.data);
      _.each(segments.data, (segment) => {
        geojsonFeature.push({
          type: 'Feature',
          properties: {
            id: segment.id,
            name: segment.name,
            radius: (segment.metadata) ? segment.metadata.radius : 0,
          },
          geometry: JSON.parse(segment.geomtext),
        });
      });
      this.geojsonFeature = geojsonFeature;
    } catch (e) {
      console.log(e);
    }
    this.$nextTick(() => {
      this.map = this.$refs.map.mapObject;
      this.map._onResize();

      this.map.scrollWheelZoom.disable();

      const drawPluginOptions = {
        position: 'topright',
        draw: {
          polyline: true,
          circle: {
            shapeOptions: {
              showRadius: true,
            },
          },
          circlemarker: false,
          polygon: false,
          rectangle: false,
          marker: false,
        },
      };
      this.drawControl = new L.Control.Draw(drawPluginOptions);
      this.map.addControl(this.drawControl);

      this.clearMap();
      this.geojsonUpdate();

      this.map.on('move', (event) => {
        this.currentPosition = event.target.getCenter();
      });

      this.map.on('click', () => {
        if (this.segment) {
          this.segment.object.editing.disable();
          this.segment.isEditable = false;
        }
      });

      this.map.on(L.Draw.Event.DRAWVERTEX, async (event) => {
        const { _latlng } = event.layers._layers[Object.keys(event.layers._layers)[0]];
        try {
          const closest = await this.$axiosSIG.get(`/gis/segments/closest?lat=${_latlng.lat}&lng=${_latlng.lng}`, config);
          console.log(closest);
          if (closest && closest.data && closest.data.closestpoint) {
            const regExp = /\(([^)]+)\)/;
            const closestPointAll = regExp.exec(closest.data.closestpoint);
            this.closestPoint = closestPointAll[1].split(' ');
          }
        } catch (e) {
          console.log(e);
        }
      });

      this.map.on(L.Draw.Event.CREATED, async (event) => {
        const { layer, layerType } = event;
        this.currentLayer = layer;
        if (layerType === 'circle') {
          const point = layer.getLatLng();
          const metadata = {
            radius: layer.getRadius(),
          };
          try {
            const circle = await this.$axiosSIG.post(`/gis/segments/circle?id=${this.projectId}`, {
              name: `Circle ${lastSegmentID.id}`,
              projectID: this.projectId,
              point,
              metadata,
            }, config);
            this.addSegment(circle.data[0].id, `Circle ${lastSegmentID.id}`, point, metadata);
            lastSegmentID.id = circle.data[0].id;
            this.clearMap();
            this.geojsonUpdate();
          } catch (e) {
            console.log(e);
          }
        } else {
          const line = layer.getLatLngs();
          line[0].lat = parseFloat(this.closestPoint[1]);
          line[0].lng = parseFloat(this.closestPoint[0]);
          try {
            const segment = await this.$axiosSIG.post(`/gis/segments?id=${this.projectId}`, {
              name: `Segment ${lastSegmentID.id}`,
              projectID: this.projectId,
              line,
            }, config);
            this.addSegment(segment.data[0].id, `Segment ${lastSegmentID.id}`, line);
            lastSegmentID.id = segment.data[0].id;
            this.clearMap();
            this.geojsonUpdate();
          } catch (e) {
            console.log(e);
          }
        }
      });
    });
  },
  methods: {
    clearMap() {
      if (this.segmentsGroup) {
        this.segmentsGroup.clearLayers();
      }
    },
    geojsonUpdate() {
      const segments = L.geoJSON(this.geojsonFeature, {
        style: this.setSegmentStyle,
        onEachFeature: this.onSegmentAction,
        pointToLayer: this.onPointToLayer,
      });

      this.segmentsGroup = new L.FeatureGroup();
      this.segmentsGroup.addLayer(segments);
      this.map.addLayer(this.segmentsGroup);
    },
    addSegment(id, name, line, metadata) {
      this.geojsonFeature.push({
        type: 'Feature',
        properties: {
          id,
          name,
          radius: (metadata) ? metadata.radius : 0,
        },
        geometry: {
          type: (metadata && metadata.radius) ? 'Point' : 'LineString',
          coordinates: (metadata && metadata.radius) ?
            [line.lng, line.lat] :
            [[line[0].lng, line[0].lat], [line[1].lng, line[1].lat]],
        },
      });
    },
    onSegmentAction(feature, layer) {
      layer.on('click', (e) => {
        setTimeout(() => {
          e.target.editing.enable();
          this.segment = {
            id: e.target.feature.properties.id,
            object: e.target,
            isEditable: true,
          };
        }, 50);
        e.target.on('edit', async () => {
          try {
            if (!feature.properties.radius) {
              const line = layer.getLatLngs();
              const geoFeature = _.find(
                this.geojsonFeature,
                feat => feat.properties.id === e.target.feature.properties.id,
              );
              if (geoFeature) {
                geoFeature.geometry.coordinates = [];
                _.each(line, (point) => {
                  geoFeature.geometry.coordinates.push([point.lng, point.lat]);
                });
              }
              await this.$axiosSIG.put(`/gis/segments/${e.target.feature.properties.id}`, {
                line,
              }, config);
            } else {
              const point = layer.getLatLng();
              const metadata = {
                radius: layer.getRadius(),
              };
              await this.$axiosSIG.put(`/gis/segments/circle/${e.target.feature.properties.id}`, {
                point,
                metadata,
              }, config);
            }
            this.segment = null;
            e.target.editing.disable();
          } catch (err) {
            console.log(err);
          }
        });
      });
      layer.on('mouseover', () => {
        layer.setStyle({
          color: 'red',
          weight: 5,
        });
      });
      layer.on('mouseout', () => {
        layer.setStyle({
          color: '#FF7800',
          weight: 2,
        });
      });
    },
    onPointToLayer(feature, latlng) {
      const { geometry, properties } = feature;
      if (geometry.type === 'Point') {
        return L.circle(latlng, {
          radius: properties.radius,
        });
      }
      return null;
    },
    setSegmentStyle(feature) {
      if (feature.properties && feature.properties.radius) {
        return {
          fillColor: '#E91C63',
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        };
      }
      return {
        color: '#FF7800',
        weight: 2,
        opacity: 0.65,
      };
    },
    async onDeleteSegment() {
      if (this.segment.id) {
        try {
          await this.$axiosSIG.delete(`/gis/segments/${this.segment.id}`, config);
          const geoFeature = _.reject(
            this.geojsonFeature,
            feat => feat.properties.id === this.segment.id,
          );
          this.segment.isEditable = false;
          this.geojsonFeature = geoFeature;
          this.clearMap();
          this.geojsonUpdate();
        } catch (e) {
          console.log(e);
        }
      }
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .custom-toolbox
    position absolute
    top 150px
    right 26px
    z-index 10000
    .delete
      display flex
      justify-content center
      align-items center
      background-color #FFF
      border 2px solid rgba(0,0,0,0.2)
      background-clip padding-box
      border-radius 4px
      width 32px
      height 32px
      &:hover
        cursor pointer
        background-color #F4F4F4
  .toolbar
    position absolute
    bottom 0
    width calc(100vw - 15px)
    height 64px
    z-index 10000
    background-color rgba(41, 52, 68, 0.5)
    color #FFF
    font-size 14px
    display flex
    justify-content space-evenly
    align-items center
    padding 15px
</style>
