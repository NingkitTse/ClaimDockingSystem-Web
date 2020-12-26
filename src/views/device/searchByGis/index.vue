<template>
  <div class="search-by-gis">
    <el-form ref="gisForm" class="gis-form" :model="gisForm" :rules="gisFormRules" label-width="110px">
      <!-- <el-form-item v-if="bounds" label="边界信息">
        <div class="bound-item">
          界面西经： <span>{{ bounds.Zd || "" }}</span>
        </div>
        <div class="bound-item">
          界面东经： <span>{{ bounds.Xd || "" }}</span>
        </div>
        <div class="bound-item">
          界面北纬： <span>{{ bounds.Ne || "" }}</span>
        </div>
        <div class="bound-item">
          界面南纬： <span>{{ bounds.Je || "" }}</span>
        </div>
      </el-form-item> -->
      <el-form-item label="中心点经度(°)" prop="lng">
        <el-input v-model="gisForm.lng" type="text" placeholder="请输入中心点经度" />
      </el-form-item>
      <el-form-item label="中心点纬度(°)" prop="lat">
        <el-input v-model="gisForm.lat" type="text" placeholder="请输入中心点纬度" />
      </el-form-item>
      <el-form-item label="搜索半径(km)" prop="radius">
        <el-input v-model="gisForm.radius" type="text" placeholder="请输入搜索半径" />
      </el-form-item>
      <el-button-group class="btn-group">
        <el-button type="" @click="preStep()">上一步</el-button>
        <el-button type="success" @click="nextStep()">下一步</el-button>
      </el-button-group>
    </el-form>
    <!-- <baidu-map
      class="map-div"
      :center="gisForm"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      @ready="handlerMapInitHouseDetail"
      @click="getMapClickInfo"
    /> -->
  </div>
</template>
<script>
import store from '@/store'
import {
  handlerMapInit,
  getMapClickInfo,
  CircleOverlay
} from '@/utils/bMapUtil'
import {
  lngValidator,
  latValidator,
  radiusValidator
} from '@/assets/rule/entityRule'

const zoomArr = ['50', '100', '200', '500', '1000', '2000', '5000', '10000', '20000', '25000', '50000',
  '100000', '200000',
  '500000', '1000000', '2000000'
] // 级别18到3;
export default {
  data() {
    return {
      zoom: 15,
      lastZoom: 15,
      radius: 2,
      bounds: {},
      map: {},
      circle: {},
      center: {
        lng: 111.67,
        lat: 27.7
      },
      gisForm: {
        lng: '111.67',
        lat: '27.7',
        radius: 2
      },
      gisFormRules: {
        radius: { validator: radiusValidator, trigger: 'change' },
        lng: [{ required: true, message: '请填写经度', trigger: 'change' }, { validator: lngValidator, trigger: 'change' }],
        lat: [{ required: true, message: '请填写纬度', trigger: 'change' }, { validator: latValidator, trigger: 'change' }]
      }
    }
  },
  watch: {
    // gisForm: {
    //   handler(val, newVal) {
    //     this.repaintCircle()
    //   },
    //   deep: true
    // },
    // center() {
    //   this.gisForm.lng = this.center.lng + ''
    //   this.gisForm.lat = this.center.lat + ''
    //   // this.repaintCircle();
    // },
    // zoom() {
    //   this.repaintCircle()
    // }
  },
  created() {
    this.$store.dispatch('entity/setSearchByReal', false)
  },
  methods: {
    preStep() {
      this.$router.back(-1)
    },
    nextStep() {
      this.$refs['gisForm'].validate((valid) => {
        if (valid) {
          const center = this.center
          const radius = this.gisForm.radius
          const bounds = this.bounds
          this.$store.dispatch('entity/setGisInfo', { center, radius, bounds })
          this.$router.push('./deviceTable')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 地图相关
    handlerMapInit,
    getMapClickInfo,
    handlerMapInitHouseDetail({
      BMap,
      map
    }) {
      const center = this.center
      handlerMapInit.call(this, {
        BMap,
        map,
        center
      })
      this.map = map
      var top_left_control = new BMap.ScaleControl({
        anchor: BMAP_ANCHOR_TOP_LEFT
      }) // 左上角，添加比例尺
      var top_left_navigation = new BMap.NavigationControl() // 左上角，添加默认缩放平移控件
      var top_right_navigation = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        type: BMAP_NAVIGATION_CONTROL_SMALL
      }) // 右上角，仅包含平移和缩放按钮
      map.addControl(top_left_control)
      map.addControl(top_left_navigation)
      map.addControl(top_right_navigation)

      this.marker.setAnimation(BMAP_ANIMATION_BOUNCE) // 跳动的动画

      map.addEventListener('zoomend', ({
        eventType,
        target
      }) => {
        //   console.info("After zoom, bounds:", this.map.getBounds(), ". zoom: ", this.map.getZoom())
        this.bounds = this.map.getBounds()

        const lastZoom = this.zoom
        let zoom = this.map.getZoom()
        zoom = zoom < 3 ? 3 : zoom
        const lastScale = zoomArr[18 - lastZoom]
        const scale = zoomArr[18 - zoom]

        this.gisForm.radius = this.gisForm.radius * scale / lastScale
        this.lastZoom = lastZoom
        this.zoom = zoom
      })
      this.bounds = this.map.getBounds()
    },
    repaintCircle() {
      const circle = this.circle
      if (!circle) {
        return
      }
      circle.setCenter(this.center)
      // console.info("lastScale: ", lastScale, "scale: ", scale, "radius: ", radius)
      circle.setRadius(this.gisForm.radius * 1000)
    }
  }
}

</script>
<style lang="scss" scoped>
  .search-by-gis {
    display: flex;

    .btn-group {
      margin-left: 20px;
    }

    .gis-form {
      padding: 10px;
      margin-top: 22px;
    }
  }

  .map-div {
    width: 100%;
    height: 700px;
    margin: 10px;
  }

</style>
