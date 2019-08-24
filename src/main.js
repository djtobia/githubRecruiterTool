import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router';
import jsonExcel from 'vue-json-excel';
Vue.config.productionTip = false;

Vue.component('downloadExcel', jsonExcel);
new Vue({
    vuetify,
    router,
    render: h => h(App)
}).$mount('#app')
