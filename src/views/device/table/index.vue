<template>
  <div class="device-table-container">
    <el-button class="goBackStep" @click="goBackStep()">返回上一步</el-button>
    <el-form ref="form" class="form" label-width="100px">
      <el-form-item label="设备ID">
        <el-input v-model="form.entityId" placeholder="请输入设备ID" />
      </el-form-item>
      <el-form-item v-if="bounds" label="设备类型">
        <el-select v-model="form.deviceType" placeholder="选择设备类型">
          <el-option :label="'所有类型'" :value="''" />
          <el-option v-for="deviceType of deviceTypes" :key="deviceType.value" :label="deviceType.label" :value="deviceType.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="使用环境">
        <el-radio-group v-model="form.useEnv">
          <el-radio-button :label="''">所有环境</el-radio-button>
          <el-radio-button v-for="useEnv of useEnvs" :key="useEnv.value" :label="useEnv.value">{{ useEnv.label }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="功能">
        <!-- <el-button type="" @click="queryEntites()">重新查询</el-button> -->
        <el-button type="" @click="exportSelection()">导出选中数据</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column fixed align="center" label="No" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column fixed align="center" label="实体ID" prop="entityId" width="180" />
        <el-table-column fixed align="center" label="资产名称" width="95">
          <template slot-scope="scope">
            {{ scope.row.assetName }}
          </template>
        </el-table-column>
        <el-table-column fixed align="center" label="设备照片" width="95">
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.imgPaths && scope.row.imgPaths.length > 0"
              :preview-src-list="scope.row.imgPaths"
              style="width: 60px; height: 60px"
              :src="scope.row.imgPaths[0]"
              :fit="'cover'"
              lazy
            />
          </template>
        </el-table-column>
        <el-table-column v-for="(value, key) of entityNameMap" :key="key" :label="value" resizable min-width="95">
          <template slot-scope="scope">
            <span v-if="getEntityType(key) == 'dept'">
              {{ getDeptName(key, scope.row) }}
            </span>
            <span v-else-if="getEntityType(key) == 'serviceEnv'">
              {{ getDictLabel('useEnvs', scope.row[key]) }}
            </span>
            <span v-else-if="getEntityType(key) == 'deviceType'">
              {{ getDictLabel('deviceTypes', scope.row[key]) }}
            </span>
            <span v-else>{{ scope.row[key] }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="95" fixed="right" :label="'操作'">
          <template slot-scope="scope">
            <i class="el-icon-edit icon" title="上传图片" @click="showEditPanel(scope.row)" />
            <!-- <i class="el-icon-delete icon"></i> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="current"
          :pager-count="11"
          :page-sizes="[10, 20, 50, 100, 200]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <el-dialog title="编辑设备详情" :visible.sync="displayEditPanel" width="30%" :before-close="handleClose">
      <article>
        <el-form ref="deviceForm" class="deviceForm" :rules="entityRule" :model="selectedEntity" label-width="100px">
          <el-form-item
            v-for="(value, key) of entityNameMap"
            :key="key"
            :prop="key"
            class="image-checkbox-item"
            :label="value"
          >
            <el-input v-if="getEntityType(key) == 'text'" v-model="selectedEntity[key]" disabled />
            <el-input
              v-else-if="getEntityType(key) == 'lng'"
              v-model="selectedEntity[key]"
              disabled
              type="number"
              :max="180"
              :min="-180"
            />
            <el-input
              v-else-if="getEntityType(key) == 'lat'"
              v-model="selectedEntity[key]"
              disabled
              type="number"
              :max="90"
              :min="-90"
            />
            <el-radio-group v-else-if="getEntityType(key) == 'serviceEnv'" v-model="selectedEntity[key]" disabled>
              <el-radio-button v-for="useEnv of useEnvs" :key="useEnv.value" :label="useEnv.value">{{ useEnv.label }}</el-radio-button>
            </el-radio-group>
            <el-input
              v-else-if="getEntityType(key) == 'tel'"
              v-model="selectedEntity[key]"
              disabled
              type="tel"
            />
            <el-input
              v-else-if="getEntityType(key) == 'dept'"
              v-model="selectedEntity[key + 'Name']"
              disabled
              type="text"
            />
            <el-select v-else-if="getEntityType(key) == 'deviceType'" v-model="selectedEntity[key]" disabled placeholder="选择设备类型">
              <el-option v-for="type of deviceTypes" :key="type.value" :label="type.label" :value="type.value" />
            </el-select>
            <div v-else class="block">
              <el-date-picker
                v-model="selectedEntity[key]"
                disabled
                type="datetime"
                placeholder="选择日期时间"
                align="right"
                :picker-options="pickerOptions"
              />
            </div>
          </el-form-item>
          <el-upload
            class="upload-demo"
            :action="backEndBaseUrl + '/device-img/info'"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="uploadFileList"
            list-type="picture"
            :data="selectedEntity"
            :headers="{'X-Token': getToken()}"
          >
            <!-- <el-button size="small" type="primary">点击上传</el-button> -->
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
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
} from '@/api/table'
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
import entityRule from '@/assets/rule/entityRule'
import {
  mapGetters
} from 'vuex'

let vm = {}
export default {
  filters: {

  },
  data() {
    return {
      entityRule,
      backEndBaseUrl,
      selectedEntity: entityNameMap,
      form: {
        deviceType: '',
        useEnv: '',
        entityId: ''
      },
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
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      uploadFileList: [],
      deviceTypes: [],
      useEnvs: []
    }
  },
  // computed: {
  //   ...mapGetters['deviceTypes']
  // }
  watch: {
    form: {
      handler(val, oldVal) {
        this.queryEntites()
      },
      deep: true
    }
  },

  created() {
    vm = this
    this.center = this.$store.getters['center']
    this.radius = this.$store.getters['radius']
    this.bounds = this.$store.getters['bounds']
    this.searchByRela = this.$store.getters['searchByRela']
    this.powerSupplyCompany = this.$store.getters['powerSupplyCompany']
    this.powerSupplyAdmin = this.$store.getters['powerSupplyAdmin']
    this.$store.dispatch('dict/getDeviceType').then(res => {
      this.deviceTypes = this.$store.getters['deviceTypes']
      // console.info(this.deviceTypes)
    })
    this.$store.dispatch('dict/getUseEnv').then(res => {
      this.useEnvs = this.$store.getters['useEnvs']
      // console.info(this.deviceTypes)
    })
    this.queryEntites()
  },
  methods: {
    goBackStep() {
      this.$router.back(-1)
    },
    getToken,
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    exportSelection() {
      downLoad(this.multipleSelection, '导出数据.json')
    },
    processEntityInfos(response) {
      // console.info(response);
      this.listLoading = false
      let data = []
      const records = this.list = (data = response.data).records
      for (const record of records) {
        const arr = record.deviceImgs || []
        if (!arr.length) {
          continue
        }
        const tmp = []
        arr.forEach(element => {
          element.imgPath = backEndBaseUrl + element.imgPath
          tmp.push(element.imgPath)
        })
        record.imgPaths = tmp
      }
      this.total = data.total
      this.current = data.current
      this.pageSize = data.size
    },
    async queryEntites() {
      this.listLoading = true
      const param = Object.assign({
        current: this.current,
        size: this.pageSize
      }, this.form)
      if (this.searchByRela) {
        Object.assign(param, {
          ownDept: this.powerSupplyCompany,
          ownTransStation: this.powerSupplyAdmin
        })
        getEntityInfos(param).then(resp => this.processEntityInfos(resp))
      } else {
        Object.assign(param, { bounds: this.bounds }, this.center, {
          radius: this.radius * 1000
        })
        getEntityInfosByGis(param).then(resp => this.processEntityInfos(resp))
      }
    },
    getEntityType(key) {
      return entityTypeMap[key] || 'text'
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.queryEntites()
    },
    handleCurrentChange(current) {
      this.current = current
      this.queryEntites()
    },
    showEditPanel(entity) {
      this.displayEditPanel = true
      entity.fileList = entity.fileList || []
      const e = this.selectedEntity = Object.assign({}, entity)
      this.uploadFileList = []
      if (e.deviceImgs && e.deviceImgs.length) {
        for (const img of e.deviceImgs) {
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
          this.displayEditPanel = false
          done()
        })
        .catch(_ => {})
    },

    // 处理文件事件
    handleRemove(file, fileList) {
      deleteDeviceImg(file).then(response => {
        this.queryEntites()
      })
    },
    handlePreview(file) {
      this.queryEntites()
      // console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },

    submitEdit() {
      this.displayEditPanel = false
      // this.$refs["deviceForm"].validate((valid) => {

      //   if (!valid) {
      //     console.log('error submit!!');
      //     return false;
      //   }

      //   this.displayEditPanel = false;
      //   modifyEntityInfo(this.selectedEntity).then(response => {
      //     // console.info(this.selectedEntity);
      //     this.queryEntites();
      //   });
      // })
    },
    getDeptName(key, row) {
      return row[`${key}Name`]
    },
    getDictLabel(dictName, val) {
      for (const dictItem of this[dictName]) {
        if (val == dictItem.value) {
          return dictItem.label
        }
      }
      return val
    }
  }
}

</script>

<style lang="scss" scoped>
  .device-table-container {
    padding: 10px 20px;

    .goBackStep {
      margin-bottom: 10px;
    }

    .bound-item:not(:first-child) {
      margin-left: 20px;
    }
    .table-container {
      // margin-left: 80px;

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

    .deviceForm {
      /deep/ .el-form-item__label {
        height: 40px;
        line-height: 20px;
      }
    }
  }

</style>
