<template>
  <div class="NewsPublish">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>发布文章</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表单组件 -->
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="form.title" placeholder="请输入文章的标题"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <vue-editor v-model="form.content"></vue-editor>
      </el-form-item>
      <el-form-item label="栏目">
        <el-checkbox-group v-model="form.categories">
          <el-checkbox v-for="item in categoryList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="封面">
        <el-upload
          :action="$axios.defaults.baseURL+'/upload'"
          list-type="picture-card"
          multiple
          :headers="headers"
          :file-list="fileList"
          :on-success="handleSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <!-- file-list作用是图片数据的回显 -->
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="form.type" size="medium">
          <el-radio border :label="1">文章</el-radio>
          <el-radio border :label="2">视频</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="onSubmit">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
export default {
  components: {
    VueEditor
  },
  data () {
    return {
      form: {
        title: '',
        content: '',
        categories: [],
        cover: [],
        type: ''
      },
      categoryList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      headers: {
        Authorization: localStorage.getItem('token')
      },
      newsId: '',
      fileList: []
    }
  },
  created () {
    this.newsId = this.$route.params.id
    console.log('编辑文章的id是', this.newsId)
    this.getCategoryList()
    if (this.newsId) {
      this.getNewsDetail(this.newsId)
    }
  },
  methods: {
    // 渲染category
    async getCategoryList () {
      const res = await this.$axios.get('/category')
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.categoryList = data.filter(item => item.id !== 999)
      }
    },
    // 回显 渲染文章详情
    async getNewsDetail (id) {
      const res = await this.$axios.get(`/post/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        console.log(data)
        // 处理category和cover数据的形式，将他们变成组件需要的数组数据样式
        data.categories = data.categories.map(item => { return item.id })
        this.fileList = data.cover.map(item => {
          return {
            id: item.id,
            url: this.$checkURL(item.url)
          }
        })
        console.log(this.fileList)
        this.form = data
      }
    },
    // 提交文章
    async onSubmit () {
      // 这样处理复选框数据的原因是：如果直接改变form里面的categories的形式，那后期在做编辑功能的时候
      // 复选框就没办法再选了。因为复选框选择的要求是把id值直接存在数组里，而发送请求时需要的categoris
      // 的形式又要数组里面是一个个的对象，所以而这冲突，需要处理后存在新的额data数据中发送请求。
      const data = { ...this.form }
      data.categories = this.form.categories.map(item => {
        return {
          id: item
        }
      })
      // console.log(this.form)
      // const有块级作用域，所以在外面定义
      let url
      if (this.newsId) {
        url = `/post_update/${this.newsId}`
      } else {
        url = '/post'
      }
      console.log(data.title)
      console.log(data.content)

      console.log(data.categories)
      console.log(data.cover)
      console.log(data.type)

      if (data.title && data.content && data.categories.length > 0 && data.cover.length > 0 && data.type) {
        const res = await this.$axios.post(url, data, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        const { statusCode, message } = res.data
        if (statusCode === 200) {
          this.$message(message)
          this.$router.push('/newslist')
        }
        console.log(res)
      } else {
        this.$message('请完善内容')
      }
    },
    // 提交照片成功
    handleSuccess (res, file) {
      const { statusCode, data } = res
      if (statusCode === 200) {
        console.log(data)
        this.form.cover.push({
          id: data.id,
          url: this.$axios.defaults.baseURL + data.url
        })
        console.log(file)
      }
    },
    // 照片移除
    handleRemove (file, fileList) {
      console.log(file, fileList)
      this.form.cover = fileList
    },
    // 图片预览
    handlePictureCardPreview (file) {
      console.log(file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.el-breadcrumb{
  margin-bottom: 10px;
}
.quillWrapper{
  background-color: #fff;
}
::v-deep .ql-editor{
  height:300px;
}
</style>
