import { Cookies } from 'quasar'

let state = {
  language: Cookies.get('language') || 'zh',
  headerTitle: '范例首页',
  viewer: null
}

export default state
