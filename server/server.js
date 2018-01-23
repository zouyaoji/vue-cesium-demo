let express = require('express')
var history = require('connect-history-api-fallback')
let app = express()
app.use(history())
app.use(express.static('dist'))
app.listen(8001, function () {
  console.log('服务启动成功: http://localhost:8001')
})
