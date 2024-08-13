<template>
    <MainContainer :background="require('@/assets/images/image_home_background_240730.webp')">
        <div class="hydstart-story">
            即将上线
        </div>
    </MainContainer>
</template>

<script>
    export default {
        name: 'StoryView',
        components: {
            MainContainer: () => import('@/components/MainContainer.vue')
        }
    }
</script>

<style lang="scss" scoped>
    .hydstart-story {
        margin: auto;
        font-size: 42px;
    }
</style>