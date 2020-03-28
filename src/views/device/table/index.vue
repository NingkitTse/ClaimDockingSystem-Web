<template>
  <div class="device-table-container">
    <el-radio-group v-model="searchByRela">
      <el-radio-button :label=true>通过供电公司\供电所搜索设备</el-radio-button>
      <el-radio-button :label=false>通过GIS搜索设备</el-radio-button>
    </el-radio-group>
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
    <el-form v-else ref="gisForm" class="gis-form" label-width="80px">
      <baidu-map class="map-div" :center="center" :zoom="zoom" @ready="handlerMapInitHouseDetail"
        @click="getMapClickInfo" :scroll-wheel-zoom='true'>
      </baidu-map>
      <el-form-item label="边界信息" v-if="this.bounds">
        <span class="bound-item">
          界面西经： <span>{{ this.bounds.Zd }}</span>
        </span>
        <span class="bound-item">
          界面东经： <span>{{ this.bounds.Xd }}</span>
        </span>
        <span class="bound-item">
          界面北纬： <span>{{ this.bounds.Ne }}</span>
        </span>
        <span class="bound-item">
          界面南纬： <span>{{ this.bounds.Je }}</span>
        </span>
      </el-form-item>
      <el-form-item label="功能">
        <el-button @click="exportSelection()">导出选中数据</el-button>
        <el-button class="el-icon-search" @click="queryEntites()"> 重新查询</el-button>
      </el-form-item>
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
        <el-pagination background layout="prev, pager, next, total, jumper" :total="total" :page-size="pageSize"
          :current-page="current" :pager-count="11" :page-sizes="[10, 20, 50, 100, 200]" @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>

    <el-dialog title="编辑设备详情" :visible.sync="displayEditPanel" width="30%" :before-close="handleClose">
      <article>
        <el-form ref="deviceForm" :rules="entityRule" :model="selectedEntity" label-width="100px">
          <el-form-item v-for="(value, key) of entityNameMap" :key="key" :prop="key" class="image-checkbox-item"
            :label="value">
            <el-input v-if="getEntityType(key) == 'text'" v-model="selectedEntity[key]" />
            <el-input v-else-if="getEntityType(key) == 'lng'" type="number" :max="180" :min="-180"
              v-model="selectedEntity[key]" />
            <el-input v-else-if="getEntityType(key) == 'lat'" type="number" :max="90" :min="-90"
              v-model="selectedEntity[key]" />
            <el-input v-else-if="getEntityType(key) == 'tel'" type="tel" :max="90" :min="-90"
              v-model="selectedEntity[key]" />
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
    modifyEntityInfo,
    getEntityInfosByGis
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
  import {
    handlerMapInit,
    getMapClickInfo
  } from '@/utils/bMapUtil'
  import entityRule from "@/assets/rule/entityRule"
  import mapGetters from "vuex"

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
    props: [
      ...mapGetters(['searchByRela', 'supplyCompanies', 'supplyAdmins', 'center', 'radius'])
    ],
    data() {
      return {
        entityRule,
        backEndBaseUrl,
        form: {
          powerSupplyCompany: [],
          powerSupplyAdmin: [],
        },
        searchByRela: true,
        selectedEntity: entityNameMap,
        
        multipleSelection: [],
        list: null,
        current: 1,
        total: 10,
        pageSize: 100000,
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

        zoom: 15,
        "center": {
          lng: 111.67,
          lat: 27.7
        },
        map: {},
      }
    },
    created() {
      this.queryEntites();
    },
    methods: {
      getToken,
      s
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      exportSelection() {
        downLoad(this.multipleSelection, "导出数据.json");
      },
      processEntityInfos(response) {
        // console.info(response);
        this.listLoading = false;
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
        this.total = data.total;
        this.current = data.current;
        this.pageSize = data.size;
      },
      async queryEntites() {
        this.listLoading = true;
        if (this.searchByRela) {
          let param = {
            current: this.current,
            size: this.pageSize,
            ownDept: this.form.powerSupplyCompany,
            ownTransStation: this.form.powerSupplyAdmin
          }
          getEntityInfos(param).then(resp => this.processEntityInfos(resp));
        } else {
          if (!this.map) {
            return;
          }
          this.bounds = this.map.getBounds();
          let param = Object.assign({}, this.bounds, {
            current: this.current,
            size: this.pageSize,
          });
          getEntityInfosByGis(param).then(resp => this.processEntityInfos(resp));
        }
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
        this.$confirm('确认关闭？')
          .then(_ => {
            this.displayEditPanel = false;
            done();
          })
          .catch(_ => {});
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
        this.$refs["deviceForm"].validate((valid) => {

          if (!valid) {
            console.log('error submit!!');
            return false;
          }

          this.displayEditPanel = false;
          modifyEntityInfo(this.selectedEntity).then(response => {
            // console.info(this.selectedEntity);
            this.queryEntites();
          });
          console.info('submit!');
        })
      },

      // 地图相关
      handlerMapInit,
      getMapClickInfo,
      handlerMapInitHouseDetail({
        BMap,
        map
      }) {
        handlerMapInit.call(this, {
          BMap,
          map
        });
        this.map = map;
        var top_left_control = new BMap.ScaleControl({
          anchor: BMAP_ANCHOR_TOP_LEFT
        }); // 左上角，添加比例尺
        var top_left_navigation = new BMap.NavigationControl(); //左上角，添加默认缩放平移控件
        var top_right_navigation = new BMap.NavigationControl({
          anchor: BMAP_ANCHOR_TOP_RIGHT,
          type: BMAP_NAVIGATION_CONTROL_SMALL
        }); //右上角，仅包含平移和缩放按钮
        map.addControl(top_left_control);
        map.addControl(top_left_navigation);
        map.addControl(top_right_navigation);

        this.marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

        map.addEventListener("zoomend", ({
          eventType,
          target
        }) => {
          // console.info("After zoom, bounds:", target.getBounds())
          this.queryEntites();
        })
        this.queryEntites();
      },
    },
    filters: {
      processSrc(src) {
        return require(src);
      },
    },
    watch: {
      searchByRela() {
        if (this.searchByRela) {
          this.queryEntites();
        }
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
    padding: 10px 20px;

    .bound-item:not(:first-child) {
      margin-left: 20px;
    }

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

    .map-div {
      width: 100%;
      height: 300px;
      margin: 5px 0px;
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
