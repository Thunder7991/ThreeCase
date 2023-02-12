import axios from 'axios'

// 获取城市信息接口
export function getSmartCityInfo () {
  return axios.get('http://127.0.0.1:4523/mock/1409270/api/smartcity/info')
}

export function getSmartCityList () {
  return axios.get('http://127.0.0.1:4523/mock/1409270/api/smartcity/list')
}
