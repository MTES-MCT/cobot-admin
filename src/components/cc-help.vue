<template>
  <q-modal v-model="openHelp"
           class="help"
                    minimized>
    <q-modal-layout style="width: 950px;">
      <q-toolbar color="dark" slot="header">
        <q-toolbar-title>
          AIDE
        </q-toolbar-title>
      </q-toolbar>
      <div class="layout-padding">
        <q-carousel ref="carousel">
          <q-carousel-slide>
            <p>
              Notre outil vous permet d’attester de la présence d’un
              ou plusieurs éléments en précisant leur emplacement
              grâce à notre outil de détourage.
            </p>
            <p style="font-weight: bold;">
              ETAPE 1
            </p>
            <p>
              Vérifiez la présence de l’un des éléments suivants sur l’image :
            </p>
            <div class="row justify-around items-baseline">
              <div v-for="(label, index) in labels"
                  :key="index"
                  v-if="label.id !== 'none'"
                  style="text-align: center;">
                  <img :src="label.img" style="width: 180px;"/>
                  <p>
                    <small>{{ label.label }}</small>
                  </p>
              </div>
            </div>
          </q-carousel-slide>
          <q-carousel-slide>
            <p style="font-weight: bold;">
              ETAPE 2
            </p>
            <p style="padding-top: 10px; font-weight: bold;">
              Si l’image ne contient aucun de ces éléments
            </p>
            <p>
              cliquez sur le lien
              <span style="color: #e91e63;">aucun élément, passer à la photo suivante</span>
            </p>
            <p style="padding-top: 10px; font-weight: bold;">
              Si l’image contient 1 ou plusieurs élément :
            </p>
            <p>
                Détourez l’élément choisi directement sur l’image : cliquez sur le bouton
                <img src="../statics/reactangleTool.png"
                    style="width: 20px; margin: 0 10px 0 10px;" />
                situé en haut à droite de la zone image,
                indiquez la zone dans lequel se situe l’élément à l’aide du curseur
            </p>
            <p>
              Vous pouvez utiliser les boutons&nbsp;
              <a class="labelLink" href="#">
                + / -
                <q-tooltip>
                  <img src="../statics/zoom.png" />
                </q-tooltip>
              </a>&nbsp;
              pour zoomer dans l’image.
              Vous pouvez déplacer l’image en maintenant un clic gauche et
              en déplaçant l’image dans la direction souhaitée.
            </p>
          </q-carousel-slide>
          <q-carousel-slide>
            <p style="font-weight: bold;">
              ETAPE 3
            </p>
            <p style="padding-top: 10px; font-weight: bold;">
              Comment détourer un élément :
            </p>
            <p>
              Veillez à détourer une zone qui contient uniquement
              l’élément à qualifier
            </p>
            <div class="row justify-around">
              <div style="text-align:center">
                <img src="../statics/label_ok.png" style="width: 350px;"/>
                <p><small>sélection ok : le pavé est isolé</small></p>
              </div>
              <div style="text-align:center">
                <img src="../statics/label_notok.png" style="width: 350px;"/>
                <p><small>sélection erronée : le pavé n'est pas isolé</small></p>
              </div>
            </div>
          </q-carousel-slide>
          <q-carousel-slide>
            <p style="font-weight: bold;">
              ETAPE 4
            </p>
            <p style="padding-top: 10px; font-weight: bold;">
              Sélectionnez l’élément détouré grâce au menu qui s’affiche
            </p>
            <div style="text-align: center;">
              <img src="../statics/panel_select.png" style="width: 350px;"/>
            </div>
          </q-carousel-slide>
          <q-carousel-slide>
            <p style="padding-top: 10px; font-weight: bold;">
              Validez votre choix en cliquant sur "continuer",
              ou cliquez sur la croix pour choisir un autre type d’élément.
            </p>
            <div style="text-align: center;">
              <img src="../statics/panel_validate.png" style="width: 350px;"/>
            </div>
          </q-carousel-slide>
          <q-carousel-slide>
            <p style="padding-top: 10px;">
              Si l’image contient un ou plusieurs autres éléments à détourer
              (parmi Elément de chantier, Rue Pavée, Passage piéton,
              Bande d'éveil vigilance),
              cliquez sur "Continuer avec cette image", sinon cliquez
              sur "passer à l’image suivante"
            </p>
            <div style="text-align: center;">
              <img src="../statics/panel_next.png" style="width: 350px;"/>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
      <q-toolbar style="text-align: right;" color="white" slot="footer">
        <q-toolbar-title>
          <q-btn color="pink"
                @click="prevSlide()"
                :disabled="currentSlide === 0"
                style="margin-right: 10px"
                label="< précédent" />
          <q-btn color="pink"
                @click="nextSlide()"
                :disabled="currentSlide === 6"
                style="margin-right: 10px"
                label="suivant >" />
          <q-btn color="grey"
                @click="close()"
                label="fermer" />
        </q-toolbar-title>
      </q-toolbar>
    </q-modal-layout>
  </q-modal>
</template>

<script>
import { mapState } from 'vuex';

import Labels from '../constants/labels';

export default {
  name: 'CcHelp',
  computed: {
    ...mapState('users', ['openHelp']),
  },
  data() {
    return {
      labels: Labels,
      currentSlide: 0,
    };
  },
  methods: {
    nextSlide() {
      this.currentSlide += 1;
      this.$refs.carousel.next();
    },
    prevSlide() {
      this.currentSlide -= 1;
      this.$refs.carousel.previous();
    },
    close() {
      this.$store.commit('users/SET_OPEN_HELP', false);
    },
  },
};
</script>

<style lang="stylus">
  .help
    .layout-padding
      padding-top 1rem
</style>
