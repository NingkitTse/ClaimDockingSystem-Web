<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <el-header :height="'100px'" :padding="0" class="top-header">
      <div class="logo_desc">
        <span>{{ title }}</span>
      </div>
      <img id="main_img" class="img" src="@/assets/home_logo_blank.gif">
    </el-header>
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
  import {
    Navbar,
    Sidebar,
    AppMain
  } from './components'
  import ResizeMixin from './mixin/ResizeHandler'
  import {mapState} from 'vuex'

  export default {
    name: 'Layout',
    components: {
      Navbar,
      Sidebar,
      AppMain
    },
    mixins: [ResizeMixin],
    computed: {
      classObj() {
        return {
          hideSidebar: !this.sidebar.opened,
          openSidebar: this.sidebar.opened,
          withoutAnimation: this.sidebar.withoutAnimation,
          mobile: this.device === 'mobile'
        }
      },
      ...mapState("app", ['sidebar', 'device']),
      ...mapState("settings", ['fixedHeader', 'title'])
    },
    methods: {
      handleClickOutside() {
        this.$store.dispatch('app/closeSideBar', {
          withoutAnimation: false
        })
      }
    }
  }

</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

  .el-header {
    
  }
  .el-main {
    padding: 10px 10px;
    overflow: hidden;
  }

  .top-header {
    background-color: #032B4B;
    z-index: 101;
  }

  .logo_desc {
    position: absolute;
    left: 290px;
    height: 50px;
    top: 40px;
    z-index: 101;
    font-size: 20px;
    color: white;
  }

  #app .sidebar-container, #app .main-container {
    
  }

  #app .sidebar-container {
    position: fixed;
    margin-top: 100px;
  }

  #app .main-container {
    height: calc(100% - 100px);
    min-height: calc(100% - 100px);
    max-height: calc(100% - 100px);
    overflow-y: scroll;
  }

</style>
