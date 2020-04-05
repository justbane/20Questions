import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import * as firebase from "firebase";

// Import the Routes
import { routes } from './routes.js';

Vue.config.productionTip = false;

// Firebase
const configOptions = {
    apiKey: "AIzaSyBjyR921vl3q6WBC8HMRKhiJJL913JkBc4",
    authDomain: "questions-91007.firebaseapp.com",
    databaseURL: "https://questions-91007.firebaseio.com",
    projectId: "questions-91007",
    storageBucket: "questions-91007.appspot.com",
    messagingSenderId: "679458298981",
    appId: "1:679458298981:web:b0fb333029de2657b67a8c",
    measurementId: "G-PXX1P26QJF"
};
firebase.initializeApp(configOptions);

// Global VueRouter
Vue.use(VueRouter);
const router = new VueRouter({ routes });
// Global beforeEach route
router.beforeEach((to, from, next) => {
    console.log('global before each');
    next();
});

// Vue mount
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
