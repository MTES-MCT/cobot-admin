import axios from 'axios';
import VueAxios from 'vue-axios';

const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
});

export default ({ Vue }) => {
  Vue.use(VueAxios, axiosInstance);
};
