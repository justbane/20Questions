<template>
    <div class="container">
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
                    <div class="input-group-prepend imput-group-append">
                        <span class="input-group-text">Game Name:</span>
                    </div>
                    <input v-model="gameName" type="text" class="form-control" id="basic-url" aria-describedby="Inout the game name.">
                    <button @click="createGame" type="button" class="btn btn-outline-success">Go</button>
                    <button @click="showGameForm = false" type="button" class="btn btn-outline-danger">Cancel</button>
                </div>
            </div> 
            <div v-else class="col w-100 text-center">
                <ul id="gameList">  
                    <li v-for="game in games" :key="game.id" class="listItem neo">
                        <button class="btn btn-outline-secondary btn-lg btn-block">{{ game.name }}</button>
                        <button @click="deleteGame(game)" class="btn btn-outline-danger btn-lg">Delete</button>
                    </li>   
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase';
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
        // Get the ganes list
        var v = this;
        firebase.database().ref('games').orderByChild('userId').equalTo(this.$store.state.user.firebaseId).on('value', function(snapshot) {
            v.games = [];
            snapshot.forEach(function(game) {
                v.games.push({
                    id: game.key, 
                    name: game.val().name,
                    created: game.val().created
                });
            });
            v.sortGames();
        });
    },
    methods: {
        createGame() {
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