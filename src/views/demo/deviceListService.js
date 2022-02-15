import { $http } from '@/utils/request'

export const DeviceListService = {
  /**
   * 列表分页查询
   * @param params
   * @returns {Promise<{data: (*|*[]), pageNo: number, totalCount: *} | {data: []}>}
   */
  async getListByPage(params){
    return $http.get('/equipment/list', params).then(value => {
      return {
        pageNo: params.pageNo,
        data: value.items || [],
        totalCount: value.total,
      }
    }).catch(e => {
      return {
        data: []
      }
    })
  },
  /**
   * 新增
   * @param data
   * @returns {Promise<void>}
   */
  async create(data){
    return $http.post('/equipment', data);
  },
  /**
   * 编辑
   * @param data
   * @returns {Promise<void>}
   */
  async edit(data){
    return $http.put('/equipment', data);
  },
  async getItemById(id){
    return $http.get('/equipment/getById', {
      id
    });
  },
  /**
   * 根据id批量删除
   * @param ids
   * @returns {Promise<unknown>}
   */
  async deleteByIds(ids){
    return $http.del('/equipment',{
      ids
    });
  }
}