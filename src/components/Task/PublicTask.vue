<template>
  <div>
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
      <!-- 遍历菜单 -->
      <template v-for="item in menuList">
        <!-- 含有子菜单 -->
        <template v-if="item.children">
          <!-- 第一层 含有子菜单菜单 -->
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i></i>
              <span slot="title">{{ item.title }}</span>
            </template>

            <!-- 第二层 子菜单遍历 -->
            <template v-for="subItem in item.children">

              <!-- 第三层 子菜单含有子菜单 -->
              <el-submenu
                  v-if="subItem.children"
                  :index="subItem.index"
                  :key="subItem.index"
              >
                <template slot="title">
                  <i></i>
                  <span slot="title">{{ subItem.title }}</span>
                </template>
                <el-menu-item
                    v-for="(threeItem, i) in subItem.children"
                    :key="i"
                    :index="threeItem.index"
                    @click="addTab(threeItem.title,threeItem.index,threeItem.route)"
                >
                  <i></i>
                  <span slot="title">{{ threeItem.title }}</span>
                </el-menu-item>
              </el-submenu>
              <!-- 子菜单不含子菜单 -->
              <el-menu-item
                  v-else
                  :index="subItem.index"
                  :key="subItem.index"
                  @click="addTab(subItem.title,subItem.index,subItem.route)"
              >
                <i></i>
                <span slot="title">{{ subItem.title }}</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>

        <!-- 第一层 不含子菜单  -->
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index" @click="addTab(item.title,item.index,item.route)">
            <i></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
    <el-tabs @tab-click="handleClick" v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
      <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="index"
          :label="item.title"
          :name="item.name"
      >
      </el-tab-pane>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </el-tabs>

  </div>

</template>


<script>

export default {
  name: "PublicTask",
  data() {
    return {

      editableTabsValue: '1',
      isCollapse: true,
      editableTabs: [{
        title: '任务中心',
        name: '1',
        route: '/publicTask/conductTask'
      }, {
        title: '课程中心',
        name: '3',
        route: '/publicTask/course'
      }],
      tabIndex: 2,
      activeIndex: '1',
      activeName: 'first',
      route: {
        publicTask: "/publicTask/conductTask"
      },
      menuList: [
        {
          title: '任务中心',
          index: '1',
          route: '/publicTask/conductTask'
        },
        {
          title: '课程中心',
          index: '3',
          route: '/publicTask/course'
        },
        // {
        //   title: '查看课程',
        //   index: '2',
        //   route: '',
        //   children: [{
        //     title: '第一学期',
        //     index: '2-1',
        //     children: [{
        //       index: '2-1-1',
        //       title: '操作系统',
        //       route: '/publicTask/test'
        //     }, {
        //       index: '2-1-2',
        //       title: '数据结构',
        //       route: '/publicTask/test2'
        //     }, {
        //       index: '2-1-3',
        //       title: '数据库原理',
        //       route: ''
        //     }
        //     ]
        //   },
        //     {
        //       title: '选项2',
        //       index: '2-2',
        //       route: ''
        //     },
        //     {
        //       title: '选项3',
        //       index: '2-3',
        //       route: ''
        //     },
        //     {
        //       title: '选项4',
        //       index: '2-4',
        //       route: '',
        //       children: [
        //         {
        //           index: '2-4-1',
        //           title: '选项1',
        //           route: ''
        //         }, {
        //           index: '2-4-2',
        //           title: '选项2',
        //           route: ''
        //         }, {
        //           index: '2-4-3',
        //           title: '选项3',
        //           route: '',
        //         }
        //       ]
        //     }
        //   ]
        // },

      ]
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      // this.$router.push("/publicTask/conductTask");
      console.log(key, keyPath)

    },
    //已知bug,删掉任务中心，会出现问题
    handleClick(tab) {
      // console.log(tab)
      // console.log(tab.$options.propsData.label);
      this.editableTabs.forEach((item) => {
        if (item.title == tab.label && this.$route.path != item.route) {
          console.log("tabs : item", item.route)
          this.editableTabsValue = item.name
          //跳转路由
          this.$router.push(item.route)
        }
      })
      // if (this.$route.path == "/publicTask/conductTask") {
      //   console.log("已经在了，无需跳转")
      // } else {
      //   console.log(tab, event);
      //   this.$router.push("/publicTask/conductTask");
      // }
    },
    addTab(targetName, index, route) {
      console.log(targetName)
      //当前页面
      let isReturn = false
      // if(this.$route.path == route) return
      //遍历导航栏
      this.editableTabs.forEach((item) => {
        if (item.title == targetName) {
          console.log("tabs : item", item)
          this.editableTabsValue = item.name
          //跳转路由
          this.$router.push(item.route)
          //判断当前标签页是否操作
          isReturn = true
        }
      })
      if (!isReturn) {
        console.log(123)
        this.editableTabs.push({
          title: targetName,
          name: index,
          route: route
        });
        this.editableTabsValue = index;
        //跳转路由
        this.$router.push(route)
      }
    },
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      // let title = ""
      // let route = ""
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
              // title = nextTab.title;
              // route = nextTab.route;
            }
          }
        });
      }
      console.log(activeName)
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      console.log(this.editableTabs)
      // this.addTab(title, activeName, route);
    },
  }
}


</script>

<style scoped>

</style>