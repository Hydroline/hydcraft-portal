<template>
    <header>
        <div class="hydstart-header">
            <div class="hydstart-header-wordmark">
                <div class="hydstart-header-title">
                    <span class="hydstart-header-title-wrapper">
                        <span class="hydstart-header-logo"></span>HydCraft World
                    </span>
                </div>
            </div>
            <ul class="hydstart-header-router">
                <li class="hydstart-header-route">
                    <router-link to="/">入口</router-link>
                </li>
                <li class="hydstart-header-route">
                    <router-link to="/story">故事</router-link>
                </li>
                <li class="hydstart-header-route">
                    <router-link to="/overview">概览</router-link>
                </li>
                <li class="hydstart-header-route">
                    <router-link to="/about">关于</router-link>
                </li>
            </ul>
            <ul class="hydstart-header-link">
                <li class="hydstart-header-link__comment">
                    <span class="material-icons">hearing</span>
                </li>
                <li class="hydstart-header-link__dashboard">
                    <span class="material-icons">dashboard</span>
                </li>
                <li class="hydstart-header-link__help">
                    <span class="material-icons">help_outline</span>
                </li>
                <li class="hydstart-header-link__more">
                    <span class="material-icons">more_vert</span>
                </li>

                <SidebarTemplate ref="sidebar"/>
            </ul>
        </div>
    </header>
</template>

<script>
    export default {
        name: "PageHeader",
        components: {
            SidebarTemplate: () => import('@/components/sidebar/SidebarTemplate.vue')
        },
        methods: {
            toggleMenu(tag) {
                this.$refs.sidebar.toggleMenu(tag);
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/styles/global.scss';

    $header-logo-border-radius: 2px;

    header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: $page-fixed-value-z-index;
        background: var(--background-light-3);
        border-bottom: 1px solid var(--background-dark-0);
        backdrop-filter: saturate(125%) blur(32px);
    }

    .hydstart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: $page-header-width;
        padding: 10px 6rem;
        margin: 0 auto;

        & > [class^="hydstart-header-"] {
            flex: 1;
        }
    }

    .hydstart-header-logo {
        display: flex;
        align-items: center;

        &::before, &::after {
            content: '';
            display: block;
            width: 24px;
            height: 4px;
        }

        &::before {
            border-radius: $header-logo-border-radius 0 0 $header-logo-border-radius;
            background: var(--color-hydcraft-red);
        }

        &::after {
            border-radius: 0 $header-logo-border-radius $header-logo-border-radius 0;
            background: var(--color-hydcraft-blue);
        }
    }

    .hydstart-header-wordmark {
        .hydstart-header-title {
            $title-value-after-opacity--max: 1;
            $title-value-transition-duration: 300ms;
            width: fit-content;
            position: relative;
            user-select: none;
            cursor: pointer;
            transition: all $title-value-transition-duration $value-transition-function;

            &:hover {
                .hydstart-header-title-wrapper {
                    color: var(--color-surface-0);
                }

                &::after {
                    opacity: $title-value-after-opacity--max;
                }
            }

            &:active {
                transform: scale(0.98);

                &::after {
                    opacity: $title-value-after-opacity--max;
                    background-color: var(--color-primary--active);
                }
            }

            &::after {
                $subbutton-icons-offset-value: 12px;
                content: '';
                background-color: var(--color-primary);
                border-radius: 32px;
                position: absolute;
                z-index: 8;
                top: $subbutton-icons-offset-value * -1;
                left: $subbutton-icons-offset-value * -1;
                right: $subbutton-icons-offset-value * -1;
                bottom: $subbutton-icons-offset-value * -1;
                opacity: 0;
                transition: all $title-value-transition-duration $value-transition-function;
            }

            .hydstart-header-title-wrapper {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-size: 18px;
                font-family: 'Site Wordmark Font';
                text-transform: uppercase;
                position: relative;
                z-index: 10;
                transition: color $title-value-transition-duration $value-transition-function;
            }
        }
    }

    $transfer-gap-value: 12px;

    .hydstart-header-link {
        justify-content: flex-end;
        position: relative;
        
        [class^="hydstart-header-link__"] {
            display: block;
            color: var(--color-text--subtle);
            cursor: pointer;
            user-select: none;
            position: relative;
            transition: transform 150ms $value-transition-function;

            &:hover {
                transform: scale(1.02);

                &::after {
                    opacity: 1;
                    transform: scale(1.2);
                }
            }

            &:active {
                transform: scale(0.98);
                transition-duration: 80ms;

                &::after {
                    opacity: 1;
                    transform: scale(1.1);
                    transition-duration: 80ms;
                }
            }

            &::after {
                $header-link-icons-offset-value: 5px;
                content: '';
                background-color: var(--background-dark-0);
                border-radius: 50%;
                position: absolute;
                top: $header-link-icons-offset-value * -1;
                left: $header-link-icons-offset-value * -1;
                right: $header-link-icons-offset-value * -1;
                bottom: $header-link-icons-offset-value * -1;
                z-index: 0;
                opacity: 0;
                transition: all 150ms $value-transition-function;
            }

            .material-icons {
                display: block;
                position: relative;
                z-index: 10;
            }
        }
    }

    .hydstart-header-router {
        justify-content: center;

        .hydstart-header-route {
            a {
                display: block;
                color: var(--color-text--weaken);
                text-decoration: none;
                position: relative;
                z-index: 10;
                user-select: none;
                cursor: pointer;
                transition: all 150ms $value-transition-function;

                &:hover {
                    color: var(--background-dark-1);
                    text-shadow: 0px 0px 6px var(--color-primary);

                    &::after {
                        opacity: 1;
                        transform: translateY(0px) scale(1);
                    }
                }

                &:active {
                    transform: scale(0.94);

                    &::after {
                        opacity: 1;
                    }
                }

                &::after {
                    $subbutton-icons-offset-value: 3px;
                    content: '';
                    background-color: var(--color-surface-4);
                    border-radius: 4px;
                    position: absolute;
                    top: calc(100% + 2px);
                    left: $subbutton-icons-offset-value * -1;
                    right: $subbutton-icons-offset-value * -1;
                    height: 2px;
                    z-index: 8;
                    opacity: 0;
                    transition: all 150ms $value-transition-function;
                    transform: translateY(2px) scale(0.9);
                }

                &.router-link-exact-active {
                    color: var(--color-text--subtle);
                    font-weight: 600;

                    &::after {
                        background-color: var(--color-primary);
                    }

                    &:hover {
                        text-shadow: 0px 0px 6px var(--background-dark-2);
                    }
                }
            }
        }
    }

    .hydstart-header-router,
    .hydstart-header-link {
        margin: 0;
        padding: 0;
        list-style-type: none;
        display: flex;
        align-items: center;
        gap: $transfer-gap-value;
    }
</style>
