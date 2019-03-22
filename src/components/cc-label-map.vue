<template>
  <l-map
    ref="map"
    :min-zoom="minZoom"
    :crs="crs"
    style="width: 720px; height: 540px;">
    <l-image-overlay
      :url="image"
      :bounds="bounds"/>
  </l-map>
</template>

<script>
import _ from 'lodash';
import L from 'leaflet';
import 'leaflet-draw';
import '../constants/leaflet-lang-fr';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';

import { LMap, LImageOverlay, LTileLayer, LMarker, LPopup, LPolyline } from 'vue2-leaflet';

export default {
  name: 'CcLabelMap',
  props: ['projectId', 'data'],
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
      map: null,
      currentLayer: null,
      polygons: [],
      image: '',
      bounds: [[0, 0], [1080, 1440]],
      minZoom: -1,
      crs: L.CRS.Simple,
      colors: {
        polygon: '#F2C037',
        rectangle: '#E91C63',
      },
    };
  },
  watch: {
    data() {
      this.displayLabels();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.map = this.$refs.map.mapObject;
      this.map._onResize();

      this.editableLayers = new L.FeatureGroup();
      this.map.addLayer(this.editableLayers);

      // const drawPluginOptions = {
      //   position: 'topright',
      //   draw: {
      //     polygon: false,
      //     polyline: false,
      //     circle: false,
      //     circlemarker: false,
      //     rectangle: {
      //       shapeOptions: {
      //         showArea: false,
      //         color: this.colors.rectangle,
      //       },
      //     },
      //     marker: false,
      //   },
      //   edit: {
      //     featureGroup: this.editableLayers,
      //     remove: true,
      //   },
      // };
      // const drawControl = new L.Control.Draw(drawPluginOptions);
      // this.map.addControl(drawControl);
      this.map.fitBounds(this.bounds);

      this.map.on(L.Draw.Event.CREATED, (event) => {
        const { layer } = event;
        this.currentLayer = layer;
        this.answer = layer.getLatLngs();
        this.$store.commit('label/SET_PANEL', 'rightPanelLabel');
        this.editableLayers.addLayer(layer);
      });
      this.displayLabels();
    });
  },
  methods: {
    displayLabels() {
      if (this.polygons.length > 0) {
        _.each(this.polygons, (polygon) => {
          this.resetLayer(polygon);
        });
      }
      this.image = `${process.env.API_URL}/img/${this.projectId}/${this.data.file}`;
      _.each(this.data.usersAnswers, (answer) => {
        this.drawUserAnswer(answer.answers.origin);
      });
    },
    drawUserAnswer(coord) {
      const latlngs = [
        [coord[0].lat, coord[0].lng],
        [coord[1].lat, coord[1].lng],
        [coord[2].lat, coord[2].lng],
        [coord[3].lat, coord[3].lng],
      ];
      this.polygons.push(L.polygon(latlngs, { color: '#E91C63' }).addTo(this.map));
    },
    resetLayer(polygon) {
      this.map.removeLayer(polygon);
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .CsHeader
    background: $cc-dark;
    position: absolute;
    padding: 17px;
    right: 0px;
    box-shadow inset 0px 0px 5px 0px rgba(0,0,0,0.75)
    a
      color $neutral;
      font-size 70%;
      text-decoration underline;
      &:hover
        color $neutral;
</style>
