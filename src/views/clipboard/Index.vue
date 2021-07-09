<!--
 * @Description:
 * @Author: ZY
 * @Date: 2020-12-21 13:50:19
 * @LastEditors: ZY
 * @LastEditTime: 2021-01-18 14:30:45
-->
<template>
  <div class="components-container">
    <aside>刷单脚本配置</aside>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="dataForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="账户1"
        prop="key1"
      >
        <el-select
          v-model="ruleForm.key1"
          placeholder="请选择账户1"
        >
          <el-option
            v-for="item in list"
            :key="item.id"
            :label="item.phone"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="账户2"
        prop="key2"
      >
        <el-select
          v-model="ruleForm.key2"
          placeholder="请选择账户2"
        >
          <el-option
            v-for="item in list"
            :key="item.id"
            :label="item.phone"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="间隔时间"
        prop="interval"
      >
        <el-select
          v-model="ruleForm.interval"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择间隔时间"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Market"
        prop="market"
      >
        <el-select
          v-model="ruleForm.market"
          placeholder="请选择Market"
        >
          <el-option
            label="bft_usdt"
            value="bft_usdt"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="结束时间"
        required
      >
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="ruleForm.date1"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col
          class="line"
          :span="2"
        >
          -
        </el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker
              placeholder="选择时间"
              v-model="ruleForm.date2"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item
        label="最小数量"
        prop="minAmount"
      >
        <el-input
          type="age"
          v-model.number="ruleForm.maxAmount"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="最大数量"
        prop="maxAmount"
      >
        <el-input
          type="age"
          v-model.number="ruleForm.minAmount"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm()"
        >
          立即开启
        </el-button>
        <el-button @click="resetForm()">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { stopRobot, startAutoTrade, getAllAccounts } from '@/apis/robot'
import { useStore } from '@/store'
import { ElForm } from 'element-plus'
import {
  computed, defineComponent,
  reactive, onBeforeMount, ref, toRefs, unref, onMounted
} from 'vue'
export default defineComponent({

  setup() {
    const store = useStore()
    const currentRole = ref('admin-dashboard')
    const roles = computed(() => {
      return store.state.user.roles
    })
    const dataForm = ref(ElForm)
    const dataMap = reactive({
      list: [],
      options: [{
        value: '20',
        label: '20s'
      }, {
        value: '40',
        label: '40s'
      }, {
        value: '60',
        label: '60s'
      }],
      ruleForm: {
        key1: '',
        key2: '',
        date1: '',
        date2: '',
        maxAmount: 0,
        minAmount: 0,
        interval: [],
        market: ''
      },
      rules: {
        key1: [
          { required: true, message: '请选择账户1', trigger: 'change' }
        ],
        key2: [
          { required: true, message: '请选择账户2', trigger: 'change' }
        ],
        interval: [
          { required: true, message: '请选择时间间隔', trigger: 'change' }
        ],
        maxAmount: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字值' }
        ],
        minAmount: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字值' }
        ],
        market: [
          { required: true, message: '请选择market', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ]
      },
      submitForm() {
        const form = unref(dataForm)
        form.validate(async(valid: any) => {
          if (valid) {
            const accountModle: any = dataMap.ruleForm
            accountModle.EXCHANGE = store.state.user.exchange
            accountModle.duration = Date.parse(accountModle.date2)
            accountModle.isPlanning = false
            accountModle.timeRange = []
            accountModle.accessKey1 = accountModle.key1.accessKey
            accountModle.secretKey1 = accountModle.key1.secretKey
            accountModle.accessKey2 = accountModle.key2.accessKey
            accountModle.secretKey2 = accountModle.key2.secretKey
            await stopRobot()
            await startAutoTrade(accountModle)
            console.log('object :>> ', accountModle)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm() {
        const form = unref(dataForm)
        form.resetFields()
      },
      async getList() {
        const data = await getAllAccounts({ EXCHANGE: store.state.user.exchange })
        dataMap.list = data ?? []
        // dataMap.total = data?.data.total ?? 0
        console.log('data :>> ', data)
      }
    })
    onMounted(() => {
      dataMap.getList()
    })
    onBeforeMount(() => {
      if (!roles.value.includes('admin')) {
        currentRole.value = 'editor-dashboard'
      }
    })

    return {
      currentRole,
      dataForm,
      ...toRefs(dataMap)
    }
  }
})
</script>
