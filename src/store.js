import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        user: {
            loggedIn: false,
            data: null,
            firebaseId: null
        }
    },
    getters: {
        user(state) {
            return state.user
        }
    },
    mutations: {
        SET_LOGGED_IN(state, value) {
            state.user.loggedIn = value;
        },
        SET_USER(state, data) {
            state.user.data = data;
        },
        SET_FIREBASEID(state, value) {
            state.user.firebaseId = value;
        }
    },
    actions: {
        fetchUser({ commit }, user) {
            commit("SET_LOGGED_IN", user !== null);
            if (user) {
                commit("SET_USER", {
                    displayName: user.displayName,
                    email: user.email
                });
            } else {
                commit("SET_USER", null);
            }
        },
        setFirebaseId({ commit }, value) {
            if (value) {
                commit("SET_FIREBASEID", value);
            }
        }
    }
});