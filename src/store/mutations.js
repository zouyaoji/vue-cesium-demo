import { Cookies } from 'quasar'
import { SET_LANGUAGE, SET_HEADER_TITLE, SET_VIEWER } from './mutation-types'

let mutations = {
  [SET_LANGUAGE] (state, language) {
    Cookies.set('language', language)
    state.language = language
  },
  [SET_HEADER_TITLE] (state, title) {
    state.headerTitle = title
  },
  [SET_VIEWER] (state, viewer) {
    state.viewer = viewer
  }
}

export default mutations
