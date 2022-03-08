<template>
  <div>
    <div align="right">
      <el-button type="success" @click="clickAddDialogVisible">新增任务</el-button>
    </div>
    <el-table
        :data="tableData"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
        :row-class-name="tableRowClassName"
        @cell-mouse-enter="clickRow"
    >
      <el-table-column
          prop="create_time"
          label="开始时间"
          sortable
          width="160">
      </el-table-column>
      <el-table-column
          prop="over_time"
          label="结束时间"
          sortable
          align="center"
          width="160">
      </el-table-column>
      <el-table-column
          prop="remain_time"
          label="剩余时间"
          sortable
          align="center"
          width="180"
      >
      </el-table-column>
      <el-table-column
          prop="assignment_name"
          label="任务"
          align="center"
          width="280">
      </el-table-column>
      <el-table-column
          prop="course_name"
          label="课程名字"
          align="center"
          width="180">
      </el-table-column>
      <el-table-column
          prop="assignment_describe"
          label="任务描述"
          show-overflow-tooltip
          header-align="center"
          align="center"
          width="580">
      </el-table-column>
      <el-table-column
          align="center"
          label="上传文件"
      >
        <el-button @click="dialogVisible = true" type="info" size="mini">选择</el-button>
      </el-table-column>
      <el-table-column
          prop="assignment_id"
          align="center"
          label="任务操作">
        <div class="el-row--flex">
          <el-button size="mini" style="margin-left:1px;" type="primary" @click="downByTaskAll">下载</el-button>
          <el-button size="mini" style="margin-left:1px;" type="warning" @click="editDialog=true">编辑</el-button>
          <el-button size="mini" style="margin-left:1px;" @click="handleDelete" type="danger">删除</el-button>
        </div>
      </el-table-column>
    </el-table>
    <el-dialog
        title="提示(文件不超过50MB)"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
      <UploadTask
          :course_name="this.rowData.course_name"
          :object_dir="this.rowData.assignment_name"
          :school_year="this.rowData.school_year"
      ></UploadTask>
      <span slot="footer" class="dialog-footer">
<!--          <el-button @click="dialogVisible = false">取 消</el-button>-->
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <div class="page-header">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageUtil.current"
          :page-size="10"
          align="center"
          layout="prev, pager, next, jumper"
          :total="1000">
      </el-pagination>
    </div>
    <el-dialog
        title="请填写新增任务信息"
        :visible.sync="addDialogVisible"
        width="30%"
        :before-close="handleClose"
        center>
      <el-form ref="form" :model="form" label-width="80px">

        <el-form-item label="课程名字"  :change="test" :rules="[{required: true, message: '课程名字不能为空'}]">
          <el-select v-model="form.course_id" placeholder="请选择">
            <el-option
                v-for="item in courses"
                :key="item.course_id"
                :label="item.course_name"
                :value="item.course_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务时间" :rules="[{required: true, message: '任务时间不能为空'}]">
          <el-date-picker
              v-model="form.timeArray"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @on-change="form.timeArray=$event">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务名字" :rules="[{required: true, message: '任务名字不能为空'}]">
          <el-input v-model="form.assignment_name"></el-input>
        </el-form-item>
        <el-form-item label="任务描述" :rules="[{required: true, message: '任务描述不能为空'}]">
          <el-input type="textarea" v-model="form.assignment_describe"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="clickAddAssignment">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="请完成需要修改的任务信息"
        :visible.sync="editDialog"
        width="30%"
        :before-close="handleClose"
        center>
      <el-form ref="form" :model="form" label-width="80px">

        <el-form-item label="任务时间" :rules="[{required: true, message: '任务时间不能为空'}]">
          <div class="el-row--flex">
            <el-date-picker
                v-model="rowData.create_time"
                type="datetime"
                placeholder="开始日期">
            </el-date-picker>
            <span>至</span>
            <el-date-picker
                v-model="rowData.over_time"
                type="datetime"
                placeholder="结束日期">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="任务描述" :rules="[{required: true, message: '任务描述不能为空'}]">
          <el-input type="textarea" v-model="rowData.assignment_describe"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false">取消</el-button>
          <el-button type="primary" @click="handleUpdate(rowData)">确定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>

import UploadTask from "../Upload";

export default {
  name: 'ConductTask',
  components: {UploadTask},
  methods: {
    test(){
      console.log("选择的id" + this.form.course_id);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    tableRowClassName({row, rowIndex}) {
      // console.log(row)
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
    timeFormat(param) {
      return param < 10 ? '0' + param : param;
    },
    countDown(it) {
      this.tableData.forEach((item) => {
        var interval = setInterval(() => {
          // 获取当前时间，同时得到活动结束时间数组
          let newTime = new Date().getTime();
          // 对结束时间进行处理渲染到页面
          let endTime = new Date(item.over_time).getTime();
          let obj = null;
          // 如果活动未结束，对时间进行处理
          if (endTime - newTime > 0) {
            let time = (endTime - newTime) / 1000;
            // 获取天、时、分、秒
            let day = parseInt(time / (60 * 60 * 24));
            let hou = parseInt(time % (60 * 60 * 24) / 3600);
            let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
            let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
            obj = {
              day: this.timeFormat(day),
              hou: this.timeFormat(hou),
              min: this.timeFormat(min),
              sec: this.timeFormat(sec)
            };
          } else { // 活动已结束，全部设置为'00'
            obj = {
              day: '00',
              hou: '00',
              min: '00',
              sec: '00'
            };
            clearInterval(interval);
          }
          item.remain_time = obj.day + '天' + obj.hou + '时' + obj.min + '分' + obj.sec + '秒';
        }, 1000);
      })
    },
    //下载当前任务下所有提交文件并打包压缩
    downByTaskAll() {
      window.open(this.$axios.Url + "api/v1/task/downFiles" + '?' + 'object_name=' + this.rowData.course_name + "/" + this.rowData.assignment_name + '&bucket_name=' + this.rowData.school_year)
    },
    clickRow(row) {
      this.rowData.assignment_id = row.assignment_id
      this.rowData.create_time = row.create_time
      this.rowData.over_time = row.over_time
      this.rowData.remain_time = row.remain_time
      this.rowData.assignment_name = row.assignment_name
      this.rowData.course_name = row.course_name
      this.rowData.assignment_describe = row.assignment_describe
      this.rowData.school_year = row.school_year
    },
    clickAddDialogVisible() {
      this.addDialogVisible = true;
    },
    clickAddAssignment() {
      this.addDialogVisible = false
      let startTime = new Date(this.form.timeArray[0]).toJSON();
      let overTime = new Date(this.form.timeArray[1]).toJSON();
      //格式化去掉 T和Z
      this.form.timeArray[0] = new Date(+new Date(startTime) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, " ")
          .replace(/\.[\d]{3}Z/, "");
      this.form.timeArray[1] = new Date(+new Date(overTime) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, " ")
          .replace(/\.[\d]{3}Z/, "");
      console.log(this.form)
      this.$axios.post("api/v1/task/assignment", {
            course_id: this.form.course_id,
            assignment_name: this.form.assignment_name,
            assignment_describe: this.form.assignment_describe,
            created_time: this.form.timeArray[0],
            over_time: this.form.timeArray[1],
          }
      ).then((response) => {
            // this.courses = response.data.data
          },
      )
    },
    handleDelete(done) {
      this.$confirm('此操作不可逆，确认删除？')
          .then(_ => {
            this.$axios.delete("api/v1/task/assignment/" + this.rowData.assignment_id)
                .then(() => {
                  this.$message({
                    message: '删除成功！',
                    type: 'success'
                  });
                  //更新数据
                  const arr = this.tableData
                  this.tableData = arr.filter((item) => {
                    return item.assignment_id != this.rowData.assignment_id
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
      //格式化时间
      let startTime = new Date(form.create_time).toJSON();
      let overTime = new Date(form.over_time).toJSON();
      //格式化去掉 T和Z
      form.create_time = new Date(+new Date(startTime) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, " ")
          .replace(/\.[\d]{3}Z/, "");
      form.over_time = new Date(+new Date(overTime) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, " ")
          .replace(/\.[\d]{3}Z/, "");
      this.$axios.put("api/v1/task/assignment", {
        assignment_id: form.assignment_id,
        assignment_describe: form.assignment_describe,
        created_time: form.create_time,
        over_time: form.over_time,
      }).then(() => {
        this.$message({
          message: '更新成功！',
          type: 'success'
        });
        //更新数据
        const arr = this.tableData
        arr.forEach((item, i) => {
          if (item.assignment_id == form.assignment_id) {
            arr[i].assignment_describe = form.assignment_describe;
            arr[i].create_time = form.create_time;
            arr[i].over_time = form.over_time;
          }
        })
        this.tableData = arr;
      }).catch(() => {
        this.$message({
          message: '更新失败！',
          type: 'error'
        });
      })
      //对话框消失
      this.editDialog = false
    },
  },
  data() {
    return {
      dialogVisible: false,
      addDialogVisible: false,
      editDialog: false,
      form: {
        course_id: '',
        timeArray: ['', ''],
        assignment_name: '',
        assignment_describe: '',
      },
      courses: [{
        course_id: '',
        course_name: '',
      }],
      rowData: {
        assignment_id: '',
        create_time: '',
        over_time: '',
        remain_time: '',
        assignment_name: '',
        course_name: '',
        assignment_describe: '',
        school_year: ''
      },
      countDownList: '00天00时00分00秒',
      pageUtil: {
        total: 0,
        current: 1,
      },
      tableData: [{
        assignment_id: '',
        create_time: '2016-05-02',
        over_time: '2022-01-12 21:00:00',
        remain_time: '00天00时00分00秒',
        assignment_name: 'JAVA第七次作业--个人项目答辩',
        course_name: 'JAVA核心编程',
        assignment_describe: '大家随意发挥就好。',
      }]
    }
  },
  updated() {
    this.countDown();
  },
  beforeCreate() {
    //任务list
    this.$axios.get("api/v1/task/assignment"
    ).then((response) => {
          this.tableData = response.data.data.item
          this.pageUtil.total = response.data.data.total
        }
    );
    //课程list
    this.$axios.get("api/v1/task/courses"
    ).then((response) => {
          this.courses = response.data.data
        }
    );
  }
}
</script>
<style>
.page-header {
  /*position: absolute;*/
  /*margin-top: 600px;*/
  position: fixed;
  left: 40%;
  bottom: 3%;
  transform: translate(–50%);
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>