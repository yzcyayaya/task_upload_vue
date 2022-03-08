<template>
  <div>
    <el-table
        :data="tableData"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
        :row-class-name="tableRowClassName"
        @row-click="clickRow"
    >
      <el-table-column
          prop="create_date"
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
      ><!--        :formatter="formatter"-->
        <el-button @click="dialogVisible = true">选择</el-button>
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
      ></UploadTask>
      <span slot="footer" class="dialog-footer">
<!--          <el-button @click="dialogVisible = false">取 消</el-button>-->
          <el-button type="primary" @click="fileCommit">确 定</el-button>
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
    fileCommit() {
      this.dialogVisible = false;
    },
    clickRow(row){
      this.rowData.create_date = row.create_date
      this.rowData.over_time = row.over_time
      this.rowData.remain_time = row.remain_time
      this.rowData.assignment_name = row.assignment_name
      this.rowData.course_name = row.course_name
      this.rowData.assignment_describe = row.assignment_describe
    }

  },

  data() {
    return {
      dialogVisible: false,
      rowData:{
        create_date:'',
        over_time:'',
        remain_time:'',
        assignment_name:'',
        course_name:'',
        assignment_describe:'',
        // upload:'',
      },
      countDownList: '00天00时00分00秒',
      tableData: [{
        create_date: '2016-05-02',
        over_time: '2022-01-12 21:00:00',
        remain_time: '00天00时00分00秒',
        assignment_name: 'JAVA第七次作业--个人项目答辩',
        course_name: 'JAVA核心编程',
        assignment_describe: '大家随意发挥就好。',
        // upload: '上传作业',
      }, {
        create_date: '2016-05-04',
        over_time: '2022-02-20 21:00:00',
        remain_time: '00天00时00分00秒',
        assignment_name: '数据库第二次作业--ER图转关系模式',
        course_name: '数据库原理与设计',
        assignment_describe: '将E-R图转换为关系模型实际上就是要将实体、实体的属性和实体之间的联系转化为关系模式。',
        // upload: '上传作业',
      }, {
        create_date: '2016-05-01',
        over_time: '2022-03-20 21:00:00',
        remain_time: '00天00时00分00秒',
        assignment_name: '数据结构第五次作业—树的遍历',
        course_name: '数据结构',
        assignment_describe: '二叉树的遍历概念二叉树的遍历是指按照某种顺序访问二叉树中的每一个结点,使每一个结点都被访问一次且仅被访问一次',
        // upload: '上传作业',
      }, {
        create_date: '2016-05-03',
        over_time: '2016-05-10 21:00:00',
        remain_time: '2022-01-025 21:00:00',
        assignment_name: '操作系统第二次作业---PV操作',
        course_name: '操作系统',
        assignment_describe: 'PV操作是一种实现进程互斥与同步的有效方法。 PV操作与信号量的处理相关，P表示通过的意思，V表示释放的意思',
        // upload: '上传作业',
      }]
    }
  },
  updated() {
    this.countDown();
  },
  beforeCreate() {
    this.$axios.get("api/v1/task/assignment"
    ).then((response)=>{
          this.tableData = response.data.data.item
        }
    )
  }
}
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>