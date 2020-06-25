<template>
    <div id="main">        
        <nav class="navbar navbar-expand-lg navbar-light bg-light neo mb-5">
            <a class="navbar-brand" href="#">20 Questions</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                            <router-link to="/" tag="a" active-class="active" exact class="flex-sm-fill text-sm-center nav-link">Home</router-link>
                        </li> 
                        <!-- <li class="nav-item">
                            <router-link to="/lobby" tag="a" active-class="active" exact class="flex-sm-fill text-sm-center nav-link">Lobby</router-link>
                        </li> -->
                        <li class="nav-item">
                            <router-link to="/games" tag="a" active-class="active" exact class="flex-sm-fill text-sm-center nav-link">Your Games</router-link>
                        </li> 
                        <li class="nav-item">
                            <router-link to="/leaderboards" tag="a" active-class="active" exact class="flex-sm-fill text-sm-center nav-link">Leaderboards</router-link>
                        </li>
                </ul>
                <div v-if="user.loggedIn">
                    <button @click="logout" class="btn">Logout {{ user.data.email }}</button>
                </div>
            </div>
        </nav>
        <router-view></router-view>
        <div class="container">
            <div class="row mt-5">
                <div class="col">
                    <small>Built by and © Justin Bane</small>
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

            @media (max-width: 480px) { 
                margin: 0;
                box-shadow:  3px 3px 6px #dddcdd, 
            -3px -3px 6px #ffffff;
            }

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
</style>
