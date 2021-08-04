<!--
 * @Description:
 * @Author: ZY
 * @Date: 2021-01-18 10:48:43
 * @LastEditors: SCY
 * @LastEditTime: 2021-04-02 10:00:26
-->
<template>
  <el-row
    :gutter="40"
    class="panel-group"
  >
    <el-col
      :xs="24"
      :sm="12"
      :lg="12"
      class="card-panel-col"
    >
      <div
        class="card-panel"
        @click="handleSetLineChartData('newVisitis')"
      >
        <div class="card-panel-icon-wrapper icon-people">
          <el-button
            type="primary"
            icon="el-icon-refresh"
            @click.stop="getStatus()"
          >
            刷新状态
          </el-button><br><br>
          <el-button
            type="primary"
            icon="el-icon-refresh-right"
            @click.stop="closeRobot()"
          >
            关闭交易
          </el-button>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            机器人运行状态
          </div>
          <span class="card-panel-num">{{ exchange }}{{ robotStatus }}</span>
        </div>
      </div>
    </el-col>
    <el-col
      :xs="24"
      :sm="12"
      :lg="12"
      class="card-panel-col"
    >
      <div
        class="card-panel"
        @click="handleSetLineChartData('messages')"
      >
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ text }}交易总量
          </div>
          <CountTo
            :start-val="0"
            :end-val="total"
            :duration="3000"
            decimals="6"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col
      :xs="24"
      :sm="12"
      :lg="12"
      class="card-panel-col"
    >
      <div
        class="card-panel"
        @click="handleSetLineChartData('purchases')"
      >
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ text }}交易次数
          </div>
          <CountTo
            :start-val="0"
            :end-val="times"
            :duration="3200"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col
      :xs="24"
      :sm="12"
      :lg="12"
      class="card-panel-col"
    >
      <div
        class="card-panel"
        @click="handleSetLineChartData('shoppings')"
      >
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ text }}交易均价
          </div>
          <CountTo
            :start-val="0"
            :end-val="avgPrice"
            :duration="3600"
            decimals="6"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { defineComponent, onMounted, reactive, ref, watch, toRefs, computed } from 'vue'
import { CountTo } from 'vue3-count-to'
import { robotStatusRequest, stopRobot, getTransactionData } from '@/apis/robot'
import visits from '@/assets/images/home/visits.png'
import { ElMessage } from 'element-plus'
export default defineComponent({
  props: {
    text: {
      type!: String,
      required: true,
      default: '24H'
    },
    value: {
      type!: String,
      required: true,
      default: ''
    }
  },
  components: {
    CountTo
  },
  emits: ['handle-set-line-chart-data'],
  setup(props, { emit }) {
    watch(
      () => props.value,
      () => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        getTransaction(props.value[0], props.value[1])
        console.log('value :>> ', props.value)
      })
    const handleSetLineChartData = (type: string) => {
      emit('handle-set-line-chart-data', type)
    }
    const store = useStore()
    const exchange = computed(() =>
      store.state.user.exchange
    )
    const robotStatus = ref('机器人已停止')
    const myCount = ref(null)
    const getStatus = async() => {
      const data = await robotStatusRequest()
      if (!data?.message) return
      robotStatus.value = data.message
      ElMessage({
        message: '成功刷新机器人状态',
        type: 'success'
      })
    }
    const dataMap = reactive({
      times: 0,
      total: 0,
      avgPrice: 0
    })
    const getTransaction = async(startTime: string | Date, endTime: string | Date) => {
      const t1 = new Date(startTime).getTime()
      const t2 = new Date(endTime).getTime()
      const param = {
        EXCHANGE: store.state.user.exchange,
        symbol: 'bft_usdt',
        startTimestamp: t1,
        endTimestamp: t2
      }
      const data = await getTransactionData(param)
      if (data?.data) {
        const { transactionTimes, totalAmount, avgPrice } = data.data
        dataMap.times = +transactionTimes
        dataMap.total = +totalAmount
        dataMap.avgPrice = +avgPrice
      }
    }
    const closeRobot = async() => {
      const a = await stopRobot()
      if (a.status) {
        await getStatus()
      }
    }
    function get24H() {
      const start = new Date()
      const end = new Date()
      start.setTime(start.getTime() - 3600 * 24 * 1000)
      getTransaction(start, end)
    }
    watch(
      () => store.state.user.exchange,
      () => {
        getStatus()
        if (props.value.length > 0) {
          getTransaction(props.value[0], props.value[1])
        } else {
          get24H()
        }
        // getTransaction()
      }
    )

    onMounted(() => {
      getStatus()
      get24H()
      // getTransaction()
    })

    return {
      handleSetLineChartData,
      myCount,
      visits,
      exchange,
      robotStatus,
      closeRobot,
      getStatus,
      ...toRefs(dataMap)
    }
  }
})
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    height: 124px;
    background: #FFFFFF;
    border-radius: 10px;
    img{
      width:60px;
      height: 60px;
      display: inline-block;
    }
    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 5px 0 0 5px;
      padding: 16px;
      padding-right: 0;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  // .card-panel-description {
  //   display: none;
  // }

  // .card-panel-icon-wrapper {
  //   float: none !important;
  //   width: 100%;
  //   height: 100%;
  //   margin: 0 !important;

  //   svg {
  //     display: block;
  //     margin: 14px auto !important;
  //     float: none !important;
  //   }
  // }
}
</style>
