<template>
    <div class="container">
        <div class="row mt-5">
            <div class="col-md-8">
                <div class="row">
                    <div class="col text-center mb-5">
                        <h4>Your Games</h4>
                    </div>
                    <div class="col">
                        <button @click="showGameForm = true" class="btn neo">New Game</button>
                    </div>
                </div>
                <div class="row">
                    <div v-if="showGameForm" class="col text-center mb-5">
                        <div class="input-group mb-3 neo">
                            <div class="input-group-prepend input-group-append">
                                <span class="input-group-text">Game Name:</span>
                            </div>
                            <input v-model="gameName" type="text" class="form-control" id="basic-url" aria-describedby="Inout the game name.">
                        </div>
                        <div class="input-group d-flex justify-content-center mb-3">
                            <button @click="createGame" type="button" class="btn btn-outline-success mr-2">Go</button>
                            <button @click="showGameForm = false" type="button" class="btn btn-outline-danger">Cancel</button>
                        </div>
                        <small>Person, place, thing - No one will see this</small>
                    </div> 
                    <div v-else class="col text-center mb-5">
                        <ul id="gameList">  
                            <li v-for="game in games" :key="game.id" class="listItem neo">
                                <router-link :to="`/game/${game.id}`" tag="button" :class="gameStatusClass(game)" class="btn btn-block mr-2">
                                    <i v-if="game.status == 'solved'" class="fas fa-star"></i> {{ game.name }}
                                </router-link>
                                <a @click="deleteGame(game)" class="btn btn-danger text-white"><i class="fas fa-trash-alt"></i></a>
                            </li>   
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="row">
                    <div class="col">
                        <h4>Stats</h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col text-center">
                        <p><strong>Games Played: </strong>{{ played }}</p>
                        <p><strong>Total Points: </strong> {{ pointsTotal }} </p>
                    </div>
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
            gameName: '',
            played: 0,
            pointsTotal: 0
        }
    },
    mounted() {
        // Get the games list
        this.getGames();
        this.getStats();
        // try again on auth state change
        this.$store.subscribe((mutation, state) => {
            if (mutation.type == "SET_FIREBASEID" && state.user.loggedIn) {
                this.getGames();
                this.getStats();
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
                        status: game.val().status,
                        created: game.val().created
                    });
                });
                self.sortGames();
            });
        },
        getStats() {
            var self = this;
            firebase.database().ref('leaderboard/' + this.$store.state.user.firebaseId).once('value').then((stats) => {
                self.played = stats.val().games;
                self.pointsTotal = stats.val().points;
            }).catch(() => {
                // catch uncaught in promise
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
                created: Date.now(),
                status: 'inPlay'
            });
            this.gameName = '';
            this.showGameForm = false;
        },
        deleteGame(game) {
            firebase.database().ref('games/' + game.id).remove();
        },
        sortGames() {
            this.games.sort((a, b) => {
                const first = a.created;
                const second = b.created;
                let comparison = 0;
                if (first < second) {
                    comparison = 1;
                } else if (first > second) {
                    comparison = -1
                }
                return comparison;
            });
        },
        gameStatusClass(game) {
            return {
                'btn-warning': game.status == 'solved',
                'btn-outline-danger': game.status == 'lost',
                'btn-outline-secondary': (game.status != 'solved' && game.status != 'lost')
            }
        }
    },
    validations: {
        gameName: { required }
    }
}
</script>

<style lang="less" scoped>
    
</style>