<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色ID">
              <a-input placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
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

    <a-table
    :columns="columns" :data-source="userlist"
    >
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
      <a>编辑{{ record.userName }}</a>
      <a-divider type="vertical" />
      <a>修改密码</a>
      <a-divider type="vertical" />
      <a>删除</a>
    
    </span>
    </a-table>
  </a-card>
</template>

<script>

import { STable } from '@/components'
// import { getRoleList, getServiceList } from '@/api/manage'
// import { PERMISSION_ENUM } from '@/core/permission/permission'

const STATUS = {
  1: '启用',
  2: '禁用'
}

const columns = [
  {
    title: '姓名',
    dataIndex: 'userName',
    key: 'name',
  },
  {
    title: '用户名',
    dataIndex: 'loginName',
    key: 'accountName',
  },
  {
    title: '用户角色',
    dataIndex: 'roleName',
    key: 'role',
  },
  {
    title: '手机号码',
    key: 'phone',
    dataIndex: 'phone'
  },
  {
    title: '人员ID',
    dataIndex: 'roleId',
    key: 'userId',
  },
    {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];


export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    return {
      visible: false,
      form: this.$form.createForm(this),
      permissions: [],
      // 查询参数
      queryParam: {},
      // 表头
      columns,
      userlist:[],
      expandedRowKeys: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {

    this.getRoleList().then(res => {
      
      this.userlist = res.data
    })
  },
  methods: {
   getRoleList(){
     return this.$http.get('user/list')
   },
    handleEdit (record) {
 
    }
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
  }
}
</script>

<style lang="less" scoped>
.permission-form {
  /deep/ .permission-group {
    margin-top: 0;
    margin-bottom: 0;
  }
}

</style>
