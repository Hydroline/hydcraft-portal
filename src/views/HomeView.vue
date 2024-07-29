<template>
  <div class="hydstart-main-container hydstart-home">
    <div class="hydstart-main-container__background">
      <img src="../assets/images/20240126_广阳北安街道.png" />
    </div>
    <div class="hydstart-main-container__foreground">
      <div class="hydstart-home-text">
        <div class="hydstart-home-text__title">哈基米</div>
        <div class="hydstart-home-text__subtitle">宝宝你是一个可爱的哈基米</div>
      </div>
      <div class="hydstart-home-desc">哈基米，哈基米，哈基米，哈基米，哈基米，哈基米，哈基米，哈基米，哈基米，哈基米，哈基米，哈基米，哈基米，哈基米，哈基米，哈基米，哈基米，哈基米，哈基米。</div>
      <!-- <HomeTab /> -->
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'HomeView',
  components: {
    HomeTab: () => import('../components/HomeTab.vue')
  },
  data() {
    return {

    }
  }
}
</script>


<style lang="scss" scoped>
@import '../assets/styles/global.scss';

.hydstart-main-container__background {
  height: 100%;
  user-select: none;
}

.hydstart-main-container__background img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hydstart-main-container__foreground {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  padding-top: $page-header-width;
}
</style>