<template>
    <div class="container">
        <div class="row">
            <div class="col text-center mb-5 mt-5">
                <h3>Games Lobby</h3>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <ul id="gameList">
                    <li v-for="game in games" :key="game.id" class="listItem neo mb-3">
                        <router-link :to="`/game/${game.id}`" tag="button" class="btn btn-lg btn-block btn-outline-secondary">
                            <p class="m-0"><strong>Questions remaining: {{ questionCount(game) }}</strong></p>
                            <small>Game ID: {{ game.id }}</small>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase';

export default {
    name: 'GameLobby',
    data() {
        return {
            games: []
        }
    },
    mounted() {
        var self = this;
        // get games list
        firebase.database().ref('games/').orderByChild('status').equalTo('inPlay').on('value', (games) => {
            if (games.val() != null) {
                games.forEach((game) => {
                    self.games.push({
                        id: game.key,
                        created: game.val().created,
                        questions: game.val().questions
                    })
                });
                self.sortGames();
            }
        });
    },
    methods: {
        questionCount(game) {
            var askedQuestions = [];
            for (var x in game.questions) {
                if (game.questions[x].type == 'question') {
                    askedQuestions.push(game.questions[x].key)
                }
            }
            return 20 - askedQuestions.length;
        },
        sortGames() {
            console.log(this.games);
            
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
        }
    }
}
</script>

<style lang="less" scoped>

</style>