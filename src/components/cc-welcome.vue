<template>
<q-modal v-model="openWelcome"
        minimized>
  <q-modal-layout style="width: 40vw;">
    <q-toolbar color="dark" slot="header">
      <q-toolbar-title>
      Bienvenue sur Labelbot
      </q-toolbar-title>
    </q-toolbar>
    <div class="layout-padding">
      <p>
        Vous avez été invité à contribuer à la qualification
        d’un jeu de données photographiques.
      </p>
      <p>
        Pour chacune des photos présentées vous allez pouvoir attester
        de la présence d’un ou plusieurs éléments
        en précisant leur emplacement grâce à notre outil de détourage.
      </p>
      <p>
        Merci, grâce à vous, nous mettons les micro-contributions
        au service de la mobilité urbaine pour tous !
      </p>
      <p><a class="next" href="">En savoir plus</a></p>
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
  name: 'CcWelcome',
  computed: {
    ...mapState('users', ['openWelcome']),
  },
  // watch: {
  //   openWelcome() {
  //     this.onOpenWelcome = openWelcome;
  //   },
  // },
  // mounted() {
  //   this.$root.$on('onOpenWelcome', () => {
  //     this.openWelcome = true;
  //   });
  // },
  methods: {
    close() {
      this.$store.commit('users/SET_OPEN_WELCOME', false);
    },
  },
};
</script>

<style scopped lang="stylus">
</style>
