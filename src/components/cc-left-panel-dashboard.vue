<template>
  <q-list highlight style="position: fixed; width:25%; height: 100vh;">
    <q-list-header>
      Dernières activitées
    </q-list-header>
    <q-item>
      <q-item-main label="Contibution de Roxane" />
      <q-item-side right>
        <q-item-tile stamp>il y a 10 mn</q-item-tile>
      </q-item-side>
    </q-item>
    <q-item>
      <q-item-main label="Arthur a ajouté 10 photos" />
      <q-item-side right>
        <q-item-tile stamp>il y a 1h</q-item-tile>
      </q-item-side>
    </q-item>
    <q-item>
      <q-item-main label="Contribution de Stéphane" />
      <q-item-side right>
        <q-item-tile stamp>il y a 2h</q-item-tile>
      </q-item-side>
    </q-item>
     <q-item>
      <q-item-main label="Contibution de Laurence" />
      <q-item-side right>
        <q-item-tile stamp>il y a 1 jour</q-item-tile>
      </q-item-side>
    </q-item>
  </q-list>
</template>

<script>

export default {
  name: 'CcLeftPanelDashboard',
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
