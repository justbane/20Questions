<template>
    <div id="GameScene" class="container w-80">
        <div class="row>">
            <div class="title w-100 mb-5">
                <h1>20 Questions</h1>
            </div>
        </div>
        <div v-if="id" class="row">
            <QuestionsAnswers :game="{gameData: game, gameId: id }" @add-question="addQs"></QuestionsAnswers>
            <div class="col-sm-4 stats">
                <div class="w-100 h-100 p-3 neo">
                    <h2>##</h2>
                    <p>Questions remaining</p>
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
                questions: []
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
        firebase.database().ref('games/' + this.id).once('value').then(function(snapshot) {
            self.gameName = snapshot.val().name;
            self.game.gameOwnerId = snapshot.val().userId;
            self.getOwnerData();
            self.getQs();
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
                        ownerId: question.val().owner
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
                created: Date.now()
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>
