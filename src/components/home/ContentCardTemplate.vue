<template>
    <div class="hydstart-content-card-container">
        <div class="hydstart-content-card-list" v-if="data.length > 0">
            <div class="hydstart-content-card-list__item" :class="{ expand: expandCardContent[index] }" v-for="(data, index) in data" :key="index" :data-index="index">
                <div class="hydstart-content-card-list__background">
                    <img :src="require('@/assets/' + data.background)" v-if="data.background">
                </div>
                <div class="hydstart-content-card-list__foreground">
                    <div class="hydstart-content-card-list__wrapper">
                        <div class="hydstart-content-card-list__title">{{ data.title }}</div>
                        <div class="hydstart-content-card-list__desc" @click="expandCard(index)">{{ data.description }}</div>
                        <a :href="data.link" class="hydstart-content-card-list__link">查看详情</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="hydstart-content-card-list" v-else>暂时没东西哦。</div>
    </div>
</template>

<script>
    export default {
        name: 'ContentCardTemplate',
        data() {
            return {
                expandCardContent: []
            }
        },
        props: {
            data: {
                type: Array,
                require: true
            }
        },
        methods: {
            expandCard(index) {
                this.$set(this.expandCardContent, index, !this.expandCardContent[index]);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/styles/global.scss';

    .hydstart-content-card-container {
        height: 100%;

        .hydstart-content-card-list {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-auto-flow: column;
            grid-gap: 10px;
            height: 100%;
            padding: 3px;
            overflow-x: auto;

            .hydstart-content-card-list__item {
                $content-card-value-transition-duration: 500ms;
                width: 230px;
                height: 100%;
                background: var(--background-light-3);
                position: relative;
                overflow: hidden;
                margin: auto;
                border-radius: 16px;
                outline: 1.5px solid transparent;
                cursor: pointer;
                transition: outline 250ms ease;

                .hydstart-content-card-list__background {
                    height: 100%;

                    img {
                        display: block;
                        object-fit: cover;
                        width: 100%;
                        height: 100%;
                        transition: filter $content-card-value-transition-duration $value-transition-function;
                    }
                }

                .hydstart-content-card-list__foreground {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    padding: 15px;
                    background: linear-gradient(0deg, var(--background-light-4) 5%, transparent 80%);
                    transition: all $content-card-value-transition-duration $value-transition-function;

                    .hydstart-content-card-list__wrapper {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        position: relative;
                    }

                    .hydstart-content-card-list__title {
                        display: flex;
                        align-items: flex-end;
                        flex: 1;
                        font-size: 26px;
                        font-weight: bold;
                        margin-bottom: 4px;
                        transition: flex $content-card-value-transition-duration $value-transition-function;
                    }

                    .hydstart-content-card-list__desc {
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 4;
                        font-size: 14px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        transition: color ($content-card-value-transition-duration - 100ms) $value-transition-function;

                        &:hover {
                            color: var(--color-primary);
                        }
                    }

                    .hydstart-content-card-list__link {
                        position: absolute;
                        right: 0;
                        top: 0;
                        display: block;
                        font-size: 12px;
                        text-align: right;
                        padding: 6px 10px;
                        border-radius: 16px;
                        background-color: var(--background-color-primary--hover);
                        box-shadow: 0 1px 2px var(--background-dark-0);
                        transition: background-color 300ms $value-transition-function;

                        &:hover {
                            background-color: var(--background-color-primary--active);
                        }
                    }
                }

                &.expand {
                    .hydstart-content-card-list__foreground {
                        backdrop-filter: blur(16px) saturate(0.75);
                    }

                    .hydstart-content-card-list__title {
                        flex: 0;
                    }

                    .hydstart-content-card-list__desc {
                        -webkit-line-clamp: unset;
                        -webkit-box-orient: unset;
                        overflow: auto;
                    }
                }

                &:hover {
                    outline-color: var(--color-primary);
                }
            }
        }
    }
</style>