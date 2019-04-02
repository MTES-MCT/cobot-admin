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
       Bienvenue,
      </p>
      <p>
        Merci de nous aider à rendre la mobilité urbaine accessible à tous en
        apprenant à notre Labelbot à reconnaître les obstacles sur la voie publique !
      </p>
      <p><a class="next" @click="onNext" href="#">suivant</a></p>
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
    onNext() {
      this.$store.commit('users/SET_OPEN_WELCOME', false);
      this.$store.commit('users/SET_OPEN_HELP', true);
    },
    close() {
      this.$store.commit('users/SET_OPEN_WELCOME', false);
    },
  },
};
</script>

<style scopped lang="stylus">
</style>
