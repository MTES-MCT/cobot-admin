<template>
  <q-modal v-model="openInfo"
           class="info"
                    minimized>
    <q-modal-layout style="width: 50vw">
      <q-toolbar color="dark" slot="header">
        <q-toolbar-title>
          Informations
        </q-toolbar-title>
      </q-toolbar>
      <div class="layout-padding">
        <p>
          L’outil Labelbot a été développé au sein de la
          <a class="pink" href="https://www.ecologique-solidaire.gouv.fr/fabrique-numerique-lincubateur-services-numeriques-du-pole-ministeriel" target="_blank">Fabrique Numérique</a>,
          l’incubateur du Ministère de la Transition écologique et solidaire.
        </p>
        <p>
          Cette plateforme permet à chacun de participer à la qualification
          de jeux de photographies afin d’indiquer la présence d’obstacles et
          ainsi mettre la contribution citoyenne au service de la mobilité urbaine pour tous.<br/>
        </p>
        <p>
          <strong>Comment fonctionne le projet ?</strong>
        </p>
        <p>
          <strong>1. Captation de photos</strong><br/>
          Nous captons des photographies de la voirie grâce à des mini-caméras raspberry
          géo-localisées installées sur les fauteuils roulants et vélos
          des membres de notre communauté.
        </p>
        <p>
          <strong>2. Qualification des photos</strong>
          Grâce à Labelbot, les contributeurs peuvent identifier,
          de façon rapide et ludique, les obstacles présents sur la voirie.
        </p>
        <p>
          <strong>3. Calculateur d'itinéraires accessibles</strong><br/>
          Les photos qualifiées sont exploitées pour fournir des itinéraires
          GPS accessibles et inclusifs par notre partenaire Streetco.
        </p>
        <p><a href="https://street-co.com" target="_blank" class="pink">Découvrir StreetCo</a></p>
      </div>
      <q-toolbar style="text-align: right;" color="white" slot="footer">
        <q-toolbar-title>
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

export default {
  name: 'CcInfo',
  computed: {
    ...mapState('users', ['openInfo']),
  },
  methods: {
    close() {
      this.$store.commit('users/SET_OPEN_INFO', false);
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .info
    a
      color $pink
      text-decoration none
      &:hover
        text-decoration underline
</style>
