import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import Vuelidate from 'vuelidate';
import VueClipboard from 'vue-clipboard2';
import firebase from "firebase";
import store from "./store";
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

// On auth change, manage store and routing
firebase.auth().onAuthStateChanged(user => {
    store.dispatch('fetchUser', user);
    // Check a user on login
    try {
        firebase.database().ref('users').orderByChild('email').equalTo(user.email).once("value", function (snapshot) {            
            if (snapshot.val() == null) {
                // create a user
                var newUser = firebase.database().ref('users/' + user.uid).set({
                    name: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    photoURL: user.photoURL
                }).key;
                store.dispatch('setFirebaseId', newUser);
                store.dispatch('setProfilePhoto', user.photoURL);
            } else {
                var userId = Object.keys(snapshot.val())[0];
                store.dispatch('setFirebaseId', userId);
                store.dispatch('setProfilePhoto', user.photoURL);
            }
        });
    } catch (error) {
        console.log("Not logged in");
    }
    
    if (store.state.prevRoute) {
        var route = '/game/' + store.state.prevRoute;
        store.dispatch('resetPrevRoute');
        router.replace(route).catch(() => {
            console.log("Caught navigation duplication"); 
        });
    
    }
});

firebase.getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        }, reject);
    })
};

// Route when ready
router.beforeEach(async (to, from, next) => {
    if (store.state.user.data == null && to.path.indexOf('/game/-') > -1) {
        store.dispatch('setPrevRoute', to.params.id);
    }
    
    var user = await firebase.getCurrentUser();
    
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    if (requiresAuth && !user) {
        next('/');
    } else {
        next();
    }
});

Vue.use(Vuelidate);
Vue.use(VueClipboard);

// Vue mount
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
