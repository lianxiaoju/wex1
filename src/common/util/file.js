import $file from '../services/file';
import $session from './session';
import Services from '../services';

const $ = {};

Object.defineProperty($, 'bucketList', {
  get: () => $session.getItem('_ksj_bucketList') || [],
  set: (bucketList) => {
    if (bucketList.length === 0) {
      $session.removeItem('_ksj_bucketList');
    } else {
      $session.setItem('_ksj_bucketList', bucketList);
    }
  }
});

/**
 * @description 获取加密文件链接
 * @private
 */
const _getPrivateFileUrl = async data => {
  const url = await $file.createDownloadToken(data).then(res => res.data.downloadUrl);
  return url;
};

/**
 * @description 获取加密文件链接
 * @private
 */
const _getPrivateFileUrls = async data => {
  const url = await $file.createDownloadTokens(data).then(res => res.data.items.map(v => v.downloadUrl));
  return url;
};

/**
 * @description 获取桶链接
 * @private
 */
const _getBucket = async (sid) => {
  let bucket = null;
  if ($.bucketList.every(v => +v.sid !== sid)) {
    bucket = await $file.getBucketBySid(sid).then(res => res.data);
    $.bucketList = $.bucketList.every(v => +v.sid !== sid) ? $.bucketList.concat(bucket) : $.bucketList;
  } else {
    bucket = $.bucketList.find(v => +v.sid === sid);
  }
  if (bucket) {
    return {
      ret: true,
      data: bucket
    };
  } else {
    return {
      ret: false
    };
  }
};

/**
 * @description 获取上传文件配置
 * @public
 * @param {*} module
 */
$.getUploadOps = async (module) => {
  const uploadOps = await Services.$file.getUploadToken(module).then(res => res.data);
  return uploadOps;
};


/**
 * @description 获取文件链接
 * @public
 */
$.getUrl = async url => {
  if (!url.sid || !url.fileKey) {
    return '';
  };
  const {
    sid,
    fileKey
  } = url;
  const bucket = await _getBucket(+sid);
  if (bucket.ret) {
    const domain = bucket.data.domains.find(domain => domain.weight > 0).host;
    if (bucket.data.isPrivate) {
      const data = {
        bucketSid: sid,
        domainHost: domain,
        expireIn: '21600'
      };
      if (Array.isArray(fileKey)) {
        data.fileKeys = fileKey;
        const urls = await _getPrivateFileUrls(data).then(res => res);
        return urls;
      } else {
        data.fileKey = fileKey;
        const url = await _getPrivateFileUrl(data).then(res => res);
        return url;
      }
    } else {
      if (Array.isArray(fileKey)) {
        data.fileKeys = fileKey;
        const urls = fileKey.map(v => `//${domain}/${v}`);
        return urls;
      } else {
        return `//${domain}/${fileKey}`;
      }
    }
  } else {
    return '';
  }
};

$.getAsyncUrl = (type, promiseList, list) => {
  Promise.all(promiseList).then(res => {
    res.forEach((v, i) => {
      if (res[i] !== '') {
        list[i][type] = res[i];
      }
    });
  });
};

export default $;
