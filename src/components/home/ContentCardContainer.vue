<template>
    <transition name="fade">
        <div class="hydstart-content-card-wrapper" v-if="show">
            <div class="hydstart-content-card">
                <div class="hydstart-content-card-background">
                    <img :src="background" v-if="background" />
                </div>
                <div class="hydstart-content-card-foreground">
                    <div class="hydstart-content-card-foreground-wrapper">
                        <button class="hydstart-content-card-close" @click="closeCard">
                            <span class="material-icons">close</span>
                        </button>
                        <div class="hydstart-content-card-title">
                            <slot name="title"></slot>
                        </div>
                        <div class="hydstart-content-card-content">
                            <slot></slot>
                        </div>
                    </div>
                </div>
            </div>
            <div class="hydstart-content-card--overlay"></div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: 'ContentCardContainer',
        props: {
            background: {
                type: String
            },
            show: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            closeCard() {
                setTimeout(() => {
                    this.$emit('closeCard');                    
                }, 50);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/styles/global.scss';

    $card-value-transition-duration: 600ms;

    .hydstart-content-card-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: all $card-value-transition-duration $value-transition-function;

        &.fade-enter-active, &.fade-leave-active {
            transition: all $card-value-transition-duration $value-transition-function;

            .hydstart-content-card--overlay {
                opacity: 0;
            }
        }

        &.fade-enter, &.fade-leave-active {
            opacity: 0;
        }

        .hydstart-content-card {
            display: flex;
            width: 750px;
            min-height: 40vh;
            padding: 24px;
            border-radius: 24px;
            overflow: hidden;
            position: relative;
            z-index: 40;
            transition: all $card-value-transition-duration $value-transition-function;
        }

        .hydstart-content-card-foreground {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            .hydstart-content-card-foreground-wrapper {
                $foreground-value-padding: 28px;
                display: flex;
                flex-direction: column;
                font-size: 18px;
                width: 100%;
                height: 100%;
                padding: $foreground-value-padding;
                overflow-y: auto;

                .hydstart-content-card-close {
                    display: block;
                    position: absolute;
                    top: $foreground-value-padding * 0.75;
                    right: $foreground-value-padding * 0.75;
                    padding: 0;
                    border: none;
                    outline: none;
                    background-color: transparent;
                    transition: all $card-value-transition-duration $value-transition-function;

                    .material-icons {
                        display: block;
                        color: var(--color-text--subtle);
                        font-size: 36px;
                        transition: all $card-value-transition-duration $value-transition-function;
                        position: relative;
                        z-index: 20;
                    }

                    &:hover {
                        transform: rotate(-30deg);

                        .material-icons {
                            color: var(--color-hydcraft-red);
                        }

                        &::after {
                            opacity: 1;
                        }
                    }

                    &:active {
                        transform: rotate(-30deg) scale(0.8);

                        .material-icons {
                            opacity: 0.7;
                        }

                        &::after {
                            opacity: 1;
                        }
                    }

                    &::after {
                        $subbutton-icons-offset-value: 4px;
                        content: '';
                        background-color: var(--background-dark-1);
                        border-radius: 50%;
                        backdrop-filter: blur(8px) saturate(1.25);
                        position: absolute;
                        z-index: 18;
                        top: $subbutton-icons-offset-value * -1;
                        left: $subbutton-icons-offset-value * -1;
                        right: $subbutton-icons-offset-value * -1;
                        bottom: $subbutton-icons-offset-value * -1;
                        opacity: 0;
                        transition: all $card-value-transition-duration $value-transition-function;
                    }
                }
            }
        }

        .hydstart-content-card-title {
            font-size: 28px;
            font-family: 'Site Wordmark Font';
            margin-bottom: 12px;
        }

        .hydstart-content-card-content {
            flex: 1;
        }

        .hydstart-content-card--overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 35;
            background-color: var(--background-light-1);
            backdrop-filter: blur(16px);
            transition: all $card-value-transition-duration $value-transition-function;
        }
    }
</style>