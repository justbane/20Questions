<template>
    <div class="questions col-7">
        <h3>Questions</h3>
        <div class="list col border h-100 text-wrap overflow-auto">
            Questions
        </div>
    </div>
</template>

<script>
export default {
    name: 'Questions',
    data() {
        return {
            questions: []
        }
    }
}
</script>

<style lang="less" scoped>
    .questions {
        .list {
            text-align: left;
            max-height: 300px;
            display: flex;
            flex-direction: column-reverse;
        }
    }
</style>