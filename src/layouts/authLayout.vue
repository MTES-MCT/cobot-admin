<template>
  <div class="row auth-layout">
    <div class="col-xs-12 col-sm-6">
      <router-view :key="$route.fullPath"></router-view>
    </div>
    <div class="col-xs-12 col-sm-6 cover">
      <div>
        <p>{{ $t('global.appTitle') }}</p>
        <small>{{ $t('global.appBottomLine') }}</small>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
@import '~variables'
.auth-layout
  min-height: 100%;
  .cover
    font-family: 'Shartoll';
    color: $neutral;
    font-size: 5rem;
    background-color: $cc-dark;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100vh;
    p
      margin: 0;
      line-height: 0;
      -webkit-margin-before: 0;
      -webkit-margin-after: 0;
    small
      font-size: 50%;

@media (max-width: 575px)
  .auth-layout
    .cover
      position: absolute;
      height: 60px;
      font-size: 30px;
</style>
