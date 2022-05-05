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

      this.map.fitBounds(this.bounds);

      this.displayLabels();
    });
  },
  methods: {
    displayLabels() {
      const { metadata } = this.data;
      if (this.polygons.length > 0) {
        _.each(this.polygons, (polygon) => {
          this.resetLayer(polygon);
        });
      }
      this.image = `${process.env.API_URL}/img/${this.projectId}/${this.data.file}`;
      setTimeout(() => {
        this.setMapOrientation(metadata, this.image);
      }, 500);
      _.each(this.data.usersAnswers, (answer) => {
        this.drawUserAnswer(answer.answers.origin);
      });
      // if (metadata.originalOrientation && metadata.originalOrientation === 6) {
      //   setTimeout(() => {
      //     this.setVerticalMap();
      //   }, 500);
      // } else {
      //   setTimeout(() => {
      //     this.setHorizontalMap();
      //   }, 500);
      // }
      // _.each(this.data.usersAnswers, (answer) => {
      //   this.drawUserAnswer(answer.answers.origin);
      // });
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
    setVerticalMap() {
      if (this.map.getBounds()._northEast.lat === 1080) {
        this.map._onResize();
        this.$refs.map.$el.style.height = '720px';
        this.$refs.map.$el.style.width = '540px';
        setTimeout(() => {
          this.bounds = [[0, 0], [720, 540]];
          this.map.fitBounds(this.bounds);
        }, 500);
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      } else {
        this.isLoading = false;
      }
    },
    setHorizontalMap() {
      this.map._onResize();
      this.$refs.map.$el.style.height = '540px';
      this.$refs.map.$el.style.width = '720px';
      setTimeout(() => {
        this.bounds = [[0, 0], [1080, 1440]];
        this.map.fitBounds(this.bounds);
      }, 500);
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    },

    async getImageSize(file) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = function () {
          resolve({
            width: this.naturalWidth,
            height: this.naturalHeight,
          });
        };
        img.src = file;
      });
    },

    async setMapOrientation(metadata, file) {
      const imageSize = await this.getImageSize(file);
      let { height, width } = imageSize;
      if (metadata.originalHeight) {
        height = metadata.originalHeight;
        width = metadata.originalWidth;
      } else {
        const { raw } = metadata;
        if (raw && raw.ImageHeight) {
          height = raw.ImageHeight;
          width = raw.ImageWidth;
        }
      }
      this.imageHeight = height;
      this.imageWidth = width;
      this.map._onResize();
      this.$refs.map.$el.style.height = `${height}px`;
      this.$refs.map.$el.style.width = `${width}px`;
      setTimeout(() => {
        this.bounds = [[0, 0], [height, width]];
        this.map.fitBounds(this.bounds);
      }, 500);
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
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
