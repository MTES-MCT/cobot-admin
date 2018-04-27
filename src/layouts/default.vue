<template>
<q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Co-Construisons > Dashboard > Opensolar Map
        </q-toolbar-title>
        <cc-header-user firstname="Stéphane" lastname="LEGOUFFE"></cc-header-user>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      content-class="bg-grey-2"
    >
      <q-list
        no-border
        link
        inset-delimiter
        separator
      >
        <q-collapsible indent icon="mail" label="mes projets" opened>
          <q-item>
            <q-item-main label="Opensolar Map" sublabel="1 283 contributions" />
          </q-item>
          <q-item>
            <q-item-main label="A bicyclette !" sublabel="projet non démarré" />
          </q-item>
          <q-item>
            <q-btn outline
                   color="primary"
                   label="ajouter un projet" />
          </q-item>
        </q-collapsible>

        <q-item>
          <q-item-side icon="people" />
          <q-item-main label="Mon compte" />
        </q-item>
        <!-- <q-list-header>Menu</q-list-header> -->
        <!-- <q-item @click.native="openURL('http://quasar-framework.org')">
          <q-item-side icon="school" />
          <q-item-main label="Docs" sublabel="quasar-framework.org" />
        </q-item>
        <q-item @click.native="openURL('https://github.com/quasarframework/')">
          <q-item-side icon="code" />
          <q-item-main label="GitHub" sublabel="github.com/quasarframework" />
        </q-item>
        <q-item @click.native="openURL('https://discord.gg/5TDhbDg')">
          <q-item-side icon="chat" />
          <q-item-main label="Discord Chat Channel" sublabel="https://discord.gg/5TDhbDg" />
        </q-item>
        <q-item @click.native="openURL('http://forum.quasar-framework.org')">
          <q-item-side icon="record_voice_over" />
          <q-item-main label="Forum" sublabel="forum.quasar-framework.org" />
        </q-item>
        <q-item @click.native="openURL('https://twitter.com/quasarframework')">
          <q-item-side icon="rss feed" />
          <q-item-main label="Twitter" sublabel="@quasarframework" />
        </q-item> -->
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <div class="column items-center no-wrap">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
  <!-- <div>
    <q-toolbar class="header"
               slot="header"
               :glossy="$q.theme === 'mat'"
               :inverted="$q.theme === 'ios'"
              color="primary">
      <q-toolbar-title class="title">
        <router-link to="/">{{ $t('global.appTitle') }}</router-link>
      </q-toolbar-title>
    </q-toolbar>

    <div class="column items-center no-wrap">
      <router-view />
    </div>
  </div> -->
</template>

<script>
import CcHeaderUser from 'components/cc-header-user';
import { openURL } from 'quasar';

export default {
  name: 'LayoutDefault',
  components: {
    CcHeaderUser,
  },
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
    };
  },
  methods: {
    openURL,
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .bg-light-blue
    background-color: $bg-light-blue;
  .header
    margin-bottom: 40px;
    .title
      font-family: 'Shartoll';
      font-weight: 900;
      font-size: 20px;
      color: $neutral;
    a
      text-decoration: none;
      color: $neutral;
      &:hover
        color: $neutral;
  .breadcrumb-container
    width: 80vw;
    max-width: 1200px;
    font-size: 12px;
</style>
