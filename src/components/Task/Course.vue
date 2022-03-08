<template>
  <div>
    <div align="right">
      <el-button type="success" @click="addDialogVisible=true">新增课程</el-button>
    </div>
    <el-table
        :data="tableData"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
        :row-class-name="tableRowClassName"
        @cell-mouse-enter="clickRow"
    >
      <el-table-column
          prop="school_year"
          label="学期"
      >
      </el-table-column>
      <el-table-column
          prop="course_name"
          label="课程名字"
          align="center"
      >
      </el-table-column>
      <el-table-column
          prop="course_teacher"
          label="课程老师"
          align="center"
      >
      </el-table-column>
      <el-table-column
          prop="course_describe"
          label="课程描述"
          show-overflow-tooltip
          header-align="center"
          align="center"
          width="580">
      </el-table-column>
      <el-table-column
          prop="course_id"
          align="center"
          label="课程操作">
        <div>
          <el-button size="mini" style="margin-left:1px;" type="warning" @click="editDialogVisible=true">编辑</el-button>
          <el-button size="mini" style="margin-left:1px;" type="danger" @click="handleDelete">删除</el-button>
        </div>
      </el-table-column>
    </el-table>
    <el-dialog
        title="请填写新增的课程信息"
        :visible.sync="addDialogVisible"
        width="30%"
        :before-close="handleClose"
        center>
      <el-form ref="form" :model="form" label-width="80px">

        <el-form-item label="学期" :rules="[{required: true, message: '学期不能为空'}]">
          <el-select v-model="form.school_year" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程名字" :rules="[{required: true, message: '课程名字不能为空'}]">
          <el-input v-model="form.course_name"></el-input>
        </el-form-item>
        <el-form-item label="教师名字" :rules="[{required: true, message: '教师名字不能为空'}]">
          <el-input v-model="form.course_teacher"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="clickAddCourse">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="请完成需要修改的课程信息"
        :visible.sync="editDialogVisible"
        width="30%"
        :before-close="handleClose"
        center>
      <el-form ref="form" :model="form" label-width="80px">

        <el-form-item label="学期" :rules="[{required: true, message: '学期不能为空'}]">
          <el-select v-model="rowData.school_year" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程名字" :rules="[{required: true, message: '课程名字不能为空'}]">
          <el-input v-model="rowData.course_name"></el-input>
        </el-form-item>
        <el-form-item label="教师名字" :rules="[{required: true, message: '教师名字不能为空'}]">
          <el-input v-model="rowData.course_teacher"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdate(rowData)">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Course",
  data() {
    return {
      addDialogVisible: false,
      editDialogVisible: false,
      tableData: [{
        course_id: '',
        course_name: '',
        course_teacher: '',
        school_year: '',
        // upload: '上传作业',
      }],
      rowData: {
        course_id: '',
        course_name: '',
        course_teacher: '',
        school_year: '',
      },
      form: {
        course_name: '',
        course_teacher: '',
        school_year: '',
      },
      options: [{
        value: 'first-semester',
        label: '第一学期'
      }, {
        value: 'second-semester',
        label: '第二学期'
      }, {
        value: 'third-semester',
        label: '第三学期'
      }, {
        value: 'fourth-semester',
        label: '第四学期'
      }, {
        value: 'fifth-semester',
        label: '第五学期'
      }, {
        value: 'sixth-semester',
        label: '第六学期'
      }, {
        value: 'seventh-semester',
        label: '第七学期'
      }, {
        value: 'eighth-semester',
        label: '第八学期'
      }],
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      // console.log(row)
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
    clickRow(row) {
      console.log(row)
      this.rowData.course_id = row.course_id
      this.rowData.course_name = row.course_name
      this.rowData.course_teacher = row.course_teacher
      this.rowData.school_year = row.school_year
    },
    clickAddCourse() {
      this.addDialogVisible = false
      this.$axios.post("api/v1/task/course", this.form).then(() => {
        this.$message({
          message: '新增成功！',
          type: 'success'
        });
        //新增完成之后置于空
        this.form = null;
      }).catch(() => {
        this.$message({
          message: '新增失败！',
          type: 'error'
        });
      })
    },
    handleDelete(done) {
      this.$confirm('此操作不可逆，确认删除？')
          .then(_ => {
            this.$axios.delete("api/v1/task/course/" + this.rowData.course_id)
                .then(() => {
                  this.$message({
                    message: '删除成功！',
                    type: 'success'
                  });
                  //更新数据
                  const arr = this.tableData
                  this.tableData = arr.filter((item) => {
                    return item.course_id != this.rowData.course_id
                  });
                }).catch(() => {
              this.$message({
                message: '删除失败！',
                type: 'error'
              });
            })
            //点击确定之后
            done();
          })
          .catch(_ => {
          });
    },
    handleUpdate(form) {
      this.$axios.put("api/v1/task/course", {
        course_id: form.course_id,
        school_year: form.school_year,
        course_name: form.course_name,
        course_teacher: form.course_teacher,
      }).then(() => {
        this.$message({
          message: '更新成功！',
          type: 'success'
        });
        //更新数据
        const arr = this.tableData
        arr.forEach((item, i) => {
          if (item.course_id == form.course_id) {
            arr[i].course_name = form.course_name;
            arr[i].course_teacher = form.course_teacher;
            arr[i].school_year = form.school_year;
          }
        })
        this.tableData = arr;
      }).catch(() => {
        this.$message({
          message: '更新失败！',
          type: 'error'
        });
      })
      //置空
      this.form = null
      //对话框消失
      this.editDialogVisible = false
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
  },
  beforeCreate() {
    this.$axios.get("api/v1/task/courses"
    ).then((response) => {
          console.log(response)
          this.tableData = response.data.data
        }
    )
  }
}
</script>

<style scoped>

</style>