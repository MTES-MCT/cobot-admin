<template>
  <div>
    <cc-subheader-label :items="getElements()" />
    <div class="row main">
      <div class="col-3">
        <cc-left-panel-label :labels="labels" />
      </div>
      <div class="col-9">
        <div class="main-card">
          <div class="row justify-center">
            <div v-if="!complete" style="text-align: center;">
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
            <div v-else>Complete</div>
            <div class="mapLoading" v-if="isLoading"></div>
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
          <CcHelp />
        </div>
      </div>
    </div>
    <q-inner-loading :visible="isLoading" style="z-index: 1200;">
      <q-spinner-gears size="50px" color="pink"></q-spinner-gears>
    </q-inner-loading>
  </div>
</template>

<script>
/* eslint prefer-destructuring: 0 */
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
import labels from '../../../constants/labels';

import CcLeftPanelLabel from 'components/cc-left-panel-label';
import CcRightPanelLabel from 'components/cc-right-panel-label';
import CcSubheaderLabel from 'components/cc-subheader-label';
import CcPanelPhotoInfo from 'components/panel-photo-info';
import CcHelp from 'components/cc-help';

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
    CcHelp,
  },
  data() {
    return {
      projectId: this.$route.params.id,
      dataset: null,
      isRightPanelInfo: false,
      isRightPanelLabel: false,
      answer: null,
      skipQuery: true,
      isLoading: true,
      openLabelHelp: false,
      complete: false,
      map: null,
      drawControl: null,
      currentLayer: null,
      image: '',
      bounds: [[0, 0], [1080, 1440]],
      minZoom: -1,
      crs: L.CRS.Simple,
      colors: {
        polygon: '#F2C037',
        rectangle: '#E91C63',
      },
      labels,
    };
  },
  computed: {
    ...mapGetters({
      datasetId: 'dataset/getDatasetId',
      data: 'dataset/getData',
      label: 'label/getLabel',
    }),
    ...mapState('label', ['panel', 'action']),
    ...mapState('dataset', ['isDataQualified']),
  },
  watch: {
    action(newValue) {
      this.onAction(newValue);
    },
    label() {
      if (this.label) {
        this.onLabelSelected();
      } else {
        this.map.removeControl(this.drawControl);
      }
    },
  },
  mounted() {
    this.$root.$on('onNext', () => {
      this.onNext();
      this.skipQuery = false;
    });
    this.$root.$on('onComplete', () => {
      this.complete = true;
      this.isLoading = false;
    });
    this.$nextTick(() => {
      this.map = this.$refs.map.mapObject;
      this.map._onResize();

      this.map.scrollWheelZoom.disable();
      this.map.dragging.disable();

      this.editableLayers = new L.FeatureGroup();
      this.map.addLayer(this.editableLayers);

      this.map.fitBounds(this.bounds);

      this.map.on(L.Draw.Event.CREATED, (event) => {
        const { layer } = event;
        this.currentLayer = layer;
        this.answer = layer.getLatLngs();
        this.$store.commit('label/SET_CAN_CONTRIBUTE', true);
        this.editableLayers.addLayer(layer);
      });

      this.map.on(L.Draw.Event.EDITSTART, () => {
        this.defaultAnswer = this.answers;
        const el = this.$refs.map.$el.querySelectorAll('.leaflet-draw-actions-top');
        el[0].childNodes[0].style.display = 'none';
      });

      this.map.on(L.Draw.Event.EDITMOVE, (event) => {
        const { layer } = event;
        this.currentLayer = layer;
        this.answer = layer.getLatLngs();
      });

      this.map.on(L.Draw.Event.EDITRESIZE, (event) => {
        const { layer } = event;
        this.currentLayer = layer;
        this.answer = layer.getLatLngs();
      });

      this.map.on(L.Draw.Event.EDITSTOP, () => {
        this.answers = this.defaultAnswer;
      });

      this.skipQuery = false;
    });
  },
  methods: {
    getElements() {
      const aLabels = _.map(this.labels, 'label');
      const labelLink = [];
      _.each(aLabels, (label) => {
        if (label !== 'Aucun') {
          labelLink.push(`<a class="labelLink" href="">${label}</a>`);
        }
      });
      return labelLink.join(', ');
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
          this.$store.commit('label/SET_ACTION', null);
          this.resetEditableLayer();
          break;
        case 'save':
          this.saveAnswer(this.label, () => {
            this.$store.commit('label/SET_ACTION', null);
            this.$store.commit('dataset/SET_IS_QUALIFIED', false);
            this.$store.commit('label/SET_LABEL', null);
            this.resetEditableLayer();
          });
          break;
        case 'next':
          this.$store.commit('label/SET_PANEL', null);
          this.$store.commit('dataset/SET_IS_QUALIFIED', false);
          this.$store.commit('label/SET_LABEL', null);
          this.resetEditableLayer();
          break;
        default:
          return null;
      }
      return true;
    },
    onLabelSelected() {
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
        },
      };
      this.drawControl = new L.Control.Draw(drawPluginOptions);
      this.map.addControl(this.drawControl);
      this.drawControl._toolbars.draw._modes.rectangle.handler.enable();
    },
    onNext() {
      this.isLoading = true;
      this.skipQuery = false;
      this.resetEditableLayer();
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
        this.resetLayer();
        this.$store.commit('label/SET_CAN_CONTRIBUTE', false);
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
  },
  apollo: {
    Data: {
      query: DATASET_QUERY,
      fetchPolicy: 'no-cache',
      variables() {
        return {
          projectId: this.projectId,
          notAnswered: !this.isDataQualified,
        };
      },
      update(data) {
        const dataset = data.DataSet;
        if (dataset) {
          const { usersAnswers } = dataset;
          const { metadata } = dataset;
          if (usersAnswers.length > 0) {
            const userAnswer = _.find(usersAnswers, { userId: this.$auth.user().id });
            if (userAnswer) {
              this.drawUserAnswer(JSON.parse(userAnswer.answers).origin);
            }
          }
          this.$store.dispatch('dataset/setData', dataset);
          this.$store.dispatch('dataset/setDatasetId', dataset._id);
          this.image = `${process.env.API_URL}/img/${this.projectId}/${dataset.file}`;
          if (metadata.originalOrientation && metadata.originalOrientation === 6) {
            setTimeout(() => {
              this.setVerticalMap();
            }, 500);
          } else {
            setTimeout(() => {
              this.setHorizontalMap();
            }, 500);
          }
        }
        this.skipQuery = true;
      },
      skip() {
        return this.skipQuery;
      },
    },
  },
};
</script>
<style scopped lang="stylus">
  @import '~variables'
  .next
    color $pink
    font-weight bold
    text-decoration none
    &:hover
      text-decoration underline
  .mapLoading
    position absolute;
    width 720px
    height 720px
    background-color #FFF
    color $dark
    z-index 1000

  .labelLink
    font-weight bold
    text-decoration none
    border-bottom: 1px dotted $pink
    &:visited
      color inherit
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
  .leaflet-draw-actions
    // display none
    // &:first-child
  .q-carousel-quick-nav
    background none
</style>
