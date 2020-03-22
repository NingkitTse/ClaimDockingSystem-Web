<template>
  <div class="device-table-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item class="image-checkbox-item" label="供电公司" style="margin-top: 20px">
        <el-checkbox-group v-model="form.powerSupplyCompany" @change="onchangeFormCond()">
          <el-checkbox-button v-for="supplyCompany in supplyCompanies" :label="supplyCompany.name"
            :key="supplyCompany.name">
            <el-image class="checkbox-img" :fit="'cover'" lazy :src="supplyCompany.src" />
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <!-- 供电所 -->
      <el-form-item label="供电所" style="margin-top: 20px">
        <el-checkbox-group v-model="form.powerSupplyCompany" @change="onchangeFormCond()">
          <el-checkbox-button v-for="supplyAdmin in supplyAdmins" :label="supplyAdmin" :key="supplyAdmin">
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
          <el-button @click="exportSelection()">导出选中数据</el-button>
      </el-form-item>
    </el-form>
    <el-table @selection-change="handleSelectionChange" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {
    getList
  } from '@/api/table';
  import downLoad from '@/utils/export'

  export default {
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        form: {
          powerSupplyCompany: [],
          powerSupplyAdmin: [],
        },
        supplyCompanies: [{
            name: "国家电网",
            src: "static/img/powerSupplyCompany/stateGridCorporationOfChina.jpg"
          },
          {
            name: "湖南省电网",
            src: "static/img/powerSupplyCompany/chinaGuoDian.jpg"
          },
          {
            name: "江西省电网",
            src: "static/img/powerSupplyCompany/stateGridCorporationOfChina.jpg"
          },
          {
            name: "河南省电网",
            src: "static/img/powerSupplyCompany/chinaGuoDian.jpg"
          },
        ],
        supplyAdmins: ["涟源所", "天元所", "株洲市所"],
        multipleSelection: [],
        list: null,
        listLoading: true
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getList().then(response => {
          this.list = response.data.items
          this.listLoading = false
        })
      },
      onchangeFormCond() {
        console.info(this.form)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      exportSelection() {
        downLoad(this.multipleSelection, "导出数据.json");
      }
    },
    filters: {
      processSrc(src) {
        return require(src);
      }
    }
  }

</script>

<style lang="scss" scoped>
  .checkbox-img {
    width: 60px;
    height: 60px;
  }

  .device-table-container {
    .image-checkbox-item {
      //   /deep/ .el-form-item__label {
      //     height: 74px;
      //     line-height: 74px;
      //   }

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
  }

</style>
