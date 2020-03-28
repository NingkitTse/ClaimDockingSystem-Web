<template>
  <div class="search-by-rela">
    <el-form v-if="searchByRela" ref="form" :model="form" label-width="80px">
      <el-form-item class="image-checkbox-item" label="供电公司" style="margin-top: 20px">
        <el-checkbox-group v-model="form.powerSupplyCompany" @change="onchangeCompany()">
          <el-checkbox-button v-for="supplyCompany in supplyCompanies" :label="supplyCompany.name"
            :title="supplyCompany.name" :key="supplyCompany.name">
            <el-image class="checkbox-img" :fit="'cover'" lazy :src="supplyCompany.src" />
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <!-- 供电所 -->
      <el-form-item label="供电所" style="margin-top: 20px" v-show="supplyAdmins && supplyAdmins.length > 0">
        <el-checkbox-group v-model="form.powerSupplyAdmin" @change="onchangeFormCond()">
          <el-checkbox-button v-for="supplyAdmin in supplyAdmins" :label="supplyAdmin" :key="supplyAdmin">
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="功能">
        <el-button @click="exportSelection()">导出选中数据</el-button>
        <el-button class="el-icon-search" @click="queryEntites()"> 重新查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        supplyCompanies: [{
            name: "国家电网",
            src: "static/img/powerSupplyCompany/stateGridCorporationOfChina.jpg",
            supplyAdmins: ["所属变电站"],
          },
          {
            name: "湖南省电网",
            src: "static/img/powerSupplyCompany/chinaGuoDian.jpg",
            supplyAdmins: ["涟源所", "伏口所", "七星所", "枫杨所", "涟源城区", "茅白所"],
          }
        ],
        supplyAdmins: [],
      }
    },
    methods: {
      onchangeCompany() {
        let admins = this.supplyAdmins = [];
        let companies = this.form.powerSupplyCompany;
        for (let company of this.supplyCompanies) {
          if (companies.includes(company.name)) {
            admins.push(...company.supplyAdmins);
          }
        }
        this.form.powerSupplyAdmin = this.form.powerSupplyAdmin.filter(e => admins.includes(e))
        this.queryEntites();
      },
      onchangeFormCond() {
        // this.queryEntites();
      },
    }
  }

</script>
<style lang="scss" scoped>

</style>
