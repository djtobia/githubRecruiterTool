import Vue from 'vue';
import Router from "vue-router";
import Base from './components/Base.vue';
import About from './components/About.vue';
Vue.use(Router);
export default new Router({
    routes: [{
        path: '/',
        name: 'base',
        component: Base
    },
        {
            path: '/about',
            name: '/about',
            component: About
        },
        {path : '*', component: Base}]
});