<template>
    <div class="hydstart-card-wrapper" v-show="showCardContainer">
        <transition name="fade">
            <div class="hydstart-card">
                <div class="hydstart-card__background">
                    <img :src="background" v-if="background" />
                </div>
                <div class="hydstart-card__foreground">
                    <div class="hydstart-card-title">
                        <slot name="title"></slot>
                    </div>
                    <div class="hydstart-card-content">
                        <slot></slot>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'CardContainer',
        data() {
            return {
                showCardContainer: false
            }
        },
        props: {
            background: {
                type: String
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/styles/global.scss';

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
        background-color: var(--background-dark--1);
        backdrop-filter: blur(32px) saturate(0.8);

        .hydstart-card {
            height: 100%;
            padding: 15px;
            border-radius: 24px;
            background: var(--color-surface-0);
            transition: all 300ms $value-transition-function;
            box-shadow: 0 8px 60px var(--background-dark--0);

            &:active {
                transform: scale(0.99);
            }
        }
    }
</style>