<template>
  <div class="device-manage">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="装置名称">
                <a-input v-model="queryParam.name" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => {
                  this.queryParam = {};
                  $refs.table.refresh(true);
                }">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-operator">
        <a-button type="primary" @click="add">新增</a-button>
        <a-button @click="batchDelete" v-if="selectedRowKeys && this.selectedRowKeys.length">删除</a-button>
      </div>
      <s-table
        ref="table"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :rowSelection="rowSelection"
        :showPagination="true"
      >
        <span slot="bz" slot-scope="bz">
           <a-tooltip :title="bz">
             {{ bz }}
           </a-tooltip>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a @click="deleteItem(record)">删除</a>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { DeviceListService } from '@/views/demo/deviceListService'
import DeviceEdit from '@/views/demo/components/DeviceEdit'
import { MODAL_SIZE } from '@/config/uiConfig'

const columns = [
  {
    title: '装置名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '装置序列号',
    dataIndex: 'sn',
    key: 'sn'
  },
  {
    title: '备注',
    dataIndex: 'bz',
    key: 'bz',
    scopedSlots: { customRender: 'bz' }
  },
  {
    title: '操作',
    width: 130,
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'TableList',
  components: {
    STable
  },
  data() {
    return {
      // 查询参数
      queryParam: {
        name: ''
      },
      // 表头
      columns,
      expandedRowKeys: [],
      selectedRowKeys: [],
      selectedRows: [],
    }
  },
  created() {
  },
  methods: {
    /**
     * 加载列表数据
     * @param parameter
     * @returns {Promise<{data: (*|*[]), pageNo: number, totalCount: *}|{data: *[]}>}
     */
    loadData(parameter) {
      const requestParameters = Object.assign({}, parameter, this.queryParam)
      return DeviceListService.getListByPage(requestParameters)
    },
    /**
     * 新增
     */
    add() {
      this.$dialog(DeviceEdit,
        {
          on: {
            ok: () => {
              this.$notification.success({
                message: '成功',
                description: '新增成功'
              })
              this.$refs.table.refresh(true);
            },
            cancel () {},
            close () {}
          }
        },
        // modal props
        {
          title: '新增',
          width: MODAL_SIZE.MIDDLE,
          centered: true,
          maskClosable: false
        }
      );
    },
    /**
     *  编辑
     */
    handleEdit(record) {
      DeviceListService.getItemById(record.id).then(data => {
        this.$dialog(DeviceEdit,
          {
            record: data,
            on: {
              ok: () => {
                this.$notification.success({
                  message: '成功',
                  description: '编辑成功'
                })
                this.$refs.table.refresh(true);
              },
              cancel () {},
              close () {}
            }
          },
          // modal props
          {
            title: '编辑',
            width: MODAL_SIZE.MIDDLE,
            centered: true,
            maskClosable: false
          }
        );
      })
    },
    /**
     * 单个删除
     */
    deleteItem(record) {
      this.$confirm({
        title: '提示',
        content: '确定删除该装置：' + record.name + '?',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.toDelete([record.id])
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    /**
     * 批量删除
     */
    batchDelete() {
      this.$confirm({
        title: '提示',
        content: '确定删除该' + this.selectedRowKeys.length + '项?',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.toDelete(this.selectedRowKeys)
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    /**
     * 删除操作
     * @param ids
     */
    toDelete(ids) {
      DeviceListService.deleteByIds(ids).then(res => {
        this.$notification.success({
          message: '成功',
          description: '装置删除成功'
        })
        this.$refs.table.refresh(true)
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
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
