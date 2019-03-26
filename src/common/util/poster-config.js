import Global from '../global';
import Utils from '../../common/util';

export default class Config {
  constructor() {
    this.config = {
      init: {
        type: 'init',
        width: 375, // 画布宽度
        height: 493,
        bgColor: '#ffffff',
        canvasId: 'share_canvas',
        fileType: 'jpg'
      },
      list: []
    }
  }

  setConfigs(titleCh, shareImgInfo, qrcode) {
    const info = Global.$data.currentUser;
    const titleChWidth = 14;
    Utils.$file.getUrl({
      sid: info.avatarBucketSid,
      fileKey: info.avatarFileKey
    }).then(url => {
      info.uperAvatarFileKeyUrl = 'https:' + url;
      this.config.list = [
        {
          type: 'rect-fill',
          color: '#ffffff',
          left: 26,
          top: 26,
          width: 323,
          height: 441
        },
        {
          type: 'image',
          url: shareImgInfo.url,
          width: 323,
          height: 182,
          left: 26,
          top: 26
        },
        {
          type: 'text',
          text: titleCh,
          fontSize: 20,
          maxLine: 1,
          flag: true,
          start: '#f43750',
          end: '#ce0c9a',
          multi: true,
          width: titleChWidth,
          align: 'left',
          left: 42,
          top: 226
        },
        {
          type: 'avatar',
          url: info.uperAvatarFileKeyUrl,
          width: 40,
          height: 40,
          top: 300,
          left: 42
        },
        {
          type: 'text',
          text: info.nickname || '英语学习者',
          fontSize: 15,
          align: 'left',
          font: '600',
          color: '#000000',
          multi: false,
          left: 90,
          top: 304
        },
        {
          type: 'text',
          text: '在',
          fontSize: 13,
          align: 'left',
          color: '#000000',
          left: 90,
          top: 325
        },
        {
          type: 'text',
          text: '海鸥看世界',
          fontSize: 13,
          align: 'left',
          color: '#eb445a',
          left: 106,
          top: 325
        },
        {
          type: 'text',
          text: '向你推荐了这条视频',
          fontSize: 13,
          align: 'left',
          color: '#000000',
          left: 174,
          top: 325
        },
        {
          type: 'qrcode',
          url: qrcode,
          width: 75,
          height: 75,
          left: 150,
          top: 366
        }
      ];
    })
  }
}
