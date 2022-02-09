<template>
  <div class="device-manage">
    <h3 class="tab-title">装置管理</h3>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="装置名称">
                <a-input placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary">查询</a-button>
                <a-button style="margin-left: 8px">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-button type="primary" @click="showModal">新增</a-button>
      <a-table :columns="columns" :data-source="devicelist">
        <a slot="name" slot-scope="text">{{ text }}</a>
        <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
        <span slot="tags" slot-scope="tags">
          <a-tag
            v-for="tag in tags"
            :key="tag"
            :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record, '编辑')">编辑</a>
          <a-divider type="vertical" />
          <a @click="showDeleteConfirm(record)">删除</a>
        </span>
      </a-table>
    </a-card>

    <a-modal v-model="deviceformVisible" :title="currentAction" @ok="handleOk">
      <a-form-model :model="deviceform" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="装置名称">
          <a-input placeholder="具有唯一性" v-model="deviceform.name" />
        </a-form-model-item>
        <a-form-model-item label="装置序列号">
          <a-input placeholder="具有唯一性" v-model="deviceform.sn" />
        </a-form-model-item>

        <a-form-model-item label="备注">
          <a-textarea v-model="deviceform.bz" placeholder="请输入备注" :rows="4" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: '装置名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '装置序列号',
    dataIndex: 'sn',
    key: 'sn',
  },
  {
    title: '备注',
    dataIndex: 'bz',
    key: 'bz',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'TableList',
  components: {
    // STable
  },
  data() {
    return {
      deviceformVisible: false,
      form: this.$form.createForm(this),
      permissions: [],
      // 查询参数
      queryParam: {},
      // 表头
      columns,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      devicelist: [],
      expandedRowKeys: [],
      selectedRowKeys: [],
      selectedRows: [],
      currentAction: '新增', //新增，编辑
      currentDevice: {},
      deviceform: {
        name: '', //装置名称
        sn: '', //装置序列号
        bz: '', //备注
      },
    }
  },
  created() {
    this.getDeviceList()
  },
  methods: {
    getDeviceList() {
      this.$http.get('equipment/list').then((res) => {
      this.devicelist = res.data.items
    })
    },
    handleEdit(record, action) {
      this.deviceformVisible = true
      this.currentdevice = record
      this.deviceform = Object.assign(this.deviceform, this.currentdevice)
      this.currentAction = action
    },
    showModal() {
      // this.currentdevice = {}
      this.deviceformVisible = true
    },
    handleOk(e) {
      console.log(e)
      switch (this.currentAction) {
        case '新增':
          //新增
          this.onSubmit()
          break
        case '编辑':
          //修改
          this.toUpdate()
          break
        default:
          break
      }
    },
    onSubmit() {
      this.$http
        .post('/equipment', {
          ...this.deviceform,
        })
        .then((res) => {
          // this.$loading.hide();
          if (res && res.result) {
            // this.clearFormState("currentdevice");
            this.$notification.success({
              message: '成功',
              description: '装置添加成功',
            })
            this.getDeviceList()
            this.deviceformVisible = false
          }
        })
    },
    toUpdate() {
      this.$http
        .put('/equipment', {
          ...this.deviceform,
        })
        .then((res) => {
          if (res && res.result) {
            // this.clearFormState("currentdevice");
            this.$notification.success({
              message: '成功',
              description: '装置修改成功',
            })
            this.getDeviceList()
            this.deviceformVisible = false
          }
        })
    },
    toEditPasswd() {},
    showDeleteConfirm(record) {
      var _this = this
      this.$confirm({
        title: '提示',
        content: '确定删除该装置：' + record.name + '?',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          _this.toDelete(record.id)
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    },
    toDelete(id) {
      this.$http
        .del('device/destory', {
          ids: [id],
        })
        .then((res) => {
          if (res && res.result) {
            // this.clearFormState("currentdevice");
            this.$notification.success({
              message: '成功',
              description: '装置删除成功',
            })
            this.getDeviceList()
          }
        })
    },
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  },
}
</script>

<style lang="less" scoped>
.device-manage {
  background: #fff;
  .tab-title {
    padding: 24px;
    height: 56px;
    line-height: 56px;
    font-size: 20px;
    color: #333;
  }
}
</style>
