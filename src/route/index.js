//配置路由相关的信息
import VueRouter from 'vue-router'  //导入vue插件  导入之前安装
import Vue from 'vue'

Vue.use(VueRouter)
const publicTask = () => import("../components/Task/PublicTask")
const ConductTask = () => import("../components/Task/ConductTask")
const SupportTask = () => import("../components/Support/SupportTask")
const Course = () => import("../components/Task/Course")
const routes = [
    {
        //缩写
        title: "管理界面",
        path: '/set',
        redirect: '/publicTask',
        meta:{
            //
            title: '管理界面'
        }
    },
    {
        title: "首页",
        path: '/publicTask',
        component: publicTask,
        meta: {
            title: '管理界面'
        },
        children: [
            {
                title:"管理界面",
                path: '/publicTask',
                redirect: '/publicTask/conductTask'
            },
            {
                title: "管理界面",
                path: "/publicTask/conductTask",
                component: ConductTask
            },
            {
                title: "课程中心",
                path: '/publicTask/course',
                component: Course,
            },
            {
                title: "暂无数据",
                path: "/publicTask/test",
                component: ()=>import("../components/Task/Test")
            },
            {
                title: "暂无数据",
                path: "/publicTask/test2",
                component: ()=>import("../components/Task/Test2")
            }
        ]
    },
    {
        title: "首页",
        path: '/',
        component: SupportTask,
        meta:{
            //
            title: '任务详情'
        }
    },
]

//导出对象并设置为HTML5的history模式
const router = new VueRouter({
    routes,
    mode: 'hash',
    // base: '/root/task/api/www',
    // base: '/home/mi2/test/task/www',
})

export default router;