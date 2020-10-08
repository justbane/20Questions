<template>
    <div id="GameScene" class="container w-80">
        <div class="row">
            <div class="nes-balloon from-left">
                <p><img class="d-inline" style="max-width: 30px;" :src="game.players[game.gameOwnerId].profilePhoto" /> {{ gameName }}</p>
            </div>
        </div>
        <div v-if="id" class="row">
            <QuestionsAnswers :game="{gameData: game, gameId: id }" :count="count" @add-question="addQs" @game-solved="gameSolved" @end-game="endGame"></QuestionsAnswers>
            <div class="col-md-4 col-sm-12 stats">
                <div class="nes-container with-title">
                    <p class="title">Questions</p>
                    <div v-bind:class="countClass" class="nes-text p-0 mt-4 mb-3" style="font-size: 3em; line-height: 1em;"><i class="nes-icon coin is-medium"></i>{{ count }}</div>
                    <div v-if="game.status == 'solved'">
                        <h4 class="mb-3 nes-text is-success">SOLVED!</h4>
                        <img v-if="game.winnerPhoto" class="profileImg mr-2 mb-2" :src="game.winnerPhoto" />
                        <p>{{ game.winnerName }} WINS!!</p>
                        <p> +{{ count + 1 }} points</p>
                    </div>
                    <div v-else-if="game.status == 'lost'">
                        <h4 class="mb-3 nes-text is-error">GAME OVER</h4>
                        <h3>Nobody wins...</h3>
                        <p> +{{ count }} points</p>
                    </div>
                    
                </div>
                <div class="w-100 h-100">
                    <div class="mt-5 nes-container with-title">
                        <p class="title">Players</p>
                        <div class="players w-100 mh-100 overflow-auto">
                            <ul class="list-group">
                                <li class="list-group-item d-flex justify-content-start align-items-center border-0 p-1" v-for="player in game.players" :key="player.id">
                                    <img v-if="player.profilePhoto != null" class="profileImg d-inline mr-2" :src="player.profilePhoto" /><small class="d-inline">{{ player.name }}</small>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="mt-5 nes-container with-title">
                        <p class="title">Share</p>
                        <div class="input-group">
                            <input v-model="this.gameURL" class="form-control" />
                            <div class="input-group-append mb-3">
                                <button v-clipboard:copy="gameURL" class="btn nes-btn"><i class="far fa-copy"></i></button>
                            </div>
                        </div>
                        <small class="d-block">Send this link to friends.</small>
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
                players: null,
                status: null,
                winnerName: null,
                winnerId: null,
                winnerPhoto: null,
                pendingQuestions: [],
            },
            sounds: {
                questionYes: './static/sounds/question-yes.mp3',
                questionNo: './static/sounds/question-no.mp3',
                gameOverWin: './static/sounds/game-over-win.mp3',
                gameOverLose: './static/sounds/game-over-lost.mp3'
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
                'is-success': this.count >= 8,
                'is-warning': this.count < 8 && this.count >= 5,
                'is-error': this.count < 5
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
    beforeRouteLeave (to, from, next) {
        // Unset player
        firebase.database().ref('players/' + this.id + '/' + this.$store.state.user.firebaseId).update({
            online: false
        }).then(() => {
            next()
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
            if (snapshot.val().status == 'solved') {
                self.playSound(self.sounds.gameOverWin);
            }
            if (snapshot.val().status == 'lost') {
                self.playSound(self.sounds.gameOverLose);
            }
        });
        // Set player
        firebase.database().ref('players/' + this.id + '/' + this.$store.state.user.firebaseId).update({
            'name': this.$store.state.user.data.displayName,
            'profilePhoto': this.$store.state.user.profilePhoto,
            'online': true
        }).then(() => {
            self.getPlayers();
        });

    },
    methods: {
        playSound(sound) {
            if(sound) {
                var audio = new Audio(sound);
                audio.play();
            }
        },
        getOwnerData() {
            var self = this;
            // Get the owner data
            firebase.database().ref('users/' + self.game.gameOwnerId).once('value').then((snapshot) => {
                self.game.gameOwner = snapshot.val().name;
            }).catch(() => {
                // caught
            });
        },
        getPlayers() {
            var self = this;
            firebase.database().ref('players/' + this.id).orderByChild('online').equalTo(true).on('value', (snapshot) => {      
                self.game.players = null;
                self.game.players = snapshot.val();
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
                    
                    // check for answered questions in pending list
                    if (self.game.pendingQuestions.includes(question.key)) {
                        var index;
                        switch (question.val().status) {
                            case 'confirmed':
                                self.playSound(self.sounds.questionYes);
                                index = self.game.pendingQuestions.indexOf(question.key);
                                self.game.pendingQuestions.splice(index, 1);
                                break;
                            
                            case 'denied':
                                self.playSound(self.sounds.questionNo);
                                index = self.game.pendingQuestions.indexOf(question.key);
                                self.game.pendingQuestions.splice(index, 1);
                                break;

                            default:
                        }
                    }

                    // last (important) add to pending question list.
                    if(question.val().status == 'asked' && !self.game.pendingQuestions.includes(question.key)) {
                        self.game.pendingQuestions.push(question.key);
                    }
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
                var points = 0;
                var games = 0;
                if (snapshot.val() == null) {
                    points = self.count + 1;
                    games = 1;
                } else {
                    points = snapshot.val().points + self.count + 1;
                    games = (!snapshot.val().games) ? 1 : snapshot.val().games + 1;
                }
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
            max-width: 30px;
            max-height: 30px;
        }

        .players {
            height: 150px;
        }
    }
</style>
