<template>
  <q-list style="position: fixed; width:25%; height: 100vh;">
    <q-list-header>
      Ajouter des utilisateurs
    </q-list-header>
    <q-item>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
    </q-item>
    <q-item>
      <div style="width: 100%; text-align: center;">
        <q-btn @click="addUser"
                color="positive"
                icon="add"
                label="ajouter des contributeurs" />
      </div>
    </q-item>
  </q-list>
</template>

<script>

export default {
  name: 'CcLeftPanelUser',
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
