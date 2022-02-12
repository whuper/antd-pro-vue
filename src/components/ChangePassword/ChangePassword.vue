<template>
  <div class="modal-form-box">
    <a-spin :spinning="loading">
      <a-form-model :model="form" :rules="rules" ref="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-descriptions>
          <a-descriptions-item label="登录名">{{ userInfo.loginName }}</a-descriptions-item>
        </a-descriptions>
        <a-descriptions>
          <a-descriptions-item label="用户名">{{ userInfo.userName }}</a-descriptions-item>
        </a-descriptions>
        <a-form-model-item label="旧密码" prop="oldPassword">
          <a-input type="password" placeholder="请输入旧密码" v-model="form.oldPassword"/>
        </a-form-model-item>
        <a-form-model-item label="新密码" prop="newPassword">
          <a-input type="password" placeholder="请输入新密码" v-model="form.newPassword"/>
        </a-form-model-item>
        <a-form-model-item label="确认密码" prop="rePassword">
          <a-input type="password" placeholder="请输入确认密码" v-model="form.rePassword"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </div>
</template>

<script>
import { LABEL_COL, WRAPPER_COL } from '@/config/uiConfig'
import md5 from 'md5'
import { PASSWORD_PATTERN, VALIDATOR_MSG } from '@/api/validator'
import qs from 'qs'

export default {
  name: 'ChangePassword',
  props: {
    userInfo: {
      type: Object,
      default: null
    }
  },
  data: function() {
    return {
      loading: false,
      form: {
        oldPassword: '',
        newPassword: '',
        rePassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: VALIDATOR_MSG.required, trigger: 'change' }
        ],
        newPassword: [
          { required: true, message: VALIDATOR_MSG.required, trigger: 'change' },
          { pattern: PASSWORD_PATTERN, message: VALIDATOR_MSG.password, trigger: 'change' }
        ],
        rePassword: [
          { required: true, message: VALIDATOR_MSG.required, trigger: 'change' },
          { validator: this.validateConfirmPass }
        ]
      },
      labelCol: LABEL_COL,
      wrapperCol: WRAPPER_COL
    }
  },
  methods: {
    onOk() {
      /**
       * 点击确认时校验
       */
      return this.handleSubmit()
    },
    onCancel() {
      /**
       * 点击取消时的操作
       */
      return new Promise(resolve => {
        resolve(true)
      })
    },
    /**
     * 提交
     */
    handleSubmit() {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve()
          } else {
            reject()
            return false
          }
        })
      }).then(() => {
        const data = {
          userId: this.userInfo.id,
          oldPassword: md5( '@12AQh#909' + md5(this.form.oldPassword)),
          newPassword: md5( '@12AQh#909' + md5(this.form.newPassword))
        }
        return this.$http.post('/sys/user/changePassword', qs.stringify(data), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
          },
        }).then(() => true).finally(() => {
          this.loading = false
        })
      })
    },
    /**
     * 校验确认密码
     * @param rule
     * @param value
     * @param callback
     */
    validateConfirmPass(rule, value, callback) {
      if (value !== this.form.newPassword) {
        callback(new Error(VALIDATOR_MSG.same_password))
      }
      callback()
    }
  }
}
</script>

<style scoped lang="less">

</style>