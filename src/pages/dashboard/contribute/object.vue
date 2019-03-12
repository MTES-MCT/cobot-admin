<template>
  <div class="main-card">
    <div class="row justify-center">
      <div>
       <l-map
          ref="map"
          :min-zoom="minZoom"
          :crs="crs"
          style="width: 720px; height: 540px;">
          <l-image-overlay
            :url="image"
            :bounds="bounds"/>
        </l-map>
      </div>
    </div>
    <transition
      enter-active-class="animated slideInRight"
      leave-active-class="animated slideOutRight">
      <CcRightPanelLabelInfo v-if="isRightPanelInfo"
                          :name="data.file"
                          :geodata="data.metadata.geoData"
                          :exif="data.metadata.raw"/>
    </transition>
    <transition
      enter-active-class="animated slideInRight"
      leave-active-class="animated slideOutRight" >
      <CcRightPanelLabel v-if="isRightPanelLabel" :labels="labels"/>
    </transition>
    <q-modal v-model="openLabelHelp"
             minimized>
      <q-modal-layout>
        <q-toolbar color="dark" slot="header">
          <q-toolbar-title>
           Aide
          </q-toolbar-title>
        </q-toolbar>
        <div class="layout-padding">
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet-draw';
import '../../../constants/leaflet-lang-fr';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';

import { LMap, LImageOverlay, LTileLayer, LMarker, LPopup, LPolyline } from 'vue2-leaflet';

import { DATASET_QUERY, DATASET_ANSWERS } from '../../../constants/graphql';

import CcRightPanelLabel from 'components/cc-right-panel-label';
import CcRightPanelLabelInfo from 'components/cc-right-panel-label-info';

delete L.Icon.Default.prototype._getIconUrl;

export default {
  name: 'dashboardContributeObject',
  components: {
    LMap,
    LImageOverlay,
    LTileLayer,
    LMarker,
    LPopup,
    LPolyline,
    CcRightPanelLabel,
    CcRightPanelLabelInfo,
  },
  data() {
    return {
      projectId: this.$route.params.id,
      dataSetId: this.$route.params.dataset,
      data: null,
      isRightPanelInfo: false,
      isRightPanelLabel: false,
      answer: null,
      label: null,
      skipQuery: true,
      loading: false,
      canSend: false,
      openLabelHelp: false,
      map: null,
      currentLayer: null,
      image: '',
      bounds: [[0, 0], [1080, 1440]],
      minZoom: -1,
      crs: L.CRS.Simple,
      colors: {
        polygon: '#F2C037',
        rectangle: '#26A69A',
      },
      labels: [
        {
          id: 'chantier',
          type: 'polygon',
          label: 'Elément de chantier',
        },
        {
          id: 'bitumen',
          type: 'polygon',
          label: 'Rue Pavée',
        },
        {
          id: 'pieton',
          type: 'polygon',
          label: 'Passage piéton',
        },
        {
          id: 'bev',
          type: 'polygon',
          label: 'Bande d\'éveil vigilance',
        },
        {
          id: 'none',
          type: 'polygon',
          label: 'Aucun',
        },
      ],
    };
  },
  mounted() {
    this.$root.$on('onLabelInformation', () => {
      this.isRightPanelInfo = !this.isRightPanelInfo;
    });
    this.$root.$on('onLabelHelp', () => {
      this.openLabelHelp = true;
    });
    this.$nextTick(() => {
      this.map = this.$refs.map.mapObject;
      this.map._onResize();

      this.editableLayers = new L.FeatureGroup();
      this.map.addLayer(this.editableLayers);

      const drawPluginOptions = {
        position: 'topright',
        draw: {
          polygon: {
            shapeOptions: {
              color: this.colors.polygon,
            },
          },
          polyline: false,
          circle: false,
          circlemarker: false,
          rectangle: {
            shapeOptions: {
              showArea: false,
              color: this.colors.rectangle,
            },
          },
          marker: false,
        },
        edit: {
          featureGroup: this.editableLayers,
          remove: true,
        },
      };
      const drawControl = new L.Control.Draw(drawPluginOptions);
      this.map.addControl(drawControl);
      this.map.fitBounds(this.bounds);

      this.map.on(L.Draw.Event.CREATED, (event) => {
        const { layer } = event; // layerType,
        this.currentLayer = layer;
        this.answer = layer.getLatLngs();
        this.isRightPanelLabel = true;
        this.editableLayers.addLayer(layer);
      });
    });
  },
  methods: {
    async onSend() {
      try {
        await this.saveAnswer();
      } catch (e) {
        console.log(e);
      }
    },
    onSkip() {
      this.$apollo.queries.Dataset.refresh();
    },
    onOpenLabelBox() {
      this.openLabelBox = true;
    },
    setLabel(label) {
      this.currentLayer.bindTooltip(
        label.label,
        {
          offset: L.point({
            x: -20,
            y: 0,
          }),
          className: `toolTip_${label.type}`,
        },
      ).openTooltip();
      this.label = label.label;
      this.canSend = true;
    },
    async saveAnswer() {
      try {
        const answer = this.prepareAnswer(this.answer[0]);
        await this.$apollo.mutate({
          mutation: DATASET_ANSWERS,
          variables: {
            id: this.dataSetId,
            answer,
          },
        });
        this.$apollo.queries.Dataset.refresh();
        this.editableLayers.eachLayer((layer) => {
          this.editableLayers.removeLayer(layer);
        });
        this.$q.notify({ message: this.$t('labelbot.answerSaved'), type: 'positive' });
        this.canSend = false;
      } catch (error) {
        this.$q.notify({ message: this.$t('global.error'), type: 'negative' });
      }
    },
    prepareAnswer(coords) {
      const ymin = coords[0].lat;
      const ymax = coords[1].lat;
      const xmin = coords[0].lng;
      const xmax = coords[2].lng;
      const yminVoc = 1080 - ymin;
      const ymaxVoc = 1080 - ymax;
      const answer = {
        label: this.label,
        origin: coords,
        voc: {
          xmin,
          yminVoc,
          xmax,
          ymaxVoc,
        },
      };
      return JSON.stringify(answer);
    },
  },
  apollo: {
    Dataset: {
      query: DATASET_QUERY,
      fetchPolicy: 'no-cache',
      variables() {
        return {
          projectId: this.projectId,
          id: this.dataSetId,
        };
      },
      update(data) {
        this.dataSetId = data.DataSet._id;
        const dataset = data.DataSet;
        const rawMetadata = dataset.metadata.raw;
        if (rawMetadata && typeof rawMetadata === 'string') {
          dataset.metadata.raw = JSON.parse(dataset.metadata.raw);
        }
        this.data = dataset;
        this.image = `${process.env.API_URL}/img/${this.projectId}/${data.DataSet.file}`;
      },
    },
  },
};
</script>
<style scopped lang="stylus">
  .main-card
    border-radius 2px
    margin 20px 0px 40px 0px
    padding 0px 20px 00px 20px
  .leaflet-control-attribution
    display none
  .toolTip_rectangle
    background #26A69A
    border 0
  .leaflet-tooltip-left.toolTip_rectangle::before
    border-left-color #26A69A
  .leaflet-tooltip-right.toolTip_rectangle::before
    border-right-color #26A69A
  .toolTip_polygon
    background #F2C037
    border 0
  .leaflet-tooltip-left.toolTip_polygon::before
    border-left-color #F2C037
  .leaflet-tooltip-right.toolTip_polygon::before
    border-right-color #F2C037
</style>
