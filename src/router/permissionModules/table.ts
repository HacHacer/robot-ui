/*
 * @Description:表格相关
 * @Author: scy
 * @Date: 2021-01-08 19:21:46
 * @LastEditors: ZY
 * @LastEditTime: 2021-01-26 13:37:09
 */
import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/Index.vue'

const tableRouter: Array<RouteRecordRaw> = [
  {
    path: '/table',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () =>
          import(
            /* webpackChunkName: "clipboard" */ '@/views/table/ComplexTable.vue'
          ),
        name: 'DynamicTable',
        meta: { title: 'dynamicTable', icon: '#iconcopy' }
      }
    ]
  }
]

export default tableRouter
