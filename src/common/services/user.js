import _rest from './_rest'

module.exports = {
  /**
   * 获取用户信息
   */
  getUserById(sid) {
    return _rest.get({
      url: ['user', 'info', 'i-' + sid]
    })
  },

  /**
   * 更新用户信息
   */
  updateUser({avatarUrl: avatar_url, nickname = '', sex = '男', intro = '', birthday = '', mobilephone = '', college = '', city = '', job = ''}) {
    return _rest.post({
      url: ['user', 'update'],
      data: {
        avatar_url,
        nickname,
        sex,
        intro,
        birthday,
        mobilephone,
        college,
        city,
        job
      }
    })
  }
}

