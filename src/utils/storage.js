
const SEARCH_MAX_LENGTH = 25
/*插入方法     arr存储的数据  val传入存储的值  compare前后比较的函数  maxlen存入的最大数目*/
function insertArray(arr, val, compare, maxlen) {
    //findIndex()函数也是查找目标元素，找到就返回元素的位置，找不到就返回-1。
    const index = arr.findIndex(compare)
    if (index === 0) {  //如果是数组中的第一个数据 不做任何操作
        return
    }
    if (index > 0) {  //数组中有这条数据并且不再第一个位置
        arr.splice(index, 1)  //删掉
    }
    arr.unshift(val)
    if (maxlen && arr.length > maxlen) {

        arr.pop()

    }
}

import storage from 'store'
export function saveSearch(queryStr, searchKey) {
    let searches = storage.get(searchKey)
    /*最后一次搜索的结果放到搜索历史的第一个*/
    insertArray(searches, queryStr, (item) => {
        return item === queryStr
    }, SEARCH_MAX_LENGTH)
    storage.set(searchKey, searches)
    return searches
}
export const goodStorage = storage