<template>
    <div class="answers col-4">
        <h3>Answers</h3>
        <div class="list col border h-100 text-wrap overflow-auto">
            
        </div>
    </div>
</template>

<script>
export default {
    name: 'Answers',
    data() {
        return {
            answers: []
        }
    }
}
</script>

<style lang="less" scoped>
    .answers {
        .list {
            text-align: left;
            max-height: 300px;
            display: flex;
            flex-direction: column-reverse;
        }
    }
</style>