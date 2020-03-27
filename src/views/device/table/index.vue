<template>
  <div class="device-table-container">
    <el-radio-group v-model="searchBy">
      <el-radio-button label=true>通过供电公司\供电所搜索设备</el-radio-button>
      <el-radio-button label=false>通过GIS搜索设备</el-radio-button>
    </el-radio-group>
    <el-form v-if="searchBy" ref="form" :model="form" label-width="80px">
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
        <el-button @click="exportSelection()">导出选中数据</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="gisForm">

    </el-form>
    <div class="table-container">
      <el-table @selection-change="handleSelectionChange" v-loading="listLoading" :data="list"
        element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column fixed align="center" label="ID" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column fixed align="center" label="资产名称" width="95">
          <template slot-scope="scope">
            {{ scope.row.assetName }}
          </template>
        </el-table-column>
        <el-table-column fixed align="center" label="设备照片" width="95">
          <template slot-scope="scope">
            <el-image :preview-src-list="scope.row.imgPaths" v-if="scope.row.imgPaths && scope.row.imgPaths.length > 0"
              style="width: 60px; height: 60px" :src="scope.row.imgPaths[0]" :fit="'cover'" lazy></el-image>
          </template>
        </el-table-column>
        <el-table-column :label="value" resizable v-for="(value, key) of entityNameMap" :key="key" min-width="95">
          <template slot-scope="scope">
            {{ scope.row[key] }}
          </template>
        </el-table-column>
        <el-table-column min-width="95" fixed="right" :label="'操作'">
          <template slot-scope="scope">
            <i class="el-icon-edit icon" title="上传图片" @click="showEditPanel(scope.row)"></i>
            <!-- <i class="el-icon-delete icon"></i> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination background layout="sizes, prev, pager, next, total, jumper" :total="total" :page-size="pageSize"
          :current-page="current" :pager-count="11" :page-sizes="[10, 20, 50, 100, 200]" @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>

    <el-dialog title="编辑设备详情" :visible.sync="displayEditPanel" width="30%" :before-close="handleClose">
      <article>
        <el-form ref="deviceForm" :model="selectedEntity" label-width="100px">
          <el-form-item v-for="(value, key) of entityNameMap" :key="key" class="image-checkbox-item" :label="value">
            <el-input v-if="getEntityType(key) == 'text'" v-model="selectedEntity[key]" />
            <div v-else class="block">
              <el-date-picker v-model="selectedEntity[key]" type="datetime" placeholder="选择日期时间" align="right"
                :picker-options="pickerOptions">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-upload class="upload-demo" :action="backEndBaseUrl + '/device-img/info'" :on-preview="handlePreview"
            :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed"
            :file-list="uploadFileList" list-type="picture" :data="selectedEntity" :headers="{'X-Token': getToken()}">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form>
      </article>
      <span slot="footer" class="dialog-footer">
        <el-button @click="displayEditPanel = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getList
  } from '@/api/table';
  import downLoad from '@/utils/export'
  import {
    getEntityInfos,
    modifyEntityInfo
  } from '@/api/entity'
  import {
    uploadDeviceImg,
    deleteDeviceImg
  } from '@/api/deviceImg'
  import entityNameMap from '@/assets/json/entityNameMap.json'
  import entityTypeMap from '@/assets/json/entityTypeMap.json'
  import {
    backEndBaseUrl
  } from '@/settings'
  import {
    getToken
  } from '@/utils/auth'

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
        backEndBaseUrl,
        form: {
          powerSupplyCompany: [],
          powerSupplyAdmin: [],
        },
        searchBy: true,
        selectedEntity: entityNameMap,
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
        multipleSelection: [],
        list: null,
        current: 1,
        total: 10,
        pageSize: 20,
        listLoading: true,
        entityNameMap,
        displayEditPanel: false,
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        uploadFileList: [],
      }
    },
    created() {
      this.queryEntites();
    },
    methods: {
      getToken,
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
        this.queryEntites();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      exportSelection() {
        downLoad(this.multipleSelection, "导出数据.json");
      },
      async queryEntites() {
        this.listLoading = true;
        let param = {
          current: this.current,
          size: this.pageSize,
          ownDept: this.form.powerSupplyCompany,
          ownTransStation: this.form.powerSupplyAdmin
        }
        getEntityInfos(param).then(response => {
          console.info(response);
          let data = [];
          let records = this.list = (data = response.data).records;
          for (let record of records) {
            let arr = record.deviceImgs || [];
            if (!arr.length) {
              continue;
            }
            let tmp = [];
            arr.forEach(element => {
              element.imgPath = backEndBaseUrl + element.imgPath;
              tmp.push(element.imgPath);
            });
            record.imgPaths = tmp;
          }
          this.listLoading = false;
          this.total = data.total;
          this.current = data.current;
          this.pageSize = data.size;
        });
      },
      getEntityType(key) {
        return entityTypeMap[key] || "text";
      },
      handleSizeChange(size) {
        this.pageSize = size;
        this.queryEntites();
      },
      handleCurrentChange(current) {
        this.current = current;
        this.queryEntites();
      },
      showEditPanel(entity) {
        this.displayEditPanel = true;
        entity.fileList = entity.fileList || [];
        let e = this.selectedEntity = Object.assign({}, entity);
        this.uploadFileList = [];
        if (e.deviceImgs && e.deviceImgs.length) {
          for (let img of e.deviceImgs) {
            this.uploadFileList.push({
              url: img.imgPath,
              name: img.imgName,
              deviceImgId: img.deviceImgId
            })
          }
        }
      },
      handleClose() {

      },

      // 处理文件事件
      handleRemove(file, fileList) {
        deleteDeviceImg(file).then(response => {
          this.queryEntites();
        })
      },
      handlePreview(file) {
        this.queryEntites();
        // console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },

      submitEdit() {
        this.displayEditPanel = false;
        modifyEntityInfo(this.selectedEntity).then(response => {
          // console.info(this.selectedEntity);
          this.queryEntites();
        });
      },
    },
    filters: {
      processSrc(src) {
        return require(src);
      },
    }
  }

</script>

<style lang="scss" scoped>
  .checkbox-img {
    width: 60px;
    height: 60px;
  }

  .device-table-container {
    padding: 10px 20px;

    .image-checkbox-item {
      /deep/ .el-form-item__label {
        text-align: left;
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

    .table-container {
      margin-left: 80px;

      .footer {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 5px;
      }
    }

    /deep/ .el-table {
      .cell {
        .icon {
          cursor: pointer;
        }
      }
    }
  }

</style>
