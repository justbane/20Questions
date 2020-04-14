<template>
    <div id="main">
        <div class="container">
            <div class="row mt-1">
                <div class="col">
                    <div v-if="user.loggedIn" class="d-flex justify-content-end">
                        <button @click="logout" class="btn neo">Logout {{ user.data.displayName }}</button>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <ul class="nav justify-content-center">
                        <li class="nav-item">
                            <router-link to="/" tag="a" active-class="active" exact class="flex-sm-fill text-sm-center nav-link">Home</router-link>
                        </li> 
                        <li class="nav-item">
                            <router-link to="/games" tag="a" active-class="active" exact class="flex-sm-fill text-sm-center nav-link">Games</router-link>
                        </li> 
                        <li class="nav-item">
                            <router-link to="/leaderboards" tag="a" active-class="active" exact class="flex-sm-fill text-sm-center nav-link">Leaderboards</router-link>
                        </li> 
                    </ul>
                </div>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import firebase from 'firebase';

export default {
  name: 'App',
  data() {
        return {}
    },
    computed: {
        ...mapGetters({
            user: "user"
        })
    },
    methods: {
        logout() {
            var parent = this;
            firebase.auth().signOut().then(function() {
                console.log('Logged out success');
                parent.$router.replace({
                    path: '/'
                });
            }).catch(function(error) {
                console.log(error);
            });

        }
    }
}
</script>

<style lang="less">
    #main {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin:15px auto 0 auto;
        max-width: 1024px;

        .neo {
            border-radius: 5px;
            background: #f5f4f6;
            box-shadow:  6px 6px 12px #dddcdd, 
            -6px -6px 12px #ffffff;
            margin: 5px;

            .input-group-prepend, .imput-group-append {
                border: none;
                span {
                    border: none;
                }
            }
            input, textarea, select {
                border: none;
            }
        }
    }
</style>
