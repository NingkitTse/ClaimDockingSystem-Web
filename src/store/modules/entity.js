import Cookies from 'js-cookie'

const state = {
    searchByRela: true,
    supplyCompanies: [], // 市级
    supplyAdmins: [], // 所级

    center: {lng: 116, lat: 27.6},
    radius: 1000,
}

const mutations = {
  SET_SEARCHBYRELA: (state, searchByRela) => {
    state.searchByRela = !!searchByRela;
  },
  SET_SUPPLYRELA: (state, {supplyCompanies, supplyAdmins}) => {
    state.supplyCompanies = supplyCompanies;
    state.supplyAdmins = supplyAdmins;
  },
  SET_GISINFO: (state, {center, radius}) => {
    state.center = center;
    state.radius = radius;
  }
}

const actions = {
  setSearchByReal({ commit }, searchByRela) {
    commit('SET_SEARCHBYRELA', searchByRela);
  },
  setSupplyRela({ commit }, {supplyCompanies, supplyAdmins}) {
    commit('SET_SUPPLYRELA', {supplyCompanies, supplyAdmins});
  },
  setSupplyRela({ commit }, {center, radius}) {
    commit('SET_GISINFO', {center, radius});
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
