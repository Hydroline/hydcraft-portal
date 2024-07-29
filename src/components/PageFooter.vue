<template>
    <footer>
        <div class="hydstart-footer">
            <div class="hydstart-footer-register">
                <img src="../assets/images/mps_ns_logo.png" alt="备案">
                ICP 备案号:
                <span class="hydstart-footer-register__icp">闽ICP备2023007345号-1</span>
                <span class="hydstart-footer-register__mps">闽公网安备35010202001677号</span>
            </div>
            <div class="hydstart-footer-desc">氢气工艺标志登记于国家版权局，本站由 AurLemon 基于 Vue.js 和 ThinkPHP 设计。我们欢迎所有想与我们交流技术的网友，我们相信：代码改变世界！</div>
            <div class="hydstart-footer-copyright">Copyright © 2018 - 2024 Hydrlab Studio. All Rights Reserved. 氢气实验室 版权所有</div>
        </div>
    </footer>
</template>

<script>
    export default {
        name: 'PageFooter'
    }
</script>

<style lang="scss" scoped>
    @use "sass:math";

    @import '../assets/styles/global.scss';

    footer {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        color: var(--color-surface-4);
        font-size: 12px;
        margin: auto $page-value-padding 0.75rem $page-value-padding;
    }

    .hydstart-footer-register {
        display: flex;
        align-items: center;
    }

    .hydstart-footer-register img {
        $image-length: 13px;
        display: block;
        width: $image-length;
        height: $image-length;
        margin-right: 4px;
        user-select: none;
    }

    .hydstart-footer-register [class^="hydstart-footer-register__"] {
        margin-left: 6px;
    }
</style>