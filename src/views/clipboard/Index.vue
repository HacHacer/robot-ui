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
          @change="change($event)"
        >
          <template
            v-for="item in list"
            :key="item.id"
          >
            <el-option
              v-if="item.id!==ruleForm.key2"
              :label="item.phone"
              :value="item.id"
            />
          </template>
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
          <template
            v-for="item in list"
            :key="item.id"
          >
            <el-option
              v-if="item.id!==ruleForm.key1"
              :label="item.phone"
              :value="item.id"
            />
          </template>
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
          placeholder="请选择文章标签"
        >
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- <el-input
          type="age"
          v-model.number="ruleForm.interval"
          autocomplete="off"
        /> -->
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
        />
      </el-form-item>
      <el-form-item
        label="最小数量"
        prop="minAmount"
      >
        <el-input
          type="age"
          v-model.number="ruleForm.minAmount"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="最大数量"
        prop="maxAmount"
      >
        <el-input
          type="age"
          v-model.number="ruleForm.maxAmount"
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
import { ElForm, ElMessage } from 'element-plus'
import {
  computed, defineComponent,
  reactive, onBeforeMount, ref, toRefs, unref, onMounted, watch
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
        maxAmount: 300,
        minAmount: 100,
        interval: '',
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
          { required: true, message: '请选择时间间隔', trigger: 'change' },
          // { type: 'number', message: '必须为数字值' }
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
        ]
      },
      change(v: any) {
        console.log('$evet :>> ', v)
      },
      submitForm() {
        const form = unref(dataForm)
        form.validate(async(valid: any) => {
          if (valid) {
            const accountModle1: any = dataMap.ruleForm
            const accountModle = Object.assign({}, accountModle1)
            accountModle.EXCHANGE = store.state.user.exchange
            accountModle.duration = Date.parse(accountModle.date1)
            accountModle.isPlanning = false
            // const arr = [accountModle.interval + '']
            // accountModle.interval = accountModle.interval.value
            // accountModle.timeRange = []
            const key1: any = dataMap.list.find((item: any) => item.id === accountModle.key1)
            const key2: any = dataMap.list.find((item: any) => item.id === accountModle.key2)
            accountModle.accessKey1 = key1.accessKey
            accountModle.secretKey1 = key1.secretKey
            accountModle.accessKey2 = key2.accessKey
            accountModle.secretKey2 = key2.secretKey
            delete accountModle?.key1
            delete accountModle?.key2
            delete accountModle?.date1
            const result = await startAutoTrade(accountModle)
            if (result?.status === 1) {
              ElMessage({
                message: '成功开启机器人交易',
                type: 'success'
              })
              form.resetFields()
            } else {
              ElMessage.error('出错了')
            }
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
    watch(
      () => store.state.user.exchange,
      () => {
        dataMap.getList()
      }
    )
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
