//配置路由相关的信息
import VueRouter from 'vue-router'  //导入vue插件  导入之前安装
import Vue from 'vue'

Vue.use(VueRouter)
const publicTask = () => import("../components/Task/PublicTask")
const ConductTask = () => import("../components/Task/ConductTask")
const SupportTask = () => import("../components/Support/SupportTask")
const Course = () => import("../components/Task/Course")
const Login = ()=>import("../components/User/Login")
const routes = [
    {
        //缩写
        title: "管理界面",
        path: '/set',
        redirect: '/login',
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
    {
        title: "登录",
        path: "/login",
        component: Login,
        meta: {
            title: "登录"
        }
    }
]

//导出对象并设置为HTML5的history模式
const router = new VueRouter({
    routes,
    mode: 'hash',
    // base: '/root/task/api/www',
    // base: '/home/mi2/test/task/www',
})

router.beforeEach((to,from,next) => {
    // to: 即将要进入的路由对象
    // from: 即将要离开的路由对象
    // next():是一个函数，在路由拦截中一定要注意调用next()进入下一个步骤，要确保进入next
    // next()- 进入下一个钩子函数，next(false) - 中断当前路由导航，
    const token = sessionStorage.getItem('token')

    if(to.path === '/publicTask/conductTask'||to.path === '/publicTask/course'){        //如果想要跳转home或者algsmanager页面必须判断有没有sessionStorage
        if(token){              //如果有sessionStorage
            next();				//跳转
        }else {
            alert('您还没有登录，请先登录账户');   //没有就先登录
            next('/login')							//还在登录页
        }
    }

    if(to.path === '/login'){				//如果跳转到了登录页面必须清空sessionStorage，否则在地址栏输入路径还是会跳转
        sessionStorage.clear();				//清空sessionStorage
    }
    next();
})

export default router;