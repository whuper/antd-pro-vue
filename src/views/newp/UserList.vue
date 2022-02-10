<template>
  <div class="user-manage">
    <h3 class="tab-title">帐号管理</h3>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="角色ID">
                <a-input placeholder="请输入" />
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
      <a-button type="primary" @click="showModal">新增</a-button>
      <a-table :columns="columns" :data-source="userlist"  rowKey="id">
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
          <a @click="handleEdit(record, '编辑用户')">编辑</a>
          <!-- {{ record.userName }} -->
          <a-divider type="vertical" />
          <a @click="handleEdit(record, '修改密码')">修改密码</a>
          <a-divider type="vertical" />
          <a @click="showDeleteConfirm(record)">删除</a>
        </span>
      </a-table>
    </a-card>

    <a-modal v-model="userformVisible" :title="currentAction" @ok="handleOk">
      <a-form-model :model="userform" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="姓名">
          <a-input v-model="userform.userName" />
        </a-form-model-item>
        <a-form-model-item label="用户名">
          <a-input :disabled="currentUser.id && currentUser.id.length > 0" v-model="userform.loginName" />
        </a-form-model-item>
        <a-form-model-item label="用户角色">
          <a-radio-group v-model="userform.uiRole">
            <a-radio value="2"> 工作负责人 </a-radio>
            <a-radio value="3"> 审计员 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item v-show="!currentUser.id" label="密码设置">
          <a-input v-model="userform.password" type="password" />
        </a-form-model-item>
        <a-form-model-item v-show="!currentUser.id" label="确认密码">
          <a-input v-model="userform.rePassword" type="password" />
        </a-form-model-item>
        <a-form-model-item label="人员ID">
          <a-input v-model="userform.bh" />
        </a-form-model-item>
        <a-form-model-item label="手机号码">
          <a-input v-model="userform.phone" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <a-modal v-model="pwdformVisible" :title="currentAction" @ok="handleOk">
      <a-form-model :model="userform" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="姓名">
          <a-input disabled v-model="userform.userName" />
        </a-form-model-item>
        <a-form-model-item label="用户名">
          <a-input disabled v-model="userform.loginName" />
        </a-form-model-item>

        <a-form-model-item label="新密码">
          <a-input v-model="userform.password" type="password" />
        </a-form-model-item>
        <a-form-model-item label="确认密码">
          <a-input v-model="userform.rePassword" type="password" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { STable } from '@/components'
import md5 from 'md5'
// import { getRoleList, getServiceList } from '@/api/manage'
// import { PERMISSION_ENUM } from '@/core/permission/permission'

const STATUS = {
  1: '启用',
  2: '禁用',
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
    dataIndex: 'phone',
  },
  {
    title: '人员ID',
    dataIndex: 'bh',
    key: 'userId',
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
    STable,
  },
  data() {
    return {
      userformVisible: false,
      pwdformVisible: false,
      form: this.$form.createForm(this),
      permissions: [],
      // 查询参数
      queryParam: {},
      // 表头
      columns,
      userlist: [],
      expandedRowKeys: [],
      selectedRowKeys: [],
      selectedRows: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      currentAction: '新增', //新增，编辑用户，// 修改密码
      currentUser: {},
      userform: {
        userName: '', //姓名
        loginName: undefined, //用户名
        uiRole: '2', //用户角色 str
        password: '',
        phone: '', //手机号码
        bh: '', // 人员id
        addStatus: true,
        adminAuditor: false,
      },
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.$http.get('user/list').then((res) => {
        this.userlist = res.data
      })
    },
    handleEdit(record, action) {
      if (action == '修改密码') {
        this.pwdformVisible = true
      } else {
        this.userformVisible = true
      }
      this.currentUser = record
      this.userform = Object.assign(this.userform, this.currentUser)
      this.userform.uiRole = String(this.currentUser.roles[0])
      this.currentAction = action
    },
    showModal() {
      // this.currentUser = {}
      this.userformVisible = true
    },
    handleOk(e) {
      console.log(e)
      switch (this.currentAction) {
        case '新增':
          //新增
          this.onSubmit()
          break
        case '编辑用户':
          //修改
          this.toUpdate()
          break
        case '修改密码':
          this.toEditPasswd()
          break
        default:
          break
      }
    },
    onSubmit() {
      this.userform.password = md5('@12AQh#909' + md5(this.userform.password))
      this.userform.roles = [String(this.userform.uiRole)]
      this.$http
        .post('/user/create', {
          ...this.userform,
        })
        .then((res) => {
          // this.$loading.hide();
          if (res && res.result) {
            // this.clearFormState("currentUser");
            this.$notification.success({
              message: '成功',
              description: '账户添加成功',
            })
            this.getUserList()
            this.userformVisible = false
          }
        })
    },
    toUpdate() {
      this.$http
        .put('/user/edit', {
          id: this.userform.id,
          userName: this.userform.userName,
          roles: [String(this.userform.uiRole)],
          bh: this.userform.bh,
          phone: this.userform.phone,
          loginName: this.userform.loginName,
        })
        .then((res) => {
          if (res && res.result) {
            // this.clearFormState("currentUser");
            this.$notification.success({
              message: '成功',
              description: '账户修改成功',
            })
            this.getUserList()
            this.userformVisible = false
          }
        })
    },
    toEditPasswd() {},
    showDeleteConfirm(record) {
      var _this = this
      this.$confirm({
        title: '提示',
        content: '确定删除该用户：' + record.userName + '?',
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
    toDelete(id){      
       this.$http
        .del('user/destory', {
          ids: [id],
        })
        .then((res) => {
          if (res && res.result) {
            // this.clearFormState("currentUser");
            this.$notification.success({
              message: '成功',
              description: '账户删除成功',
            })
            this.getUserList()
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
    userformVisible: function (val) {
      if (!val) {
        console.log('清空 currentUser')
        this.currentUser = {}
      }
    },
  },
}
</script>

<style lang="less" scoped>
.user-manage {
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
