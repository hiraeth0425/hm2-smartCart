// 約定一個通用的鍵名
const INFO_KEY = 'hm_shopping_key'
const HISTORY_KEY = 'hm_search_list'

// 獲取個人信息
export const getInfo = () => {
  const defaultObj = { token: '', userId: '' }
  const result = localStorage.getItem(INFO_KEY)
  return result ? JSON.parse(result) : defaultObj
}

// 設置個人信息
export const setInfo = (obj) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(obj))
}

// 移除個人信息
export const romoveInfo = () => {
  localStorage.removeItem(INFO_KEY)
}

// 儲存搜索歷史
export const setHistory = (arr) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr))
}

// 取出搜索歷史
export const getHostory = () => {
  const result = localStorage.getItem(HISTORY_KEY)
  return result ? JSON.parse(result) : []
}
