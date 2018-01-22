export default {
  categories: [
    {
      title: '图层',
      icon: 'layers',
      path: 'layres',
      children: [
        {
          title: '地形',
          icon: 'layers',
          path: 'terrain'
        },
        {
          title: '影像',
          icon: 'collections',
          path: 'image'
        }
      ]
    },
    {
      title: '场景',
      icon: 'layers',
      path: 'scenes',
      children: [
        {
          title: '位置信息',
          icon: 'layers',
          path: 'position'
        }
      ]
    },
    {
      title: '功能测试',
      icon: 'functions',
      path: 'functions',
      children: [
        {
          title: '刘桔伍',
          icon: 'bookmark',
          path: 'makeMarker'
        },
        {
          title: '地名搜索定位',
          icon: 'collections',
          path: 'location'
        },
        {
          title: '地图打印',
          icon: 'collections',
          path: 'outputSceneToFile'
        }
      ]
    }
  ]
}
