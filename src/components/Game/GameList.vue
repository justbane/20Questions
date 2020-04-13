<template>
    <div class="container">
        <div class="row mt-5">
            <div class="col">
                <div class="row">
                    <div class="col text-center">
                        <h3>Your Games</h3>
                    </div>
                    <div class="col">
                        <button @click="showGameForm = true" class="btn neo">New Game</button>
                    </div>
                </div>
                <div class="row">
                    <div v-if="showGameForm" class="col w-100 text-center">
                        <div class="input-group mb-3 neo">
                            <div class="input-group-prepend input-group-append">
                                <span class="input-group-text">Game Name:</span>
                            </div>
                            <input v-model="gameName" type="text" class="form-control" id="basic-url" aria-describedby="Inout the game name.">
                            <div class="input-group-append">
                                <button @click="createGame" type="button" class="btn btn-outline-success">Go</button>
                                <button @click="showGameForm = false" type="button" class="btn btn-outline-danger">Cancel</button>
                            </div>
                            
                        </div>
                    </div> 
                    <div v-else class="col w-100 text-center">
                        <ul id="gameList">  
                            <li v-for="game in games" :key="game.id" class="listItem neo">
                                <router-link :to="`/game/${game.id}`" tag="button"  class="btn btn-outline-secondary btn-lg btn-block mr-2">{{ game.name }}</router-link>
                                <a @click="deleteGame(game)" class="btn btn-danger btn-lg text-white"><i class="fas fa-trash-alt"></i></a>
                            </li>   
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="col text-center">
                    <h3>Invites</h3>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import firebase from 'firebase';
import { required } from 'vuelidate/lib/validators';

export default {
    name: 'GameList',
    data() {
        return {
            games: [],
            showGameForm: false,
            gameName: ''
        }
    },
    mounted() {
        // Get the games list
        this.getGames();
        // try again on auth state change
        this.$store.subscribe((mutation, state) => {
            if (mutation.type == "SET_FIREBASEID" && state.user.loggedIn) {
                this.getGames();
            }
        });
    },
    methods: {
        getGames() {
            var self = this;
            firebase.database().ref('games').orderByChild('userId').equalTo(this.$store.state.user.firebaseId).on('value', function(snapshot) {
                self.games = [];
                snapshot.forEach(function(game) {
                    self.games.push({
                        id: game.key, 
                        name: game.val().name,
                        created: game.val().created
                    });
                });
                self.sortGames();
            });
        },
        createGame() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            firebase.database().ref('games').push({
                name: this.gameName,
                userId: this.$store.state.user.firebaseId,
                created: Date.now()
            });
            this.gameName = '';
            this.showGameForm = false;
        },
        deleteGame(game) {
            firebase.database().ref('games/' + game.id).remove();
        },
        sortGames() {
            this.games.sort(function(a, b){return b.created-a.created});
        }
    },
    validations: {
        gameName: { required }
    }
}
</script>

<style lang="less" scoped>
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