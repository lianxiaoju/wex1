/**
 * Created by 小野猫 on 2018/11/27
 */

import _rest from './_rest';

const $ = {};

/**
 * 用户关注up主
 * @param {*} uper_sid
 */
$.likeupmaster = (uper_sid) => _rest.post({
  url: ['uper', 'action-follow'],
  data: {
    uper_sid: uper_sid
  }
})

/**
 * 用户取消关注up主
 * @param {*} uper_sid
 */
$.unlikeupmaster = (uper_sid) => _rest.post({
  url: ['uper', 'action-undofollow'],
  data: {
    uper_sid: uper_sid
  }
})

/**
 * 视频点赞
 * @param {*} video_sid
 */
$.videoLike = (video_sid) => _rest.post({
  url: ['video', 'action-like'],
  data: {
    video_sid: video_sid
  }
})

/**
 * 视频取消点赞
 * @param {*} video_sid
 */
$.videoUnlike = (video_sid) => _rest.post({
  url: ['video', 'action-undolike'],
  data: {
    video_sid: video_sid
  }
})

/**
 * 获取视频评论列表
 * @param {*} data
 */
$.getCommentList = (data) => _rest.get({
  url: ['comment', 'list-by-video'],
  query: {
    video_sid: data.video_sid
  }
})

/**
 * 评论视频
 * @param {*} data
 */
$.commentVideo = (data) => _rest.post({
  url: ['comment', 'submit'],
  data: {
    video_sid: data.video_sid,
    content: data.content
  }
})


/**
 * 评论点赞
 * @param {*} data
 */
$.commentLiked = (data) => _rest.post({
  url: ['comment', 'action-like'],
  data: {
    comment_sid: data.comment_sid
  }
})

/**
 * 取消评论点赞
 * @param {*} data
 */
$.commentUnlLiked = (data) => _rest.post({
  url: ['comment', 'action-undolike'],
  data: {
    comment_sid: data.comment_sid
  }
})

/**
 * 获取回复列表
 * @param {*} data
 */
$.getReplyList = (data) => _rest.get({
  url: ['comment', 'reply', 'list'],
  query: {
    comment_sid: data.comment_sid
  }
})

/**
 * 回复评论
 * @param {*} data
 */
$.replyComment = (data) => _rest.post({
  url: ['comment', 'reply'],
  data: {
    comment_sid: data.comment_sid,
    content: data.content,
    to_reply_sid: data.to_reply_sid
  }
})

/**
 * 回复点赞
 * @param {*} data
 */
$.replyLiked = (data) => _rest.post({
  url: ['comment', 'reply', 'action-like'],
  data: {
    reply_sid: data.reply_sid
  }
})

/**
 * 取消回复点赞
 * @param {*} data
 */
$.replyUnlLiked = (data) => _rest.post({
  url: ['comment', 'reply', 'action-undolike'],
  data: {
    reply_sid: data.reply_sid
  }
})

/**
 * 搜索
 * @param {*} data
 */
$.searchVideo = (data) => _rest.post({
  url: ['video', 'search'],
  data: {
    keyword: data.keyword,
    page: data.page,
    limit: data.limit
  }
})

export default $;
