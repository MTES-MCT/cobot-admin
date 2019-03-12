<template>
  <q-list class="rightLabelPanel">
    <q-list-header style="padding-top: 30px;">
      Image information
    </q-list-header>
    <q-item>
      <q-item-main>
        <q-item-tile label>{{ name }}</q-item-tile>
      </q-item-main>
    </q-item>
    <q-list-header v-if="geodata"
                  style="padding-top: 30px;">Geolocalisation</q-list-header>
    <q-item v-if="geodata">
      <GmapMap
          :center="{
            lat: geodata.location.coordinates[0],
            lng: geodata.location.coordinates[1]
          }"
          :zoom="16"
          mapTypeId="satellite"
          style="width: 300px; height: 230px"
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
          <GmapInfoWindow :opened="infoWinOpen"
                          :options="infoOptions"
                          :position="infoWindowPos"
                          @closeclick="infoWinOpen = false">
            {{ geodata.location.coordinates[0] }}, {{ geodata.location.coordinates[1] }}
          </GmapInfoWindow>
          <GmapMarker
            :position="{
              lat: geodata.location.coordinates[0],
              lng: geodata.location.coordinates[1]
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
        <q-item-tile v-if="typeof row === 'object'" sublabel>
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
      <q-item-side v-if="typeof row !== 'object'" right>
        <q-item-tile>{{ row }}</q-item-tile>
      </q-item-side>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: 'CcRightPanelLabelInfo',
  props: ['name', 'exif', 'geodata'],
  data() {
    return {
      infoWindowPos: null,
      infoWinOpen: false,
      currentMidx: null,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
    };
  },
  methods: {
    toggleInfoWindow() {
      this.infoWindowPos = {
        lat: this.geodata.location.coordinates[0],
        lng: this.geodata.location.coordinates[1],
      };
      this.infoWinOpen = true;
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .rightLabelPanel
    height: calc(100vh - 138px);
    overflow-y: auto;
    z-index 5890
    position fixed
    top 138px
    right 0px
    width 25%
  .q-list
    background-color #F2F2F2
    box-shadow 0px 0px 5px 0px rgba(0,0,0,0.75)
  .q-list-header
    height 60px
    margin-bottom 10px
    border-bottom 1px solid #e0e0e0
</style>
