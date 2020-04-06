<template>
  <div class="search-by-rela">
    <el-form ref="form" :model="form" label-width="80px">
      <!-- <el-form-item class="image-checkbox-item" label="供电公司" style="margin-top: 20px">
        <el-checkbox-group v-model="form.powerSupplyCompany" @change="onchangeCompany()">
          <el-checkbox-button v-for="supplyCompany in supplyCompanies" :label="supplyCompany.name"
            :title="supplyCompany.name" :key="supplyCompany.name">
            <el-image class="checkbox-img" :fit="'cover'" lazy :src="supplyCompany.src" />
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item> -->
      <!-- 供电所 -->
      <!-- <el-form-item label="供电所" style="margin-top: 20px" v-show="supplyAdmins && supplyAdmins.length > 0">
        <el-checkbox-group v-model="form.powerSupplyAdmin" @change="onchangeFormCond()">
          <el-checkbox-button v-for="supplyAdmin in supplyAdmins" :label="supplyAdmin" :key="supplyAdmin">
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item> -->
      <el-form-item label="地级市">
        <el-select v-model="form.powerSupplyCompany" placeholder="选择地级市" @change="onchangeCompany()">
          <el-option v-for="supplyCompany of supplyCompanies" :key="supplyCompany.postcode" :label="supplyCompany.orgName" :value="supplyCompany.postcode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="变电所">
        <el-select v-if="form.powerSupplyCompany" v-model="form.powerSupplyAdmin" placeholder="选择变电所">
          <el-option v-for="supplyAdmin of supplyAdmins" :key="supplyAdmin.orgNo" :label="supplyAdmin.orgName" :value="supplyAdmin.orgNo"></el-option>
        </el-select>
        <span v-else>请先选择地级市</span>
      </el-form-item>
      <el-form-item>
        <el-button-group class="btn-group">
          <el-button @click="preStep()" type="">上一步</el-button>
          <el-button @click="nextStep()" type="success">下一步</el-button>
        </el-button-group>
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
          powerSupplyCompany: "",
          powerSupplyAdmin: "",
        },
        // supplyCompanies: [{
        //     name: "国家电网",
        //     src: "static/img/powerSupplyCompany/stateGridCorporationOfChina.jpg",
        //     supplyAdmins: ["所属变电站"],
        //   },
        //   {
        //     name: "湖南省电网",
        //     src: "static/img/powerSupplyCompany/chinaGuoDian.jpg",
        //     supplyAdmins: ["涟源所", "伏口所", "七星所", "枫杨所", "涟源城区", "茅白所"],
        //   }
        // ],
        supplyCompanies: [],
        supplyAdmins: [],
        // rules: {
        //   powerSupplyCompany: [
        //     { required: true, message: '请输选择地级市', trigger: 'change' }
        //   ],
        //   powerSupplyAdmin: [
        //     { required: true, message: '请输选择变电所', trigger: 'change' }
        //   ],
        // }
      }
    },
    created() {
      this.powerSupplyCompany = this.$store.getters["powerSupplyCompany"];
      this.powerSupplyAdmin = this.$store.getters["powerSupplyAdmin"];
      
      this.$store.dispatch('entity/setSearchByReal', true);
      this.$store.dispatch('dict/addDepts', {parentPostcode: "431300"}).then(res => {
        this.supplyCompanies = this.$store.getters["childDeptMap"].get("431300");
      });
    },
    methods: {
      preStep() {
        this.$router.back(-1);
      },
      nextStep() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$store.dispatch('entity/setSupplyRela', {
              powerSupplyCompany: this.form.powerSupplyCompany,
              powerSupplyAdmin: this.form.powerSupplyAdmin
            }).then(res => {
              this.$router.push("./deviceTable");
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      onchangeCompany(company) {
        this.$store.dispatch('dict/addDepts', {parentPostcode: this.form.powerSupplyCompany}).then(res => {
          this.supplyAdmins = this.$store.getters["childDeptMap"].get(this.form.powerSupplyCompany);
        });
      },
      onchangeAdmin() {
        this.$store.dispatch('dict/addDepts', {parentPostcode: this.form.powerSupplyAdmin});
      },
    }
  }

</script>
<style lang="scss" scoped>
  .checkbox-img {
    width: 60px;
    height: 60px;
  }

  .search-by-rela {
    margin-top: 20px;
  }

  // .image-checkbox-item {
  //   /deep/ .el-form-item__label {
  //     height: 40px;
  //     line-height: 20px;
  //   }

  //   /deep/ .el-checkbox-button__inner {
  //     padding: 5px;
  //   }

  //   /deep/ .el-checkbox-button.is-checked .el-checkbox-button__inner {
  //     color: #FFF;
  //     background-color: #FFF;
  //     border-color: #DCDFE6;
  //     -webkit-box-shadow: -1px 0 0 0 #8cc5ff;
  //     box-shadow: -1px 0 0 0 #8cc5ff;
  //   }

  //   /deep/ .el-checkbox-button.is-checked .el-checkbox-button__inner::before {
  //     content: "✔";
  //     display: inline-block;
  //     position: absolute;
  //     width: 15px;
  //     height: 15px;
  //     z-index: 100;
  //     border-radius: 50%;
  //     background-color: #2ac845;
  //   }
  // }

</style>
