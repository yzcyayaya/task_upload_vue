<template>
  <div>
    <div align="right">
      <el-button type="success" @click="next">下一步</el-button>
    </div>
    <el-steps :active="active" finish-status="success" simple>
      <el-step title="1 找到对应课程" icon="el-icon-edit"></el-step>
      <el-step title="2 选择文件" icon="el-icon-upload"></el-step>
      <el-step title="3 点击上传服务器" icon="el-icon-success"></el-step>
    </el-steps>
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
          width="">
      </el-table-column>
      <el-table-column
          prop="over_time"
          label="结束时间"
          sortable
          align="center"
          width="">
      </el-table-column>
      <el-table-column
          prop="remain_time"
          label="剩余时间"
          sortable
          align="center"
          width=""
      >
      </el-table-column>
      <el-table-column
          prop="assignment_name"
          label="任务"
          align="center"
          width="">
      </el-table-column>
      <el-table-column
          prop="course_name"
          label="课程名字"
          align="center"
          width="">
      </el-table-column>
      <el-table-column
          prop="assignment_describe"
          label="任务描述"
          show-overflow-tooltip
          header-align="center"
          align="center">
      </el-table-column>
      <el-table-column
          align="center"
          label="上传文件"
          width="170"
      >
        <el-button @click="dialogVisible = true" type="primary" size="mini">选择</el-button>
        <el-button @click="upPersons" type="info" size="mini">查看提交</el-button>
      </el-table-column>
    </el-table>
    <el-dialog
        title="提示(文件名: 班级+名字+学号)"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
      <UploadTask
          :course_name="this.rowData.course_name"
          :object_dir="this.rowData.assignment_name"
          :school_year="this.rowData.school_year"
      ></UploadTask>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
        :visible.sync="viewUpPerson"
        width="30%">
      <div class="el-row--flex">
        <el-descriptions :colon="false" title="已上传人员信息">
          <el-descriptions-item >
            <el-dropdown size="mini">
            <span class="el-dropdown-link">
              查看名字<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
              <el-dropdown-menu v-if="upPerson.upNames==null" slot="dropdown">
                <el-dropdown-item>暂无人员上传</el-dropdown-item>
              </el-dropdown-menu>
              <el-dropdown-menu v-else slot="dropdown">
                <el-dropdown-item :key="index" v-for="(item,index) in upPerson.upNames" command="index">{{item}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :colon="false" title="未上传人员信息">
          <el-descriptions-item >
            <el-dropdown size="mini">
            <span class="el-dropdown-link">
              查看名字<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
              <el-dropdown-menu v-if="upPerson.notUpSName==null" slot="dropdown">
                <el-dropdown-item>已经全部交完</el-dropdown-item>
              </el-dropdown-menu>
              <el-dropdown-menu v-else slot="dropdown">
                <el-dropdown-item :key="index" v-for="(item,index) in upPerson.notUpSName" command="index">{{item}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :colon="false" title="已上传人数占比">
          <el-descriptions-item>
            <el-progress type="circle" :percentage="upPerson.percentage"></el-progress>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
    <div class="page-header">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageUtil.current"
          :page-size="10"
          align="center"
          layout="prev, pager, next, jumper"
          :total="pageUtil.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>

import UploadTask from "../Upload";

export default {
  name: 'ConductTask',
  components: {UploadTask},
  methods: {
    upPersons() {
      this.viewUpPerson = true;
      this.$axios.get("api/v1/task/getNotUploadStudents" + "?bucket_name=" + this.rowData.school_year + "&object_name=" + this.rowData.course_name + "/" + this.rowData.assignment_name)
          .then((r) => {
            this.upPerson = r.data.data
            console.log(this.upPerson)
          })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.$axios.get("api/v1/task/assignment?start_page="+ (val*10-9) +"&size_page=10"
      ).then((response) => {
            console.log(response.data.data)
            this.tableData = response.data.data.item
            this.pageUtil.total = response.data.data.total
          }
      )
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
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    // 业务操作
    hanldeVisiblityChange() {
      if (document.visibilityState === 'hidden') {
        document.title = '不交作业学委会生气~';
        this.controlHeadIcon(require('/public/doubt.png'))
        clearTimeout()
        console.info('ws  hidden>>>关闭定时器');
      }
      else if (document.visibilityState === 'visible') {
        document.title = '欢迎回来!'
        this.controlHeadIcon(require('/public/happy.png'))
        setTimeout(()=>{
          document.title='任务详情'
          this.controlHeadIcon(require('/public/favicon.png'))
        },300)
        console.info('ws  visible>>>启动定时器');
      }
    },
    controlHeadIcon(path){
      var link = document.querySelector("link[rel*='icon']") || document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = path
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  },

  data() {
    return {
      dialogVisible: false,
      viewUpPerson: false,
      upPerson: {
        notUpSName: [],
        upNames: [],
        percentage: 0,
      },
      //步骤条
      active: 0,
      rowData: {
        assignment_id: '',
        create_time: '',
        over_time: '',
        remain_time: '',
        assignment_name: '',
        course_name: '',
        assignment_describe: '',
        school_year: ''
        // upload:'',
      },
      pageUtil: {
        total: 0,
        current: 1,
      },
      countDownList: '00天00时00分00秒',
      tableData: [{
        assignment_id: '',
        create_time: '2016-05-02',
        over_time: '2022-01-12 21:00:00',
        remain_time: '00天00时00分00秒',
        assignment_name: 'JAVA第七次作业--个人项目答辩',
        course_name: 'JAVA核心编程',
        assignment_describe: '大家随意发挥就好。',
        // upload: '上传作业',
      }]
    }
  },
  updated() {
    this.countDown();
  },
  beforeCreate() {
    this.$axios.get("api/v1/task/assignment?start_page=1&size_page=10"
    ).then((response) => {
          console.log(response.data.data)
          this.tableData = response.data.data.item
          this.pageUtil.total = response.data.data.total
        }
    )
  },
  // watch: {
  //   // 如果 `question` 发生改变，这个函数就会运行
  //   question: function (newQuestion, oldQuestion) {
  //     this.answer = 'Waiting for you to stop typing...'
  //     this.debouncedGetAnswer()
  //   }
  // },
  mounted() {
    // 监听当前页面 显示状态
    window.addEventListener('visibilitychange', this.hanldeVisiblityChange);

    // 当页面被销毁时 移除监听
    this.$on('hook:beforeDestroy', () => {
      console.info('ws 我被销毁了, 移除监听>>>');
      window.removeEventListener('visibilitychange', this.hanldeVisiblityChange)
    })
  },

}
</script>
<style>
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}

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