import Cookies from 'js-cookie'

let mutations = {
  setLanguage (state, language) {
    state.language = language
    Cookies.set('language', language)
  },
  setViewer (state, viewer) {
    state.viewer = viewer
  }
}

export default mutations
