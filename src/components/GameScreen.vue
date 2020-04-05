<template>
    <div id="GameScene" class="container w-80">
        <div class="row>"><div class="title w-100 mb-5"><h1>{{ title }}</h1></div></div>
        <div class="row">
            <Questions></Questions>
            <div class="col"></div>
            <Answers></Answers>
            <div class="w-100 mt-5 mb-5"></div>
            <Chat></Chat>
        </div>
    </div>
</template>

<script>
import Questions from './Questions.vue'
import Answers from './Answers.vue'
import Chat from './Chat.vue'

export default {
  name: 'GameScreen',
  props: {
    title: String
  },
  components: {
      Questions,
      Answers,
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
