import Cookies from 'js-cookie'

let state = {
  language: Cookies.get('language') || 'zh',
  viewer: null
}

export default state
