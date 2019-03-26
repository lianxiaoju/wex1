const Util = require('@hzct/js-utils');
const RestClient = require('../services/_rest');
const Service$token = require('../services/token');
const Service$user = require('../services/user');
const Global$data = require('../globals/data');

const $ = module.exports = {};

$.login = () => {
  let jsCode = '';
  return new Promise((resolve, reject) => {
    wx.loginAsync().then((res) => {
      console.log('[LOGIN] STEP 1: wx.login()');
      // console.log(res);
      jsCode = res.code;
      return wx.getUserInfoAsync({
        withCredentials: true,
        lang: 'zh_CN',
      });
    }).then((res) => {
      // console.log(res);
      console.log('[LOGIN] STEP 2: wx.getUserInfo()');
      return Service$token.getToken({
        code: jsCode,
        encryptedData: res.encryptedData,
        iv: res.iv
      })
    }).then((tokenInfo) => {
      console.log('[LOGIN] STEP 3: $token.getToken()');
      // console.log(tokenInfo)
      const userId = tokenInfo.data.token.session_id;
      const appToken = tokenInfo.data.token.access_token;
      const auth = `${userId}:${appToken}`;
      RestClient.authorization = `Bearer ${Util.$$encrypt.encodeBase64(auth)}`
      return Service$user.getUserById(tokenInfo.data.user.sid);
    })
    .then((userInfo) => {
      console.log('[LOGIN] STEP 4: $user.getUserById()');
      Global$data.currentUser = userInfo.data;
      resolve(Global$data.currentUser);
      console.log('[LOGIN] STEP 5: callback');
      return Promise.resolve(Global$data.currentUser);
    })
    .catch((err) => {
      console.error('[登录失败]', err);
      if (err && err.errMsg && err.errMsg.includes('deny')) {
        wx.showModal({
          title: '登录失败',
          content: '请在设置中授权允许获取用户信息',
          showCancel: true,
          cancalText: '取消',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting['scope.userInfo']) {
                    $.login(); // 重新唤起登录
                  } else {
                    reject(res);
                  }
                },
                fail: (err) => reject(err)
              });
            } else {
              reject(res);
            }
          },
          fail: (err) => reject(err)
        });
      } else {
        reject(err);
      }
    });
  });
};
/**
 * 下载图片。
 * @param {Object} options
 * @return {Promise}
 */
$.saveNetImageToPhotosAlbum = (options) => {
  if ('string' === typeof options) {
    options = {
      url: options
    };
  }
  options = Object.assign({
    url: ''
  }, options);

  return new Promise((resolve, reject) => {
    wx.downloadFileAsync({
      url: String(options.url).replace('http://', 'https://'),
      success: (res) => {
        wx.saveImageToPhotosAlbumAsync({
          filePath: res.tempFilePath,
          success: () => {
            wx.removeSavedFileAsync({
              filePath: res.tempFilePath,
              complete: () => resolve()
            });
          },
          fail: () => reject(new Error('保存失败，请检查是否开启相册权限'))
        });
      },
      fail: () => reject(new Error('获取图片失败，请重试或尝试截屏'))
    });
  });
};
