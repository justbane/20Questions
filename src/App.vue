<template>
    <div id="main">
        <div class="nes-container with-title is-centered mb-3">   
            <h2 class="title">20 Questions</h2>
            <nav class="navbar navbar-expand-lg p-1">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <!-- <li class="nav-item">
                            <router-link to="/" tag="a" active-class="active" exact class="flex-sm-fill text-sm-center nav-link">Home</router-link>
                        </li>  -->
                        <!-- <li class="nav-item">
                            <router-link to="/lobby" tag="a" active-class="active" exact class="flex-sm-fill text-sm-center nav-link">Lobby</router-link>
                        </li> -->
                        <li class="nav-item mr-3">
                            <router-link to="/games" tag="button" active-class="is-primary" exact class="pt-1 pb-1 flex-sm-fill text-sm-center nav-link nes-btn">Your Games</router-link>
                        </li> 
                        <li class="nav-item">
                            <router-link to="/leaderboards" tag="button" active-class="is-primary" exact class="pt-1 pb-1 flex-sm-fill text-sm-center nav-link nes-btn">Leaderboards</router-link>
                        </li>
                    </ul>
                    <div v-if="user.loggedIn">
                        <button @click="logout" class="btn">Logout {{ user.data.email }}</button>
                    </div>
                </div>
            </nav>
        </div>
        <router-view></router-view>
        <div class="container">
            <div class="row mt-5">
                <div class="col">
                    <small>Built by Justin Bane</small>
                </div>
            </div>
        </div>
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
        text-align: center;
        //color: #2c3e50;
        margin:15px auto 0 auto;
        max-width: 1280px;

        .navbar {
            box-shadow: none;
        }

        #gameList {
            li {
                display: flex;
                justify-content: space-between;
                align-items: center;

                &.listItem {
                    margin-bottom: 10px;
                }
            }
        }
    }
    
</style>
