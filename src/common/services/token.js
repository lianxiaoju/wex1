import _rest from './_rest'

const $ = {};

// 获取用户登录信息
$.getToken = (body) => _rest.post({
  url: ['passport', 'login', 'wxmini'],
  data: {
    js_code: body.code,
    encrypted_data: body.encryptedData,
    iv: body.iv
  }
});

export default $;