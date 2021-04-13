import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */'../components/login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/home.vue')

const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "Users_rights_Roles" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "Users_rights_Roles" */'../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_rights_Roles" */'../components/power/Roles.vue')

const Cate = () => import(/* webpackChunkName: "Cate_Params" */'../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "Cate_Params" */'../components/goods/Params.vue')

const GoodsList = () => import(/* webpackChunkName: "GoodList_Add" */'../components/goods/List.vue')
const Add = () => import(/* webpackChunkName: "GoodList_Add" */'../components/goods/add.vue')

const Order = () => import(/* webpackChunkName: "Order_Report" */'../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "Order_Report" */'../components/report/Report.vue')



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
    redirect: '/Welcome',
    children:[
    {
      path: '/Welcome',
      component: Welcome,
    },
    {
      path: '/users',
      component: Users,
    },
    {
      path:'/rights',
      component:Rights,
    },
    {
      path:'/roles',
      component:Roles,
    },
    {
      path:'/categories',
      component:Cate,
    },
    {
      path:'/Params',
      component:Params,
    },
    {
      path:'/goods',
      component:GoodsList,
    },
    {
      path:'/goods/add',
      component:Add,
    },
    {
      path:'/orders',
      component:Order,
    },
    {
      path:'/reports',
      component:Report,
    },
  ]
  },


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