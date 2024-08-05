<template>
    <MainContainer :background="require('@/assets/images/image_home_background_240730.webp')">
        <div class="hydstart-story">
            
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
</style>