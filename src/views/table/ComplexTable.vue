<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        v-if="currentRole==='admin'"
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        align="center"
        label="交易所名称"
      >
        <template #default="{row}">
          <span>{{ row.EXCHANGE }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="标签"
      >
        <template #default="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column

        align="center"
        label="accessKey"
      >
        <template #default="{row}">
          <span>{{ row.accessKey }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="secretKey"
      >
        <template #default="{row}">
          <span>{{ row.secretKey }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >
        <template #default="scope">
          <el-button
            @click="handleInfo(scope.row)"
            type="text"
            size="small"
          >
            查看
          </el-button>
          <el-button
            v-if="currentRole==='admin'"
            type="text"
            size="small"
            @click="handleUpdate(scope.row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            v-if="currentRole==='admin'"
            title="确定删除吗？"
            @confirm="handleDelete(scope.row)"
          >
            <template #reference>
              <el-button
                type="text"
                size="small"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="textMap[dialogStatus]"
      v-model="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempAccountModel"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item
          label="电话"
          prop="phone"
        >
          <el-input
            v-model="tempAccountModel.phone"
            :disabled="dialogStatus==='update'"
          />
        </el-form-item>
        <el-form-item
          label="accessKey"
          prop="accessKey"
        >
          <el-input
            v-model="tempAccountModel.accessKey"
            :autosize="{minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item
          label="secretKey"
          prop="secretKey"
        >
          <el-input
            v-model="tempAccountModel.secretKey"
            :autosize="{minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="createData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="账户详情"
      v-model="dialogInfoVisible"
    >
      <el-form
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item
          label="BFT"
        >
          {{ info.BFT_OVER }}
        </el-form-item>
        <el-form-item
          label="BFT冻结"
        >
          {{ info.BFT_LOCK }}
        </el-form-item>
        <el-form-item
          label="USDT"
        >
          {{ info.USDT_OVER }}
        </el-form-item>
        <el-form-item
          label="USDT冻结"
        >
          {{ info.USDT_LOCK }}
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="dialogInfoVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  nextTick,
  onMounted,
  unref,
  computed,
  onBeforeMount,
  watch
} from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash'
import { useStore } from '@/store'
import { createAccount, getAllAccounts, getAccountInfo, deleteUserKey } from '@/apis/robot'

// import Pagination from '@/components/Pagination/index.vue'
export default defineComponent({
  setup() {
    const store = useStore()
    const currentRole = ref('admin')
    const calendarTypeOptions = [
      { key: 'CN', displayName: 'China' },
      { key: 'US', displayName: 'USA' },
      { key: 'JP', displayName: 'Japan' },
      { key: 'EU', displayName: 'Eurozone' }
    ]
    const roles = computed(() => {
      return store.state.user.roles
    })
    console.log('roles :>> ', roles)
    const dataForm = ref(ElForm)
    const dataMap = reactive({
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },

      importanceOptions: [1, 2, 3],
      calendarTypeOptions: calendarTypeOptions,
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],

      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      dialogFormVisible: false,
      dialogInfoVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },

      dialogPageviewsVisible: false,
      pageviewsData: [],
      rules: {
        phone: [
          { required: true, message: 'phone is required', trigger: 'blur' }
        ],
        accessKey: [
          { required: true, message: 'accessKey is required', trigger: 'blur' }
        ],
        secretKey: [
          { required: true, message: 'secretKey is required', trigger: 'blur' }
        ]
      },
      downloadLoading: false,
      tempAccountModel: {
        phone: '',
        accessKey: '',
        secretKey: ''
      },
      info: {},
      visible: true,
      async getList() {
        dataMap.listLoading = true
        const data = await getAllAccounts({ EXCHANGE: store.state.user.exchange })
        dataMap.list = data ?? []
        // dataMap.total = data?.data.total ?? 0
        console.log('data :>> ', data)
        // Just to simulate the time of the request
        setTimeout(() => {
          dataMap.listLoading = false
        }, 0.5 * 1000)
      },
      resetTempAccountModel() {
        dataMap.tempAccountModel = cloneDeep({
          phone: '',
          accessKey: '',
          secretKey: ''
        })
      },
      async handleInfo(row: any) {
        dataMap.info = await getAccountInfo(row)
        dataMap.dialogStatus = 'create'
        dataMap.dialogInfoVisible = true
      },
      async handleDelete(row: any) {
        const params = {
          EXCHANGE: store.state.user.exchange,
          phone: row.phone
        }
        const result = await deleteUserKey(params)
        console.log('result :>> ', result)
        if (result.code === 200) {
          await dataMap.getList()
          ElMessage.success({
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          // dataMap.list.unshift(addData.data)
        } else {
          ElMessage.error(
            '出错了'
          )
        }
      },
      handleCreate() {
        console.log('添加了')
        dataMap.resetTempAccountModel()
        dataMap.dialogStatus = 'create'
        dataMap.dialogFormVisible = true
        nextTick(() => {
          (dataForm.value as typeof ElForm).clearValidate()
        })
      },
      createData() {
        const form = unref(dataForm)
        form.validate(async(valid: any) => {
          if (valid) {
            const accountModle: any = dataMap.tempAccountModel
            accountModle.EXCHANGE = store.state.user.exchange
            accountModle.invitedKey = 'BNGJ_BNGJ'
            const addData = await createAccount(accountModle)
            console.log('addData :>> ', addData)
            if (addData.code === 200) {
              await dataMap.getList()
              // dataMap.list.unshift(addData.data)
            }

            dataMap.dialogFormVisible = false
            ElMessage.success({
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }
        })
      },
      handleUpdate(row: any) {
        dataMap.tempAccountModel = Object.assign({}, row)
        dataMap.dialogStatus = 'update'
        dataMap.dialogFormVisible = true
        nextTick(() => {
          (dataForm.value as typeof ElForm).clearValidate()
        })
      },
      updateData() {
        const form = unref(dataForm)
        form.validate(async(valid: any) => {
          if (valid) {
            const tempData = Object.assign({}, dataMap.tempAccountModel)
            console.log(tempData)
            const data = await createAccount(tempData)
            console.log(data, '-----------------')
            if (data.code === 200) {
              await dataMap.getList()
              // dataMap.list.unshift(addData.data)
            }
            dataMap.dialogFormVisible = false
            ElMessage.success({
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          }
        })
      }
    })
    onMounted(() => {
      console.log(typeof ElForm)
      dataMap.getList()
    })
    watch(
      () => store.state.user.exchange,
      () => {
        dataMap.getList()
      }
    )
    onBeforeMount(() => {
      if (!roles.value.includes('admin')) {
        currentRole.value = 'editor'
      }
    })
    return { ...toRefs(dataMap), dataForm, roles, currentRole }
  }
})
</script>
