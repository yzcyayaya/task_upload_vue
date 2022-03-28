<template>
  <el-upload
      class="upload-demo"
      ref="upload"
      action="#"
      :on-preview="handlePreview"
      :on-exceed="handleExceed"
      :beforeRemove="beforeRemove"
      :on-remove="handleRemove"
      :file-list="fileArr"
      :auto-upload="false"
      :limit="6"
      :on-change="handleUpload"
      align="center"
      multiple>
    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传文件</el-button>
    <div slot="tip" class="el-upload__tip"></div>
  </el-upload>
</template>
<script>
export default {
  name: 'UploadTask',
  props: {
    school_year: String,
    course_name: String,
    object_dir: String,
    active: Number,
  },
  data() {
    return {
      formData: {},
      fileArr: []
    };
  },
  methods: {
    submitUpload() {
      // this.$refs.upload.submit();
      const formData = new FormData();
      this.fileArr.forEach(file=>{
        formData.append("file",  file);
      })
      formData.append("bucket_name", this.school_year);
      //目录格式为 /学期/课程名/任务名
      formData.append("object_dir", this.course_name + "/" + this.object_dir);
      if (formData.get("file") == null) {
        this.$notify({
          title: '未选中文件',
          message: '请求失败！',
          type: 'error'
        });
        //结束
        return
      }
      //三个参数
      this.$axios.post("api/v1/task/file",
          formData
          ,{headers: {'Content-Type': 'multipart/form-data'}}
      ).then(() => {
        this.$notify({
          title: '成功',
          message: '上传成功！',
          type: 'success'
        });
        //步骤条完成
        this.$emit('setActive',3);
        //清空上传成功文件
        this.$refs['upload'].clearFiles();
      }).catch(()=>{
        this.$notify({
          title: '失败',
          message: '上传失败！',
          type: 'error'
        });
      })
    },
    handleRemove(file) {
      this.fileArr.forEach((item,index) => {
        //匹配到的索引
        if(file.uid === item.uid) {
          this.fileArr.splice(index, 1);
        }
      })
      console.log(this.fileArr.length)

      if (this.fileArr.length === 0) {
        //步骤条加载
        this.$emit('setActive',1);
      }
    },
    //点击访问文件
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 6 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    //change
    handleUpload(options) {
      //获取文件流
      this.fileArr.push(options.raw);
      //选中了文件
      if (this.fileArr.length > 0) {
        //步骤条加载
        this.$emit('setActive',2);
      }
    }
  }
}
</script>