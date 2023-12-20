<template>
  <el-card class="card">
    <div class="card_head">
      <el-row :gutter="50">
        <el-col :span="3">
          <el-button icon="Plus" size="large" type="primary" @click="onAddCategoryClick"
            >新增菜品分类</el-button
          >
        </el-col>
      </el-row>
    </div>

    <div class="card_body">
      <el-table :data="page.records" border style="width: 100%">
        <el-table-column prop="name" label="分类名称"> </el-table-column>
        <el-table-column label="分类状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" effect="dark">{{
              row.status === 1 ? '启用' : '禁用'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button-group>
              <el-button
                :icon="Edit"
                @click="onEditCategoryClick(row)"
                circle
                plain
                type="primary"
              ></el-button>
              <el-button :icon="Delete" circle plain type="danger"></el-button>
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
      <h4 :id="titleId" :class="titleClass">{{ drawerTitle }}</h4>
    </template>
    <el-form :model="form" label-width="120px" label-position="left">
      <el-form-item label="分类名称">
        <el-input v-model="form.name" prefix-icon="Menu" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="分类状态">
        <el-select v-model="form.status" placeholder="选择状态">
          <el-option
            v-for="item in categoryStatus"
            :key="item.status"
            :label="item.label"
            :value="item.status"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="drawerVisible = false">取消 </el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { getCategoryList, updateCategory } from '@/api'
import type { categoryType, pageType } from '@/types'

// 分类状态
const categoryStatus = ref([
  { label: '启用', status: 1 },
  { label: '禁用', status: 0 }
])

// 表单数据
const form = ref<categoryType>({})
// 抽屉可见性
const drawerVisible = ref(false)
// 抽屉标题
const drawerTitle = ref('')

// 添加类别
function onAddCategoryClick() {
  console.log('添加类别')
  drawerVisible.value = true
  drawerTitle.value = '新增菜品分类'
  // 重置表单
  form.value = {}
}

// 编辑类别
function onEditCategoryClick(row: categoryType) {
  console.log('编辑菜品分类')
  drawerVisible.value = true
  // 填充表单
  form.value.name = row.name
  form.value.status = row.status
  form.value.id = row.id
}

// 提交表单
const onSubmit = async () => {
  console.log('submit!')
  drawerVisible.value = !(await updateCategory(form.value))
  refreshCategoryList()
}

// 分页展示元素
const page = ref<pageType>({
  records: [] as categoryType[],
  total: 100,
  size: 10,
  current: 1
})

// 分页切换
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
  page.value.current = val
  refreshCategoryList()
}

// 刷新分类列表
const refreshCategoryList = async () => {
  console.log('refresh category list')
  const records = await getCategoryList(page.value.current, page.value.size)
  page.value = records
}

onMounted(() => {
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
</style>
