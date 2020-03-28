<template>
  <div class="search-by-rela">
    <el-form ref="form" :model="form" label-width="80px">
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
      <el-form-item>
        <el-button @click="nextStep()" type="success">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import store from '@/store'
  export default {
    data() {
      return {
        form: {
          powerSupplyCompany: [],
          powerSupplyAdmin: [],
        },
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
    created() {
      this.$store.dispatch('entity/setSearchByReal', true);
    },
    methods: {
      nextStep() {
        this.$store.dispatch('entity/setSupplyRela', {
          powerSupplyCompany: this.form.powerSupplyCompany,
          supplyAdmins: this.form.supplyAdmins
        });
        this.$router.push("./deviceTable");
      },
      onchangeCompany() {
        let admins = this.supplyAdmins = [];
        let companies = this.form.powerSupplyCompany;
        for (let company of this.supplyCompanies) {
          if (companies.includes(company.name)) {
            admins.push(...company.supplyAdmins);
          }
        }
        this.form.powerSupplyAdmin = this.form.powerSupplyAdmin.filter(e => admins.includes(e))
        // this.queryEntites();
      },
      onchangeFormCond() {
        // this.queryEntites();
        this.$store.dispatch('entity/setSupplyRela', this.form);
      },
    }
  }

</script>
<style lang="scss" scoped>
  .checkbox-img {
    width: 60px;
    height: 60px;
  }

  .image-checkbox-item {
    /deep/ .el-form-item__label {
      height: 40px;
      line-height: 20px;
    }

    /deep/ .el-checkbox-button__inner {
      padding: 5px;
    }

    /deep/ .el-checkbox-button.is-checked .el-checkbox-button__inner {
      color: #FFF;
      background-color: #FFF;
      border-color: #DCDFE6;
      -webkit-box-shadow: -1px 0 0 0 #8cc5ff;
      box-shadow: -1px 0 0 0 #8cc5ff;
    }

    /deep/ .el-checkbox-button.is-checked .el-checkbox-button__inner::before {
      content: "✔";
      display: inline-block;
      position: absolute;
      width: 15px;
      height: 15px;
      z-index: 100;
      border-radius: 50%;
      background-color: #2ac845;
    }
  }

</style>
