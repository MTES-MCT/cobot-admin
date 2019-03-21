<template>
  <div>
    <cc-subheader-label :items="getElements()" />
    <div class="row main">
      <div class="col-3">
        <cc-left-panel-label />
      </div>
      <div class="col-9">
        <div class="main-card">
          <div class="row justify-center">
            <div style="text-align: center;">
              <p>Si cette photo contient l'un des élements suivants, merci de le détourer :</p>
              <p style="font-weight: bold;">{{ getElements() }}</p>
              <p>
                <a href="#" @click="onNone()" class="next">
                  <small>aucun élément, passer à la photo suivante</small>
                </a>
              </p>
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
            <CcPanelPhotoInfo v-if="panel === 'rightPanelInfo'"
                              side="right"
                              :name="data.file"
                              :metadata="data.metadata"/>
          </transition>
          <transition
            enter-active-class="animated slideInRight"
            leave-active-class="animated slideOutRight" >
            <CcRightPanelLabel v-if="panel === 'rightPanelLabel'" :labels="labels"/>
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import _ from 'lodash';
import L from 'leaflet';
import 'leaflet-draw';
import '../../../constants/leaflet-lang-fr';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';

import { LMap, LImageOverlay, LTileLayer, LMarker, LPopup, LPolyline } from 'vue2-leaflet';

import { DATASET_QUERY, DATASET_ANSWERS } from '../../../constants/graphql';

import CcLeftPanelLabel from 'components/cc-left-panel-label';
import CcSubheaderLabel from 'components/cc-subheader-label';
import CcRightPanelLabel from 'components/cc-right-panel-label';
import CcPanelPhotoInfo from 'components/panel-photo-info';

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
    CcPanelPhotoInfo,
    CcLeftPanelLabel,
    CcSubheaderLabel,
  },
  data() {
    return {
      projectId: this.$route.params.id,
      dataset: null,
      isRightPanelInfo: false,
      isRightPanelLabel: false,
      answer: null,
      label: null,
      skipQuery: true,
      loading: false,
      openLabelHelp: false,
      map: null,
      currentLayer: null,
      image: '',
      bounds: [[0, 0], [1080, 1440]],
      minZoom: -1,
      crs: L.CRS.Simple,
      colors: {
        polygon: '#F2C037',
        rectangle: '#E91C63',
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
  computed: {
    ...mapGetters({
      datasetId: 'dataset/getDatasetId',
      data: 'dataset/getData',
    }),
    ...mapState('label', ['panel', 'action']),
    ...mapState('dataset', ['isDataQualified']),
  },
  watch: {
    datasetId() {
      this.$apollo.queries.Data.refresh();
    },
    action(newValue) {
      this.onAction(newValue);
    },
  },
  mounted() {
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
          polygon: false,
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
        const { layer } = event;
        this.currentLayer = layer;
        this.answer = layer.getLatLngs();
        this.$store.commit('label/SET_PANEL', 'rightPanelLabel');
        this.editableLayers.addLayer(layer);
      });
    });
  },
  methods: {
    getElements() {
      let labels = _.map(this.labels, 'label');
      labels = _.reject(labels, (label => label === 'Aucun'));
      return labels.join(', ');
    },
    resetEditableLayer() {
      this.editableLayers.eachLayer((layer) => {
        this.editableLayers.removeLayer(layer);
      });
    },
    resetLayer() {
      if (this.polygon) {
        this.map.removeLayer(this.polygon);
      }
    },
    onAction() {
      switch (this.action) {
        case 'cancel':
          this.$store.commit('label/SET_PANEL', null);
          this.$store.commit('label/SET_ACTION', null);
          this.resetEditableLayer();
          break;
        case 'save':
          this.saveAnswer(this.$store.state.label.label, () => {
            this.$store.commit('label/SET_ACTION', null);
          });
          break;
        case 'next':
          this.$store.commit('label/SET_PANEL', null);
          this.$store.dispatch('dataset/setDatasetId', null);
          this.$store.commit('dataset/SET_IS_QUALIFIED', false);
          this.resetEditableLayer();
          break;
        default:
          return null;
      }
      return true;
    },
    onNone() {
      this.saveAnswer(JSON.stringify(this.labels[4]), () => {
        this.$store.dispatch('dataset/setDatasetId', null);
        this.onSkip();
      });
    },
    onOpenLabelBox() {
      this.openLabelBox = true;
    },
    async saveAnswer(label, callback) {
      try {
        const answer = (this.answer) ? this.prepareAnswer(this.answer[0], label) : label;
        await this.$apollo.mutate({
          mutation: DATASET_ANSWERS,
          variables: {
            id: this.datasetId,
            answer,
          },
        });
        this.answer = null;
        this.$root.$emit('onLabelSaved');
        callback();
      } catch (error) {
        // this.$q.notify({ message: this.$t('global.error'), type: 'negative' });
      }
    },
    prepareAnswer(coords, label) {
      const ymin = coords[0].lat;
      const ymax = coords[1].lat;
      const xmin = coords[0].lng;
      const xmax = coords[2].lng;
      const yminVoc = 1080 - ymin;
      const ymaxVoc = 1080 - ymax;
      const answer = {
        label,
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
    drawUserAnswer(coord) {
      const latlngs = [
        [coord[0].lat, coord[0].lng],
        [coord[1].lat, coord[1].lng],
        [coord[2].lat, coord[2].lng],
        [coord[3].lat, coord[3].lng],
      ];
      this.polygon = L.polygon(latlngs, { color: '#E91C63' }).addTo(this.map);
    },
  },
  apollo: {
    Data: {
      query: DATASET_QUERY,
      fetchPolicy: 'no-cache',
      variables() {
        return {
          projectId: this.projectId,
          id: this.datasetId,
          notAnswered: !this.isDataQualified,
        };
      },
      update(data) {
        const dataset = data.DataSet;
        const { usersAnswers } = dataset;
        this.resetLayer();
        if (usersAnswers.length > 0) {
          const userAnswer = _.find(usersAnswers, { userId: this.$auth.user().id });
          if (userAnswer) {
            this.drawUserAnswer(JSON.parse(userAnswer.answers).origin);
          }
        }
        this.$store.dispatch('dataset/setData', dataset);
        this.image = `${process.env.API_URL}/img/${this.projectId}/${dataset.file}`;
      },
    },
  },
};
</script>
<style scopped lang="stylus">
  @import '~variables'
  .next
    color $pink
    &:hover
      text-decoration underline
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
