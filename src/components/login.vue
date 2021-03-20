<!--  -->
<template>
  <div id="login_conter">
    <div id="login_box">
      <div id="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        id="login_form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <el-form-item id="btn">
          <el-button type="primary">立即创建</el-button>
          <el-button type="info" @click="loginFormRef">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //登录数据绑定
      loginForm: {
        username: "admin",
        password: "123456",
      },
      //表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods:{
      loginFormRef(){
         this.$refs.loginFormRef.resetFields();
      }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style  scoped>
#login_box {
  height: 300px;
  width: 450px;
  background-color: aquamarine;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
#avatar_box {
  height: 130px;
  position: absolute;
  width: 130px;
  border: 1px solid #234223;
  border-radius: 50%;
  padding: 10px;
  background-color: dimgray;
  box-shadow: 0 0 10px;
  left: 50%;

  transform: translate(-50%, -50%);
}
#avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
#login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
#btn {
  text-align: center;
}
</style>