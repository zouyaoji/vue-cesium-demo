
import categories from '@/pages/showcase/categories'

function load (component) {
  return () => import(`@/${component}.vue`)
}

const appRouter = [{ path: '/', name: 'home_index', component: load('pages/Index') }]

let showcase = {
  path: '/showcase',
  component: load('layouts/ShowcaseLayout'),
  children: [
    {
      path: '',
      component: load('pages/showcase/Showcase'),
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
    component: load('pages/showcase/' + path)
  }
}

categories.forEach(category => {
  if (category.extract) {
    return
  }

  category.features.forEach(feature => {
    let path = category.path + '/' + feature.path

    if (!feature.children) {
      showcase.children.push(component(path, feature))
    }
  })
})

appRouter.push(showcase)
appRouter.push({
  path: '*',
  name: '404',
  component: load('pages/Error404')
})

export const routes = [...appRouter]
