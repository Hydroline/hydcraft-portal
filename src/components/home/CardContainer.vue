<template>
    <transition name="fade" @enter="afterEnter">
        <div class="hydstart-card-wrapper">
            <div class="hydstart-card">
                <div class="hydstart-card-background">
                    <img :src="background" v-if="background" />
                </div>
                <div class="hydstart-card-foreground">
                    <div class="hydstart-card-foreground-wrapper">
                        <button class="hydstart-card-close" @click="closeCard">
                            <span class="material-icons">close</span>
                        </button>
                        <div class="hydstart-card-title">
                            <slot name="title"></slot>
                        </div>
                        <div class="hydstart-card-content">
                            <slot></slot>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: 'CardContainer',
        props: {
            background: {
                type: String
            }
        },
        methods: {
            closeCard() {
                setTimeout(() => {
                    this.$emit('close');                    
                }, 50);
            },
            afterEnter() {
                this.isWrapperVisible = true;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/styles/global.scss';

    $card-value-transition-duration: 450ms;

    .hydstart-card-wrapper {
        $card-value-margin-horizon: 10rem;
        $card-value-margin-vertical: 8rem;
        display: flex;
        justify-content: center;
        position: absolute;
        top: $page-header-width;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 80;
        padding: ($card-value-margin-vertical * 0.5) $card-value-margin-horizon $card-value-margin-vertical $card-value-margin-horizon;
        backdrop-filter: blur(48px) saturate(0.6) brightness(0.95);
        transition: all $card-value-transition-duration $value-transition-function, opacity 350ms $value-transition-function, backdrop-filter 2000ms $value-transition-function;

        &.fade-enter, &.fade-leave-to {
            backdrop-filter: blur(0px) saturate(1) brightness(1);
            top: 70%;
            left: 50%;
            right: 50%;
            bottom: 50%;
            opacity: 0;
        }

        .hydstart-card {
            width: 100%;
            height: 100%;
            border-radius: 24px;
            background: var(--color-surface-0);
            position: relative;
            opacity: 1;
            transition: all 300ms $value-transition-function;
            box-shadow: 0 8px 60px var(--background-dark-0);
            outline: 3px solid transparent;
            transition: outline $card-value-transition-duration $value-transition-function;

            &:hover {
                outline-color: var(--color-primary);
            }
        }

        .hydstart-card-foreground {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            .hydstart-card-foreground-wrapper {
                $foreground-value-padding: 28px;
                display: flex;
                flex-direction: column;
                font-size: 18px;
                width: 100%;
                height: 100%;
                padding: $foreground-value-padding;
                position: relative;
                overflow-y: auto;

                .hydstart-card-close {
                    display: block;
                    position: absolute;
                    top: $foreground-value-padding * 0.75;
                    right: $foreground-value-padding * 0.75;
                    padding: 0;
                    border: none;
                    outline: none;
                    background-color: transparent;
                    transition: all 300ms $value-transition-function;

                    .material-icons {
                        display: block;
                        color: var(--color-text--subtle);
                        font-size: 36px;
                        transition: all 300ms $value-transition-function;
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
                        background-color: var(--background-dark-0);
                        border-radius: 50%;
                        position: absolute;
                        z-index: 18;
                        top: $subbutton-icons-offset-value * -1;
                        left: $subbutton-icons-offset-value * -1;
                        right: $subbutton-icons-offset-value * -1;
                        bottom: $subbutton-icons-offset-value * -1;
                        opacity: 0;
                        transition: all 300ms $value-transition-function;
                    }
                }
            }
        }

        .hydstart-card-title {
            margin-bottom: 12px;
        }

        .hydstart-card-content {
            flex: 1;
        }
    }
</style>