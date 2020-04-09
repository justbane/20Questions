<template>
    <div class="questions col-sm-8">
        <div class="list text-wrap overflow-auto mb-3 w-100 neo">
            <ul>
                <li v-for="question in questions" :key="question.id">
                    <div class="card">
                        <div class="row no-gutters mb-0">
                            <div class="col-md-1">
                                <button v-if="question.type == 'question' && question.status == 'asked'" type="button" class="btn btn-outline-primary w-100 h-100" style="font-size: 25px;"><i class="fas fa-question"></i></button>
                                <button v-if="question.type == 'question' && question.status == 'denied'" type="button" class="btn btn-danger w-100 h-100" style="font-size: 25px;"><i class="fas fa-times"></i></button>
                                <button v-if="question.type == 'question' && question.status == 'confirmed'" type="button" class="btn btn-success w-100 h-100" style="font-size: 25px;"><i class="fas fa-check"></i></button>
                                <button v-if="question.type == 'question' && question.status == 'solved'" type="button" class="btn btn-warning w-100 h-100 star" style="font-size: 25px;"><i class="fas fa-star"></i></button>
                            </div>
                            <div class="col">
                                <div class="card-body p-2">
                                    <h5 v-if="question.type == 'question' && question.status != 'solved'" class="card-title mb-0">Question</h5>
                                    <h5 v-else class="card-title mb-0">SOLVED!</h5>
                                    <p class="card-text mb-0">{{ question.text }}</p>
                                    <p v-if="question.type == 'question' && question.status == 'solved'" class="card-text"><small class="font-weight-bold"><em>WINNER:</em> Justin Bane</small></p>
                                    <p v-else class="card-text"><small class="text-muted">Asked by Justin Bane</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="input-group mb-3 w-100 neo">
            <input v-model="questionText" type="text" class="form-control" id="basic-url" aria-describedby="Inout the game name.">
            <div class="input-group-append">
                <button @click="addQuestion" type="button" class="btn btn-outline-primary">Ask question</button>
                <button type="button" class="btn btn-outline-secondary">Chat</button>
            </div>
            
        </div>
    </div>
</template>

<script>
export default {
    name: 'Questions',
    data() {
        return {
            questionText: ''
        }
    },
    props: {
        questions: {
            type: Array,
            required: true
        }
    },
    methods: {
        addQuestion() {
            var question = {
                text: this.questionText,
                type: 'question',
                status: 'asked',
                ownerId: this.$store.state.user.firebaseId,
                created: Date.now()
            }
            this.$emit('add-question', question);
            console.log('addQuestion');
            
        },
        addAnswer() {

        },
        addChat() {

        }
    }
}
</script>

<style lang="less" scoped>
    .questions {
        .list {
            text-align: left;
            height: 300px;
            max-height: 300px;
            display: flex;
            flex-direction: column-reverse;

            ul {
                padding: 0;
                list-style: none;

                .star {
                    color: #fff;
                }
            }
        }
    }
</style>