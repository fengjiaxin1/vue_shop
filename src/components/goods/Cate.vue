<!--商品分类组件  -->
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
        <!-- 表格 -->
        <tree-table
          class="tree-table"
          :data="cateList"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          show-index
          index-text="#"
          border
          :show-row-hover="false"
        >
          <!-- 是否有效 -->
          <template slot="isok" slot-scope="scope">
            <i
              style="color: lightgreen"
              v-if="scope.row.cat_deleted === false"
              class="el-icon-success"
            ></i>
            <i class="el-icon-error" v-else style="color: red"></i>
          </template>
          <!-- 排序 -->
          <template slot="order" slot-scope="scope">
            <el-tag size="mini" type="primary" v-if="scope.row.cat_level === 0"
              >一级</el-tag
            >
            <el-tag
              size="mini"
              type="success"
              v-else-if="scope.row.cat_level === 1"
              >二级</el-tag
            >
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
          <!-- 操作 -->
          <template slot="opt" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
          </template>
        </tree-table>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[3, 5, 10, 15]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              checkStrictly: 'true',
            }"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //请求商品分类数据的参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //商品分类的数据
      cateList: [],
      //总数据条数
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          width: "180px",
        },
        {
          label: "是否有效",
          //表示将当前列定义为模板列
          type: "template",
          //表示当前这一列使用的模板名称
          template: "isok",
        },
        {
          label: "排序",
          //表示将当前列定义为模板列
          type: "template",
          //表示当前这一列使用的模板名称
          template: "order",
        },
        {
          label: "操作",
          //表示将当前列定义为模板列
          type: "template",
          //表示当前这一列使用的模板名称
          template: "opt",
        },
      ],
      //控制添加分类的对话框
      addCateDialogVisible: false,
      //添加分类的表单数据
      addCateForm: {
        //将要添加分类的名称
        cat_name: "",
        cat_pid: 0,
        //默认1级分类
        cat_level: 0,
      },
      //添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      //添加分类表单的父级列表
      parentCateList: [],
      //指定级联选择器的配置对象
      casecaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //选中的父级分类的id数组
      selectKeys: [],
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }

      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    //监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    //监听pagenum改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    //展示添加分类的对话框
    showAddCateDialog() {
      this.getParentCatList();
      this.addCateDialogVisible = true;
    },
    //重置对话框表单
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields();
      this.selectKeys = [];
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    //获取父级分类的数据列表
    async getParentCatList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级数据失败");
      }

      this.parentCateList = res.data;
    },
    //添加分类中父级分类发生变化
    parentCateChanged() {
      //如果selectKeys数组的length大于0，证明选中了父级分类
      //反之，就说明没有选中任何父级分类
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
          this.addCateForm.cat_level =this.selectKeys.length;
          return
      }
     else{
        this.addCateForm.cat_pid = 0;
         this.addCateForm.cat_level= 0;

     }
     
    },

    addCate(){
      this.$refs.addCateFormRef.validate( async valid=>{
        //如果表单校验没通过，直接退出
        if(!valid) return

        const { data: res } = await this.$http.post("categories", this.addCateForm);
         if (res.meta.status !== 201) {
           return this.$message.error("添加分类失败");
       }
          this.$message.success("添加分类成功");
          this.getCateList();
          this.addCateDialogVisible = false;
      })
           

    }
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
/* @import url(); 引入css类 */
.el-button {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>