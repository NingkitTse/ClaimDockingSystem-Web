<template>
  <div class="dashboard-container">
    <div class="dashboard-text">title: {{ title }}</div>
    <div class="dashboard-text">name: {{ name }}</div>
    <el-input v-model="str"/>
    <el-button size="mini" style="margin-top: 5px;" @click="changeSetting({key:'title', value:str})">应用修改</el-button>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';

export default {
  name: 'Dashboard',
  data() {
    return {
      str: "",
    }
  },
  computed: {
    ...mapGetters([
      'name', 'title'
    ])
  },
  methods: {
    ...mapActions("settings", ['changeSetting'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
