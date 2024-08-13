<template>
    <div class="hydstart-card-world-container">
        <div class="hydstart-card-world-overview-wrapper">
            <div class="hydstart-card-world-overview hydstart-card-world-overview--status">
                <div class="hydstart-card-world-label">运行状态</div>
                <div class="hydstart-card-world-value">{{ serverStatus.status === 3 ? '正常' : '异常' }}</div>
            </div>
            <div class="hydstart-card-world-overview hydstart-card-world-overview--online">
                <div class="hydstart-card-world-label">在线人数<span class="material-icons-outlined">info</span></div>
                <div class="hydstart-card-world-value">
                    {{serverStatus.online}}<span class="weaken"> / {{ serverStatus.max }}</span>
                </div>
            </div>
            <div class="hydstart-card-world-overview hydstart-card-world-overview--days">
                <div class="hydstart-card-world-label">运行天数<span class="material-icons-outlined">info</span></div>
                <div class="hydstart-card-world-value">{{ daysAgo(serverStatus.created_time) }}</div>
            </div>
            <div class="hydstart-card-world-overview hydstart-card-world-overview--related">
                <div class="hydstart-card-world-label">相关话题</div>
                <div class="hydstart-card-world-value">
                    <a class="weaken" target="_blank" v-for="(item, index) in serverStatus.related_keywords" :key="index" :href="item.link">{{ item.name }}</a>
                    <span v-if="serverStatus.related_keywords == null">无</span>
                </div>
            </div>
        </div>
        <div class="hydstart-card-world-map">
            <div class="hydstart-card-world-label">卫星地图</div>
            <iframe :src="serverStatus.dynmap" frameborder="0" v-if="showCards.iframe"></iframe>
        </div>
    </div>
</template>

<script>
    import dayjs from 'dayjs';

    export default {
        name: 'CardTemplate.vue',
        props: {
            showCards: {
                type: Object,
                require: true
            },
            serverStatus: {
                type: Object,
                require: true
            }
        },
        methods: {
            daysAgo(dateString) {
                const date = dayjs(dateString);
                const now = dayjs();
                return now.diff(date, 'day');
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/styles/global.scss';

    .hydstart-home-dialog {
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