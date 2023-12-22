import instance from '@/api/request'
import router from '@/router'
import { useTokenStore } from '@/stores'
import type {
  loginType,
  responseType,
  loginResType,
  pageType,
  categoryType,
  restaurantType,
  orderDetailListItemType
} from '@/types'
import { ElMessage } from 'element-plus'

export async function login(data: loginType) {
  const res: responseType = await instance.post('/rest/login', data)
  const resData: loginResType = res.data
  if (res.code === 1) {
    ElMessage.success('登陆成功')
    const tokenStore = useTokenStore()
    tokenStore.setToken(resData.token)
    // 跳转到首页
    router.push('/')
  } else {
    ElMessage.error(res.msg || '糟糕，出错啦')
  }
}

// 获取菜品列表
export async function getDishList(page: number, pagesize: number, key?: string) {
  if (key == '') {
    key = undefined
  }
  console.log(page, pagesize, key)
  const res: responseType = await instance.get('/dish/rest/list', {
    params: {
      page: page,
      size: pagesize,
      key: key
    }
  })
  console.log(res)
  if (res.code === 0) {
    ElMessage.error(res.msg || '糟糕，出错啦')
  }
  const resData: pageType = res.data
  return resData
}

// 获取分类列表
export async function getCategoryList(page?: number, pagesize?: number) {
  console.log('获取分类列表')
  const res: responseType = await instance.get('/category/rest/list', {
    params: {
      page: page,
      size: pagesize
    }
  })
  if (res.code === 0) {
    ElMessage.error(res.msg || '糟糕，出错啦')
  }
  const resData: pageType = res.data
  return resData
}

// 更新分类
export async function updateCategory(category: categoryType) {
  // 携带category
  const res: responseType = await instance.post('/category/update', category)
  if (res.code === 1) {
    ElMessage.success('更新成功')
    return true
  } else {
    ElMessage.error(res.msg || '糟糕，出错啦')
    return false
  }
}

// 更新菜品
export async function updateDish(dish: any) {
  // 携带category
  const res: responseType = await instance.post('/dish/update', dish)
  if (res.code === 1) {
    ElMessage.success('更新成功')
    return true
  } else {
    ElMessage.error(res.msg || '糟糕，出错啦')
    return false
  }
}

// 批量删除菜品
export async function deleteDish(ids: Array<number>) {
  // 携带category
  const res: responseType = await instance.post('/dish/delete', ids)
  if (res.code === 1) {
    ElMessage.success('删除成功')
    return true
  } else {
    ElMessage.error(res.msg || '糟糕，出错啦')
    return false
  }
}

// 批量启售菜品
export async function enableDish(ids: Array<number>) {
  // 携带category
  const res: responseType = await instance.post('/dish/enable', ids)
  if (res.code === 1) {
    ElMessage.success('启售成功')
    return true
  } else {
    ElMessage.error(res.msg || '糟糕，出错啦')
    return false
  }
}

// 批量停售菜品
export async function disableDish(ids: Array<number>) {
  // 携带category
  const res: responseType = await instance.post('/dish/disable', ids)
  if (res.code === 1) {
    ElMessage.success('停售成功')
    return true
  } else {
    ElMessage.error(res.msg || '糟糕，出错啦')
    return false
  }
}

// 获取饭店信息
export async function getRestaurantInfo() {
  const res: responseType = await instance.get('/rest/info')
  if (res.code != 1) {
    ElMessage.error(res.msg || '糟糕，出错啦')
  }
  const resData: restaurantType = res.data
  return resData
}

// 更新饭店信息
export async function updateRestaurantInfo(setting: restaurantType) {
  // 携带category
  const res: responseType = await instance.post('/rest/update', setting)
  if (res.code === 1) {
    ElMessage.success('更新成功')
    return true
  } else {
    ElMessage.error(res.msg || '糟糕，出错啦')
    return false
  }
}

// 获取订单列表
export async function getOrderList(
  page: number,
  pagesize: number,
  key?: string,
  begin?: string,
  end?: string
) {
  if (key == '') {
    key = undefined
  }
  if (begin == '') {
    begin = undefined
  }
  if (end == '') {
    end = undefined
  }
  console.log(page, pagesize, key)
  const res: responseType = await instance.get('/order/rest/list', {
    params: {
      page: page,
      size: pagesize,
      key: key,
      begin: begin,
      end: end
    }
  })
  console.log(res)
  if (res.code === 0) {
    ElMessage.error(res.msg || '糟糕，出错啦')
  }
  const resData: pageType = res.data
  return resData
}

// 获取订单详情
export async function getOrderDetail(id: number) {
  const res: responseType = await instance.get('/orderdetail/rest/byoid', {
    params: {
      oid: id
    }
  })
  if (res.code === 0) {
    ElMessage.error(res.msg || '糟糕，出错啦')
  }
  const resData: orderDetailListItemType[] = res.data
  console.log(resData)
  return resData
}

// 更新订单状态
export async function updateOrderStatus(id: number, status: number) {
  // 携带category
  const res: responseType = await instance.post('/order/rest/update', {
    id: id,
    status: status
  })
  if (res.code === 1) {
    ElMessage.success('更新成功')
    return true
  } else {
    ElMessage.error(res.msg || '糟糕，出错啦')
    return false
  }
}
