import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home.vue'
const Login = () => import('../components/login.vue')


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
  {
    path: '/home',
    component: Home,
  }

]
  
const router = new VueRouter({
  routes
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
    //to 将要去的路径 
    //from 从那个路径来的
    //next是一个函数 表示放行
    if(to.path === '/login')return next();
    //获取token
    const tokenstr = window.sessionStorage.getItem('token');
    if(!tokenstr) return next('/login')
    next(); 
})

export default router