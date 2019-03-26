/**
 * Created by 小野猫 on 2019/1/04
 */

import _rest from './_rest';

const $ = {};

/**
 * 获取话题推荐分类列表
 */
$.getTopicRecommendedCategoryList = () => _rest.get({
  url: ['topic', 'list-category']
})

/**
 * 获取指定话题的信息
 */
$.getTopicBySID = (topic_sid) => _rest.get({
  url: ['topic', 'i-' + topic_sid]
})

/**
 * 获取已经关注的up视频列表
 */
$.getAttentionTopicList = (data) => _rest.post({
  url: ['video', 'list-followed'],
  data: {
    "limit": data.limit,
    "page": data.page
  }
})

/**
 * 通过topic获取视频列表
 */
$.getByTopicVideoList = (data) => _rest.get({
  url: ['video', 'list-by-topic'],
  query: {
    "topic_sid": data.topic_sid,
    "limit": data.limit,
    "page": data.page
  }
})

/**
 * 获取请求者关注过的话题列表
 */
$.getUserFollowedTopicList = (data) => _rest.get({
  url: ['topic', 'list-followed'],
  query: {
    "limit": data.limit,
    "page": data.page
  }
})

/**
 * 关注指定话题
 */
$.followTopic = (topic_sid) => _rest.get({
  url: ['topic', 'i-' + topic_sid, 'action-follow']
})

/**
 * 取消关注指定话题
 */
$.undoFollowTopic = (topic_sid) => _rest.get({
  url: ['topic', 'i-' + topic_sid, 'action-undofollow']
})

export default $;
