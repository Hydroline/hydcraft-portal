<template>
    <div class="hydstart-main-container hydstart-home">
        <div class="hydstart-main-container__background">
            <img :src="background" v-if="background" />
        </div>
        <div class="hydstart-main-container__foreground">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'MainContainer',
        props: {
            background: {
                type: String,
                default: ''
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/styles/global.scss';

    .hydstart-main-container {
        height: 100%;
    }
    
    .hydstart-main-container__background {
        display: flex;
        align-items: flex-end;
        height: 100%;
        user-select: none;
    }

    .hydstart-main-container__background img {
        display: block;
        width: 100%;
        height: 70%;
        min-height: 550px;
        filter: grayscale(0) contrast(0) brightness(0) invert(1);
        object-fit: cover;
        object-position: top;
    }

    .hydstart-main-container__foreground {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        margin: $page-header-width 8rem 0 8rem;
    }
</style>