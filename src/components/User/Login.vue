<template>
  <div>
    <div>
      <el-form ref="form" :model="form" label-position="left" label-width="0px" class="login-container">
        <el-form-item label="">
          <el-input v-model="form.user_name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="" prop="captcha"
        >
          <div class="el-row--flex">
            <el-input type="captcha" v-model="form.captcha_code" @keyup.enter.native="loginCommit" placeholder="请输入验证码"
                      autocomplete="off"></el-input>
            <el-image :src="url" @click="getCaptcha" draggable="false" placeholder="el-icon-loading"></el-image>
          </div>
        </el-form-item>
        <el-form-item class="">
          <el-button type="primary" size="mini" @click="loginCommit">登录</el-button>
          <el-button size="mini" @click="registerDialog=true">注册</el-button>
          <el-button size="mini" @click="repassDialog=true">找回密码</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
        title="注册用户"
        :visible.sync="registerDialog"
        center
        width="30%">
      <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="100px"
               class="demo-registerForm">
        <el-form-item label="用户名" prop="name" :rules="[{ required: true, message: '用户名不能为空'}]">
          <el-input type="name" v-model="registerForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="registerForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="registerForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <div class="el-row--flex">
            <el-input v-model.number="registerForm.captcha"></el-input>
            <el-image :src="url" @click="getCaptcha" draggable="false" placeholder="el-icon-loading"></el-image>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('registerForm')">提交</el-button>
          <el-button @click="resetForm('registerForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
        title="找回密码"
        :visible.sync="repassDialog"
        width="30%"
        center>
      <span><h1>暂时没有找回密码渠道, 请联系学委.</h1></span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    var checkCaptcha = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('验证码不能为空'));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        } else {
          if ((value + '').length !== 4) {
            callback(new Error('验证码必须为4位数'));
          } else {
            callback();
          }
        }
      }, 1500);
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.registerForm.checkPass !== '') {
          this.$refs.registerForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      form: {
        user_name: "",
        password: "",
        captcha_id: "",
        captcha_code: '',
      },
      //验证码地址
      url: '',
      registerDialog: false,
      repassDialog: false,

      registerForm: {
        name: '',
        pass: '',
        checkPass: '',
        captcha: ''
      },
      rules: {
        pass: [
          {validator: validatePass, trigger: 'blur', required: true}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur', required: true}
        ],
        captcha: [
          {validator: checkCaptcha, trigger: 'blur', required: true}
        ]
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post("/api/v1/user/register", {
              user_name: this.registerForm.name,
              password: this.registerForm.pass,
              captcha_id: this.form.captcha_id,
              captcha_code: this.registerForm.captcha + ''
            }).then((reps) => {
              if (reps.data.status === 20000) {
                this.$notify({
                  title: '错误',
                  message: '验证码错误！',
                  type: 'error'
                });
                this.getCaptcha();
              } else if (reps.data.status === 200) {
                this.$notify({
                  title: '成功',
                  message: '登录成功！',
                  type: 'success'
                });
                this.form = null;
                //隐藏
                this.registerDialog = false;
              } else if (reps.data.status === 10002) {
                this.$notify({
                  title: '错误',
                  message: '用户名已经存在!',
                  type: 'error'
                });
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    };
  },

  methods: {
    //获取或刷新验证码
    getCaptcha() {
      //获取id
      this.$axios.get("api/v1/captchaId"
      ).then((resp) => {
        this.form.captcha_id = resp.data.data
        //根据验证码id申请验证码
        this.url = this.$axios.Url + 'api/v1/captchaCode?captcha_id=' + resp.data.data;
      });
    },
    loginCommit() {
      this.$axios.post("/api/v1/user/login", this.form)
          .then((reps) => {
            if (reps.data.status === 20000) {
              this.$notify({
                title: '错误',
                message: '验证码错误！',
                type: 'error'
              });
              this.getCaptcha();
            } else if (reps.data.status === 200) {
              sessionStorage.setItem("token", reps.data.data.token)
              this.$notify({
                title: '成功',
                message: '登录成功！',
                type: 'success'
              });
              this.form = null;
              this.$router.replace("/publicTask");
            } else if (reps.data.status === 10007) {
              this.$notify({
                title: '错误',
                message: '账号或密码不正确!',
                type: 'error'
              });
            }
          })
    },
  },
  created() {
    this.getCaptcha();
  },

}
</script>

<style lang="scss" scoped>
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;

  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>