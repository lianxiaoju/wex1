export default {
  /**
   * 创建海报
   * @param options
   */
  drawPoster(options) {
    const init = options.init;
    const canvasId = init.canvasId;
    const ctx = wx.createCanvasContext(canvasId);

    // 绘制图片
    const drawImg = (option) => {
      return new Promise((resolve) => {
        downloadImg(option).then(img => {
          ctx.save();
          ctx.drawImage(img.tempUrl, img.left, img.top, img.width, img.height);
          ctx.restore();
          ctx.draw(true, () => {
            resolve();
          });
        });
      })
    };

    // 绘制二维码
    const drawQrcode = (option) => {
      return new Promise((resolve) => {
        ctx.save();
        ctx.drawImage(option.url, option.left, option.top, option.width, option.height);
        ctx.restore();
        ctx.draw(true, () => {
          resolve();
        });
      })
    };

    // 绘制头像
    const drawAvatar = (option) => {
      return new Promise((resolve) => {
        downloadImg(option).then(img => {
          const r = img.width / 2;
          ctx.save();
          ctx.beginPath();
          ctx.arc(img.left + r, img.top + r, r, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(img.tempUrl, img.left, img.top, img.width, img.height);
          ctx.restore();
          ctx.draw(true, () => {
            resolve();
          });
        });
      });
    };

    // 绘制文本
    const drawText = (textData) => {
      const formatText = getFormatText(textData);
      if (formatText.flag) {
        wx.getSystemInfo({
          success:function(res){
            if(res.platform == "ios"){
              ctx.setFillStyle(formatText.color);
            }else {
              const gradient = ctx.createLinearGradient(0, 0, 291, 0);
              gradient.addColorStop(0, formatText.start);
              gradient.addColorStop(1, formatText.end);
              ctx.setFillStyle(gradient)
            }
          }
        })
      } else {
        ctx.setFillStyle(formatText.color);
      }
      ctx.setFontSize(formatText.fontSize);
      ctx.setTextAlign(formatText.align);
      ctx.setTextBaseline(formatText.baseline || 'middle');
      ctx.font = `${formatText.fontStyle || 'normal'} ${formatText.fontWeight || 'normal'} ${formatText.fontSize}px ${formatText.fontFamily || 'sans-serif'}`;

      let top = formatText.top + formatText.fontSize / 2 || 0;
      let left = formatText.left || 0;
      formatText.textList.forEach((t, i) => {
        ctx.fillText(t, left, top + formatText.lineHeight * i);
      });
      return new Promise((resolve) => {
        ctx.draw(true, () => {
          resolve();
        });
      });
    };

    // 生成图片并返回文件路径
    const getImg = () => {
      return new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: init.width,
          height: init.height,
          destWidth: init.width * 3,
          destHeight: init.height * 3,
          fileType: init.fileType,
          quality: 1,
          canvasId: init.canvasId,
          success(res) {
            resolve(res.tempFilePath);
          },
          fail(e) {
            console.error('生成图片或返回文件路径错误');
            reject(e);
          }
        });
      });
    };

    // 裁剪文本（初级版）
    const cutText = (textInfo) => {
      if (!textInfo.maxLine || textInfo.maxLine <= textInfo.textList.length ) { return textInfo; }
      textInfo.textList.length = textInfo.maxLine;
      const lastLine = textInfo.maxLine - 1;
      textInfo.textList[lastLine].splice(textInfo.textList[lastLine].length - 1, 1);
      return textInfo;
    };

    // 获取多行文本 （初级版）
    const getFormatText = (text) => {
      text.textList = [];
      if (!text.lineHeight) {
        text.lineHeight = isNaN(parseInt(text.fontSize)) ? 0 : parseInt(text.fontSize) * 1.5;
      }
      if (!text.multi) {
        // 单行文本
        text.textList = [text.text];
        return text;
      }
      if (!text.width) {
        console.error('多行文本需传入宽度');
        return;
      } else if (!text.lineHeight) {
        console.error('多行文本没有指定行高');
        return;
      }
      let content = text.text.split('');
      let tempText = '';
      while (content.length > 0) {
        if (tempText.length + 1 > text.width) {   // width 不是文本区域的宽度，而是字符长度
          // 换行
          text.textList.push(tempText);
          tempText = '';
        } else if (1 === content.length) {
          text.textList.push(tempText + content.shift());
        } else {
          tempText += (content.shift());
        }
      }
      text.bottom = text.top + text.textList.length * text.lineHeight;    // 底部坐标
      text = cutText(text);
      if (text.textList.length > 2) {
        const rowCut = text.textList.slice(0, 2)
        const rowPart = rowCut[1].split('')
        let test = '';
        const empty = [];
        for (let a = 0; a < rowPart.length; a++) {
          if (test.length + 1 < text.width) {
            test += rowPart[a];
          }
          else {
            break;
          }
        }
        empty.push(test);
        const group = empty[0] + "..."; //这里只显示两行，超出的用...表示
        rowCut.splice(1, 1, group);
        text.textList = rowCut
      }
      return text;
    };

    // 下载图片
    const downloadImg = (item) => {
      return new Promise((resolve, reject) => {
        wx.downloadFile({
          url: item.url.replace('http://', 'https://'),
          success: function (res) {
            item.tempUrl = res.tempFilePath;
            resolve(item);
          },
          fail: function (err) {
            console.log(err)
            reject('下载图片失败');
          }
        });
      });
    };

    // 绘制填充矩形
    const fillRect = (option) => {
      return new Promise((resolve) => {
        ctx.save();
        ctx.setFillStyle(option.color);
        ctx.fillRect(option.left, option.top, option.width, option.height);
        ctx.restore();

        ctx.draw(true, () => {
          resolve();
        });
      });
    };

    // 绘制非填充矩形
    const strokeRect = (option) => {
      return new Promise((resolve) => {
        ctx.save();
        ctx.setLineWidth(option.lineWidth || 1);
        ctx.setStrokeStyle(option.color);
        ctx.strokeRect(option.left, option.top, option.width, option.height);
        ctx.restore();

        ctx.draw(true, () => {
          resolve();
        });
      });
    };

    // 绘制填充圆形
    const fillArc = (option) => {
      return new Promise((resolve) => {
        const r = option.width / 2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(option.left + r, option.top + r, r, 0, 2 * Math.PI);
        ctx.setFillStyle(option.color);
        ctx.fill();

        ctx.draw(true, () => {
          resolve();
        });
      });
    };

    // 绘制非填充圆形
    const strokeArc = (option) => {
      return new Promise((resolve) => {
        const r = option.width / 2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(option.left + r, option.top + r, r, 0, 2 * Math.PI);
        ctx.setStrokeStyle(option.color);
        ctx.setLineWidth(option.lineWidth || 1);
        ctx.stroke();

        ctx.draw(true, () => {
          resolve();
        });
      });
    };

    // 初始化
    const initCanvas = () => {
      return new Promise((resolve) => {
        if (!options.init) {
          console.error('没有init配置');
          return;
        }
        const init = options.init;
        // ctx.setFillStyle(init.bgColor);
        const grd = ctx.createLinearGradient(0, 0, 0, 493)
        grd.addColorStop(0, '#FF475F')
        grd.addColorStop(1, '#AE0BCF')
        ctx.setFillStyle(grd)
        ctx.save();
        ctx.fillRect(0, 0, init.width, init.height);
        ctx.restore();

        ctx.draw(false, () => {
          resolve();
        });
      });
    };

    const canvasDraw = () => {
      return new Promise((resolve) => {
        const optionList = [];
        const iterator = optionList.entries();
        options.list.forEach((option) => {
          switch (option.type) {
            case 'image':
              optionList.push([option, drawImg]);
              break;
            case 'text':
              optionList.push([option, drawText]);
              break;
            case 'rect-fill':
              optionList.push([option, fillRect]);
              break;
            case 'rect-stroke':
              optionList.push([option, strokeRect]);
              break;
            case 'avatar':
              optionList.push([option, drawAvatar]);
              break;
            case 'arc-fill':
              optionList.push([option, fillArc]);
              break;
            case 'arc-stroke':
              optionList.push([option, strokeArc]);
              break;
            case 'qrcode':
              optionList.push([option, drawQrcode]);
              break;
          }
        });

        // 递归调用的函数
        function draw() {
          const next = iterator.next();
          if (next.done) {
            getImg().then(res => {
              resolve(res);
            });
          } else {
            const value = next.value[1];
            value[1](value[0]).then(() => {
              draw();
            });
          }
        }

        // 启动递归
        draw();
      });
    };


    // 启动绘制
    return initCanvas().then(() => {
      return canvasDraw();
    });
  }
}
