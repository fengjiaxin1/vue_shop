<template>
  <el-container id="container">
    <el-header
      ><div><img src="../assets/logo.png" alt="" /> 电商后台管理系统</div>
      <el-button type="info" @click="logout">退出</el-button></el-header
    >
    <el-container>
      <el-aside :width="istoggle?'64px':'160px'">
        <el-col >
          <!-- 侧边菜单 -->
          <div id="toggle" @click="toggle">|||</div>
          <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409Eff"
            :unique-opened="true"
            :collapse="istoggle"
            :collapse-transition="false"
            :router="true"
            :default-active="activePath"
          >
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
                <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>

      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList:[],
       iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      istoggle:false,
      activePath:'',
    };
  },
   //生命周期 - 创建完成（访问当前this实例）
  created() {
      this.getMenuList();
      this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {

    //退出功能
    logout() {
      window.sessionStorage.clear();
      this.$router.push({ path: "/login" });
    },
    //获取菜单列表
    async getMenuList(){
        const {data:res}= await this.$http.get('menus');
        if(res.meta.status!==200) return this.$message.error(res.meta.msg);
        this.menuList = res.data;
        console.log(res);
    },

    //菜单折叠和展开
    toggle(){
      this.istoggle = !this.istoggle
    },

    //保存连接的激活状态
    //保存当前菜单index值存到sessionStorage
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath);
      this.activePath = activePath;
      
    }

  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
/* @import url(); 引入css类 */
#container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: aliceblue;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header img {
  height: 40px;
  width: 40px;
}
.el-aside {
  background-color: #545c64;
}
.el-main {
  background-color: #e0f6ea;
}
.el-menu{
  border-right: 0;
}
.iconfont{
  margin-right: 10px;
}
#toggle{
  background-color:#545c64 ;
  color: white;
  text-align: center;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>