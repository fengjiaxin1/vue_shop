<template>
    <el-container  id="container" >
      <el-header
        >Header
        <el-button type="info" @click="logout">退出</el-button></el-header
      >
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push({ path: "/login" });
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
/* @import url(); 引入css类 */
#container{
  height: 100%;
}
.el-header {
  background-color: #373d41;
}
.el-aside {
  background-color: #373441;
}
.el-main {
  background-color: #82808a;
}

</style>