<template>
    <div id="GameScene" class="container w-80">
        <div class="row>">
            <div class="title w-100 mb-5">
                <h1>20 Questions</h1>
            </div>
        </div>
        <div v-if="id" class="row">
            <QuestionsAnswers :game="{gameData: game, gameId: id }" @add-question="addQs" @game-solved="gameSolved"></QuestionsAnswers>
            <div class="col-sm-4 stats">
                <div class="w-100 h-100 p-3 neo">
                    <div v-bind:class="countClass" class="btn btn-lg p-3 mb-2" style="font-size: 3em; line-height: 1em;">{{ count }}</div>
                    <div v-if="game.status == 'solved'">
                        <h4>SOLVED!</h4>
                        <h3>{{ game.winnerName }} WINS!!</h3>
                    </div>
                    <h4 v-else >Questions remaining</h4>
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
                winnerId: null

            }
        }
    },
    computed: {
        count() {
            var askedQuestions = [];
            for (var x in this.game.questions) {
                console.log(this.game.questions[x].status);
                
                if (this.game.questions[x].type != 'chat') {
                    askedQuestions.push(x);
                }
            }
            return 20 - askedQuestions.length;
        },
        countClass() {
            return {
                'btn-outline-success': this.count >= 8,
                'btn-outline-warning': this.count < 8 && this.count >= 5,
                'btn-danger': this.count < 5
            }
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
    mounted() {
        var self = this;
        // Get our game data
        firebase.database().ref('games/' + this.id).on('value', function(snapshot) {
            if (snapshot.val() != null) {
                self.gameName = snapshot.val().name;
                self.game.gameOwnerId = snapshot.val().userId;
                self.game.status = snapshot.val().status;
                self.game.winnerName = snapshot.val().winnerName;
                self.game.winnerId = snapshot.val().winnerId;
                self.getOwnerData();
                self.getQs();
            }
        });
    },
    methods: {
        getOwnerData() {
            var self = this;
            // Get the owner data
            firebase.database().ref('users/' + self.game.gameOwnerId).once('value').then(function(snapshot) {
                self.game.gameOwner = snapshot.val().name;
            });
        },
        getQs() {
            var self = this;
            // Get the owner data
            firebase.database().ref('games/' + this.id + '/questions').on('value', function(snapshot) {
                self.game.questions = [];
                snapshot.forEach(function(question) {
                    self.game.questions.push({
                        id: question.key, 
                        text: question.val().text,
                        type: question.val().type,
                        status: question.val().status,
                        created: question.val().created,
                        ownerId: question.val().ownerId,
                        ownerName: question.val().ownerName
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
                ownerId: question.ownerId,
                ownerName: question.ownerName,
                created: Date.now()
            });
        },
        gameSolved(question) {
            firebase.database().ref('games/' + this.id).update({
                status: 'solved',
                winnerId: question.ownerId,
                winnerName: question.ownerName,
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>
