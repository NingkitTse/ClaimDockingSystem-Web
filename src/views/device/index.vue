<template>
  <div class="deviceInfo">
      <h1>设备详情界面</h1>
      <div> 
          您可以按照提示步骤搜索设备信息。
      </div>
      <el-button-group class="btn-group">
        <el-button @click="searchByRela()">通过组织关系查找设备</el-button>
        <el-button @click="searchByGis()">通过GIS地图查找设备</el-button>
      </el-button-group>
  </div>
</template>

<script>
  export default {
    created() {
    },
    methods: {
        searchByRela() {
            this.$router.push("./searchDeviceByRela")
        },
        searchByGis() {
            this.$router.push("./searchDeviceByGis")
        }
    }
  }

</script>

<style lang="scss" scoped>
    .deviceInfo {
        margin: 10px;

        .btn-group {
            margin-top: 10px;
        }
    }
</style>
