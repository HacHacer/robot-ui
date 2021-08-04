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
    <PanelGroup
      @handle-set-line-chart-data="handleSetLineChartData"
      :text="text"
      :value="value"
    />
    <el-row style="background:#fff;padding:16px;margin-bottom:32px;border-radius: 8px;">
      <el-date-picker
        v-model="value2"
        type="datetimerange"
        :shortcuts="shortcuts"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <span style="margin:0 10px" />
      <el-button
        type="primary"
        icon="el-icon-refresh-right"
        @click="search()"
      >
        按时间段查询
      </el-button>
    </el-row>
  </div>
</template>

<script lang='ts'>
import { ref } from 'vue'
import PanelGroup from './components/PanelGroup.vue'
export default {
  components: {
    PanelGroup
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
    const shortcuts = [{
      text: '24H',
      value: (() => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24)
        return [start, end]
      })()
    }, {
      text: '最近一周',
      value: (() => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        return [start, end]
      })()
    }, {
      text: '最近一个月',
      value: (() => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        return [start, end]
      })()
    }, {
      text: '最近三个月',
      value: (() => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        return [start, end]
      })()
    }]
    const lineChartData = ref(data.newVisitis)
    const handleSetLineChartData = (type: any) => {
      lineChartData.value = data[type]
    }
    const value2 = ref('')
    const text = ref('')
    const value = ref('')
    function formatDate(date: string, format: string) {
      const dateObj = new Date(date)
      const o = {
        'M+': dateObj.getMonth() + 1,
        'd+': dateObj.getDate(),
        'h+': dateObj.getHours() % 12 === 0 ? 12 : dateObj.getHours() % 12,
        'H+': dateObj.getHours(),
        'm+': dateObj.getMinutes(),
        's+': dateObj.getSeconds(),
        'q+': Math.floor((dateObj.getMonth() + 3) / 3),
        S: dateObj.getMilliseconds()
      }
      const week = {
        0: '\u65e5',
        1: '\u4e00',
        2: '\u4e8c',
        3: '\u4e09',
        4: '\u56db',
        5: '\u4e94',
        6: '\u516d'
      }
      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      if (/(E+)/.test(format)) {
        format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[dateObj.getDay() + ''])
      }
      for (const k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return format
    }
    const search = () => {
      const format = 'yyyy-MM-dd hh:mm:ss'
      if (value2.value?.length > 0) {
        value.value = value2.value
        text.value = formatDate(value2.value[0], format) + ' 到 ' + formatDate(value2.value[1], format)
        console.log('12312 :>> ', text)
        console.log('value2 :>> ', value2)
      }
    }
    return {
      value,
      text,
      value2,
      search,
      shortcuts,
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
