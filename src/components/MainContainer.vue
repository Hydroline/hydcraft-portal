<template>
    <div class="hydstart-main-container">
        <div class="hydstart-main-container__background">
            <img :src="background" v-if="background" />
            <video src="@/assets/images/video_background_240726.webm" v-if="video" autoplay muted loop></video>
        </div>
        <div class="hydstart-main-container__foreground">
            <slot :executeDialog="$listeners.dialog"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'MainContainer',
        props: {
            background: {
                type: String
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
        width: 100%;
        height: 100%;
        position: relative;
        user-select: none;

        img {
            display: block;
            width: 100%;
            height: 75%;
            min-height: 600px;
            max-height: 720px;
            position: relative;
            z-index: 10;
            filter: opacity(1) grayscale(0) contrast(0) brightness(0) invert(1);
            object-fit: cover;
            object-position: top;
            transition: filter 3000ms $value-transition-function;
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
            transition: all 150ms $value-transition-function;

            &.fade-enter, &.fade-leave-to {
                opacity: 0;
            }
        }
    }

    .hydstart-main-container__foreground {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        padding: $page-header-width 6.5rem 0 6.5rem;
        overflow: hidden;
    }
</style>