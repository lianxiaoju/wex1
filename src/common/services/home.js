/**
 * Created by 小野猫 on 2018/11/02
 */

import _rest from './_rest';

const $ = {};

/**
 * 获取导航列表
 */
$.getNavList = () => _rest.get({
  url: ['channel', 'list']
})

/**
 * 获取地区下的视频列表
 */
$.getAreaVideoList = (data) => _rest.post({
  url: ['video', 'list-by-area'],
  data: {
    "page": data.page,
    "limit": data.limit
  }
})

/**
 * 获取视频列表
 * @param {*} data
 */
$.getVideoList = (data) => _rest.post({
  url: ['video', 'list-by-channel'],
  data: {
    "page": data.page,
    "limit": data.limit,
    "channel_sid": data.channel_sid,
    "scene_id": data.scene_id,
    "log_id": data.log_id
  }
})

/**
 * 获取关注列表
 * @param {*} data
 */
$.getAttentionList = (data) => _rest.post({
  url: ['video', 'list-followed'],
  data: {
    "page": data.page,
    "limit": data.limit
  }
})

/**
 * 获取视频详情
 * @param {*} id
 */
$.getDetailList = (sid) => _rest.get({
  url: ['video', 'info', 'i-' + sid]
})

/**
 * 获取详情相关推荐列表
 * @param {*} data
 */
$.getRecommendList = (data) => _rest.post({
  url: ['video', 'list-relevant-by-video'],
  data: {
    "page": data.page,
    "limit": data.limit,
    "channel_sid": data.channel_sid,
    "scene_id": data.scene_id,
    "log_id": data.log_id,
    "video_sid": data.video_sid
  }
})

/**
 * 获取小程序二维码
 */
// $.qrcode = (scene, page, width = 100) => {
//   return _rest.post({
//     url: ['qrcode', 'qrcode'],
//     data: {
//       scene,
//       page,
//       width
//     }
//   });
// }

$.qrcode = () => {
  return new Promise((reslove) => {
    setTimeout(() => {
      reslove('../..//images/qrcode.png')
    })
  })
}

export default $;
