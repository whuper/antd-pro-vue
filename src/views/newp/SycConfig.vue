<template>
  <div class="SycConfig">
    <div class="form-box">
      <h3 class="form-title">版本信息</h3>
      <a-form-model
        layout="horizontal"
        :model="formInline"
        @submit="handleSubmit"
        @submit.native.prevent
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item>
          <a-input v-model="formInline.user" placeholder="序列号">
            <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-input v-model="formInline.password" type="password" placeholder="版本号">
            <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" html-type="submit">
            升级
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>

    <div class="form-box">
      <h3 class="form-title">时间设置</h3>
      <a-form-model layout="inline" :model="formInline" @submit="handleSubmit" @submit.native.prevent>

          <a-radio>手动设置</a-radio>
          <a-radio>自动同步</a-radio>

          
        <a-form-model-item>
          <a-input v-model="formInline.user" >
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-input v-model="formInline.password" >
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" html-type="submit" :disabled="formInline.user === '' || formInline.password === ''">
            升级
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>

    <div class="form-box">
      <h3 class="form-title">授权管理</h3>
    </div>

  </div>
</template>
<script>
export default {
  name: 'SycConfig',
  data() {
    return {
      currentDate: new Date(),
      labelCol: { span: 4 },
      wrapperCol: { span: 8 },
      formInline: {
        user: '',
        password: '',
      },
    }
  },
  created() {},

  methods: {
    handleSubmit(e){

      console.log(e);

    },

  },
}
</script>
<style lang="less" scoped>
.form-box {
  background: #fff;
  form {
    padding:32px;
  }
}
.form-title {
  font-size: 20px;
  color: rgb(51, 51, 51);
  height: 56px;
  line-height: 56px;
  padding-left: 24px;
  border-bottom: 1px solid rgb(204, 204, 204);
}
</style>
