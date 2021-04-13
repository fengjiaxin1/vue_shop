<!--  -->
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  添加角色区-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcaenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5"
                ><el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="['bdtop', i1 === 0 ? '' : 'bdtop', 'vcaenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditRoleDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="30%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="addRoleFormDialogClose"
    >
      <el-form
        :model="addRoleForm"
        :rules="editRoleFormRules"
        ref="addRoleFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleFormAction">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色的对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="editRoleFormDialogClose"
    >
      <el-form
        :model="editRoleForm"
        :rules="addRoleFormRules"
        ref="editRoleFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="putEditRoleForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      rightsList: [],
      //控制分配权限对话框显示
      setRightDialogVisible: false,
      //树形控件属性绑定
      treeProps: {
        label: "authName",
        children: "children",
      },
      //tree选中节点的id值数组
      defaultKeys: [],
      //当前即将分配权限的id
      roleId: "",
      //控制添加角色的对话框
      addRoleDialogVisible: false,
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      //添加角色表单验证
      addRoleFormRules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
      //控制编辑角色的对话框
      editRoleDialogVisible: false,
      //保存要修改的角色的信息
      editRoleForm: {
        id: 0,
        roleName: "",
        roleDesc: "",
      },
      //编辑角色表单验证
      editRoleFormRules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.getRolesList();
  },
  methods: {
    //获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.roleList = res.data;
    },
    //根据id删除对应角色的权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("取消删除");
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }

      role.children = res.data;
    },
    //分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;

      const { data: res } = await this.$http.get(`rights/tree`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败");
      }
      this.rightsList = res.data;
      //  console.log(this.rightsList);

      //递归获取权限
      this.getDefaultKeys(role, this.defaultKeys);
      this.setRightDialogVisible = true;
    },
    //通过递归获取当前角色所有三级id并且保存到defaultKeys里
    getDefaultKeys(node, arr) {
      //当前节点不包含children属性，为3级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getDefaultKeys(item, arr);
      });
    },
    //监听分配权限对话框关闭
    setRightDialogClosed() {
      this.defaultKeys = [];
    },
    //给角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("添加权限数据失败");
      }
      this.getRolesList();
      this.$message.success("添加权限数据成功");
    },
    //点击按钮添加角色
    addRoleFormAction() {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) return;
        //校验通过
        const { data: res } = await this.$http.post("roles", this.addRoleForm);

        if (res.meta.status !== 201) {
          return this.$message.error("添加角色失败");
        }
        this.$message.success("添加角色成功");
      });
      this.getRolesList();
      this.addRoleDialogVisible = false;
    },
    //监听添加角色对话框关闭
    addRoleFormDialogClose() {
      this.$refs.addRoleFormRef.resetFields();
      this.addRoleForm.roleName = "";
      this.addRoleForm.roleDesc = "";
    },
    //打开编辑角色的对话框
    async showEditRoleDialog(id) {
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("查询角色失败");
      }
      this.editRoleForm = res.data;
      this.editRoleDialogVisible = true;
      console.log(this.editRoleForm);
    },
    //提交修改的角色信息
    putEditRoleForm() {
      console.log(this.editRoleForm);
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (!valid) return;
        //校验通过
        const { data: res } = await this.$http.put(`roles/${this.editRoleForm.id}`, {roleNmme:this.editRoleForm.roleName,roleDesc:this.editRoleForm.roleDesc});

        if (res.meta.status !== 201) {
          return this.$message.error("修改角色信息失败");
        }
        this.$message.success("修改角色信息成功");
      });
      this.getRolesList();
      this.editRoleDialogVisible = false;
    },
    //监听编辑角色对话框关闭事件
    editRoleFormDialogClose() {
      console.log(this.editRoleForm);
      // this.$refs.editRoleFormRef.resetFields();
      // this.editRoleForm.roleName = "";
      // this.editRoleForm.roleDesc = "";
    },
    //删除角色
    async removeRoleById(id) {
      const confirmR = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //确认删除返回confirm
      //取消就返回cancel
      if (confirmR !== "confirm") {
        return this.$message.info("已取消了删除");
      }

       const { data: res } = await this.$http.delete(`roles/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }

      this.$message.success("删除成功");
      this.getRolesList();
    },
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
/* @import url(); 引入css类 */
.el-tag {
  margin-top: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcaenter {
  display: flex;
  align-items: center;
}
</style>