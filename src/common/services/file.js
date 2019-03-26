/**
 * @description 负责各类文件的访问
 */
import $req from './_rest';

const $ = {};
/**
 * @description 获取指定的存储桶信息
 * @param {String} bucket_sid;
 */
$.getBucketBySid = (bucket_sid = '') => $req.get({
  url: ['filestore', 'bucket', `i-${bucket_sid}`]
});

/**
 * @description 创建下载凭证
 * @param {Object} data;
 */
$.createDownloadToken = data => $req.post({
  url: ['filestore', 'token', 'download-token'],
  data: Object.assign({
    bucketSid: '',
    domainHost: '',
    fileKey: '',
    expireIn: ''
  }, data)
});

/**
 * @description 批量创建下载凭证
 * @param {Object} data;
 */
$.createDownloadTokens = data => $req.post({
  url: ['filestore', 'token', 'download-tokens'],
  data: Object.assign({
    bucketSid: '',
    domainHost: '',
    fileKeys: [],
    expireIn: ''
  }, data)
});

/**
 * @description 获取文件上传token
 * @param {String} module
 */
$.getUploadToken = (module) => $req.post({
  url: ['filestore', 'token', 'upload-token'],
  data: {
    module: module
  }
});

export default $;
