<template>
    <div class="questions col-md-8 col-sm-12">
        <div class="card list text-wrap overflow-auto mb-3 w-100 neo">
            <ul>
                <li v-for="question in game.gameData.questions" :key="question.id">
                    <div class="mb-2">
                        <div class="row no-gutters mb-0">
                            <div class="col-2 pl-2">
                                <button v-if="question.type == 'question' && question.status == 'asked'" type="button" class="btn btn-outline-primary w-100 h-100" style="font-size: 25px;"><i class="fas fa-question"></i></button>
                                <button v-if="question.type == 'question' && question.status == 'denied'" type="button" class="btn btn-danger w-100 h-100" style="font-size: 25px;">
                                    <i class="fas fa-times"></i><span class="d-none d-lg-block">NO</span>
                                </button>
                                <button v-if="question.type == 'question' && question.status == 'confirmed'" type="button" class="btn btn-success w-100 h-100" style="font-size: 25px;">
                                    <i class="fas fa-check"></i><span class="d-none d-lg-block">YES</span>
                                </button>
                                <button v-if="question.type == 'question' && question.status == 'solved'" type="button" class="btn btn-warning w-100 h-100" style="font-size: 25px;">
                                    <i class="fas fa-star"></i><span class="d-none d-lg-block">WIN</span>
                                </button>
                                <button v-if="question.type == 'chat' && question.status == 'posted'" type="button" class="btn btn-secondary disabled w-100 h-100" style="font-size: 25px;"><i class="far fa-comment"></i></button>
                            </div>
                            <div class="col pl-2">
                                <div v-if="question.type == 'chat'" class="card-body p-2">
                                    <p class="card-text mb-2"><img v-if="question.ownerPhoto != null" class="profileImg mr-2" :src="question.ownerPhoto" /><small class="text-muted"><strong>{{ question.ownerName }}</strong></small></p>
                                    <p class="card-text mb-1 lead">{{ question.text }}</p>
                                </div>
                                <div v-else class="card-body p-2">
                                    <h5 v-if="question.type == 'question' && question.status != 'solved'" class="card-title mb-1">Question</h5>
                                    <h5 v-else class="card-title mb-1">SOLVED!</h5>
                                    <p v-if="question.type == 'question' && question.status == 'solved'" class="card-text"><img v-if="question.ownerPhoto != null" class="profileImg mr-2" :src="question.ownerPhoto" /><small class="font-weight-bold"><em>WINNER:</em> {{ question.ownerName }}</small></p>
                                    <p v-else class="card-text"><img v-if="question.ownerPhoto != null" class="profileImg mr-2" :src="question.ownerPhoto" /><small class="text-muted">Asked by {{ question.ownerName }}</small></p>
                                    <p class="card-text text lead">{{ question.text }}</p>
                                </div>
                                <div v-if="game.gameData.gameOwnerId == $store.state.user.firebaseId && question.status == 'asked'" class="card-footer bg-transparent border-secondary d-flex justify-content-end align-items-center">
                                    <div class="btn-group btn-group-sm" role="group">
                                        <button v-if="(game.gameData.status != 'solved')" @click="answerQuestion(question, 'confirmed')" class="btn btn-primary mr-1 ml-2"><i class="fas fa-check"></i> Yes</button>
                                        <button v-if="(game.gameData.status != 'solved')" @click="answerQuestion(question, 'denied')" class="btn btn-danger mr-1"><i class="fas fa-check"></i> No</button>
                                        <button v-if="(game.gameData.status != 'solved')" @click="answerQuestion(question, 'solved')" class="btn btn-warning"><i class="fas fa-star"></i> Winner</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="input-group mb-3 w-100 neo">
            <input v-model="questionText" v-on:keyup.enter="addChat" type="text" name="questionText" class="form-control" id="basic-url" aria-describedby="Inout the game name.">
            <div class="input-group-append">
                <button @click="addChat" type="button" class="btn btn-secondary">Chat</button>
                <button v-if="showQuestionButton" :disabled="waitToQuestion > 0" @click="addQuestion" type="button" class="btn btn-outline-primary">
                    <span v-if="waitToQuestion > 0">Ask another question in {{waitToQuestion}}</span>
                    <span v-else>Ask question</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase';
import { required } from 'vuelidate/lib/validators';

export default {
    name: 'Questions',
    data() {
        return {
            questionText: '',
            waitToQuestion: 0
        }
    },
    computed: {
        showQuestionButton() {  
            if (this.game.gameData.gameOwnerId != this.$store.state.user.firebaseId) {
                if (this.game.gameData.status == 'inPlay' && this.count > 0) {
                    return true;
                }
            }
            return false;
        }
    },
    props: {
        game: {
            type: Object,
            required: true
        },
        count: {
            type: Number,
            required: true
        }
    },
    methods: {
        addQuestion() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            var question = {
                text: this.questionText,
                type: 'question',
                status: 'asked',
                created: Date.now()
            }
            this.$emit('add-question', question);
            this.startAnswerTimer();
            this.questionText = '';            
        },
        addChat() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            var question = {
                text: this.questionText,
                type: 'chat',
                status: 'posted',
                ownerId: this.$store.state.user.firebaseId,
                ownerName: this.$store.state.user.data.displayName,
                ownerPhoto: this.$store.state.user.profilePhoto,
                created: Date.now()
            }
            this.$emit('add-question', question);
            this.questionText = '';
        },
        answerQuestion(question, status) {
            firebase.database().ref('games/' + this.game.gameId).child('questions').child(question.id).update({
                status: status
            });
            if (status == 'solved') {
                this.$emit('game-solved', question);
            }
            if(this.count < 1 && status != 'solved') {
                this.$emit('end-game', 'lost');
            }
        },
        startAnswerTimer() {
            if (this.waitToQuestion == 0) {
                this.waitToQuestion = 10;
                setTimeout(() => {
                    this.waitToQuestion -= 1;
                    this.startAnswerTimer();
                }, 1000);
            } else {
                setTimeout(() => {
                    this.waitToQuestion -= 1;
                    if (this.waitToQuestion > 0) {
                        this.startAnswerTimer();
                    }
                }, 1000);
            }
        }
    },
    validations: {
        questionText: { required }
    }
}
</script>

<style lang="less" scoped>
    .questions {
        .list {
            text-align: left;
            height: 420px;
            display: flex;
            flex-direction: column-reverse;

            ul {
                padding: 0;
                list-style: none;

                .profileImg {
                    max-width: 20px;
                    max-height: 20px;
                }
            }
        }
    }
</style>