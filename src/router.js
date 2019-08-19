import Vue from 'vue';
import Router from "vue-router";
import Base from './components/Base.vue';
Vue.use(Router);
export default new Router({
    routes: [{
        path: '/*',
        name: 'base',
        component: Base
    }]
});