import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import App from './App.vue'
import PageNotFound from './pages/PageNotFound.vue'
import Home from './pages/Home.vue'
import Comments from './pages/Comments.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import * as VueRouter from 'vue-router';

const routes = [
    { name: 'home', path: '/', component: Home },
    { name: 'authors', path: '/authors/:authorName', component: Home },
    { name: 'comments', path: '/comments/:comicId', component: Comments },
    { name: '404', path: '/:pathMatch(.*)*', component: PageNotFound },
];


const vuetify = createVuetify({
    components,
    directives,
});

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
});

createApp(App)
    .use(vuetify)
    .use(router)
    .mount('#app')
