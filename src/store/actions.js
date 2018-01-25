import {
  SET_LANGUAGE,
  SET_VIEWER
} from './mutation-types'

const actions = {
  setLanguage: ({ commit }, language) => {
    commit(SET_LANGUAGE, language)
  },
  setViewer: ({ commit }, viewer) => {
    commit(SET_VIEWER, viewer)
  }
}

export default actions
