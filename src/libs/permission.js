let permission = {

}

permission.check = function (config) {
  if (config.permission && config.permission.length > 0) {
    let needPermissions = config.permission
    let permissions = JSON.parse(localStorage.getItem('permission'))
    let hasPermission = permissions.some(s => {
      return needPermissions.indexOf(s) > -1
    })
    if (!hasPermission === 0) {
      return false
    }
  }
  return true
}

export default permission
