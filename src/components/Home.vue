<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <h2>{{ title }}</h2>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button v-if="!user.loggedIn" @click="login" class="btn neo"><i class="fab fa-google mr-2"></i>Login</button>
                <button v-if="user.loggedIn" @click="logout" class="btn neo"><i class="fab fa-google mr-2"></i>Logout</button>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase';
import { mapGetters } from "vuex";

export default {
    name: 'Home',
    data() {
        return {
            title: "20 Questions"
        }
    },
    computed: {
        ...mapGetters({
            user: "user"
        })
    },
    methods: {
        login() {
            var self = this;
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function() {
                self.$router.replace({
                    path: '/games'
                }).catch( () => {});
                
            }).catch(function(error) {
                // Handle Errors.
                console.log(error);
            });
        },
        logout() {
            firebase.auth().signOut().then(function() {
                console.log('Logged out success');
            }).catch(function(error) {
                console.log(error);
            });
        }
    }
}
</script>