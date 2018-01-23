import { Cookies } from 'quasar'

let state = {
  language: Cookies.get('language') || 'zh',
  viewer: null
}

export default state
