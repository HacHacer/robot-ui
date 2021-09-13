/*
 * @Description: axios 封装网络请求
 * @Author: ZY
 * @Date: 2020-12-28 14:45:32
 * @LastEditors: ZY
 * @LastEditTime: 2021-01-25 20:01:32
 */

import { useStore } from '@/store'
import HttpClient, { HttpClientConfig } from 'axios-mapper'
import exchangesUrl from '../../public/config.json'
import exchangeUrl from '@/config/exchangeUrl'
const https = (hasToken: Boolean = true) => {
  const exchange = useStore().state.user.exchange
  const host = exchangeUrl[exchange]
  console.log('host :>> ', host)
  const config: HttpClientConfig = {
    baseURL: host,
    headers: {
      token: hasToken ? useStore().state.user.token : ''
    }
  }
  return new HttpClient(config)
}

export default https
