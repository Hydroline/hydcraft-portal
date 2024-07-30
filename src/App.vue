<template>
    <div id="app">
        <PageHeader />
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
            PageHeader: () => import('./components/PageHeader.vue'),
            PageFooter: () => import('./components/PageFooter.vue')
        }
    }
</script>

<style lang="scss">
    @import url('@/assets/styles/common.scss');

    #app {
        height: 100vh;
    }
</style>

<style lang="scss" scoped>
    main {
        height: 100%;
    }
</style>