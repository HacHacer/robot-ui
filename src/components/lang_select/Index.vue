<!--
 * @Description: 语言选择
 * @Author: ZY
 * @Date: 2020-12-23 20:06:29
 * @LastEditors: SCY
 * @LastEditTime: 2021-04-02 14:33:32
-->
<template>
  <div>
    <el-dropdown>
      <svg
        class="icon"
        aria-hidden="true"
        font-size="45px"
        :class="{'svg-color': isWhite}"
      >
        <use xlink:href="#iconzhongyingwen" />
      </svg>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in languages"
            :key="item.value"
            :disabled="language===item.value"
          >
            <span @click="handleSetLanguage(item.value)">{{ item.name }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { ref, defineComponent, reactive, toRefs } from 'vue'
import { AppActionTypes } from '@/store/modules/app/action-types'
import { ElMessage } from 'element-plus'
type Language = {
    name: string
    value: string
}

export default defineComponent({
  props: {
    isWhite: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const store = useStore()

    const state = reactive({
      languages: [{ name: 'en', value: 'en' }, { name: '中文', value: 'zh-cn' }] as Array<Language>,
      handleSetLanguage: (lang: string) => {
        store.dispatch(AppActionTypes.ACTION_SET_LANGUAGE, lang)
        ElMessage({
          message: 'Switch Language Success',
          type: 'success'
        })
      }
    })
    const language = ref('')
    return {
      ...toRefs(state),
      language
    }
  }
})

</script>

<style lang="scss" scoped>
.svg-color{
  fill: white;
}
</style>
