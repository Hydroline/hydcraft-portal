<template>
    <div class="hydstart-home-cards">
        <div class="hydstart-home-card hydstart-home-card-world helium" @click="showDialog('card', 0)">
            <div class="hydstart-home-card__background">
                <img src="@/assets/images/home/image_card_background_helium_1.png" />
            </div>
            <div class="hydstart-home-card__foreground">
                <div class="hydstart-home-card-world__title hydstart-home-card__title">
                    Helium
                    <span class="hydstart-home-card-world__status"></span>
                </div>
                <div class="hydstart-home-card-world__wordmark">6<span>th</span></div>
            </div>
        </div>

        <div class="hydstart-home-card hydstart-home-card-world nitrogen" @click="showDialog('card', 1)">
            <div class="hydstart-home-card__background">
                <img src="@/assets/images/home/image_card_background_nitrogen_2.png" />
            </div>
            <div class="hydstart-home-card__foreground">
                <div class="hydstart-home-card-world__title hydstart-home-card__title">
                    Nitrogen
                    <span class="hydstart-home-card-world__status"></span>
                </div>
                <div class="hydstart-home-card-world__wordmark">7<span>th</span></div>
            </div>
        </div>

        <div class="hydstart-home-card hydstart-home-card-culture omec">
            <div class="hydstart-home-card__background">
                <img src="@/assets/images/home/image_card_background_omec_1.png" />
            </div>
            <div class="hydstart-home-card__foreground">
                <div class="hydstart-home-card__title">OMEC</div>
            </div>
        </div>

        <div class="hydstart-home-card hydstart-home-card-develop cities">
            <div class="hydstart-home-card__background">
                <img src="@/assets/images/image_home_background_240730.webp" />
            </div>
            <div class="hydstart-home-card__foreground">
                <div class="hydstart-home-card__title">Cities</div>
            </div>
        </div>

        <div class="hydstart-home-card hydstart-home-card-develop railway">
            <div class="hydstart-home-card__background">
                <img src="@/assets/images/home/image_card_background_railway_1.png" />
            </div>
            <div class="hydstart-home-card__foreground">
                <div class="hydstart-home-card__title">Railway</div>
            </div>
        </div>

        <div class="hydstart-home-card hydstart-home-card-culture player" @click="changeSkinViewer">
            <div class="hydstart-home-card__background">
                <canvas id="skin-container"></canvas>
            </div>
            <div class="hydstart-home-card__foreground">
                <div class="hydstart-home-card__title">Play<span>er</span></div>
            </div>
        </div>
    </div>
</template>

<script>
    import { SkinViewer } from "skinview3d";

    export default {
        name: 'HomeCards',
        data() {
            return {
                skinViewer: Object,
                skinBaseApi: 'https://minotar.net/skin/',
                skinList: [
                    'Aurora_Lemon',
                    'Xiao_awa_',
                    'Complex_Colors',
                    'TochoShizuku',
                    'Arknights_Chen_',
                    'Hammurabi',
                    'CN_DaJiChi',
                    'larker_package',
                    'QiShui233'
                ],
                skinListCurrentIndex: 0,
                skinListTimeoutId: null,
                skinListDuration: 8000
            };
        },
        methods: {
            initSkinViewer() {
                this.skinViewer = new SkinViewer({
                    canvas: document.getElementById("skin-container"),
                    width: 100,
                    height: 170,
                    skin: this.skinBaseApi + this.skinList[this.skinListCurrentIndex]
                });

                this.skinViewer.fov = 60;
                this.skinViewer.zoom = 1;
                this.skinViewer.autoRotate = true;
            },
            autoChangeSkinViewer() {
                this.skinListTimeoutId = setTimeout(() => {
                    this.skinListCurrentIndex = (this.skinListCurrentIndex + 1) % this.skinList.length;
                    this.skinViewer.loadSkin(this.skinBaseApi + this.skinList[this.skinListCurrentIndex]);
                    this.autoChangeSkinViewer();
                }, this.skinListDuration);
            },
            clearSkinViewerTimeout() {
                if (this.skinListTimeoutId) {
                    clearTimeout(this.skinListTimeoutId);
                    this.skinListTimeoutId = null;
                }
            },
            changeSkinViewer() {
                this.clearSkinViewerTimeout();
                this.skinListCurrentIndex = (this.skinListCurrentIndex + 1) % this.skinList.length;
                this.skinViewer.loadSkin(this.skinBaseApi + this.skinList[this.skinListCurrentIndex]);
                this.autoChangeSkinViewer();
            },
            showDialog(type, index) {
                this.$emit('dialog', {
                    type: type,
                    index: index
                });
            }
        },
        mounted() {
            this.initSkinViewer();
            this.autoChangeSkinViewer();
        },
        beforeDestroy() {
            this.clearSkinViewerTimeout();
        }
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/styles/global.scss';

    .hydstart-home-cards {
        display: grid;
        grid-template-rows: repeat(2, 1fr);
        grid-auto-flow: column;
        grid-gap: 10px;
        margin-top: auto;
        height: 170px;

        .hydstart-home-card {
            $card-value-transition-duration: 250ms;
            $card-value-transition-delay: 50ms;
            border-radius: 16px;
            background-color: var(--color-surface-0);
            outline: 2px solid transparent;
            box-shadow: 0 1px 4px var(--background-dark-0);
            transition: all $card-value-transition-duration $value-transition-function;
            transition-delay: $card-value-transition-delay;
            overflow: hidden;
            position: relative;
            cursor: pointer;
            user-select: none;

            .hydstart-home-card__background,
            .hydstart-home-card__foreground {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
            }

            .hydstart-home-card__background {
                z-index: 20;

                img {
                    display: block;
                    width: 120%;
                    height: 100%;
                    object-fit: cover;
                    filter: brightness(0.85) saturate(0.95);
                    transition: all $card-value-transition-duration $value-transition-function;
                    transition-delay: $card-value-transition-delay;
                }
            }

            .hydstart-home-card__foreground {
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                padding: 15px;
                background: linear-gradient(220deg, transparent 50%, var(--background-light-2) 110%);
                z-index: 30;
            }

            .hydstart-home-card__title {
                font-size: 22px;
                font-family: 'Site Wordmark Font';
                transition: all $card-value-transition-duration $value-transition-function;
                transform: translateX(2px);
            }

            &:hover {
                outline-color: var(--color-primary);
                transform: scale(1.04);

                .hydstart-home-card__background img {
                    filter: brightness(1) saturate(1.5);
                    transform: translateX(-20px) scale(1.03);
                    transition-duration: 500ms;
                    transition-delay: 80ms;
                }

                .hydstart-home-card__title {
                    font-weight: 900;
                    transform: translateX(0px);
                }
            }

            &:active {
                transform: scale(0.99);
                transition-duration: 80ms;
            }

            &.hydstart-home-card-world {
                --home-background-status-unknown: #808080;
                --home-background-status-offline: #ff3c00;
                --home-background-status-loading: #e4ca23;
                --home-background-status-online: #008000;
                grid-row: 1 / span 2;
                width: 200px;

                .hydstart-home-card-world__title {
                    display: flex;
                    align-items: baseline;
                    gap: 6px;
                    font-size: 22px;
                    font-family: 'Site Wordmark Font';
                }

                .hydstart-home-card-world__status {
                    $status-value-length: 10px;
                    width: $status-value-length;
                    height: $status-value-length;
                    border-radius: 50%;
                    background-color: var(--home-background-status-unknown);
                }

                .hydstart-home-card-world__wordmark {
                    color: var(--background-light-4);
                    font-size: 54px;
                    font-weight: 700;
                    font-family: 'MiSans Latin';
                    text-shadow: 0 0 4px var(--background-dark-1);
                    line-height: 1;
                    position: relative;
                }

                .hydstart-home-card-world__wordmark span {
                    font-size: 20px;
                }

                &:hover {
                    width: 240px;
                }
            }

            &.omec, &.cities {
                width: 150px;
                grid-row: 1;
                grid-column: 3;

                .hydstart-home-card__foreground {
                    background: linear-gradient(290deg, transparent 20%, var(--background-light-3) 90%);
                    transition: all $card-value-transition-duration $value-transition-function;
                    transition-delay: $card-value-transition-delay;
                }

                &:hover {
                    .hydstart-home-card__title {
                        transform: translateX(0px);
                    }
                }
            }

            &.cities {
                grid-row: 2;
                grid-column: 3;
            }

            &.railway, &.player {
                .hydstart-home-card__foreground {
                    transition: all $card-value-transition-duration $value-transition-function;
                    transition-delay: $card-value-transition-delay;
                }
            }

            &.railway {
                width: 140px;
                grid-row: 1 / span 2;
                grid-column: 4;

                .hydstart-home-card__background img {
                    object-position: left;
                }

                &:hover {
                    width: 180px;
                }
            }

            &.player {
                width: 100px;
                grid-row: 1 / span 2;
                grid-column: 5;

                .hydstart-home-card__foreground {
                    background: unset;
                }

                span {
                    display: block;
                    color: var(--color-primary);
                    font-size: 18px;
                }

                canvas {
                    transform: rotate(-25deg) translate(0px, 60px);
                    transition: transform $card-value-transition-duration $value-transition-function;
                }

                &:hover {
                    width: 120px;

                    canvas {
                        transform: rotate(-25deg) translate(10px, 60px) scale(1.05);
                    }
                }
            }
        }
    }
</style>