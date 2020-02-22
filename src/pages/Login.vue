<template>
  <div class="home">
    <el-form ref="form" :model="form" label-width="80px">
      <h1 class="title">欢迎登陆ttNews</h1>
      <el-form-item label="账号">
        <el-input v-model="form.username" placeholder="请输入用户名" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" clearable show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login" @keyup.enter="login">登陆</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      if (this.username === '') {
        return this.$message.error('用户名不能为空')
      } else if (this.password === '') {
        return this.$message.error('密码不能为空')
      }
      console.log('submit!')
      const res = await this.$axios.post('/login', this.form)
      console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // 把个人信息和token存在缓存中以供home页面使用
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        this.$message.success('登陆成功')
        this.$router.push('/')
      } else {
        this.$message.error('用户名或密码错误')
      }
    },
    reset () {
      this.form.username = ''
      this.form.password = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form{
  .title{
    text-align: center;
    padding-bottom: 50px;
  }
  width: 400px;
  padding: 50px 100px;
  border: 1px solid #ccc;
  margin: 100px auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
</style>
