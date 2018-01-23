export default {
  categories: [
    {
      title: 'Layer',
      icon: 'layers',
      path: 'layer',
      features: [
        {
          title: 'addTerrainLayer',
          icon: 'terrain',
          path: 'addTerrainLayer'
        },
        {
          title: 'addImageryLayer',
          icon: 'photo',
          path: 'addImageryLayer'
        },
        {
          title: 'addS3MTilesLayer',
          icon: 'drafts',
          path: 'addS3MTilesLayer'
        }
      ]
    },
    {
      title: 'Scene',
      icon: 'global',
      path: 'scene',
      features: [
        {
          title: 'pickPosition',
          icon: 'place',
          path: 'pickPosition'
        }
      ]
    },
    {
      title: 'Query',
      icon: 'search',
      path: 'query',
      features: [
        {
          title: 'queryByOnlineAPI',
          icon: 'language',
          path: 'queryByOnlineAPI'
        },
        {
          title: 'queryBySQL',
          icon: 'web',
          path: 'queryBySQL'
        }
      ]
    },
    {
      title: 'Analysis3D',
      icon: 'global',
      path: 'analysis3D',
      features: [
        {
          title: 'sightline',
          icon: 'layers',
          path: 'sightline'
        },
        {
          title: 'viewshed3D',
          icon: 'layers',
          path: 'viewshed3D'
        },
        {
          title: 'shadowVisibilityQuery',
          icon: 'layers',
          path: 'shadowVisibilityQuery'
        },
        {
          title: 'skyline',
          icon: 'layers',
          path: 'skyline'
        },
        {
          title: 'profile',
          icon: 'layers',
          path: 'profile '
        },
        {
          title: 'projectionImage',
          icon: 'layers',
          path: 'projectionImage'
        },
        {
          title: 'clipByBox',
          icon: 'layers',
          path: 'clipByBox '
        },
        {
          title: 'slopeMap',
          icon: 'layers',
          path: 'slopeMap'
        }
      ]
    },
    {
      title: 'KML&Model',
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
      title: 'someFeatures',
      icon: 'functions',
      path: 'someFeatures',
      features: [
        {
          title: 'locationMaker',
          icon: 'bookmark',
          path: 'featuresOne'
        },
        {
          title: 'measure',
          icon: 'collections',
          path: 'location'
        },
        {
          title: 'flyManager',
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
    showcase: 'Showcase Home'
  }
}
