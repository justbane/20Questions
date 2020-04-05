<template>
    <div class="chat col">
        <div class="list col h-100">Neat</div>
    </div>
</template>

<script>
export default {
    name: 'Chat',
    data() {
        return {
            chats: []
        }
    }
}
</script>

<style lang="less" scoped>
    .chat {
        .list {
            text-align: left;
            max-height: 300px;
            display: flex;
            flex-direction: column-reverse;
        }
    }
</style>