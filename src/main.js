import Vue from 'vue';
import App from './App.vue';
import Vuex from 'vuex';
import router from './router';
import PortalVue from 'portal-vue';

import 'material-icons/iconfont/material-icons.css';

new Vue({
    Vuex,
    router,
    PortalVue,
    render: h => h(App)
}).$mount('#app')
