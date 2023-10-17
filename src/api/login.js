// 存放登入相關接口請求
import request from '@/utils/request'

// 1.獲取圖形驗證碼
export const getPcode = () => {
  return request.get('/captcha/image')
}

// 2.獲取短信驗證碼
export const getMsgCode = (captchaCode, captchaKey, mobile) => {
  return request.post('/captcha/sendSmsCaptcha', {
    form: {
      captchaCode,
      captchaKey,
      mobile
    }
  })
}

// 3.手機驗證碼登入
export const codeLogin = (mobile, smsCode) => {
  return request.post('/passport/login', {
    form: {
      isParty: false,
      partyData: {},
      mobile,
      smsCode
    }
  })
}
