<template>
  <div class="container">
    <div class="wrap">
      <img class="logo-login" src="../../assets/logo/login_logo.png" />
      <div class="login-product">{{ app.productName }}</div>
      <a-form class="login-form" @submit="onSubmit" :form="form">
        <a-form-item>
          <a-input
            autocomplete="autocomplete"
            size="large"
            placeholder="请输入登录名"
            v-decorator="['name', {rules: [{ required: true, message: '请输入登录名', whitespace: true}]}]"
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            size="large"
            placeholder="请输入密码"
            autocomplete="autocomplete"
            type="password"
            v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button :loading="logging" style="width: 100%;margin-top: 16px" size="large" htmlType="submit" type="primary">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import { timeFix } from '@/utils/util'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      logging: false,
      error: '',
      systemName: '',
      form: this.$form.createForm(this)
    }
  },
  created() {
  },
  computed: {
    ...mapState(['app'])
  },
  methods: {
    ...mapActions(['Login','GenerateRoutes','SyncInfo']),
    ...mapMutations(['SET_NAME', 'SET_ROLES', 'SET_INFO']),
    onSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true
          const userName = this.form.getFieldValue('name')
          const password = md5( '@12AQh#909' + md5(this.form.getFieldValue('password')))
          this.Login({userName, password}).then(this.afterLogin).finally(() => this.logging = false)
        }
      })
    },
async afterLogin(res) {

    console.log('afterLogin');


          // 等待同步完路由信息
          this.$nextTick(() => {
            this.$router.push('/')
          })
          // 延迟 1 秒显示欢迎信息
          setTimeout(() => {
            this.$notification.success({
              message: '欢迎',
              description: `${timeFix()}，欢迎回来`,
            })
          }, 500)
     
      },
/*     async afterLogin(res) {
      const loginRes = res
      if (loginRes) {
        const translatedInfo = await this.SyncInfo(loginRes);
        this.GenerateRoutes(translatedInfo.data).then( value => {
          // 等待同步完路由信息
          this.$nextTick(() => {
            this.$router.push('/admin')
          })
          // 延迟 1 秒显示欢迎信息
          setTimeout(() => {
            this.$notification.success({
              message: '欢迎',
              description: `${timeFix()}，欢迎回来`,
            })
          }, 500)
        })
      }
    }, */
    onClose() {
      this.error = false
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: #f0f2f5;
  background-image: url('../../assets/images/login_bg.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100%;
  .wrap{
    position: absolute;
    left: 50%;
    top: 20.8%;
    transform: translateX(-50%);
    padding: 0 55px;
    width: 440px;
    height: 420px;
    box-shadow: 1px 4px 6px 2px rgba(0, 0, 0, 0.24);
    border-radius: 4px;
    background: #fff;
    text-align: center;
    .logo-login {
      margin: 32px 0 5px;
      max-height: 80px;
    }
    .login-product {
      position: relative;
      left: -25%;
      width: 150%;
      color: #333;
      font-size: 32px;
    }
    .login-form{
      margin-top: 40px;
      text-align: left;
    }
  }
}
</style>
