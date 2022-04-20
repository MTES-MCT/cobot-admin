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
    <!-- <div class="connection">
      <div>Connexion :</div>
      <ul>
        <li>
          <a
            @mouseover="$emit('on-segment-connexion-toggle-highlight', {id: '107', state: 'on'})"
            @mouseleave="$emit('on-segment-connexion-toggle-highlight', {id: '107', state: 'off'})">
            Segment 12
          </a>
        </li>
        <li>
          <a
            @mouseover="$emit('on-segment-connexion-toggle-highlight', {id: '105', state: 'on'})"
            @mouseleave="$emit('on-segment-connexion-toggle-highlight', {id: '105', state: 'off'})">
            Segment 14
          </a>
        </li>
      </ul>
    </div> -->
    <div v-if="segment.object.feature.properties.length" class="distance">
      <div>Distance:</div>
      <div>{{ distanceToMeter(segment.object.feature.properties.length) }} mètres</div>
    </div>
    <div class="color">
      <div>Couleur</div>
      <q-color v-model="color" @input="$emit('on-segment-color', color)"/>
    </div>
    <div class="photo">
      <div class="photo-title">Photos du segment
        <span v-if="maxSlides > 0">({{ currentSlide }}/{{ maxSlides }})</span>
      </div>
      <swiper
        v-if="objects && objects.length > 0"
        ref="swiperSegmentRef"
        class="swiper-container"
        :options="swiperOption"
        @slideChange="onSlideChange"
      >
        <swiper-slide
          v-for="(photo, i) in objects"
          :key="'it-'+i"
          :style="setSlideWidth(photo.attributes)"
        >
          <div>
            <div style="position: relative;">
              <img :src="setPhotoUrl(photo.attributes.name)">
            </div>
          </div>
        </swiper-slide>
      </swiper>
      <div v-else class="no-photo">
        Aucune photo
      </div>
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
      objects: null,
      swiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 10,
        loop: true,
        freeMode: false,
      },
      currentSlide: 1,
      maxSlides: null,
    };
  },
  watch: {
    segment(object) {
      console.log(object);
    },
  },
  async mounted() {
    const objects = await this.$axiosSIG.get(`/object-to-segments?filters[segmentID][$eq]=${this.segment.id}`);
    this.objects = objects.data.data;
    this.maxSlides = this.objects.length;
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
    setSlideWidth() {
      // photo
      // const maxHeight = 380;
      // const coef = photo.image.dimensions.height / maxHeight;
      // const width = photo.image.dimensions.width / coef;
      // const height = photo.image.dimensions.height / coef;
      // return `width: ${width}px; height: ${height + 80}px`;
      return true;
    },
    setPhotoUrl(file) {
      // const path = `${process.env.API_URL}/img/${this.$route.params.id}/${file}`;
      return `https://labelbot-api.wawy.io/img/${this.$route.params.id}/${file}`;
    },
    onSlideChange(slide) {
      this.currentSlide = slide.realIndex + 1;
    },
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
  .connection
    padding-top 15px
    ul
      margin-block-start 0em
      margin-block-end 0em
      padding-inline-start 30px
      li
        a
          text-decoration: underline
          &:hover
            font-weight: bold

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
  .photo {
    padding-top 15px
    .photo-title {
      padding-bottom 15px
    }
    .no-photo {
      text-align center
    }
  }
  .swiper-slide {
    width: 80%;
  }
  // .swiper-slide:nth-child(2n) {
  //   width: 60%;
  // }
  // .swiper-slide:nth-child(3n) {
  //   width: 40%;
  // }
  .swiper-container {
    .swiper-wrapper {
      align-items: center;
      .swiper-slide {
        img {
          max-width: 100%;
        }
      }
    }
  }
  .progess {
    text-align: right;
    padding-right: calc(12% + 20px);
    font-weight: bold;
  }
</style>
