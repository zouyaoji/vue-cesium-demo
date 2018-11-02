const app = {
  state: {
    cesiumInstance: null
  },
  mutations: {
    SET_CESIUMINSTANCE (state, cesiumInstance) {
      state.cesiumInstance = cesiumInstance
    }
  },
  actions: {
    async setCesiumInstance ({
      commit
    }, cesiumInstance) {
      commit('SET_CESIUMINSTANCE', cesiumInstance)
    }
  }
}

export default app
