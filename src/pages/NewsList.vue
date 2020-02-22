<template>
  <div class="newsList">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table
      :data="newsList"
      style="width: 100%">

      <el-table-column
        label="序号"
        type="index"
        :index="indexMethod">
      </el-table-column>

      <el-table-column
        label="时间"
        sortable
        width="180">
        <template v-slot="{row}">
          <span>{{row.create_date | time}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="user.username"
        label="作者"
        sortable
        width="180">
      </el-table-column>

      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>

      <el-table-column
        label="图片">
        <template v-slot="scope">
          <img class="avatar" :src="$checkURL(scope.row.cover[0].url)">
        </template>
      </el-table-column>

      <el-table-column
        prop=""
        label="操作">
        <!-- 作用域插槽 -->
        <template v-slot="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="pageSize"
        :current-page="pageIndex"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      newsList: [],
      pageSize: 3,
      pageIndex: 1,
      total: 0
    }
  },
  created () {
    this.getNewsList()
  },
  methods: {
    // 文章列表的渲染
    async getNewsList () {
      const res = await this.$axios.get('/post', {
        params: {
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        }
      })
      const { statusCode, data, total } = res.data
      if (statusCode === 200) {
        this.newsList = data
        this.total = total
        console.log(this.newsList)
      }
    },
    // 翻页文章列表的序号叠加
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageIndex - 1)
    },
    // 翻页
    handleCurrentChange (val) {
      this.pageIndex = val
      this.getNewsList()
    },
    // 每页显示的新闻条数改变
    handleSizeChange (val) {
      this.pageIndex = 1
      this.pageSize = val
      this.getNewsList()
    },
    // 点击编辑按钮，页面跳转，并传文章的id过去
    handleEdit (row) {
      console.log(row)
      // 修改文章的路由跳转以及id传值，传了id的代表是编辑，没有传id的代表是新建
      this.$router.push({
        name: 'NewsPublish',
        params: {
          id: row.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-breadcrumb{
  margin-bottom: 10px;
}
.avatar{
  width:200px;
  height: 100px;
}
.block{
  margin-top: 10px;
}
</style>
