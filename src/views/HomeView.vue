<template>
    <MainContainer @dialog="executeDialog" :video="true">
        <div class="hydstart-home-wrapper">
            <div class="hydstart-home">
                <div class="hydstart-home-main" v-show="!showContentCard">
                    <div class="hydstart-home-text">
                        <div class="hydstart-home-text__title">……👏你好！这里是<span class="red">氢气</span><span class="blue">工艺</span>。</div>
                        <div class="hydstart-home-text__subtitle">我们是个 MC 服务器社区，我们凭借共同的爱好走到了一起，这有交通爱好者，科技爱好者，独立开发者…… 总之，我们什么都有。❤</div>
                    </div>

                    <div class="hydstart-home-buttons">
                        <button class="hydstart-home-button main">来都来了，点我看氢气服主写的の小作文</button>
                        <div class="hydstart-home-subbutton overview">
                            <span>🥺我还是想自己看看</span>
                        </div>
                        <div class="hydstart-home-subbutton join">
                            <span>😋只想进服快给群号</span>
                        </div>
                    </div>
                </div>
                
                <transition name="fade">
                    <div class="hydstart-home-content-card" v-show="showContentCard">
                        <ContentCardContainer :show="showCards.culture.show" @closeCard="closeCard('content-card', 'culture')">
                            <template v-slot:title>
                                Culture
                            </template>
                            <div class="hydstart-content-card-container">
                                Test
                            </div>
                        </ContentCardContainer>
                        <ContentCardContainer :show="showCards.cities.show" @closeCard="closeCard('content-card', 'cities')">
                            <template v-slot:title>
                                Cities
                            </template>
                            <div class="hydstart-content-card-container">
                                Test
                            </div>
                        </ContentCardContainer>
                        <ContentCardContainer :show="showCards.railway.show" @closeCard="closeCard('content-card', 'railway')">
                            <template v-slot:title>
                                Railway
                            </template>
                            <div class="hydstart-content-card-container">
                                Test
                            </div>
                        </ContentCardContainer>
                        <ContentCardContainer :show="showCards.player.show" @closeCard="closeCard('content-card', 'player')">
                            <template v-slot:title>
                                Player
                            </template>
                            <div class="hydstart-content-card-container">
                                Test
                            </div>
                        </ContentCardContainer>
                    </div>
                </transition>
            </div>

            <div class="hydstart-home-info">
                <HomeCards @dialog="executeDialog" :active="showContentCard" />

                <div class="hydstart-home-belong">
                    隶属于
                    <span class="hydstart-home-belong__hydrlab" translate="no">
                        <img src="@/assets/images/logo_Hydrlab.png">
                        Hydrlab Studio
                    </span>
                </div>

                <div class="hydstart-home-dialog">
                    <CardContainer v-show="showCards.world.helium.show" @closeCard="closeCard('card', 'helium')">
                        <template v-slot:title>
                            <div class="hydstart-card-world-header">
                                <div class="hydstart-card-world-header__status"></div>
                                <div class="hydstart-card-world-header__title">
                                    六周目
                                    <div class="hydstart-card-world-header__codename">Helium</div>
                                </div>
                            </div>
                        </template>
                        <div class="hydstart-card-world-container">
                            <div class="hydstart-card-world-overview-wrapper">
                                <div class="hydstart-card-world-overview hydstart-card-world-overview--online">
                                    <div class="hydstart-card-world-label">在线人数<span class="material-icons-outlined">info</span></div>
                                    <div class="hydstart-card-world-value">
                                        {{serverStatus.helium.online}}<span class="weaken"> / {{ serverStatus.helium.max }}</span>
                                    </div>
                                </div>
                                <div class="hydstart-card-world-overview hydstart-card-world-overview--status">
                                    <div class="hydstart-card-world-label">运行状态</div>
                                    <div class="hydstart-card-world-value">{{ serverStatus.helium.status === 3 ? '正常' : '异常' }}</div>
                                </div>
                                <div class="hydstart-card-world-overview hydstart-card-world-overview--days">
                                    <div class="hydstart-card-world-label">运行天数<span class="material-icons-outlined">info</span></div>
                                    <div class="hydstart-card-world-value">{{ daysAgo(serverStatus.helium.created_time) }}</div>
                                </div>
                                <div class="hydstart-card-world-overview hydstart-card-world-overview--related">
                                    <div class="hydstart-card-world-label">相关话题</div>
                                    <div class="hydstart-card-world-value">
                                        <a class="weaken" target="_blank" v-for="(item, index) in serverStatus.helium.related_keywords" :key="index" :href="item.link">{{ item.name }}</a>
                                        <span v-if="serverStatus.helium.related_keywords == null">无</span>
                                    </div>
                                </div>
                            </div>
                            <div class="hydstart-card-world-map">
                                <div class="hydstart-card-world-label">卫星地图</div>
                                <iframe src="https://map.helium.hydcraft.cn" frameborder="0" v-if="showCards.world.helium.iframe"></iframe>
                            </div>
                        </div>
                    </CardContainer>
                    <CardContainer v-show="showCards.world.nitrogen.show" @closeCard="closeCard('card', 'nitrogen')">
                        <template v-slot:title>
                            <div class="hydstart-card-world-header">
                                <div class="hydstart-card-world-header__status"></div>
                                <div class="hydstart-card-world-header__title">
                                    七周目
                                    <div class="hydstart-card-world-header__codename">Nitrogen</div>
                                </div>
                            </div>
                        </template>
                        <div class="hydstart-card-world-container">
                            <div class="hydstart-card-world-overview-wrapper">
                                <div class="hydstart-card-world-overview hydstart-card-world-overview--online">
                                    <div class="hydstart-card-world-label">在线人数<span class="material-icons-outlined">info</span></div>
                                    <div class="hydstart-card-world-value">
                                        {{serverStatus.nitrogen.online}}<span class="weaken"> / {{ serverStatus.nitrogen.max }}</span>
                                    </div>
                                </div>
                                <div class="hydstart-card-world-overview hydstart-card-world-overview--status">
                                    <div class="hydstart-card-world-label">运行状态</div>
                                    <div class="hydstart-card-world-value">{{ serverStatus.nitrogen.status === 3 ? '正常' : '异常' }}</div>
                                </div>
                                <div class="hydstart-card-world-overview hydstart-card-world-overview--days">
                                    <div class="hydstart-card-world-label">运行天数<span class="material-icons-outlined">info</span></div>
                                    <div class="hydstart-card-world-value">{{ daysAgo(serverStatus.nitrogen.created_time) }}</div>
                                </div>
                                <div class="hydstart-card-world-overview hydstart-card-world-overview--related">
                                    <div class="hydstart-card-world-label">相关话题</div>
                                    <div class="hydstart-card-world-value">
                                        <a class="weaken" target="_blank" v-for="(item, index) in serverStatus.nitrogen.related_keywords" :key="index" :href="item.link">{{ item.name }}</a>
                                        <span v-if="serverStatus.nitrogen.related_keywords == null">无</span>
                                    </div>
                                </div>
                            </div>
                            <div class="hydstart-card-world-map">
                                <div class="hydstart-card-world-label">卫星地图</div>
                                <iframe src="https://map.nitrogen.hydcraft.cn" frameborder="0" v-if="showCards.world.nitrogen.iframe"></iframe>
                            </div>
                        </div>
                    </CardContainer>
                </div>
            </div>
        </div>
    </MainContainer>
</template>

<script>
    import dayjs from 'dayjs';

    export default {
        name: 'HomeView',
        data() {
            return {
                showContentCard: false,
                showCards: {
                    world: {
                        helium: {
                            show: false,
                            iframe: false
                        },
                        nitrogen: {
                            show: false,
                            iframe: false
                        }
                    },
                    culture: {
                        show: false
                    },
                    cities: {
                        show: false
                    },
                    railway: {
                        show: false
                    },
                    player: {
                        show: false
                    }
                },
                serverStatus: {
                    helium: {
                        created_time: '2022-02-17',
                        status: 3,
                        online: 0,
                        max: 20,
                        related_keywords: [
                            { name: '南屿' , link: 'https://wiki.hydcraft.cn/南屿都' },
                            { name: '宜兰' , link: 'https://wiki.hydcraft.cn/宜兰' },
                            { name: '赫尔海姆' , link: 'https://wiki.hydcraft.cn/赫尔海姆' },
                            { name: '北港' , link: 'https://wiki.hydcraft.cn/北港' }
                        ]
                    },
                    nitrogen: {
                        created_time: '2023-08-07',
                        status: 3,
                        online: 0,
                        max: 20,
                        related_keywords: [
                            { name: '新屿' , link: 'https://wiki.hydcraft.cn/新屿都' },
                            { name: '沁京' , link: 'https://wiki.hydcraft.cn/沁京都' },
                            { name: '欧文' , link: 'https://wiki.hydcraft.cn/欧文州' },
                            { name: '蒲田' , link: 'https://wiki.hydcraft.cn/蒲田县' }
                        ]
                    }
                }
            }
        },
        components: {
            MainContainer: () => import('@/components/MainContainer.vue'),
            HomeCards: () => import('@/components/home/HomeCards.vue'),
            CardContainer: () => import('@/components/home/CardContainer.vue'),
            ContentCardContainer: () => import('@/components/home/ContentCardContainer.vue')
        },
        methods: {
            executeDialog(data) {
                setTimeout(() => {
                    this.resetShows();

                    if (data.type === 'card') {
                        this.showContentCard = false;
                        switch(data.index) {
                            case 'helium':
                                this.showCards.world.helium.show = true;
                                break;
                            case 'nitrogen':
                                this.showCards.world.nitrogen.show = true;
                                break;
                            default:
                                return;
                        }
                    } else if (data.type === 'content-card') {
                        this.showContentCard = true;

                        switch(data.index) {
                            case 'culture':
                                this.showCards.culture.show = true;
                                break;
                            case 'cities':
                                this.showCards.cities.show = true;
                                break;
                            case 'railway':
                                this.showCards.railway.show = true;
                                break;
                            case 'player':
                                this.showCards.player.show = true;
                                break;
                            default:
                                return;
                        }
                    } else
                        return;
                }, 120);
            },
            closeCard(type, index) {
                this.resetShows();

                if (type === 'content-card')
                    this.showContentCard = false;

                switch(index) {
                    case 'helium':
                        this.showCards.world.helium.show = false;
                        break;
                    case 'nitrogen':
                        this.showCards.world.nitrogen.show = false;
                        break;
                    case 'culture':
                        this.showCards.culture.show = false;
                        break;
                    case 'cities':
                        this.showCards.cities.show = false;
                        break;
                    case 'railway':
                        this.showCards.railway.show = false;
                        break;
                    case 'player':
                        this.showCards.player.show = false;
                        break;
                    default:
                        return;
                }
            },
            resetShows(obj = this.showCards) {
                Object.keys(obj).forEach(key => {
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        this.resetShows(obj[key]);
                    } else if (key === 'show' && obj[key] === true) {
                        obj[key] = false;
                    }
                });
            },
            daysAgo(dateString) {
                const date = dayjs(dateString);
                const now = dayjs();
                return now.diff(date, 'day');
            },
            updateDynmap(world, statusKey, dynmapKey, newVal) {
                if (newVal === true) {
                    setTimeout(() => {
                        this.showCards.world[world][dynmapKey] = true;
                    }, 500);
                } else {
                    this.showCards.world[world][dynmapKey] = false;
                }
            }
        },
        watch: {
            'showCards.world.helium.show'(newVal) {
                this.updateDynmap('helium', 'show', 'iframe', newVal);
            },
            'showCards.world.nitrogen.show'(newVal) {
                this.updateDynmap('nitrogen', 'show', 'iframe', newVal);
            }
        },
        mounted() {
            this.$eventBus.$emit('updateFooter', { showMain: true });
        }
    }
</script>

<style lang="scss" scoped>
    .hydstart-home-dialog {
        .hydstart-card-world-header {
            display: flex;
            align-items: center;
            gap: 10px;

            .hydstart-card-world-header__status {
                $card-world-header-value-status: 14px;
                width: $card-world-header-value-status;
                height: $card-world-header-value-status;
                background-color: var(--home-background-status-unknown);
                border-radius: 50%;
            }

            .hydstart-card-world-header__title {
                display: flex;
                align-items: baseline;
                gap: 12px;
                font-size: 28px;
                font-weight: 600;
            }

            .hydstart-card-world-header__codename {
                color: var(--color-text--weaken);
                font-size: 22px;
                font-family: 'Site Wordmark Font';
                font-weight: normal;
            }
        }

        .hydstart-card-world-container {
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;

            .hydstart-card-world-overview-wrapper {
                display: flex;
                gap: 3rem;
                flex-wrap: wrap;

                .hydstart-card-world-overview {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;

                    &.hydstart-card-world-overview--related {
                        flex: 1;

                        .hydstart-card-world-value {
                            height: 100%;
                            display: flex;
                            align-items: center;
                            row-gap: 9px;
                            column-gap: 12px;
                            flex-wrap: wrap;

                            a {
                                color: var(--color-text);
                                transition: opacity 250ms ease;

                                &:hover {
                                    opacity: 0.6;
                                }

                                &::before {
                                    content: '#';
                                }
                            }
                        }
                    }
                }
            }

            .hydstart-card-world-map {
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            .hydstart-card-world-label {
                display: flex;
                align-items: center;
                gap: 2px;
                color: var(--color-text--subtle);
                font-size: 16px;
                padding: 2px 4px;

                .material-icons-outlined {
                    display: block;
                    font-size: 16px;
                }
            }

            .hydstart-card-world-value {
                font-size: 54px;
                line-height: 1;

                .weaken {
                    font-size: 28px;
                }
            }

            iframe {
                width: 100%;
                height: 100%;
                min-height: 300px;
                margin-top: 4px;
                border-radius: 12px;
                background-color: var(--color-surface-3);
                user-select: none;
            }
        }
    }
</style>

<style lang="scss" scoped>
    @import '@/assets/styles/global.scss';

    $page-home-gap-value: 2rem;
    
    .hydstart-home-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
        
        .hydstart-home {
            width: 100%;
            margin: auto;

            .hydstart-home-content-card {
                $card-value-transition-duration: 300ms;

                &::before {
                    content: '';
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

                &.fade-enter-active, &.fade-leave-active {
                    transition: all $card-value-transition-duration $value-transition-function;

                    &::before {
                        opacity: 0;
                    }
                }

                &.fade-enter, &.fade-leave-active {
                    opacity: 0;
                }
            }
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
                color: var(--color-hydcraft-red);
            }

            span.blue {
                color: var(--color-hydcraft-blue);
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
        $button-transition-delay: 150ms;        
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
            outline: none;
            border-radius: 16px;
            padding: 6px 20px;
            flex: 1 1 100%;
            cursor: pointer;
            transition: all $button-transition-delay $value-transition-function;

            &:hover {
                background-color: var(--color-primary--hover);
            }

            &:active {
                background-color: var(--color-primary--active);
                border-radius: 24px;
                transform: scale(0.98);
            }
        }

        .hydstart-home-subbutton {
            color: var(--color-text--subtle);
            font-size: 14px;
            position: relative;
            user-select: none;
            cursor: pointer;
            transition: all 150ms $value-transition-function;

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
                background-color: var(--background-dark-0);
                border-radius: 12px;
                position: absolute;
                z-index: 8;
                top: $subbutton-icons-offset-value * -1;
                left: $subbutton-icons-offset-value * -1;
                right: $subbutton-icons-offset-value * -1;
                bottom: $subbutton-icons-offset-value * -1;
                opacity: 0;
                transition: all 150ms $value-transition-function;
            }

            span {
                position: relative;
                z-index: 10;
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
        position: relative;
        z-index: 60;

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