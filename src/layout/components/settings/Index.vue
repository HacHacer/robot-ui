<!--
 * @Description: 设置页面
 * @Author: ZY
 * @Date: 2020-12-17 16:05:05
 * @LastEditors: ZY
 * @LastEditTime: 2021-01-27 13:48:18
-->
<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">
        {{ t('settings.title') }}
      </h3>

      <div class="drawer-item">
        <el-radio
          v-for="(item,index) in list"
          :key="index"
          v-model="exchange"
          :label="item"
          border
        >
          {{ item }}
        </el-radio>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { SettingsActionTypes } from '@/store/modules/settings/action-types'
import { UserActionTypes } from '@/store/modules/user/action-types'

import { defineComponent, reactive, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  setup() {
    const list = reactive(['jdex', 'hotcoin-global'])
    const store = useStore()
    const { t } = useI18n()
    const state = reactive({
      exchange: store.state.user.exchange,
      showTagsView: store.state.settings.showTagsView,
      showSidebarLogo: store.state.settings.showSidebarLogo,
      sidebarTextTheme: store.state.settings.sidebarTextTheme,
      themeChange: (value: string) => {
        store.dispatch(SettingsActionTypes.ACTION_CHANGE_SETTING, {
          key: 'theme',
          value
        })
      }
    })

    watch(
      () => state.exchange,
      (value) => {
        console.log('value :>> ', value)
        store.dispatch(UserActionTypes.ACTION_EXCHANGE, value)
      }
    )

    watch(
      () => state.showTagsView,
      (value) => {
        store.dispatch(SettingsActionTypes.ACTION_CHANGE_SETTING, {
          key: 'showTagsView',
          value
        })
      }
    )

    watch(
      () => state.showSidebarLogo,
      (value) => {
        console.log(value)

        store.dispatch(SettingsActionTypes.ACTION_CHANGE_SETTING, {
          key: 'showSidebarLogo',
          value
        })
      }
    )

    watch(
      () => state.sidebarTextTheme,
      (value) => {
        store.dispatch(SettingsActionTypes.ACTION_CHANGE_SETTING, {
          key: 'sidebarTextTheme',
          value
        })
      }
    )

    return {
      list,
      t,
      ...toRefs(state)
    }
  }
})
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }
}
</style>
