export default {
  state: {
    backRoute: '/',
    path: '',
    icon: '',
    iframeTabs: false,
    title: 'SuperMap Showcase',
    tabs: []
  },
  set (newState) {
    this.state.title = newState.title || ''
    this.state.path = newState.path || ''
    this.state.icon = newState.icon || ''
    this.state.iframeTabs = newState.iframeTabs || false
    this.state.backRoute = newState.backRoute || '/showcase'
    this.state.tabs = newState.tabs || []
  }
}
