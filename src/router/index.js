import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/Login.vue'
import Home from '../pages/Home'
import NewsList from '../pages/NewsList'
import NewsPublish from '../pages/NewsPublish'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/Home' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      { path: '/newslist', component: NewsList, name: 'NewsList' },
      { path: '/newspublish', component: NewsPublish, name: 'NewsPublish' }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // console.log('to', to)
  const token = localStorage.getItem('token')
  if (to.path !== '/login') {
    if (token) {
      next()
    } else {
      router.push('/login')
    }
  } else {
    next()
  }
})

export default router
