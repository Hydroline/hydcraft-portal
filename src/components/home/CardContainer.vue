<template>
    <transition name="fade">
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
                }, 150);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/styles/global.scss';

    $card-value-transition-duration: 250ms;

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    .hydstart-card-wrapper {
        $card-value-margin-horizon: 10rem;
        $card-value-margin-vertical: 8rem;
        position: absolute;
        top: $page-header-width;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 80;
        padding: ($card-value-margin-vertical * 0.5) $card-value-margin-horizon $card-value-margin-vertical $card-value-margin-horizon;
        background-color: var(--background-dark-1);
        backdrop-filter: blur(32px) saturate(0.8);
        transition: opacity $card-value-transition-duration $value-transition-function, transform $card-value-transition-duration $value-transition-function;

        .hydstart-card {
            height: 100%;
            border-radius: 24px;
            background: var(--color-surface-0);
            position: relative;
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
                font-size: 18px;
                width: 100%;
                height: 100%;
                padding: $foreground-value-padding;
                position: relative;

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
                        transform: rotate(-45deg);

                        .material-icons {
                            color: var(--color-text--weaken);
                        }

                        &::after {
                            opacity: 1;
                        }
                    }

                    &:active {
                        transform: rotate(-45deg) scale(0.9);

                        .material-icons {
                            color: var(--color-text--emphasized);
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
    }
</style>