/**
 * Created by 小野猫 on 2018/12/11
 */

import _rest from './_rest';

const $ = {};

/**
 * 创建专辑
 * @param {*} data
 */
$.createAlbum = (data) => _rest.post({
  url: ['album'],
  data: {
    "name": data.name,
    "thumb_bucket_sid": data.thumb_bucket_sid,
    "thumb_file_key": data.thumb_file_key,
    "description": data.description
  }
})

/**
 * 修改专辑
 * @param {*} data
 */
$.updateAlbum = (data) => _rest.put({
  url: ['album', `i-${data.sid}`, 'info'],
  data: {
    "name": data.name,
    "thumb_bucket_sid": data.thumb_bucket_sid,
    "thumb_file_key": data.thumb_file_key,
    "description": data.description
  }
})

/**
 * 专辑分页
 * @param {*} data
 */
$.albumList = (data) => _rest.get({
  url: ['album', 'list'],
  query: {
    "page": data.page,
    "limit": data.limit,
    "user_sid": data.user_sid
  }
})

/**
 * 专辑上线
 * @param {*} sid
 */
$.albumOnline = (sid) => _rest.post({
  url: ['album', `i-${sid}`, 'action-online']
})

/**
 * 专辑下线
 * @param {*} sid
 */
$.albumOffline = (sid) => _rest.post({
  url: ['album', `i-${sid}`, 'action-offline']
})

/**
 * 删除专辑
 * @param {*} sid
 */
$.removeAlbum = (sid) => _rest.delete({
  url: ['album', `i-${sid}`]
})

/**
 * 专辑详情
 * @param {*} sid
 */
$.albumDetail = (sid) => _rest.get({
  url: ['album', `i-${sid}`, 'info']
})

/**
 * 专辑下的视频列表
 * @param {*} sid
 */
$.albumVideoList = (data) => _rest.get({
  url: ['album', `i-${data.sid}`, 'video', 'list'],
  query: {
    "page": data.page,
    "limit": data.limit,
    "user_sid": data.user_sid
  }
})

/**
 * 专辑下新增视频
 * @param {*} data
 */
$.albumAddVideo = (data) => _rest.post({
  url: ['album', `i-${data.sid}`, 'video'],
  data: {
    "video_sid": data.video_sid
  }
})

/**
 * 专辑下删除视频
 * @param {*} data
 */
$.albumRemoveVideo = (data) => _rest.delete({
  url: ['album', `i-${data.sid}`, 'video'],
  data: {
    "video_sid": data.video_sid
  }
})

/**
 * 专辑下视频批量排序
 * @param {*} data
 */
$.albumVideoSort = (data) => _rest.put({
  url: ['album', `i-${data.sid}`, 'video', 'sorting'],
  data: {
    "video_sids": data.video_sids
  }
})

export default $;