import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('../components/login.vue')

//const Login = () => import('../components/login.vue')
Vue.use(VueRouter)

const routes = [
  //login
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
  },

]

const router = new VueRouter({
  routes
})

export default router