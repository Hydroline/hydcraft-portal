<template>
    <div class="hydstart-main-container">
        <div class="hydstart-main-container__background">
            <img :src="background" v-if="background" />
            <video src="@/assets/images/video_background_240726.webm" v-if="video" autoplay muted loop></video>
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
            },
            video: {
                type: Boolean,
                default: false
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
        justify-content: center;
        align-items: flex-end;
        height: 100%;
        position: relative;
        user-select: none;

        img {
            display: block;
            width: 100%;
            height: 68%;
            min-height: 550px;
            max-height: 680px;
            position: relative;
            z-index: 10;
            filter: opacity(0.75) grayscale(0) contrast(0) brightness(0) invert(0.98);
            object-fit: cover;
            object-position: top;
            transition: filter $page-transition-delay $page-transition-type;
        }

        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 8;
            filter: opacity(0.25) brightness(1.05) saturate(2);
        }
    }

    .hydstart-main-container__foreground {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        padding: $page-header-width 8rem 0 8rem;
        overflow: hidden;
    }
</style>