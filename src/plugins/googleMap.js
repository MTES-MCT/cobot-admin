import * as VueGoogleMaps from 'vue2-google-maps';

export default ({ Vue }) => {
  Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyAklcr2T53GLWOXXPLcEDyt73kqCvDAKAE',
    },
  });
};
