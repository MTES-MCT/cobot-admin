<template>
  <div class="main-card row justify-center">
    <div style="text-align: center">
      <h2>Dataset - {{ projectName }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dataset',
  data() {
    return {
      project: this.$route.params.name,
      projectName: this.$localStorage.get('projectName'),
    };
  },
};
</script>

<style lang="stylus">
  @import '~variables'
</style>
