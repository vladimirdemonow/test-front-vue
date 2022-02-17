import Vue from 'vue';
import Vuetify from 'vuetify';
import Notifications from 'vue-notification';

Vue.use(Vuetify);
Vue.use(Notifications);

export default new Vuetify({
  theme: {
    dark: (() => false)(),
  },
  icons: {
    iconfont: 'mdi',
  },
});
