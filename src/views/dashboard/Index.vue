<!--
 * @Description:
 * @Author: ZY
 * @Date: 2020-12-21 13:50:19
 * @LastEditors: ZY
 * @LastEditTime: 2021-01-18 14:30:45
-->
<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import AdminDashboard from './admin/Index.vue'
import EditorDashboard from './editor/Index.vue'
export default defineComponent({
  components: {
    AdminDashboard,
    EditorDashboard
  },
  setup() {
    const currentRole = ref('admin-dashboard')
    return {
      currentRole
    }
  }
})
</script>
