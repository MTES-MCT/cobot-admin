<template>
  <q-list v-if="data" style="position: fixed; width:25%; height: 100vh;">
    <q-list-header style="padding-top: 30px;">
      Image information
    </q-list-header>
    <q-item>
      <q-item-main>
        <q-item-tile label>{{ data.file }}</q-item-tile>
      </q-item-main>
    </q-item>
    <q-list-header v-if="data.metadata.geoData"
                   style="padding-top: 30px;">Geolocalisation</q-list-header>
    <q-item v-if="data.metadata.geoData">
      <GmapMap
          :center="{
            lat: data.metadata.geoData.location.coordinates[0],
            lng: data.metadata.geoData.location.coordinates[1]
          }"
          :zoom="16"
          mapTypeId="satellite"
          style="width: 100%; height: 230px"
          :options="{
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true,
            disableDefaultUi: false
          }"
        >
          <!-- <GmapInfoWindow :opened="infoWinOpen"
                          :options="infoOptions"
                          :position="infoWindowPos"
                          @closeclick="infoWinOpen = false">
            {{ geodata.location.coordinates[0] }}, {{ geodata.location.coordinates[1] }}
          </GmapInfoWindow> -->
          <GmapMarker
            :position="{
              lat: data.metadata.geoData.location.coordinates[0],
              lng: data.metadata.geoData.location.coordinates[1]
            }"
            :draggable="false"
            :clickable="true"
            @click="toggleInfoWindow()"
          />
        </GmapMap>
    </q-item>
    <q-list-header v-if="exif" style="padding-top: 30px;">
      EXIF
    </q-list-header>
    <q-item v-for="(row, index) in exif"
            :key="index">
      <q-item-main>
        <q-item-tile label>{{ index }}</q-item-tile>
        <q-item-tile v-if="hasChild(row)" sublabel>
          <q-item v-for="(subRow, subIndex) in row"
            :key="subIndex">
            <q-item-main>
              <q-item-tile label style="color: black;">{{ subIndex }}</q-item-tile>
              <q-item-tile v-if="typeof subRow !== 'object'"  sublabel>{{ subRow }}</q-item-tile>
              <q-item-tile v-else sublabel>{{ subRow.join(', ') }}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-item-tile>
      </q-item-main>
      <q-item-side v-if="!hasChild(row)" right>
        <q-item-tile>{{ row }}</q-item-tile>
      </q-item-side>
    </q-item>
  </q-list>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CcLeftPanelDataset',
  props: ['name', 'exif', 'geodata'],
  computed: {
    ...mapGetters({
      data: 'dataset/getData',
    }),
  },
  watch: {
    data() {
      const rawMetadata = this.data.metadata.raw;
      console.log(rawMetadata);
      if (rawMetadata && typeof rawMetadata === 'string') {
        this.data.metadata.raw = JSON.parse(this.data.metadata.raw);
      }
      console.log(this.data);
    },
  },
  methods: {
    addUser() {
      this.$root.$emit('onAddUser');
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .q-list
    background-color #F2F2F2
    box-shadow 0px 0px 5px 0px rgba(0,0,0,0.75)
  .q-list-header
    height 60px
    margin-bottom 10px
    border-bottom 1px solid #e0e0e0
</style>
