const actions = {
  setLanguage: ({ commit }, language) => {
    commit('setLanguage', language)
  },
  setViewer: ({ commit }, viewer) => {
    commit('setViewer', viewer)
  }
}

export default actions
