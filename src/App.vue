<template>
    <div id="app">
        <PageHeader />
        <main>
            <router-view />
        </main>
        <PageFooter :showMain="showMain" />
    </div>
</template>

<script>
    export default {
        name: 'App',
        data() {
            return {
                showMain: false
            }
        },
        components: {
            PageHeader: () => import('./components/PageHeader.vue'),
            PageFooter: () => import('./components/PageFooter.vue')
        },
        created() {    
            this.$eventBus.$on('updateFooter', (data) => {
                this.showMain = data.showMain;
            });
        },
        beforeDestroy() {
            this.$eventBus.$off('updateFooter');
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