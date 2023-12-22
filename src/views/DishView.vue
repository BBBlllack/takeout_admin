<template>
  <el-card class="card">
    <div class="card_head">
      <el-row>
        <el-col :span="12">
          <el-input
            size="large"
            prefix-icon="Search"
            style="width: 20vw"
            autocomlpete="off"
            placeholder="请输入菜品名称"
            @input="onKeywordChange"
            v-model="keyword"
          />
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button size="large" type="danger" text @click="onBatchDeleteClick()"
            >批量删除</el-button
          >
          <el-button size="large" type="success" text @click="onBatchSaleEnableClick()">
            批量启售</el-button
          >
          <el-button size="large" type="danger" text @click="onBatchSaleDisableClick()"
            >批量停售</el-button
          >
          <el-button size="large" type="primary" @click="onAddDishClick">+添加菜品</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="card_body">
      <el-table
        :data="page.records"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column prop="name" label="名称"> </el-table-column>
        <el-table-column prop="cover" label="图片">
          <template #default="{ row }">
            <img :src="row.cover" style="width: 100%; height: 100%; border-radius: 5px" />
          </template>
        </el-table-column>
        <el-table-column prop="descr" label="简介"> </el-table-column>
        <el-table-column prop="category" label="分类">
          <template #default="{ row }">
            <!-- 根据row.cid查找具有相同id的name -->
            {{ categoryData.records!.find((item) => item.id === row.cid)?.name }}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="售价"> </el-table-column>
        <el-table-column prop="discount" label="折扣"> </el-table-column>
        <el-table-column prop="status" label="售卖状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" effect="dark">
              <!-- 根据row.status查找具有相同status的label -->
              {{ categoryStatus.find((item) => item.status === row.status)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button-group>
              <el-button
                :icon="Edit"
                circle
                plain
                type="primary"
                @click="onEditClick(row)"
              ></el-button>
              <el-button
                :icon="Delete"
                circle
                plain
                type="danger"
                @click="clickDelete(row)"
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

  <el-drawer v-model="drawerVisible" :show-close="false">
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">菜品添加</h4>
    </template>
    <el-form :model="form" label-width="120px" label-position="left">
      <el-form-item label="菜品名称">
        <el-input v-model="form.name" prefix-icon="Dish" placeholder="朗朗上口名经传" />
      </el-form-item>
      <el-form-item label="菜品分类">
        <el-select v-model="form.cid" placeholder="选择分类">
          <!-- 用categoryData内的数据生成选项 -->
          <el-option
            v-for="item in categoryData.records"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="菜品图片">
        <el-upload class="avatar-uploader" :show-file-list="false" :http-request="onUploadCover">
          <img v-if="form.cover" :src="form.cover" class="avatar-uploader-img" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="菜品价格">
        <el-input v-model="form.price" prefix-icon="Coin" type="number" placeholder="作价几许？">
          <template #append>元</template>
        </el-input>
      </el-form-item>

      <el-form-item label="菜品状态">
        <el-select v-model="form.status" placeholder="选择状态">
          <el-option
            v-for="item in categoryStatus"
            :key="item.status"
            :label="item.label"
            :value="item.status"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="菜品折扣">
        <el-input v-model="form.discount" prefix-icon="Discount" placeholder="来即是客，我打个折">
          <template #append>%</template>
        </el-input>
      </el-form-item>

      <el-form-item label="菜品简介">
        <el-input v-model="form.descr" type="textarea" placeholder="给食客一句话的考虑时间" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="drawerVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { pageType, categoryType, dishType } from '@/types'
import axios from 'axios'
import {
  getDishList,
  updateDish,
  deleteDish,
  enableDish,
  disableDish,
  getCategoryList
} from '@/api'

const drawerVisible = ref(false)
const drawerTitle = ref('')

// 分类状态选择列表映射
const categoryStatus = ref([
  { label: '售卖', status: 1 },
  { label: '下架', status: 0 }
])

interface categoryPageType extends pageType {
  records?: categoryType[]
}
// 分类列表
const categoryData = ref<categoryPageType>({})

// 刷新分类列表
const refreshCategoryList = async () => {
  console.log('refresh category list')
  const records = await getCategoryList()
  categoryData.value = records
  console.log(categoryData.value)
}

interface pictureBadRes {
  success: boolean
  code: string
  message: string
  images?: string
  data: { url: string }
}

// 上传头像
const onUploadCover = async (file: any) => {
  ElMessage.success('上传中...')
  console.log('上传头像')
  console.log(file)
  // 将图片上传到sm.ms图床
  const formData = new FormData()
  formData.append('smfile', file.file)
  const res = await axios.post('/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'EbGJXCofcjs7WYDGf1KN5p6JuxJew8pJ'
    }
  })
  const resData = res.data as pictureBadRes
  if (resData.success) {
    // 如果上传成功
    console.log(res)
    const pic = resData.data.url
    form.value.cover = pic
  } else {
    // 如果重复上传
    form.value.cover = resData.images
  }
  ElMessage.success('头像上传成功')
}
// 提交菜品变更
const onSubmit = async () => {
  console.log('submit!')
  drawerVisible.value = !(await updateDish(form.value))
  refreshDishList()
}

// 菜品表单
const form = ref<dishType>({})

// 选中的菜品id
const selectedDish = ref<number[]>([])

function onAddDishClick() {
  drawerTitle.value = '菜品添加'
  drawerVisible.value = true
  // 清空form
  form.value = {}
}

function onEditClick(row: dishType) {
  drawerTitle.value = '菜品编辑'
  drawerVisible.value = true
  form.value = {}
  // 将row的值赋给form
  form.value.cid = row.cid
  form.value.cover = row.cover
  form.value.descr = row.descr
  form.value.discount = row.discount
  form.value.id = row.id
  form.value.name = row.name
  form.value.price = row.price
  form.value.status = row.status
}

function clickDelete(row: dishType) {
  console.log('删除' + JSON.stringify(row))
  ElMessageBox.confirm('确认删除该菜品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const status = await deleteDish([row.id!])
    if (status) {
      refreshDishList()
    }
  })
}

// 关键字搜索
const keyword = ref('')

// dishPageType继承pageType
interface dishPageType extends pageType {
  records?: dishType[]
}
// 分页展示元素
const page = ref<dishPageType>({
  current: 1,
  size: 5,
  total: 0
})

// 关键字搜索
const onKeywordChange = (val: string) => {
  console.log(`keyword: ${val}`)
  refreshDishList()
}

// 分页切换
const handleCurrentChange = async (val: number) => {
  console.log(`current page: ${val}`)
  page.value.current = val
  refreshDishList()
}

//  批量选中
const handleSelectionChange = (selected: dishType[]) => {
  console.log(`selected: ${JSON.stringify(selected)}`)
  // 将选中的菜品id提取出来赋值给selectedDish
  selectedDish.value = selected.map((item: dishType) => item.id) as number[]
  console.log(`selectedDish: ${JSON.stringify(selectedDish.value)}`)
}

// 批量删除
const onBatchDeleteClick = async () => {
  console.log('批量删除')
  ElMessageBox.confirm('确认删除选中菜品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const status = await deleteDish(selectedDish.value)
    if (status) {
      refreshDishList()
    }
  })
}

// 批量启售
const onBatchSaleEnableClick = async () => {
  console.log('批量启售')
  ElMessageBox.confirm('确认启售选中菜品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const status = await enableDish(selectedDish.value)
    if (status) {
      refreshDishList()
    }
  })
}

// 批量停售
const onBatchSaleDisableClick = async () => {
  console.log('批量停售')
  ElMessageBox.confirm('确认停售选中菜品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const status = await disableDish(selectedDish.value)
    if (status) {
      refreshDishList()
    }
  })
}

// 刷新菜品列表
const refreshDishList = async () => {
  console.log('获取菜品列表')
  const records = await getDishList(page.value.current!, page.value.size!, keyword.value)
  page.value = records
}

onMounted(() => {
  refreshDishList()
  refreshCategoryList()
})
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

.avatar-uploader .avatar {
  width: 150px;
  height: 150px;
  display: block;
}
.avatar-uploader-img {
  /* 拉伸图片适应父容器大小 */
  width: 150px;
  height: 150px;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  text-align: center;
}
</style>
