import { getDictList, getDeptList, getDeptListByParentPostcode } from '@/api/dict'

const state = {
    deviceTypes: [],
    useEnvs: [],
    childDeptMap: new Map()
}

// 更新state 中的状态
const mutations = {
  SET_DEVICE_TYPES(state, deviceTypeList) {
    state.deviceTypes = deviceTypeList
  },
  SET_USE_ENVS(state, useEnvs) {
    state.useEnvs = useEnvs
  },
  ADD_CHILD_DEPT_LIST(state, {key, depts}) {
    state.childDeptMap.set(key, depts);
  },
  SET_DEPT_MAP(state, {depts}) {
    for (let dep of depts) {
        state.deptMap.set(dep.postcode, dep);
    }
  },
}

const actions = {
  //  获得设备类型
  getDeviceType({ commit }) {
    return new Promise((resolve, reject)=>{
      const param = {
        type: 'device_type'
      }
      getDictList(param).then((res) => {
        const { data } = res
        const { records } = data;
        if(!records){
          reject('getDict failed')
        } else {
          records.sort((item1, item2) => parseInt(item1.sort) - parseInt(item2.sort))
          commit('SET_DEVICE_TYPES', records)
        }
        resolve("success")
      }).catch((error)=>{
        reject(error)
      })
    })
  },
  getUseEnv({ commit }) {
    return new Promise((resolve, reject)=>{
      const param = {
        type: 'use_env'
      }
      getDictList(param).then((res) => {
        const { data } = res
        const { records } = data;
        if(!records){
          reject('getDict failed')
        } else {
          records.sort((item1, item2) => parseInt(item1.sort) - parseInt(item2.sort))
          commit('SET_USE_ENVS', records)
        }
        resolve("success")
      }).catch((error)=>{
        reject(error)
      })
    })
  },
  addDepts({ commit }, {parentPostcode}) {
    return new Promise((resolve, reject)=>{
        const param = {
          parentPostcode: parentPostcode
        }
        getDeptListByParentPostcode(param).then((res) => {
          const { data } = res
          const { records } = data;
          if(!records){
            reject('getDict failed')
          } else {
            commit('ADD_CHILD_DEPT_LIST', {key: parentPostcode, depts: records});
          }
          resolve("success")
        }).catch((error)=>{
          reject(error)
        })
      })
  },
  getDeptsMap({ commit }) {
    return new Promise((resolve, reject)=>{
        const param = {
        }
        getDeptList().then((res) => {
          const { data } = res
          const { records } = data;
          if(!records){
            reject('getDict failed')
          } else {
            commit('SET_DEPT_MAP', {depts: records});
          }
          resolve("success")
        }).catch((error)=>{
          reject(error)
        })
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}