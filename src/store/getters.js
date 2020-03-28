const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  title: state => state.settings.title,
  backEndBaseUrl: state => state.settings.backEndBaseUrl,
  searchByRela: state => state.entity.searchByRela,
  supplyCompanies: state => state.entity.supplyCompanies,
  supplyAdmins: state => state.entity.supplyAdmins,
  center: state => state.entity.center,
  radius: state => state.entity.radius,
  bounds: state => state.entity.bounds,
}
export default getters
