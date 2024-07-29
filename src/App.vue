<template>
  <div id="app">
    <nav>
      <div class="hydstart-header">
        <div class="hydstart-header-title"><span class="hydstart-header-logo"></span>HydCraft World</div>
        <div class="hydstart-header-transfer">
          <ul class="hydstart-header-router">
            <li class="hydstart-header-route"><router-link to="/">首页</router-link></li>
            <li class="hydstart-header-route"><router-link to="/about">关于</router-link></li>
            <li class="hydstart-header-route"><a href="https://wiki.hydcraft.cn" target="_blank">知识库</a></li>
            <li class="hydstart-header-route"><a href="https://docs.hydcraft.cn" target="_blank">文档中心</a></li>
            <li class="hydstart-header-route"><a href="https://monitor.hydcraft.cn" target="_blank">业务监测</a></li>
          </ul>
          <ul class="hydstart-header-link">
            <li class="hydstart-header-link__help"><span class="material-icons">help_outline</span></li>
            <li class="hydstart-header-link__more"><span class="material-icons">more_vert</span></li>
          </ul>
        </div>
      </div>
    </nav>
    <main>
      <router-view />
    </main>
    <PageFooter />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    PageFooter: () => import('./components/PageFooter.vue')
  }
}
</script>

<style lang="scss" scoped>
@import './assets/styles/global.scss';

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
  padding: 10px 15rem;
  margin: 0 auto;
}

.hydstart-header-logo {
  display: flex;
  align-items: center
}

.hydstart-header-logo::before,
.hydstart-header-logo::after {
  content: '';
  display: block;
  width: 24px;
  height: 4px;
}

.hydstart-header-logo::before {
  border-radius: $header-logo-border-radius 0 0 $header-logo-border-radius;
  background: rgb(211, 47, 47);
}

.hydstart-header-logo::after {
  border-radius: 0 $header-logo-border-radius $header-logo-border-radius 0;
  background: rgb(3, 169, 244);
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

.hydstart-header-transfer {
  display: flex;
  gap: $transfer-gap-value * 2;
}

.hydstart-header-router, .hydstart-header-link {
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  align-items: center;
  gap: $transfer-gap-value;
}

.hydstart-header-router .hydstart-header-route {
  user-select: none;
}

.hydstart-header-router a {
  color: var(--color-text--subtle);
  text-decoration: none;
  transition: color 150ms $page-transition-type;
}

.hydstart-header-router a.router-link-exact-active {
  color: var(--color-primary);
}

.hydstart-header-link .material-icons {
  display: block;
  color: var(--color-text--subtle);
  cursor: pointer;
  user-select: none;
}

main {
  height: 100%;
}

.hydstart-main-container {
  height: 100%;
  position: relative;
}
</style>

<style lang="scss">
@font-face {
  font-family: 'Minecraft AE';
  src: url(./assets/fonts/Minecraft_AE.woff2);
}

@font-face {
  font-family: 'Site Wordmark Font';
  src: url(./assets/fonts/Site_Wordmark_Font.woff2);
}

:root {
  --font-family: "MiSans", "HarmonyOS Sans SC", "MiSans Latin", "Helvetica Neue", "Helvetica", "Roboto", "BlinkMacSystemFont", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  --color-primary__h: 200;
  --color-primary__s: 55%;
  --color-primary__l: 48%;
  --color-surface-0__s: 3%;
  --color-surface-0__l: 99%;
  --color-surface-1__s: 3%;
  --color-surface-1__l: 95%;
  --color-surface-2__s: 10%;
  --color-surface-2__l: 93%;
  --color-surface-3__s: 10%;
  --color-surface-3__l: 85%;
  --color-surface-4__s: 10%;
  --color-surface-4__l: 74%;
  --color-primary: hsl(var(--color-primary__h), var(--color-primary__s), var(--color-primary__l));
  --color-surface-0: hsl(var(--color-primary__h), var(--color-surface-0__s), var(--color-surface-0__l));
  --color-surface-1: hsl(var(--color-primary__h), var(--color-surface-1__s), var(--color-surface-1__l));
  --color-surface-2: hsl(var(--color-primary__h), var(--color-surface-2__s), var(--color-surface-2__l));
  --color-surface-3: hsl(var(--color-primary__h), var(--color-surface-3__s), var(--color-surface-3__l));
  --color-surface-4: hsl(var(--color-primary__h), var(--color-surface-4__s), var(--color-surface-4__l));
  --color-light: var(--color-primary__h), var(--color-surface-0__s), var(--color-surface-0__l);
  --color-dark: var(--color-primary__h), 20%, 10%;
  --background-light--0: hsla(var(--color-light), 0.1);
  --background-light--0-active: hsla(var(--color-light), 0.05);
  --background-light--1: hsla(var(--color-light), 0.3);
  --background-light--2: hsla(var(--color-light), 0.6);
  --background-light--2-hover: hsla(var(--color-light), 0.5);
  --background-light--3: hsla(var(--color-light), 0.75);
  --background-light--4: hsla(var(--color-light), 0.9);
  --background-dark--0: hsla(var(--color-dark), 0.1);
  --background-dark--1: hsla(var(--color-dark), 0.3);
  --background-dark--2: hsla(var(--color-dark), 0.6);
  --color-text: hsl(var(--color-primary__h), 29%, 24%);
  --color-text--emphasized: hsl(var(--color-primary__h), 85%, 5%);
  --color-text--subtle: hsl(var(--color-primary__h), 30%, 35%);
  --color-text--weaken: hsl(var(--color-primary__h), 15%, 73%);
}

::selection {
  background: hsla(var(--color-primary__h), 5%, 54%, 22%);
}

*,
*::before,
*::after {
  scrollbar-color: var(--color-surface-4) transparent;
  scrollbar-width: thin;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  color: var(--color-text);
  font-family: var(--font-family);
  background: var(--color-surface-1);
}

#app {
  height: 100vh;
}
</style>
