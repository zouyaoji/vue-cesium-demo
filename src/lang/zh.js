export default {
  categories: [
    {
      title: '图层',
      icon: 'layers',
      path: 'layer',
      features: [
        {
          title: '地形',
          icon: 'terrain',
          path: 'addTerrainLayer'
        },
        {
          title: '影像',
          icon: 'photo',
          path: 'addImageryLayer'
        },
        {
          title: '三维缓存',
          icon: 'drafts',
          path: 'addS3MTilesLayer'
        }
      ]
    },
    {
      title: '场景',
      icon: 'global',
      path: 'scene',
      features: [
        {
          title: '位置信息',
          icon: 'place',
          path: 'pickPosition'
        }
      ]
    },
    {
      title: '查询',
      icon: 'search',
      path: 'query',
      features: [
        {
          title: '在线检索',
          icon: 'language',
          path: 'queryByOnlineAPI'
        },
        {
          title: '属性查询',
          icon: 'web',
          path: 'queryBySQL'
        }
      ]
    },
    {
      title: '三维分析',
      icon: 'global',
      path: 'analysis3D',
      features: [
        {
          title: '通视分析',
          icon: 'layers',
          path: 'sightline'
        },
        {
          title: '可视域分析',
          icon: 'layers',
          path: 'viewshed3D'
        },
        {
          title: '阴影分析',
          icon: 'layers',
          path: 'shadowVisibilityQuery'
        },
        {
          title: '天际线分析',
          icon: 'layers',
          path: 'skyline'
        },
        {
          title: '剖面分析',
          icon: 'layers',
          path: 'profile '
        },
        {
          title: '视频投放',
          icon: 'layers',
          path: 'projectionImage'
        },
        {
          title: 'Box裁剪',
          icon: 'layers',
          path: 'clipByBox '

        },
        {
          title: '坡度坡向分析',
          icon: 'layers',
          path: 'slopeMap'
        }
      ]
    },
    {
      title: 'KML&模型',
      icon: 'global',
      path: 'scenes',
      features: [
        {
          title: '分层设色',
          icon: 'layers',
          path: 'position'
        },
        {
          title: '三维分析',
          icon: 'layers',
          path: 'position'
        }
      ]
    },
    {
      title: '一些功能',
      icon: 'functions',
      path: 'someFeatures',
      features: [
        {
          title: '定位标注',
          icon: 'bookmark',
          path: 'featuresOne'
        },
        {
          title: '量算',
          icon: 'collections',
          path: 'location'
        },
        {
          title: '飞行',
          icon: 'collections',
          path: 'outputSceneToFile'
        },
        {
          title: '分层设色',
          icon: 'collections',
          path: 'location'
        }
      ]
    }
  ],
  nav: {
    showcase: '范例首页'
  }
}
