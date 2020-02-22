<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">
        <h1 class="logo">天天新闻</h1>
        <!-- 解决菜单高亮的问题，根据地址栏的变化，不同的菜单，不同的菜单高亮 -->
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" router>
          <el-menu-item index="/newslist">
            <i class="el-icon-menu"></i>
            <span slot="title">文章列表</span>
          </el-menu-item>
          <el-menu-item index="/newspublish">
            <i class="el-icon-document"></i>
            <span slot="title">发布文章</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <img :src="$axios.defaults.baseURL + user.head_img" alt="">
          <div class="nickname">{{user.nickname}}</div>
          <div class="logout" @click="logout">退出</div>
        </el-header>
        <el-main>
          <!-- 嵌套路由的出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: JSON.parse(localStorage.getItem('user'))
    }
  },
  methods: {
    async logout () {
      await this.$confirm('确定退出？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('退出成功!')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        this.$router.push('/Login')
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// 高度问题
.home{
  position: absolute;
  width: 100%;
  height: 100%;
  // 高度问题
  .el-container{
    height: 100%;
  }
  .el-header{
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    img{
      width: 40px;
      height:40px;
      border-radius: 50%;
    }
    .nickname,
    .logout{
      padding-left:5px;
    }
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 60px;
    font-size: 20px;
    color:#555;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
}

</style>
