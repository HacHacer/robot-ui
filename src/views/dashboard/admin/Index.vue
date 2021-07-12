<!--
 * @Description: admin 权限主页
 * @Author: ZY
 * @Date: 2021-01-15 18:44:25
 * @LastEditors: SCY
 * @LastEditTime: 2021-04-02 09:40:07
-->
<template>
  <div class="dashboard-editor-container">
    <!-- <GithubCorner class="github-corner" /> -->
    <PanelGroup @handle-set-line-chart-data="handleSetLineChartData" />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;border-radius: 8px;">
      <LineChart :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script lang='ts'>
import { ref } from 'vue'
import PanelGroup from './components/PanelGroup.vue'
import LineChart from './components/LineChart.vue'
export default {
  components: {
    PanelGroup,
    LineChart
  },
  setup() {
    const data = {
      newVisitis: {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145]
      },
      messages: {
        expectedData: [200, 192, 120, 144, 160, 130, 140],
        actualData: [180, 160, 151, 106, 145, 150, 130]
      },
      purchases: {
        expectedData: [80, 100, 121, 104, 105, 90, 100],
        actualData: [120, 90, 100, 138, 142, 130, 130]
      },
      shoppings: {
        expectedData: [130, 140, 141, 142, 145, 150, 160],
        actualData: [120, 82, 91, 154, 162, 140, 130]
      }
    }

    const lineChartData = ref(data.newVisitis)
    const handleSetLineChartData = (type: any) => {
      lineChartData.value = data[type]
    }

    return {
      lineChartData,
      handleSetLineChartData
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: #F2F7FF;
  position: relative;

  .github-corner{
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
    border-radius: 8px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
