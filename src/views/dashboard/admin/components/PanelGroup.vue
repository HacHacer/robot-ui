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
          <span class="card-panel-num">{{ robotStatus }}</span>
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
        <div class="card-panel-icon-wrapper icon-message">
          <el-button
            type="primary"
            icon="el-icon-s-marketing"
          >
            查看七日交易量
          </el-button>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            24H交易量
          </div>
          <CountTo
            :start-val="0"
            :end-val="81212"
            :duration="3000"
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
        <div class="card-panel-icon-wrapper icon-money">
          <el-button
            type="primary"
            icon="el-icon-s-data"
          >
            查看七日交易额度
          </el-button>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            24H交易额度
          </div>
          <CountTo
            :start-val="0"
            :end-val="9280"
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
        <div class="card-panel-icon-wrapper icon-shopping">
          <el-button
            type="primary"
            icon="el-icon-refresh-right"
          >
            查看24H停止次数
          </el-button>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            24H机器人停止次数
          </div>
          <CountTo
            :start-val="0"
            :end-val="400"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { defineComponent, onMounted, ref, watch } from 'vue'
import { CountTo } from 'vue3-count-to'
import { robotStatusRequest, stopRobot } from '@/apis/robot'
import visits from '@/assets/images/home/visits.png'
export default defineComponent({
  components: {
    CountTo
  },
  emits: ['handle-set-line-chart-data'],
  setup(_, { emit }) {
    const handleSetLineChartData = (type: string) => {
      emit('handle-set-line-chart-data', type)
    }
    const store = useStore()
    const robotStatus = ref('机器人已停止')
    const myCount = ref(null)
    const getStatus = async() => {
      const data = await robotStatusRequest()
      if (!data?.message) return
      robotStatus.value = data.message
    }
    const closeRobot = async() => {
      const a = await stopRobot()
      if (a.status) {
        await getStatus()
      }
    }

    watch(
      () => store.state.user.exchange,
      () => {
        getStatus()
      }
    )

    onMounted(() => {
      getStatus()
    })

    return {
      handleSetLineChartData,
      myCount,
      visits,
      robotStatus,
      closeRobot,
      getStatus
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
