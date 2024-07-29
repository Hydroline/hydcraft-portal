<template>
    <MainContainer :background="require('@/assets/images/background_1.png')">
        232
    </MainContainer>
</template>

<script>
    export default {
        name: 'HomeView',
        components: {
            MainContainer: () => import('../components/MainContainer.vue')
        }
    }
</script>


<style lang="scss" scoped>
    @import '@/assets/styles/global.scss';

    .hydstart-main-container__background {
        height: 100%;
        user-select: none;
    }

    .hydstart-main-container__background img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .hydstart-main-container__foreground {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        padding-top: $page-header-width;
    }
</style>