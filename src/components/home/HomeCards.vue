<template>
    <div class="hydstart-home-cards">
        <div class="hydstart-home-card hydstart-home-card-world helium">
            <div class="hydstart-home-card__background">
                <img src="@/assets/images/image_card_background_helium.png" />
            </div>
            <div class="hydstart-home-card__foreground">
                <div class="hydstart-home-card-world__title">
                    Helium
                    <span class="hydstart-home-card-world__status"></span>
                </div>
                <div class="hydstart-home-card-world__wordmark">6<span>th</span></div>
            </div>
        </div>

        <div class="hydstart-home-card hydstart-home-card-world nitrogen">
            <div class="hydstart-home-card__background">
                <img src="@/assets/images/image_card_background_nitrogen.png" />
            </div>
            <div class="hydstart-home-card__foreground">
                <div class="hydstart-home-card-world__title">
                    Nitrogen
                    <span class="hydstart-home-card-world__status"></span>
                </div>
                <div class="hydstart-home-card-world__wordmark">7<span>th</span></div>
            </div>
        </div>

        <div class="hydstart-home-card hydstart-home-card-culture omec">

        </div>

        <div class="hydstart-home-card hydstart-home-card-develop cities">

        </div>

        <div class="hydstart-home-card hydstart-home-card-develop railway">

        </div>
        
        <div class="hydstart-home-card hydstart-home-card-culture player">

        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import '@/assets/styles/global.scss';

    .hydstart-home-cards {
        display: grid;
        grid-template-rows: repeat(2, 1fr);
        grid-auto-flow: column;
        grid-gap: 10px;
        margin-top: auto;
        height: 150px;

        .hydstart-home-card {
            padding: 8px;
            border-radius: 12px;
            background-color: var(--color-surface-0);
            box-shadow: 0 1px 4px var(--background-dark--0);
            transition: all 150ms $page-transition-type;
            overflow: hidden;
            position: relative;

            .hydstart-home-card__background, .hydstart-home-card__foreground {
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
                    transition: transform 200ms $page-transition-type;
                }
            }

            .hydstart-home-card__foreground {
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                padding: 15px;
                z-index: 30;
            }

            &:hover {
                transform: scale(1.04);

                .hydstart-home-card__background img {
                    transform: translateX(-10%);
                }
            }

            &:active {
                transform: scale(1.01);
            }

            &.hydstart-home-card-world {
                --home-background-status-unknown: #808080;
                --home-background-status-offline: #ff3c00;
                --home-background-status-loading: #e4ca23;
                --home-background-status-online: #008000;
                grid-row: 1 / span 2;
                width: 200px;
                padding: 0;

                .hydstart-home-card-world__title {
                    display: flex;
                    align-items: baseline;
                    gap: 6px;
                    font-size: 22px;
                    font-family: 'Site Wordmark Font';
                }

                .hydstart-home-card-world__status {
                    $status-length-value: 10px;
                    width: $status-length-value;
                    height: $status-length-value;
                    border-radius: 50%;
                    background-color: var(--home-background-status-unknown);
                }

                .hydstart-home-card-world__wordmark {
                    color: var(--background-light--4);
                    font-size: 54px; 
                    font-weight: 700;
                    font-family: 'MiSans Latin';
                    text-shadow: 0 0 5px var(--background-light--1);
                    line-height: 1;
                    position: relative;
                }

                .hydstart-home-card-world__wordmark span {
                    font-size: 20px;
                }
            }

            &.omec {
                grid-row: 1;
                grid-column: 3;
            }

            &.cities {
                grid-row: 2;
                grid-column: 3;
            }

            &.omec, &.cities {
                width: 150px;
            }

            &.railway {
                grid-row: 1 / span 2;
                grid-column: 4;
            }

            &.player {
                grid-row: 1 / span 2;
                grid-column: 5;
            }

            &.railway, &.player {
                width: 100px;
            }
        }
    }
</style>