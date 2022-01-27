<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="装置名称">
              <a-input placeholder="请输入"/>
            </a-form-item>
          </a-col>
<!--           <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col> -->
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
    :columns="columns" :data-source="devicelist"
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
      <a>编辑{{ record.name }}</a>
      <a-divider type="vertical" />
      <a>删除</a>
    
    </span>
    </a-table>
  </a-card>
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
];


export default {
  name: 'TableList',
  components: {
    // STable
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
      devicelist:[],
      expandedRowKeys: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {

    this.getRoleList().then(res => {
      
      this.devicelist = res.data.items
    })
  },
  methods: {
   getRoleList(){
     return this.$http.get('equipment/list')
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
