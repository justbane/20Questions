<template>
    <div id="GameScene" class="container w-80">
        <div class="row>"><div class="title w-100 mb-5"><h1>{{ title }}</h1></div></div>
        <div v-if="gameId" class="row">
            <QuestionsAnswers></QuestionsAnswers>
            <div class="w-100 mt-5 mb-5"></div>
            <Chat></Chat>
        </div>
        <div v-else class="row">
            <div class="col"></div>
            <div class="w-100 mt-5 mb-5"></div>
            <div class="col">
                <div class="input-group mb-3 neo">
                    <div class="input-group-prepend imput-group-append">
                        <span class="input-group-text">Game Name:</span>
                    </div>
                    <input v-model="gameName" type="text" class="form-control" id="basic-url" aria-describedby="Inout the game name.">
                    <button type="button" class="btn">Go</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import QuestionsAnswers from './QuestionsAnswers.vue'
import Chat from './Chat.vue'

export default {
  name: 'GameScreen',
  data() {
      return {
          gameId: '',
          gameName: ''
      }
  },
  props: {
    title: String
  },
  components: {
      QuestionsAnswers,
      Chat
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    #GameScene {
        .title {
            color: red;
        }
    }
</style>
