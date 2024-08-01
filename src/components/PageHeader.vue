<template>
    <nav>
        <div class="hydstart-header">
            <div class="hydstart-header-title">
                <span class="hydstart-header-logo"></span>HydCraft World
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
            </ul>
        </div>
    </nav>
</template>

<script>
    export default {
        name: "PageHeader",
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/styles/global.scss';

    $header-logo-border-radius: 2px;

    nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        background: var(--background-light--3);
        border-bottom: 1px solid var(--background-dark--0);
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
            background: var(--color-hydrcraft-red);
        }

        &::after {
            border-radius: 0 $header-logo-border-radius $header-logo-border-radius 0;
            background: var(--color-hydrcraft-blue);
        }
    }

    .hydstart-header-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 18px;
        font-family: 'Site Wordmark Font';
        text-transform: uppercase;
        user-select: none
    }

    $transfer-gap-value: 12px;

    .hydstart-header-link {
        justify-content: flex-end;
        
        .material-icons {
            display: block;
            color: var(--color-text--subtle);
            cursor: pointer;
            user-select: none;
            position: relative;
            z-index: 10;
            transition: transform 150ms $page-transition-type;

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
                background-color: var(--background-dark--0);
                border-radius: 50%;
                position: absolute;
                top: $header-link-icons-offset-value * -1;
                left: $header-link-icons-offset-value * -1;
                right: $header-link-icons-offset-value * -1;
                bottom: $header-link-icons-offset-value * -1;
                z-index: 8;
                opacity: 0;
                transition: all 150ms $page-transition-type;
            }
        }
    }

    .hydstart-header-router {
        justify-content: center;

        .hydstart-header-route {
            user-select: none;
        }

        a {
            color: var(--color-text--weaken);
            text-decoration: none;
        }

        a.router-link-exact-active {
            color: var(--color-text--subtle);
            font-weight: 600;
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
