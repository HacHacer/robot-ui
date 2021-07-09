/*
 * @Description: app actions
 * @Author: ZY
 * @Date: 2020-12-23 10:25:37
 * @LastEditors: scy😊
 * @LastEditTime: 2021-01-29 08:46:37
 */
import { ActionTree, ActionContext } from 'vuex'
import { RootState, useStore } from '@/store'
import { state, UserState } from './state'
import { Mutations } from './mutations'
import { UserMutationTypes } from './mutation-types'
import { UserActionTypes } from './action-types'
import { loginRequest, userInfoRequest } from '@/apis/user'
import { removeToken, setToken } from '@/utils/cookies'
import { PermissionActionType } from '../permission/action-types'
import router, { resetRouter } from '@/router'
import { RouteRecordRaw } from 'vue-router'

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<UserState, RootState>, 'commit'>

export interface Actions {
  [UserActionTypes.ACTION_LOGIN](
    { commit }: AugmentedActionContext,
    userInfo: { username: string, password: string }
  ): void
  [UserActionTypes.ACTION_RESET_TOKEN]({ commit }: AugmentedActionContext): void
  [UserActionTypes.ACTION_GET_USER_INFO]({
    commit
  }: AugmentedActionContext): void
  [UserActionTypes.ACTION_CHANGE_ROLES](
    { commit }: AugmentedActionContext,
    role: string
  ): void
  [UserActionTypes.ACTION_LOGIN_OUT]({ commit }: AugmentedActionContext): void
  [UserActionTypes.ACTION_EXCHANGE](
    { commit }: AugmentedActionContext,
    payload: string
  ): void
}

export const actions: ActionTree<UserState, RootState> & Actions = {
  async [UserActionTypes.ACTION_LOGIN](
    { commit }: AugmentedActionContext,
    userInfo: { username: string, password: string }
  ) {
    let { username, password } = userInfo
    username = username.trim()
    if (username === 'admin' && password === 'admin') {
      const token = 'admin-token'
      setToken(token)
      commit(UserMutationTypes.SET_TOKEN, token)
    }
    if (username === 'editor') {
      const token = 'editor-token'
      setToken(token)
      commit(UserMutationTypes.SET_TOKEN, token)
    }
    // await loginRequest({ username, password }).then(async(res) => {
    //   if (res?.code === 0 && res.data.accessToken) {
    //     setToken(res.data.accessToken)
    //     commit(UserMutationTypes.SET_TOKEN, res.data.accessToken)
    //   }
    // }).catch((err) => {
    //   console.log(err)
    // })
  },

  [UserActionTypes.ACTION_RESET_TOKEN]({ commit }: AugmentedActionContext) {
    removeToken()
    commit(UserMutationTypes.SET_TOKEN, '')
    commit(UserMutationTypes.SET_ROLES, [])
  },

  async [UserActionTypes.ACTION_GET_USER_INFO]({
    commit
  }: AugmentedActionContext) {
    if (state.token === '') {
      throw Error('token is undefined!')
    }
    let res: any
    if (state.token === 'admin-token') {
      res = {
        avatar:
          'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        email: 'admin@test.com',
        id: 0,
        introduction: 'I am a super administrator',
        name: 'Super Admin',
        password: 'any',
        phone: '1234567890',
        roles: ['admin'],
        username: 'admin'
      }
    }
    if (state.token === 'editor-token') {
      res = {
        avatar:
          'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        email: 'editor@test.com',
        id: 1,
        introduction: 'I am an editor',
        name: 'Normal Editor',
        password: 'any',
        phone: '1234567890',
        roles: ['editor'],
        username: 'editor'
      }
    }
    commit(UserMutationTypes.SET_ROLES, res.roles)
    commit(UserMutationTypes.SET_NAME, res.name)
    commit(UserMutationTypes.SET_AVATAR, res.avatar)
    commit(UserMutationTypes.SET_INTRODUCTION, res.introduction)
    commit(UserMutationTypes.SET_EMAIL, res.email)
    return res
  },

  async [UserActionTypes.ACTION_CHANGE_ROLES](
    { commit }: AugmentedActionContext,
    role: string
  ) {
    const token = role + '-token'
    const store = useStore()
    commit(UserMutationTypes.SET_TOKEN, token)
    setToken(token)
    await store.dispatch(UserActionTypes.ACTION_GET_USER_INFO, undefined)
    store.dispatch(PermissionActionType.ACTION_SET_ROUTES, state.roles)
    store.state.permission.dynamicRoutes.forEach((item: RouteRecordRaw) => {
      router.addRoute(item)
    })
  },

  [UserActionTypes.ACTION_LOGIN_OUT]({ commit }: AugmentedActionContext) {
    console.log(commit)
    removeToken()
    commit(UserMutationTypes.SET_TOKEN, '')
    commit(UserMutationTypes.SET_ROLES, [])
    resetRouter()
  },

  [UserActionTypes.ACTION_EXCHANGE](
    { commit }: AugmentedActionContext,
    payload: string
  ) {
    commit(UserMutationTypes.SET_EXCHANGE, payload)
  }
}
