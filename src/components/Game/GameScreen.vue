<template>
    <div id="GameScene" class="container w-80">
        <div class="row>">
            <div class="title w-100 mb-5">
                <!-- <h1>20 Questions</h1> -->
                <h4>{{ game.gameOwner }} is thinking of something...</h4><p>You've got 20 questions to figure it out?</p>
            </div>
        </div>
        <div v-if="id" class="row">
            <QuestionsAnswers :game="{gameData: game, gameId: id }" :count="count" @add-question="addQs" @game-solved="gameSolved" @end-game="endGame"></QuestionsAnswers>
            <div class="col-sm-4 stats">
                <div class="w-100 h-100 p-3 neo">
                    <div v-bind:class="countClass" class="btn btn-lg p-3 mb-5" style="font-size: 3em; line-height: 1em;">{{ count }}</div>
                    <div v-if="game.status == 'solved'">
                        <h4 class="mb-2">SOLVED!</h4>
                        <img v-if="game.winnerPhoto" class="profileImg mr-2 mb-2" :src="game.winnerPhoto" />
                        <h3>{{ game.winnerName }} WINS!!</h3>
                        <p> +{{ count + 1 }} points</p>
                    </div>
                    <div v-if="game.status == 'lost'">
                        <h4 class="mb-2">GAME OVER</h4>
                        <div class="" style="font-size: 100px;"><i class="far fa-sad-tear"></i></div>
                        <h3>Nobody wins...</h3>
                        <p> +{{ count }} points</p>
                    </div>
                    <h4 v-else >Questions remaining</h4>

                    <div class="mt-5">
                        Share this game! 
                        <div class="input-group">
                            <input v-model="this.gameURL" class="form-control" disabled />
                            <div class="input-group-append">
                                <button v-clipboard:copy="gameURL" class="btn btn-secondary"><i class="far fa-copy"></i></button>
                            </div>
                        </div>
                        <small class="d-block">Send this link to friends to play 20 questions.</small>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="row">
            <p><strong>Oops!</strong> Looks like this game is no longer available.. or never existed.</p>
        </div>
    </div>
</template>

<script>
import QuestionsAnswers from './QuestionsAnswers.vue';
import firebase from 'firebase';

export default {
    name: 'GameScreen',
    data() {
        return {
            gameName: '',
            game: {
                gameOwner: '',
                gameOwnerId: null,
                questions: [],
                status: null,
                winnerName: null,
                winnerId: null,
                winnerPhoto: null

            }
        }
    },
    computed: {
        count() {
            var askedQuestions = [];
            for (var x in this.game.questions) {
                if (this.game.questions[x].type != 'chat') {
                    askedQuestions.push(x);
                }
            }
            var questionsLeft = 20 - askedQuestions.length;
            return questionsLeft;
        },
        countClass() {
            return {
                'btn-outline-success': this.count >= 8,
                'btn-outline-warning': this.count < 8 && this.count >= 5,
                'btn-danger': this.count < 5
            }
        },
        gameURL() {
            return "https://20questions.games/#/game/" + this.id;
        }
    },
    props: {
        id: {
            type: String,
            required: true
        }
    },
    components: {
        QuestionsAnswers,
    },
    beforeRouteEnter (to, from, next) {
         firebase.database().ref('games/' + to.params.id).once('value').then((snapshot) => {
            if (snapshot.val() != null) {
                next();
            } else {
                next('/games');
            }
        });
    },
    mounted() {
        var self = this;
        // Get our game data
        firebase.database().ref('games/' + this.id).on('value', (snapshot) => {
            if (snapshot.val() != null) {
                self.gameName = snapshot.val().name;
                self.game.gameOwnerId = snapshot.val().userId;
                self.game.status = snapshot.val().status;
                self.game.winnerName = snapshot.val().winnerName;
                self.game.winnerId = snapshot.val().winnerId;
                self.game.winnerPhoto = snapshot.val().winnerPhoto;
                self.getOwnerData();
                self.getQs();
            }
        });
    },
    methods: {
        getOwnerData() {
            var self = this;
            // Get the owner data
            firebase.database().ref('users/' + self.game.gameOwnerId).once('value').then((snapshot) => {
                self.game.gameOwner = snapshot.val().name;
            }).catch(() => {
                // caught
            });
        },
        getQs() {
            var self = this;
            // Get the owner data
            firebase.database().ref('games/' + this.id + '/questions').on('value',(snapshot) => {
                self.game.questions = [];
                snapshot.forEach(function(question) {
                    self.game.questions.push({
                        id: question.key, 
                        text: question.val().text,
                        type: question.val().type,
                        status: question.val().status,
                        created: question.val().created,
                        ownerId: question.val().ownerId,
                        ownerName: question.val().ownerName,
                        ownerPhoto: question.val().ownerPhoto
                    });
                });
            });
        },
        addQs(question) {
            // Get the owner data
            firebase.database().ref('games/' + this.id + '/questions').push({
                text: question.text,
                type: question.type,
                status: question.status,
                ownerId: this.$store.state.user.firebaseId,
                ownerName: this.$store.state.user.data.displayName,
                ownerPhoto: this.$store.state.user.profilePhoto,
                created: Date.now()
            });
        },
        gameSolved(question) {
            var self = this;
            // game update
            firebase.database().ref('games/' + this.id).update({
                status: 'solved',
                winnerId: question.ownerId,
                winnerName: question.ownerName,
                winnerPhoto: question.ownerPhoto,
            });
            // leaders update
            firebase.database().ref('leaderboard/' + question.ownerId).once('value').then((snapshot) => {
                var points = snapshot.val().points + self.count + 1;
                var games = (!snapshot.val().games) ? 1 : snapshot.val().games + 1;
                firebase.database().ref('leaderboard/' + question.ownerId).update({
                    points: points,
                    games: games
                });
            });
        },
        endGame(status) {
            // game update
            firebase.database().ref('games/' + this.id).update({
                status: status
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .stats {
        .profileImg {
            max-width: 60px;
            max-height: 60px;
        }
    }
</style>
