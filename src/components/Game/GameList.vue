<template>
    <div class="container">
        <div class="row mt-5">
            <div class="col-md-8">
                <div class="row">
                    <div class="col text-center mb-5 nes-container with-title">
                        <p class="title">Your Games</p>
                        <div class="row">
                            <div v-if="showGameForm" class="col text-center mb-1">
                                <div class="input-group mb-3 neo">
                                    <div class="input-group-prepend input-group-append">
                                        <span class="input-group-text">Game Name:</span>
                                    </div>
                                    <input v-model="gameName" type="text" class="form-control" id="basic-url" aria-describedby="Input the game name.">
                                </div>
                                <div class="input-group d-flex justify-content-center mb-3">
                                    <button @click="createGame" type="button" class="btn nes-btn is-success mr-2">Go</button>
                                    <button @click="showGameForm = false" type="button" class="btn nes-btn is-error">Cancel</button>
                                </div>
                                <small>Give the game a name, or pose a question... BUT NOT THE ANSWER!</small>
                            </div> 
                            <div v-else class="col text-center mb-5">
                                <ul id="gameList">  
                                    <li v-for="game in games" :key="game.id" class="listItem neo">
                                        <router-link :to="`/game/${game.id}`" @click.native="playSound(sounds.gameStart)" tag="button" :class="gameStatusClass(game)" class="btn nes-btn btn-block mr-2">
                                            <i v-if="game.status == 'solved'" class="nes-icon trophy is-small"></i> {{ game.name }}
                                        </router-link>
                                        <a @click="deleteGame(game)" class="btn nes-btn is-error text-white"><i class="fas fa-trash-alt"></i></a>
                                    </li>   
                                </ul>
                                <div class="col">
                                    <button @click="showGameForm = true" class="btn nes-btn is-primary">New Game</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col mb-5 nes-container with-title">
                        <p class="title">Currently Playing</p>
                        <ul id="gameList">  
                            <li v-for="game in gamesPlaying" :key="game.id" class="listItem neo">
                                <router-link :to="`/game/${game.id}`" @click.native="playSound(sounds.gameStart)" tag="button" class="btn nes-btn btn-block">
                                    {{ game.name }} : {{ game.status }}
                                </router-link>
                            </li>   
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="nes-container with-title">
                    <p class="title">Stats</p>
                    <p>Games Played<br>{{ played }}</p>
                    <p>Total Points<br><i class="nes-icon coin is-small mr-3"></i>{{ pointsTotal }}</p>
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
            gamesPlaying: [],
            showGameForm: false,
            gameName: '',
            played: 0,
            pointsTotal: 0,
            sounds: {
                gameStart: './static/sounds/game-start.mp3'
            }
        }
    },
    mounted() {
        // Get the games list
        this.getGames();
        this.getGamesPlaying();
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
        playSound(sound) {
            if(sound) {
                var audio = new Audio(sound);
                audio.play();
            }
        },
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
        getGamesPlaying() {
            var self = this;
            firebase.database().ref('players').on('value', function(snapshot) {
                self.gamesPlaying = [];
                snapshot.forEach(function(game) {
                    game.forEach(function(player) {
                        if (player.key == self.$store.state.user.firebaseId) {
                            firebase.database().ref('games/' + game.key).once('value').then(function(snapshot) {    
                                if (snapshot.val()) {
                                    self.gamesPlaying.push({
                                        id: game.key,
                                        name: snapshot.val().name,
                                        owner: snapshot.val().userName,
                                        status: (snapshot.val().status == 'solved') ? 'Solved' : 'Playing'
                                    });
                                }                                                          
                            });
                        }
                    });
                });
                // self.sortGames();
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
                userName: this.$store.state.user.data.displayName,
                created: Date.now(),
                status: 'inPlay'
            });
            this.gameName = '';
            this.showGameForm = false;
        },
        deleteGame(game) {
            var remove = {};
            remove['games/' + game.id] = null;
            remove['players/' + game.id] = null;
            firebase.database().ref().update(remove);
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
                'is-warning': game.status == 'solved',
                'is-error': game.status == 'lost',
                'none': (game.status != 'solved' && game.status != 'lost')
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