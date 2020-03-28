<template>
  <div class="search-by-gis">
    <el-form ref="gisForm" class="gis-form" label-width="100px">
      <el-form-item label="边界信息" v-if="bounds">
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
      </el-form-item>
      <el-form-item label="中心点经度(°)">
        <el-input v-model="center.lng" placeholder="请输入中心点经度"></el-input>
      </el-form-item>
      <el-form-item label="中心点纬度(°)">
        <el-input v-model="center.lat" placeholder="请输入中心点纬度"></el-input>
      </el-form-item>
      <el-form-item label="搜索半径(m)">
        <el-input v-model="radius" type="number" placeholder="请输入搜索半径"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="nextStep()">下一步</el-button>
      </el-form-item>
    </el-form>
    <baidu-map class="map-div" :center="center" :zoom="zoom" @ready="handlerMapInitHouseDetail" @click="getMapClickInfo"
      :scroll-wheel-zoom='true'>
    </baidu-map>
  </div>
</template>
<script>
  import store from '@/store'
  import {
    handlerMapInit,
    getMapClickInfo,
    CircleOverlay
  } from '@/utils/bMapUtil'


  const zoomArr = ["50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000", "50000",
    "100000", "200000",
    "500000", "1000000", "2000000"
  ] //级别18到3;
  export default {
    data() {
      return {
        zoom: 15,
        lastZoom: 15,
        center: {
          lng: 111.67,
          lat: 27.7
        },
        radius: 2000,
        bounds: {},
        map: {},
        circle: {},
      }
    },
    created() {
      this.$store.dispatch('entity/setSearchByReal', false);
    },
    methods: {
      nextStep() {
          let center = this.center;
          let radius = this.radius;
          let bounds = this.bounds;
          this.$store.dispatch('entity/setGisInfo', {center, radius, bounds});
          this.$router.push('./deviceTable')
      },
      // 地图相关
      handlerMapInit,
      getMapClickInfo,
      handlerMapInitHouseDetail({
        BMap,
        map
      }) {
        let center = this.center;
        handlerMapInit.call(this, {
          BMap,
          map,
          center
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
          //   console.info("After zoom, bounds:", this.map.getBounds(), ". zoom: ", this.map.getZoom())
          this.bounds = this.map.getBounds();

          let lastZoom = this.zoom;
          let zoom = this.map.getZoom();
          zoom = zoom < 3 ? 3 : zoom;
          let lastScale = zoomArr[18 - lastZoom];
          let scale = zoomArr[18 - zoom];

          this.radius = this.radius * scale / lastScale;
          this.lastZoom = lastZoom;
          this.zoom = zoom;
        });
        this.bounds = this.map.getBounds();
      },
      repaintCircle() {
        let circle = this.circle;
        if (!circle) {
          return;
        }
        circle.setCenter(this.center);
        // console.info("lastScale: ", lastScale, "scale: ", scale, "radius: ", radius)
        circle.setRadius(this.radius)
      }
    },
    watch: {
      center() {
        this.repaintCircle();
      },
      zoom() {
        this.repaintCircle();
      }
    }
  }

</script>
<style lang="scss" scoped>
  .search-by-gis {
    display: flex;

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
