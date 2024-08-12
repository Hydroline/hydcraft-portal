<template>
    <div class="hydstart-content-card-container">
        <div class="hydstart-content-card-list" v-if="data.length > 0">
            <div class="hydstart-content-card-list__item" v-for="(data, index) in data" :key="index">
                <div class="hydstart-content-card-list__background">
                    <img :src="require('@/assets/' + data.background)" v-if="data.background">
                </div>
                <div class="hydstart-content-card-list__foreground">
                    <div class="hydstart-content-card-list__wrapper">
                        <div class="hydstart-content-card-list__title">{{ data.title }}</div>
                        <div class="hydstart-content-card-list__desc">{{ data.description }}</div>
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
        props: {
            data: {
                type: Array,
                require: true
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
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 10px;
            height: 100%;
            padding: 3px;
            overflow-x: auto;
            filter: drop-shadow(0 2px 12px var(--background-dark-0));

            .hydstart-content-card-list__item {
                $content-card-value-transition-duration: 500ms;
                height: 290px;
                background: var(--background-light-3);
                position: relative;
                overflow: hidden;
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
                        margin-top: auto;
                        font-size: 24px;
                        font-weight: bold;
                    }

                    .hydstart-content-card-list__desc {
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 3;
                        font-size: 16px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        // text-align: justify;
                    }

                    .hydstart-content-card-list__link {
                        position: absolute;
                        right: 0;
                        top: 0;
                        display: inline-block;
                        font-size: 12px;
                        text-align: right;
                        padding: 6px 10px;
                        border-radius: 16px;
                        background-color: var(--background-light-4);
                        transition: background-color 300ms $value-transition-function;

                        &:hover {
                            background-color: var(--background-dark-0);
                        }
                    }
                }

                &:hover {
                    outline-color: var(--color-primary);
                }
            }
        }
    }
</style>