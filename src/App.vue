<template>
    <div class="main">
        <div class="container">
            <div class="row">
                <div class="col">
                    <ul class="nav justify-content-center">
                        <li class="nav-item">
                            <router-link to="/" tag="a" active-class="active" exact class="flex-sm-fill text-sm-center nav-link">Home</router-link>
                        </li>   
                        <li class="nav-item">
                            <router-link to="/game" tag="a" active-class="active" exact class="flex-sm-fill text-sm-center nav-link">New Game</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
