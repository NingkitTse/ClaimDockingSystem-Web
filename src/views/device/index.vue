<template>
  <div class="deviceInfo">
    <h1>设备信息补充</h1>
    <el-button-group class="btn-group">
      <el-button @click="showUploadPanel()">上传设备经纬度信息</el-button>
    </el-button-group>
    <h1>设备信息查找</h1>
    <div>
      您可以按照提示步骤搜索设备信息。
    </div>
    <el-button-group class="btn-group">
      <el-button @click="searchByRela()">通过组织关系查找设备</el-button>
      <el-button @click="searchByGis()">通过GIS地图查找设备</el-button>
    </el-button-group>

    <el-dialog title="设备信息补充" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <p v-if="!uploadComplete">
        <span :class="{'danger': notifyType == 'SINGLE_FAILED'}">
        {{ uploadMsg }}
        </span>
      </p>
      <p v-else>
        <el-table :data="uploadEntities" style="width: 100%" height="450">
          <el-table-column prop="entityId" label="EntityId" width="350">
          </el-table-column>
          <el-table-column prop="longitude" label="经度">
          </el-table-column>
          <el-table-column prop="latitude" label="纬度">
          </el-table-column>
          <el-table-column class-name="status-col" label="处理状态" width="110" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.success | statusFilter">{{ scope.row.success ? '成功' : '失败' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注">
          </el-table-column>
        </el-table>
      </p>
      <el-upload class="upload-demo" ref="upload" :action="backEndBaseUrl + '/entity/uploadGisInfo'"
        :on-preview="handlePreview" :limit="1" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false"
        :headers="{'X-Token': getToken()}" accept=".xls">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" :disabled="disableUpload" size="small" type="success"
          @click="submitUpload">上传到服务器</el-button>
        <el-button size="small" @click="downloadTemplate()">下载样例</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls文件，且不超过1mb</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUploadPanel()">关 闭</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
  import {
    backEndBaseUrl,
    webSocketUrl
  } from "@/settings"
  import {
    getToken
  } from '@/utils/auth' // get token from cookie
  import {
    uploadGisInfo
  } from '@/api/entity'

  export default {
    data() {
      return {
        backEndBaseUrl,
        dialogVisible: false,
        fileList: [],
        disableUpload: false,
        uploadMsg: "",
        notifyType: "",
        uploadComplete: false,

        uploadEntities: [],
        successList: [],
        failureList: [],
        total: 0,
        successNum: 0,
        failNum: 0
      }
    },
    created() {
      // 重新选择时，清除上一次记录的gis地图
      sessionStorage.removeItem("current_org_no");
      this.initWebSocket();
    },
    destroyed() {
      this.websock.close() //离开路由之后断开websocket连接
    },
    methods: {
      getToken,
      showUploadPanel() {
        this.dialogVisible = true;
        this.uploadMsg = "";
        this.uploadComplete = false;
        this.disableUpload = false;
        this.fileList = [];
      },
      closeUploadPanel() {
        this.dialogVisible = false;
        this.uploadMsg = "";
        this.uploadComplete = false;
      },
      submitUpload() {
        this.$refs.upload.submit();
        this.disableUpload = true;
        this.uploadComplete = false;
      },
      handleRemove(file, fileList) {
        // console.log(file, fileList);
      },
      handlePreview(file) {
        
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      searchByRela() {
        this.$router.push("./searchDeviceByRela")
      },
      searchByGis() {
        this.$router.push("./searchDeviceByGis")
      },
      handleClose() {
        this.$confirm('确认关闭？')
          .then(_ => {
            this.dialogVisible = false;
            done();
          })
          .catch(_ => {});
      },
      downloadTemplate() {
        window.open(`${backEndBaseUrl}/static/entityinfo.xls`);
      },
      initWebSocket() { //初始化weosocket
        this.websock = new WebSocket(`${webSocketUrl}/${getToken()}`);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen() { //连接建立之后执行send方法发送数据
        let actions = {
          "msg": "Hello there~"
        };
        this.websocketsend(JSON.stringify(actions));
      },
      websocketonerror() { //连接建立失败重连
        this.initWebSocket();
      },
      websocketonmessage(e) { //数据接收
        let json = JSON.parse(e.data);
        if (!json || !json.notifyType) {
          return;
        }
        let notifyInfo = json.notifyInfo;
        this.notifyType = json.notifyType;
        switch (json.notifyType) {
          case "SINGLE_PROCESS":
            this.uploadMsg = `正在处理${notifyInfo.entityId}`
            break;
          case "SINGLE_SUCCESS":
            this.uploadMsg = `${notifyInfo.entityId}, 处理成功`
            break;
          case "SINGLE_FAILED":
            this.uploadMsg = `${notifyInfo.entityId}, 处理失败, 原因：${json.msg}`
            break;
          case "SUCCEED":
            this.uploadComplete = true;
            this.disableUpload = false;
            this.successList = notifyInfo.successList;
            this.failureList = notifyInfo.failureList;
            this.uploadEntities = [...this.successList, ...this.failureList];
            this.total = notifyInfo.total;
            this.successNum = notifyInfo.successNum;
            this.failNum = notifyInfo.failNum;
            break;
          case "FAILURE":
            this.disableUpload = false;
            this.uploadMsg = `处理失败, 原因：${json.msg}`
            break;
        }
        // console.info(json);
      },
      websocketsend(Data) { //数据发送
        this.websock.send(Data);
      },
      websocketclose(e) { //关闭
        console.log('断开连接', e);
      },
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          true: 'success',
          false: 'danger',
        }
        return statusMap[status]
      }
    },
  }

</script>

<style lang="scss" scoped>
  .deviceInfo {
    margin: 10px;

    .btn-group {
      margin-top: 10px;
    }

    span.danger {
      color: red;
    }
  }
</style>
