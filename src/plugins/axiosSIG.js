import axios from 'axios';
// import VueAxios from 'vue-axios';

const axiosSIGInstance = axios.create({
  baseURL: process.env.API_SIG_URL,
});

export default ({ Vue }) => {
  Vue.prototype.$axiosSIG = axiosSIGInstance;
  // Vue.use(VueAxios, axiosSIGInstance);
};
