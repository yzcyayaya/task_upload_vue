<template>
  <div id="box">
    <el-table
        :data="tableData"
        style="width: 100%">
      <el-table-column
          prop="date"
          label="日期"
      >
      </el-table-column>
      <el-table-column
          prop="name"
          label="姓名"
      >
      </el-table-column>
      <el-table-column
          prop="start"
          label="开始时间"
      >
      </el-table-column>
      <el-table-column
          prop="end"
          label="结束时间"
      >
      </el-table-column>
      <el-table-column
          prop="countdown"
          label="倒计时"
      >
      </el-table-column>

    </el-table>
  </div>
</template>
<script>

export default {
  name: 'test2',
  data() {
    return {
      tableData: [{
        date: 'I ',
        name: '1234456676',
        start: '1590117056',//2020/5/22 11:10:56
        end: '1590117076' ,//2020/5/22 11:11:56
        countdown: ''  //倒计时
      }, {
        date: 'I ',
        name: '1234456676',
        start: '1590117056',//2020/5/22 11:10:56
        end: '1590117066' ,//2020/5/22 11:11:56
        countdown: ''  //倒计时
      }, {
        date: 'I ',
        name: '1234456676',
        start: '1590117056',//2020/5/22 11:10:56
        end: '1590117136' ,//2020/5/22 11:11:56
        countdown: ''  //倒计时
      }, {
        date: 'I ',
        name: '1234456676',
        start: '1590117056',//2020/5/22 11:10:56
        end: '1590117106' ,//2020/5/22 11:11:56
        countdown: ''  //倒计时
      }],
      timer: ''
    }
  },
  methods: {
    init() {
      let i = 0
      this.timer = setInterval(() => {
        i++
        this.tableData.forEach((item,idx) => {
          item.countdown = (item.end - item.start) - i <= 0 ? 0 : (item.end - item.start) - i
        })
        if(this.tableData.every(item => item.countdown == 0)) {
          clearInterval(this.timer)
        }
      },1000)
    },
    countdownTimer(start,end) {

    }

  },
  components: {

  },
  destroyed() {
    clearInterval(this.timer)
  },
  created() {
    this.init()
  }
}
</script>

<style  lang="less" >


</style>