import Cookies from 'js-cookie'

const state = {
    searchByRela: true,
    supplyCompanies: [], // 市级
    supplyAdmins: [], // 所级

    center: {lng: 116, lat: 27.6},
    bounds: {},
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
  SET_GISINFO: (state, {center, radius, bounds}) => {
    state.center = center;
    state.radius = radius;
    state.bounds = bounds;
  }
}

const actions = {
  setSearchByReal({ commit, dispatcher }, searchByRela) {
    commit('SET_SEARCHBYRELA', searchByRela);
  },
  setSupplyRela({ commit, dispatcher }, {supplyCompanies, supplyAdmins}) {
    commit('SET_SUPPLYRELA', {supplyCompanies, supplyAdmins});
  },
  setGisInfo({ commit, dispatcher }, {center, radius, bounds}) {
    commit('SET_GISINFO', {center, radius, bounds});
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
