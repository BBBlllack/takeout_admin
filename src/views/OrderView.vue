<template>
  <el-card class="card">
    <div class="card_head">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input
            size="large"
            prefix-icon="Search"
            autocomlpete="off"
            placeholder="请输入订单号"
            v-model="searchForm.oid"
            @input="onKeywordChange"
          />
        </el-col>
        <el-col :span="8">
          <el-date-picker
            size="large"
            type="daterange"
            unlink-panels
            range-separator="To"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
            v-model="searchForm.date"
            @change="onDateChange"
          />
        </el-col>
        <el-col :span="4">
          <el-button icon="Search" size="large" type="primary">搜索</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="card_body">
      <el-table :data="page.records" style="width: 100%" border>
        <el-table-column prop="id" label="订单号"> </el-table-column>
        <el-table-column prop="user.username" label="用户"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间"> </el-table-column>
        <el-table-column prop="status" label="订单状态">
          <template #default="{ row }">
            {{ orderStatus[row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button-group>
              <el-button
                circle
                plain
                type="primary"
                :icon="Dish"
                @click="onSendClick(row)"
              ></el-button>
              <el-button
                circle
                plain
                type="warning"
                :icon="List"
                @click="onDetailClick(row)"
              ></el-button>
              <el-button
                circle
                plain
                type="danger"
                :icon="Delete"
                @click="onRefundClick(row)"
              ></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="card_bottom">
      <el-pagination
        v-model:current-page="page.current"
        v-model:page-size="page.size"
        layout="total, prev, pager, next, jumper"
        :total="page.total"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>

  <el-drawer size="50%" v-model="drawer.visible" :show-close="true">
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">{{ drawer.title }}</h4>
    </template>
    <el-descriptions class="margin-top" title="用户信息" :column="2" border>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <user />
            </el-icon>
            用户名
          </div>
        </template>
        {{ drawer.order.user.username }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <iphone />
            </el-icon>
            电话
          </div>
        </template>
        {{ drawer.order.user.phone }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <Money />
            </el-icon>
            总价
          </div>
        </template>
        {{ drawer.order.totalprice }}元
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <office-building />
            </el-icon>
            地址
          </div>
        </template>
        {{ drawer.order.address.detail }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <List />
            </el-icon>
            备注
          </div>
        </template>
        {{ drawer.order.comment }}
      </el-descriptions-item>
    </el-descriptions>

    <el-divider />
    <h4>菜品详情</h4>
    <el-table :data="drawer.detail" border>
      <el-table-column prop="id" label="id"> </el-table-column>
      <el-table-column prop="dish.name" label="菜品"> </el-table-column>
      <el-table-column prop="quantity" label="数量"> </el-table-column>
      <el-table-column prop="price" label="价格"> </el-table-column>
      <el-table-column prop="mark" label="评分"> </el-table-column>
    </el-table>
  </el-drawer>
</template>
<script setup lang="ts">
import { Delete, Dish, List } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import type { pageType, orderListItemType, orderDetailListItemType } from '@/types'
import { ElMessageBox } from 'element-plus'
import { getOrderList, getOrderDetail, updateOrderStatus } from '@/api'

onMounted(() => {
  refreshOrderList()
})

// 分页
const page = ref<pageType>({
  records: [] as orderListItemType[],
  total: 20,
  current: 1,
  size: 10
})

// 搜索表单
const searchForm = ref({
  oid: '' as string,
  date: [] as string[]
})

// 抽屉
const drawer = ref({
  visible: false as boolean,
  title: '订单详情' as string,
  order: {} as orderListItemType,
  detail: [] as orderDetailListItemType[]
})

const orderStatus = ['已支付', '已出餐', '已完成', '已退单']

// 出餐按钮
const onSendClick = async (row: orderListItemType) => {
  console.log(row)
  ElMessageBox.confirm('确认出餐吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      console.log('确定')
      updateOrderStatus(row.id, 1)
      refreshOrderList()
    })
    .catch(() => {
      console.log('取消')
    })
}

// 详情按钮
const onDetailClick = async (row: orderListItemType) => {
  console.log(row)
  drawer.value.visible = true
  drawer.value.title = '订单详情'
  drawer.value.order = row
  const res = await getOrderDetail(row.id)
  drawer.value.detail = res
  console.log(drawer.value.detail)
}

// 退单按钮
const onRefundClick = async (row: orderListItemType) => {
  console.log(row)
  ElMessageBox.confirm('确认退单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      console.log('确定')
      updateOrderStatus(row.id, 3)
      refreshOrderList()
    })
    .catch(() => {
      console.log('取消')
    })
}

// 刷新订单列表
const refreshOrderList = async () => {
  console.log('refresh')
  const val = searchForm.value
  const res = await getOrderList(
    page.value.current!,
    page.value.size!,
    val.oid,
    val.date[0],
    val.date[1]
  )
  console.log(res)
  page.value = res
}

// 日期选择器
const onDateChange = async () => {
  console.log(searchForm.value.date)
  refreshOrderList()
}
// 页码改变
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
  page.value.current = val
  refreshOrderList()
}

// 订单号改变
const onKeywordChange = () => {
  console.log(searchForm.value.oid)
  refreshOrderList()
}

// 快捷日期
const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]
</script>
<style scoped>
.card {
  text-align: left;
}

.card_head {
  margin: 15px;
}

.card_body {
  margin: 15px;
}

.card_bottom {
  text-align: right;
  margin: 15px;
}
.el-descriptions {
  margin-top: 20px;
}
.cell-item {
  display: flex;
  align-items: center;
}
.margin-top {
  margin-top: 20px;
}
</style>
