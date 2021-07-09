/*
 * @Description: 机器人相关接口
 * @Author: lfl
 */
import { RootObject } from '@/model/rootObject'
import { UserInfoModel, Users } from '@/model/userModel'
import https from '@/utils/https'
import { LoginModel } from '@/views/user-manager/login/model/loginModel'
import { RequestParams, ContentType, Method } from 'axios-mapper'

export const robotStatusRequest = () => {
  return https(false).request<any>(
    'strategy/getAutoTradeStatus',
    Method.GET,
    undefined,
    ContentType.json
  )
}

export const createAccount = (account: any) => {
  return https().request<any>(
    'user/saveUserKeys',
    Method.POST,
    account,
    ContentType.json
  )
}

export const getAccounts = (params: any) => {
  return https().request<any>(
    'user/getUserKeys',
    Method.GET,
    params,
    ContentType.json
  )
}
export const getAccountInfo = (params: any) => {
  return https().request<any>(
    'account/getMyInfo',
    Method.GET,
    params,
    ContentType.form
  )
}
export const getAllAccounts = (params: any) => {
  return https().request<any>(
    'user/getAllUserKeys',
    Method.GET,
    params,
    ContentType.form
  )
}

export const stopRobot = () => {
  return https().request<any>(
    'strategy/stopAutoTrade',
    Method.GET,
    undefined,
    ContentType.json
  )
}

export const startAutoTrade = (model: any) => {
  return https().request<any>(
    'strategy/startAutoTrade',
    Method.POST,
    model,
    ContentType.json
  )
}
