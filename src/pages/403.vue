<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="~assets/sad.svg"
        style="width:30vw;max-width:150px;"
      >
    </p>
    <p class="text-faded">Sorry, your are not allowed to be here...<strong>(403)</strong></p>
    <q-btn
      color="secondary"
      style="width:200px;"
      @click="goBack()">{{ $t('global.goBack') }}</q-btn>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.push('/');
    },
  },
};
</script>
