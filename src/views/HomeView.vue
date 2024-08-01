<template>
    <MainContainer :background="require('@/assets/images/image_home_background_240730.webp')" :video="true">
        <div class="hydstart-home">
            <div class="hydstart-home-main">
                <div class="hydstart-home-text">
                    <div class="hydstart-home-text__title">……👏你好！这里是<span class="red">氢气</span><span class="blue">工艺</span>。</div>
                    <div class="hydstart-home-text__subtitle">我们是个 MC 服务器社区，我们凭借共同的爱好走到了一起，这有交通爱好者，科技爱好者，独立开发者…… 总之，我们什么都有。❤</div>
                </div>

                <div class="hydstart-home-buttons">
                    <button class="hydstart-home-button main">来都来了，不妨来了解一下我们</button>
                    <div class="hydstart-home-subbutton overview">🥺我还是想直接看概览</div>
                    <div class="hydstart-home-subbutton join">😋只想进服快给我群号</div>
                </div>
            </div>

            <div class="hydstart-home-info">
                <HomeCards />

                <div class="hydstart-home-belong">
                    隶属于
                    <span class="hydstart-home-belong__hydrlab" translate="no">
                        <img src="@/assets/images/logo_Hydrlab.png">
                        Hydrlab Studio
                    </span>
                </div>
            </div>
        </div>
    </MainContainer>
</template>

<script>
    export default {
        name: 'HomeView',
        components: {
            MainContainer: () => import('@/components/MainContainer.vue'),
            HomeCards: () => import('@/components/home/HomeCards.vue')
        }
    }
</script>


<style lang="scss" scoped>
    @import '@/assets/styles/global.scss';

    $page-home-gap-value: 2rem;

    .hydstart-home {
        display: flex;
        flex-direction: column;
        height: 100%;
        
        .hydstart-home-main {
            margin: auto;
        }

        .hydstart-home-info {
            margin: 1rem auto 6rem auto;
        }
    }

    .hydstart-home-text {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 5px;

        .hydstart-home-text__title {
            text-align: center;
            font-size: 60px;

            span.red, span.blue {
                font-weight: 600;
            }

            span.red {
                color: var(--color-hydrcraft-red);
            }

            span.blue {
                color: var(--color-hydrcraft-blue);
            }
        }

        .hydstart-home-text__subtitle {
            color: var(--color-text--subtle);
            font-size: 20px;
            text-align: center;
            max-width: 700px;
        }
    }

    .hydstart-home-buttons {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        row-gap: 8px;
        column-gap: 12px;
        margin-top: $page-home-gap-value;

        .hydstart-home-button {
            color: var(--color-surface-0);
            font-size: 18px;
            background-color: var(--color-primary);
            border: none;
            border-radius: 16px;
            padding: 6px 20px;
            flex: 1 1 100%;
        }

        .hydstart-home-subbutton {
            color: var(--color-text--subtle);
            font-size: 14px;
            position: relative;
            z-index: 10;
            user-select: none;
            cursor: pointer;
            transition: all 150ms $page-transition-type;

            &:hover {
                &::after {
                    opacity: 1;
                }
            }

            &:active {
                transform: scale(0.98);

                &::after {
                    opacity: 1;
                }
            }

            &::after {
                $subbutton-icons-offset-value: 4px;
                content: '';
                background-color: var(--background-dark--0);
                border-radius: 12px;
                position: absolute;
                top: $subbutton-icons-offset-value * -1;
                left: $subbutton-icons-offset-value * -1;
                right: $subbutton-icons-offset-value * -1;
                bottom: $subbutton-icons-offset-value * -1;
                z-index: 8;
                opacity: 0;
                transition: all 150ms $page-transition-type;
            }
        }
    }

    .hydstart-home-belong {
        color: var(--color-text--subtle);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        letter-spacing: 0.125rem;
        margin-top: $page-home-gap-value;

        .hydstart-home-belong__hydrlab {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--color-text);
            font-size: 20px;
            font-family: 'Site Wordmark Font';
            text-transform: uppercase;
            letter-spacing: 0;
            margin-left: 10px;
            user-select: none;

            img {
                $hydrlab-logo-length-value: 22px;
                display: block;
                width: $hydrlab-logo-length-value;
                height: $hydrlab-logo-length-value;
            }
        }
    }
</style>