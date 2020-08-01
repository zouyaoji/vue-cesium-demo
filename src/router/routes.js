import categories from 'pages/showcase/categories'

const appRouter = [{ path: '/', name: 'home_index', component: () => import('pages/Index') }]

const showcase = {
  path: '/showcase',
  component: () => import('layouts/MainLayout'),
  children: [
    {
      path: '',
      component: () => import('pages/showcase/Showcase'),
      meta: {
        title: 'categories.showcase',
        hash: '/showcase',
        icon: 'layers',
        backRoute: '/'
      }
    }
  ]
}

function component (path, config) {
  return {
    path,
    meta: config,
    component: () => import('pages/showcase/' + path)
  }
}

categories.forEach(category => {
  if (category.extract) {
    return
  }

  category.features.forEach(feature => {
    const path = category.path + '/' + feature.path

    if (!feature.children) {
      showcase.children.push(component(path, feature))
    }
  })
})

appRouter.push(showcase)
appRouter.push({
  path: '*',
  name: '404',
  component: () => import('pages/Error404')
})

export default [...appRouter]
