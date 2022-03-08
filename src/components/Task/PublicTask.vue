<template>
  <div>
    <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
      <el-menu-item index="1">任务中心</el-menu-item>

      <!--    <el-submenu index="2">-->
      <!--      <template slot="title">我的工作台</template>-->
      <!--      <el-menu-item index="2-1">选项1</el-menu-item>-->
      <!--      <el-menu-item index="2-2">选项2</el-menu-item>-->
      <!--      <el-menu-item index="2-3">选项3</el-menu-item>-->
      <!--      <el-submenu index="2-4">-->
      <!--        <template slot="title">选项4</template>-->
      <!--        <el-menu-item index="2-4-1">选项1</el-menu-item>-->
      <!--        <el-menu-item index="2-4-2">选项2</el-menu-item>-->
      <!--        <el-menu-item index="2-4-3">选项3</el-menu-item>-->
      <!--      </el-submenu>-->
      <!--    </el-submenu>-->
      <!--    <el-menu-item index="3" disabled>消息中心</el-menu-item>-->
      <!--    <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>-->
    </el-menu>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="正在进行任务" name="first">
        <router-view></router-view>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>

</template>


<script>
export default {
  name: "PublicTask",
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1',
      activeName: 'first'
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClick(tab, event) {
      console.log(tab, event);
      this.$router.push("/publicTask/hell");
    }
  }
}


</script>

<style scoped>

</style>