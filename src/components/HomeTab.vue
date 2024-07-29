<template>
    <div class="hydstart-home-tab">
23
    </div>
</template>

<script>
export default {
    name: 'HomeTab'
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/global.scss';

.hydstart-home-tab {
    font-size: 14px;
    width: 500px;
    padding: 12px 16px;
    background: var(--color-surface-0);
    border-radius: 24px;
    position: absolute;
    left: 50%;
    bottom: 50px;
    transform: translate(-50%, -50%);
    transition: all $page-transition-delay $page-transition-type;
}
</style>