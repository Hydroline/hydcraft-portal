import Vue from 'vue';
import App from './App.vue';
import Vuex from 'vuex';
import router from './router';
import PortalVue from 'portal-vue';

import axios from 'axios';
import 'material-icons/iconfont/material-icons.css';

Vue.prototype.$axios = axios;

new Vue({
    Vuex,
    router,
    PortalVue,
    render: h => h(App)
}).$mount('#app')
