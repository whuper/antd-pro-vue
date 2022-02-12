<template>
  <a-spin :spinning="loading">
    <a-form-model :model="deviceForm" :rules="rules" ref="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="装置名称" prop="name">
        <a-input placeholder="具有唯一性" v-model="deviceForm.name"/>
      </a-form-model-item>
      <a-form-model-item label="装置序列号" prop="sn">
        <a-input placeholder="具有唯一性" v-model="deviceForm.sn"/>
      </a-form-model-item>

      <a-form-model-item label="备注">
        <a-textarea v-model="deviceForm.bz" placeholder="请输入备注" :rows="4"/>
      </a-form-model-item>
    </a-form-model>
  </a-spin>
</template>

<script>
import { INT_VALIDATOR, VALIDATOR_MSG } from '@/api/validator'
import { LABEL_COL, WRAPPER_COL } from '@/config/uiConfig'
import pick from 'lodash.pick'
import { DeviceListService } from '@/views/demo/deviceListService'

export default {
  name: 'DeviceEdit',
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data: function() {
    return {
      loading: false,
      deviceForm: {
        id: '',
        name: '', //装置名称
        sn: '', //装置序列号
        bz: '' //备注
      },
      rules: {
        name: [
          { required: true, message: VALIDATOR_MSG.required, trigger: 'change' }
        ],
        sn: [
          { required: true, message: VALIDATOR_MSG.required, trigger: 'change' },
          { validator: INT_VALIDATOR }
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
      }).then(() => this.record ? DeviceListService.edit(this.deviceForm) : DeviceListService.create(this.deviceForm))
        .then(() => true)
        .finally(() => {
          this.loading = false
        })

    }
  },
  mounted() {
    // 如果有传入值，则显示传入的值
    this.record && Object.assign(this.deviceForm, this.record)
  }
}
</script>

<style scoped lang="less">

</style>