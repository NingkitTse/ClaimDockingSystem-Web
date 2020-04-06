<template>
  <div class="echarts-map">
    <div id="map-container" :style="{height:'800px',width:'100%'}" ref="myEchart"></div>
  </div>
</template>

<script>
  import echarts from "echarts";
  import { MessageBox, Message } from 'element-ui'
  import {
    getDeptInfo
  } from "@/api/dict";
  let vm = {};
  export default {
    data() {
      return {
        currentOrg: {
          "orgLevel": "province",
          "childs": []
        },
        lastOrg: [],
        orgMap: new Map(),
        mapContainer: {},
        form: {
          powerSupplyCompany: "",
          powerSupplyAdmin: "",
        }
      }
    },
    created() {

    },
    mounted() {
      vm = this;
      let topPostcode = 430000;
      this.mapContainer = document.getElementById("map-container");

      // 如果是从table界面过来，加上上一次的选项
      let currentOrgNoObjStr = sessionStorage.getItem("current_org_no");
      if (currentOrgNoObjStr) {
        let obj = JSON.parse(currentOrgNoObjStr);
        if (obj && obj.postcode) {
          this.loadMap(obj.postcode);
          return;
        }
      }
      this.loadMap(topPostcode);
      
    },
    methods: {
      loadMap(postcode) {
        getDeptInfo(postcode).then(data => {
          if (data.code != 20000 || null == data.data) {
            Message({message: "暂不支持查看该区域。", type: 'error'})
            return;
          }
          let realData = data.data;
          this.lastOrg.push(Object.assign({}, this.currentOrg));
          let currentOrg = this.currentOrg = realData;
          sessionStorage.setItem("current_org_no", JSON.stringify(currentOrg));
          if (currentOrg.childs) {
            for (let child of currentOrg.childs) {
              this.orgMap.set(child.postcode, child);
            }
          }
          this.$http.get(`static/${currentOrg.resPath}`).then(data => {
            data = data.data;
            let markdata = this.convertData(data.features);
            this.createMap(data, markdata);
          })
        })
      },
      convertData(features) {
        var markdata = [];
        for (var i = 0; i < features.length; i++) {
          let feature = features[i];
          markdata.push({})
          markdata[i].coord = feature.properties.center;
          markdata[i].name = feature.properties.name;

          let postcode = markdata[i].postcode = feature.id || i + 1;
          let child = this.orgMap.get(this.getQualifiedPostcode(this.currentOrg, postcode));
          let enable = markdata[i].enable = child ? !!child.enableFlag : false;
          markdata[i].color = enable ? "#95CFFF" : '#ddd';
          markdata[i].value = enable ? 1 : 0;
          markdata[i].orgNo = child ? child.orgNo : '';
        }
        return markdata;
      },
      getQualifiedPostcode(currentOrg, postcode) {
        switch (currentOrg.orgLevel) {
          case "province":
            return postcode;
          case "city":
          case "county":
            return currentOrg.postcode + postcode;
        }
      },
      createMap(data, markdata) {
        echarts.registerMap('demo', data);
        var mapEcharts = echarts.init(this.mapContainer);
        mapEcharts.setOption({
          color: '#95CFFF',
          geo: {
            textStyle: {
              fontSize: "50%"
            }
          },
          dataRange: {
            show: false,
            min: 0, //颜色区间的最小值
            max: 1, //颜色区间的最大值，和data中的最大值一致
            x: 'left',
            y: 'bottom',
            text: ['High', 'Low'],
            //text: ['高', '低'], // 文本，默认为数值文本
            calculable: true,
            inRange: {
              color: ['#999', '#2A7FD2']
            },
            splitList: markdata.map((e) => {
              return e.color
            }),
            itemWidth: '0' //5
          },
          tooltip: {
            show: true,
            formatter: '{b}',
            formatter: function (param) {
              let data = param.data;
              let flag = !!data.enable ? "启用" : "未启用";
              return `${data.name}<br/>${flag}`;
            },
            textStyle: {
              fontSize: "100%"
            }
          },
          toolbox: {
            padding: 30,
            show: true,
            feature: {
              mark: {
                show: true
              },
              saveAsImage: {
                show: true
              },
              //敲黑板，重点！！！
              myTool2: { //自定义按钮 danielinbiti,这里增加，selfbuttons可以随便取名字    
                show: this.currentOrg.orgLevel != "province", //是否显示    
                title: '返回上一级', //鼠标移动上去显示的文字    
                icon: 'path://M789.12 818.016s-5.632 14.496-13.12 0c0 0-83.808-252.896-288.064-189.216v78.496s-3.264 46.144-43.52 16.096l-200.832-173.376s-42.592-23.168 2.592-54.88l202.976-174.4s30.528-21.76 37.856 13.92l0.224 84.704c0 0.064 380.704 18.304 301.888 398.656z', //图标
                onclick: function () { //点击事件,这里的option1是chart的option信息
                  vm.loadMap(vm.lastOrg.pop().postcode);
                }
              }
            }
          },
          series: [{
            type: 'map',
            map: 'demo',
            zoom: 1.2,
            itemStyle: {
              normal: {
                label: {
                  show: true
                },
                borderColor: '#FFFFFF',
                areaColor: ["#AAA"]
              },
              emphasis: {
                label: {
                  show: true
                }
              },
            },
            label: {
              normal: {
                textStyle: {
                  fontSize: "125%",
                  color: '#FFFFFF'
                },
                formatter: function (param) {
                  let data = param.data;
                  return `${data.name}`;
                }
              }
            },
            data: markdata,
          }]
        });
        mapEcharts.off('click');
        mapEcharts.on('click', function (e) {
          console.info(e);
          let data = e.data;
          let postcode = data.postcode;
          let submitPostcode = postcode;
          let enable = data.enable;
          if (!enable) {
            Message({message: "暂不支持查看该区域。", type: 'error'})
            return;
          }
          switch (vm.currentOrg.orgLevel) {
            case "province":
              vm.loadMap(submitPostcode);
              break;
            case "city":
              submitPostcode = vm.currentOrg.postcode + postcode;
              getDeptInfo(submitPostcode).then(data => {
                if (data.code != 20000 || null == data.data) {
                  Message({message: "暂不支持查看该区域。", type: 'error'})
                    return;
                  }
                  let realData = data.data;
                  // vm.currentOrg = realData;
                  vm.form.powerSupplyCompany = submitPostcode;
                  vm.loadMap(submitPostcode);
              })
              break;
            case "county":
              // submitPostcode = vm.currentOrg.postcode + postcode;
              vm.form.powerSupplyAdmin = data.orgNo;
              vm.$store.dispatch('entity/setSupplyRela', {
                powerSupplyCompany: vm.form.powerSupplyCompany,
                powerSupplyAdmin: vm.form.powerSupplyAdmin
              }).then(res => {
                vm.$router.push("./deviceTable");
              });
              break;
          }
        })
      }
    },
  }

</script>

<style lang="scss" scoped>

</style>
