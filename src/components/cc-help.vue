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
              Labelbot est en train d’apprendre à reconnaître de façon autonome 3 types
              d’éléments qui entravent l’accessibilité des rues et des
              trottoirs pour les personnes à mobilité réduite :
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
            <p>
              Votre mission : aider Labelbot à reconnaître ces éléments
              en sélectionnant, pour chacun, sur les images qui vous
              sont proposées, une zone de l’image qui le contient.
            </p>
            <p>
              Attention, pour bien apprendre, Labelbot a besoin que la zone
              sélectionnée contienne uniquementl’élément indiqué !
              Pas besoin de sélectionner l’intégralité de l’élément, seulement
              une zone qui contient le “motif” recherché, par exemple, pour des pavés :
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
            <p>
              Pour commencer à faire apprendre Labelbot c’est très simple !
            </p>
            <p>
              Sur chaque image, suivez les étapes suivantes :
            </p>
            <p style="padding-top: 10px;">
              <strong>Etape 1 :</strong>
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
            <p>
              Si l’image ne contient aucun de ces éléments,
              cliquez sur le lien
              "<span style="color: #e91e63;">aucun élément, passer à la photo suivante</span>"
            </p>
          </q-carousel-slide>
          <q-carousel-slide>
            <p style="padding-top: 10px;">
              <strong>Etape 2 :</strong>
               Si l’image contient 1 ou plusieurs élément :
            </p>
            <p>
              Cliquez sur le bouton correspondant à l’élément que vous allez identifier :
            </p>
            <div style="text-align: center;">
              <img src="../statics/panel_select.png" style="width: 350px;"/>
            </div>
          </q-carousel-slide>
          <q-carousel-slide>
            <p>
              Cliquez sur le bouton
              <img src="../statics/reactangleTool.png"
                   style="width: 20px; margin: 0 10px 0 10px;" />
              situé en haut à droite de la zone image puis, à l’aide du curseur
              sélectionner une zone de l’image qui contient l’élément choisi
              directement sur l’image.
            </p>
            <div style="text-align: center;">
              <img src="../statics/selection.png" style="width: 440px;"/>
            </div>
            <p style="padding-top: 10px;">
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
            <p>
              <strong>Pour modifier votre sélection :</strong>
            </p>
            <p>
              Vous pouvez modifier la zone de sélection en
              cliquant sur le bouton
              <img src="../statics/edit.png"
                   style="width: 30px; margin: 0 10px 0 10px;" />
            </p>
            <p>
              Pour recommencer, vous pouvez supprimer votre sélection
              à l’aide du bouton
              <img src="../statics/delete.png"
                   style="width: 30px; margin: 0 10px 0 10px;" />, et
              recommencer à nouveau grâce au bouton
              <img src="../statics/reactangleTool.png"
                   style="width: 30px; margin: 0 10px 0 10px;" />
            </p>
            <p style="padding-top: 15px;">
              <strong>Validez votre choix en cliquant sur "Contribuer".</strong>
            </p>
            <div style="text-align: center;">
              <img src="../statics/panel_validate.png" style="width: 350px;"/>
            </div>
          </q-carousel-slide>
          <q-carousel-slide>
            <p style="padding-top: 10px;">
              <strong>Etape 3 (optionnelle) : </strong>
              si l’image contient un ou plusieurs autres éléments à détourer
              (parmi Elément de chantier, Rue Pavée, Passage piéton,
              Bande d'éveil vigilance),
              cliquez sur "Continuer avec cette image", sinon cliquez
              sur "passer à l’image suivante"
            </p>
            <div style="text-align: center;">
              <img src="../statics/panel_select.png" style="width: 350px;"/>
            </div>
          </q-carousel-slide>
          <q-carousel-slide>
            <p style="padding-top: 10px;">
              <strong>Etape 4 :</strong>
            </p>
            <p>
              Pour enregistrer cliquez sur “Enregistrer mes contributions”
            </p>
            <p>L’image suivante s’affiche automatiquement, et vous pouvez la qualifier.</p>
          </q-carousel-slide>
          <q-carousel-slide>
            <p style="padding-top: 10px;">
              Plus nous aurons de photos qualifiées, plus notre Labelbot pourra gagner
              en autonomie dans la reconnaissance des obstacles à la mobilité.
            </p>
            <p style="font-weight: bold;">
              Notre objectif : avoir qualifié 1000 photos d’ici fin avril grâce à vous !
              Chaque contribution compte, prêt.e à relever le défi ? Et si vous en qualifiez
              10 dès aujourd’hui ?
            </p>
            <p>
              A tout moment, retrouvez ce tutoriel en cliquant sur le bouton
              <img src="../statics/help.png"
                   style="width: 60px; margin: 0 10px 0 10px;" />
              en haut à droite de la page.</p>
              <div style="padding-top: 30px; text-align: center;">
                <q-btn color="pink"
                    size="lg"
                    @click="close()"
                    style="margin-right: 10px"
                    label="c'est parti !" />
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
                 v-if="currentSlide != 8"
                 style="margin-right: 10px"
                 label="suivant >" />
          <q-btn color="grey"
                 v-if="currentSlide != 8"
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
  created() {
    this.$refs.goToSlide(0);
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
    .q-modal-layout-content
      overflow-y hidden
    .layout-padding
      padding-top 1rem
</style>
