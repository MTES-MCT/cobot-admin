<template>
  <div class="custom-toolbox">
    <div class="title">{{segment.object.feature.properties.name}}</div>
    <div class="position">
      <div>Coordonnées:</div>
      <span
        v-html="coordsToHumandReadable(
          segment.object.feature.geometry,
        )">
      </span>
    </div>
    <div v-if="segment.object.feature.properties.length" class="distance">
      <div>Distance:</div>
      <div>{{ distanceToMeter(segment.object.feature.properties.length) }} mètres</div>
    </div>
    <div class="color">
      <div>Couleur</div>
      <q-color v-model="color" @input="$emit('on-segment-color', color)"/>
    </div>
    <div class="cta-delete">
       <q-btn
          color="negative"
          @click="$emit('on-delete-segment')"
          label="supprimer"
          style="margin-left: 10px;" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'CcSegments',
  props: {
    segment: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      color: (this.segment.object.feature.properties.style && this.segment.object.feature.properties.style.color) ? this.segment.object.feature.properties.style.color : '#FF7800',
    };
  },
  watch: {
    segment(object) {
      console.log(object);
    },
  },
  methods: {
    coordsToHumandReadable: (object) => {
      const { coordinates, type } = object;
      let toString = '';
      if (type === 'Point') {
        toString += `${coordinates[0]} ${coordinates[1]}`;
      } else {
        _.each(coordinates, (coord) => {
          toString += `${coord[0]} ${coord[1]} <br/>`;
        });
      }
      return toString;
    },

    distanceToMeter: distance => (distance * 1000 * 100).toFixed(2),
  },
};
</script>

<style lang="stylus">
.custom-toolbox
  position absolute
  top 150px
  right 26px
  z-index 10000
  width 250px
  background-color #FFF
  border 2px solid rgba(0,0,0,0.2)
  border-radius 4px
  padding 15px
  font-size 14px
  .distance
    padding-top 15px
  .color
    padding-top 15px
    .q-input-target
      font-size 14px
  .title
    text-align center
    padding-bottom 15px
    font-weight 900
    font-size 18px
  .cta-delete
    padding-top 15px
    text-align center
</style>
