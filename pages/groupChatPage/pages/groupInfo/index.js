var webim = require('../../../../libs/webim.js');
const {
  emojis,
  emojiToPath,
  textToEmoji
} = require('../../../../libs/emojis');
const inputHeight = 51;
const manageHeight = 79;
const emojiHeight = 171;
const timeouts = [];
let windowHeight;
Page({
  data: {
    msgs: [],
    msgContent: "",
    groupId: "",
    recordFlag: "",
    toView: "",
    nowHistoryMsgSeq: 0,
    recorderManager: "",
    innerAudioContext: "",
    emojiList: [],
    showEmojis: false,
    showFiles: false,
    sysInfo: {},
    scrollHeight: '0',
    scrollTop: 9999,
    disp: "",
    qzcyInfo: [],
  },
  /**
   * 清空输入框
   */
  clearInput: function() {
    this.setData({
      msgContent: ""
    })
  },
  /**
   * 管理群组
   */
  manage: function() {
    getApp().globalData.qzid = this.data.groupId;
    //跳转管理群组页面
    wx.navigateTo({
      url: "../manageGroup/index"
    })
  },
  /**
   * 视频通话
   */
  videoCall: function() {
    //登出
    webim.logout(
      function(resp) {
        webim.Log.info('登出成功');
        console.log('IM登出成功');
      }
    );
    //跳转视频房间列表页面
    wx.navigateTo({
      url: "../../../videoCallPage/pages/multiroom/roomlist/roomlist"
    })
  },
  /**
   * 群组消息存至本地数据库
   */
  storeMsg: function(xxnr, xxlx) {
    var that = this;

    var urlStr = getApp().globalData.urlStr;

    var jcid = getApp().globalData.wxUserInfo.jcid;
    var qzid = that.data.groupId;

    //调用接口群组消息存至本地数据库
    wx.request({
      url: urlStr+"im/addQzxx",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        "jcid": jcid,
        "qzid": qzid,
        "xxnr": xxnr,
        "xxlx": xxlx
      },
      success: function(r) {
        // console.log(r);
      }
    });
  },
  /**
   * 播放录音
   */
  playR: function(e) {
    var voice = e.currentTarget.dataset.index;
    // var voice = 'C:/Users/Administrator/Desktop/20180806154150892.silk';
    // console.log(voice);
    //播放声音文件  
    // wx.playVoice({
    //   filePath: voice,
    //   success: function () {
    //     console.log("播放成功");
    //   }
    // })
    this.data.innerAudioContext.src = voice;
    this.data.innerAudioContext.play();
  },
  /**
   * 开始录音
   */
  startR: function() {
    var that = this;
    //设置录音开始标志
    that.setData({
      recordFlag: 1
    });
    that.data.recorderManager.start({
      format: 'mp3' // 如果录制acc类型音频则改成aac 
    });

    //录音
    // wx.startRecord({
    //   success: function (e) {
    //     var voice = e.tempFilePath;
    //     //执行上传
    //     wx.uploadFile({
    //       url: 'https://www.thinkllwx.cn/spring-boot/upload/uploadFile',
    //       filePath: voice,
    //       name: 'file',
    //       success: function (res) {
    //         //对上传文件 返回值 进行数据转换
    //         res.data = JSON.parse(res.data);
    //         //返回服务器存的文件名
    //         console.log(res.data.data);
    //         var fileName = res.data.data;
    //         var src = 'https://www.thinkllwx.cn/spring-boot/upload/' + fileName;
    //         //发送群组消息(语音)
    //         that.onSendMsg(src, "2", function (res) {
    //           console.log("发送语音成功")
    //         }, function (res) {
    //           console.log("发送语音失败")
    //         })
    //       }
    //     });
    //   }
    // })
  },
  /**
   * 结束录音
   */
  stopR: function() {
    //结束  
    // wx.stopRecord();
    this.data.recorderManager.stop();

    //设置录音结束标志
    this.setData({
      recordFlag: 0
    })
  },
  /**
   * 选中图片
   */
  choosePicture: function() {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    //选择图片
    wx.chooseImage({
      count: 1, // 允许上传张数
      sizeType: ['compressed'], // 可以指定是原图(original)还是压缩图(compressed)，
      sourceType: ['album', 'camera'], // 可以指定来源是相册(album)还是相机(camera)，
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        //临时路径
        var tPath = res.tempFilePaths[0];
        var width;
        var height;
        //获取图片信息
        wx.getImageInfo({
          src: tPath,
          success: function(res) {
            width = res.width;
            height = res.height
            // console.log(width + "-----" + height);
          }
        })
        //执行上传
        wx.uploadFile({
          url: urlStr+'upload/uploadFile',
          filePath: tPath,
          name: 'file',
          success: function(res) {
            //对上传图片 返回值 进行数据转换
            res.data = JSON.parse(res.data);
            //返回服务器存的文件名
            // console.log(res.data.data);
            var fileName = res.data.data;
            var src = urlStr+'show/images?fileName=' + fileName;
            //构建云通信消息中的图片元素 图片大小类型/size/宽/高/路径
            var picture_obj = new webim.Msg.Elem.Images.Image(3, 0, 2, 2, src);
            // console.log(picture_obj);
            //发送群组消息(图片)
            that.onSendMsg(picture_obj, "1", function(res) {
              console.log("发送图片成功")
            }, function(res) {
              console.log("发送图片失败")
            })
          }
        });
      }
    })
  },
  /**
   * 修改昵称
   */
  setProfilePortrait: function(options) {
    webim.setProfilePortrait(options,
      function(res) {
        console.log(res);
        console.log("修改昵称成功");
        webim.Log.info('修改昵称成功');
      },
      function(err) {
        console.log(err);
        console.log("修改昵称失败");
      }
    );
  },
  /**
   * 发送群组消息 0普通1图片2语音
   */
  onSendMsg: function(msg, msgType, callback) {
    var that = this;
    //用户信息对象
    //基础id
    var jcid = getApp().globalData.wxUserInfo.jcid;
    //昵称
    var nickName = getApp().globalData.wxUserInfo.xm;

    //群组ID
    var selToID = this.data.groupId;
    //会话类型
    var selType = webim.SESSION_TYPE.GROUP;
    //会话
    var selSess = null;
    //获取消息内容
    var msgtosend = msg;
    console.log(msgtosend);

    //文本+表情
    if (msgType == "0") {
      //获取消息内容长度
      var msgLen = webim.Tool.getStrBytes(msg);
      //判断消息内容是否为空
      if (msgtosend.length < 1) {
        console.error("发送的消息不能为空!");
        return;
      }
      var maxLen, errInfo;
      //获取规定群组消息内容最大长度
      maxLen = webim.MSG_MAX_LENGTH.GROUP;
      errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
      //判断消息内容是否超出限制
      if (msgLen > maxLen) {
        console.error(errInfo);
        return;
      }
    }

    //从存储会话中获取指定会话
    selSess = webim.MsgStore.sessByTypeId(webim.SESSION_TYPE.GROUP, selToID);
    if (!selSess) { //不存在则新建会话
      selSess = new webim.Session(selType, selToID, selToID, "selSessHeadUrl", Math.round(new Date().getTime() / 1000));
    }


    var isSend = true; //是否为自己发送
    var seq = -1; //消息序列，-1表示sdk自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
    var msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
    var subType; //消息子类型
    //webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息
    subType = webim.GROUP_MSG_SUB_TYPE.COMMON;

    //构建消息模型
    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, jcid, subType, nickName);

    //解析文本+表情
    if (msgType == "0") {
      var expr = /\[[^[\]]{1,3}\]/mg;
      var emotions = msgtosend.match(expr);
      console.log(emotions)
      var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
      if (!emotions || emotions.length < 1) { //无表情
        text_obj = new webim.Msg.Elem.Text(msgtosend);
        msg.addText(text_obj);
      } else { //有表情
        for (var i = 0; i < emotions.length; i++) {
          tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]));
          if (tmsg) {
            text_obj = new webim.Msg.Elem.Text(tmsg);
            msg.addText(text_obj);
          }
          emotionIndex = webim.EmotionDataIndexs[emotions[i]];
          // emotion = webim.Emotions[emotionIndex];
          console.log(emotionIndex)
          console.log(emotion)
          if (emotionIndex >= 0 & emotionIndex <= 20) {
            face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
            msg.addFace(face_obj);
          } else {
            text_obj = new webim.Msg.Elem.Text(emotions[i]);
            msg.addText(text_obj);
          }
          restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length;
          msgtosend = msgtosend.substring(restMsgIndex);
        }
        if (msgtosend) {
          text_obj = new webim.Msg.Elem.Text(msgtosend);
          msg.addText(text_obj);
        }
      }
    }
    //解析图片
    if (msgType == "1") {
      var random = Math.round(Math.random() * 4294967296); //消息随机数
      //构建消息元素对象(图片数组) 	图片id
      var picture = new webim.Msg.Elem.Images(random + "");

      picture.addImage(msgtosend);
      msg.addImage(picture);
    }
    //解析语音
    if (msgType == "2") {
      var random = Math.round(Math.random() * 4294967296); //消息随机数
      //现版本不支持语音 改为模拟文件
      //构建消息元素对象(文件) 文件id/文件名/大小/发送者账号/下载地址
      var voice = new webim.Msg.Elem.File(random + "", msgtosend, 0, jcid, "url");
      msg.addFile(voice);
    }
    // console.log(123);

    //调用api发送消息
    webim.sendMsg(msg, function(resp) {
      console.log("发消息成功");
      // console.log(msg);
      if (msgType == "0") {

        var msgStr = "{'elems':[";
        for (var i = 0; i < msg.elems.length; i++) {
          if (msg.elems[i].type == "TIMTextElem") {
            msgStr += "{'type':'text','content':'" + msg.elems[i].content.text + "'},";
          } else {
            msgStr += "{'type':'emoji','content':" + msg.elems[i].content.index + "},";
          }
        }
        msgStr = msgStr.substring(0, msgStr.length - 1);
        msgStr += "]}";
        that.storeMsg(msgStr, "text");
      } else if (msgType == "1") {
        that.storeMsg(msg.elems["0"].content.ImageInfoArray["0"].url, "image");
      } else if (msgType == "2") {
        that.storeMsg(msg.elems["0"].content.name, "sound");
      }
      webim.Log.info("发消息成功");
      callback && callback();
    }, function(err) {
      webim.Log.error("发消息失败:" + err.ErrorInfo);
      console.error("发消息失败:" + err.ErrorInfo);
    });
  },
  /**
   * 回车触发发送消息
   */
  bindConfirm: function() {
    var that = this;
    //获取输入框内容
    var content = this.data.msgContent;
    if (!content.replace(/^\s*|\s*$/g, '')) return;
    //发送群组消息(文本+表情)
    that.onSendMsg(content, "0", function() {
      that.clearInput();
    })
  },
  /**
   * 展示图片
   */
  showImg: function(e) {
    //获取data-src
    var src = e.currentTarget.dataset.src;
    // var src = 'https://www.thinkllwx.cn/spring-boot/show/images?fileName=btnbg.png';

    var imgList = [src];
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    });
  },
  /**
   * 滑动到顶部
   */
  upper: function() {
    var that = this;
    var groupId = that.data.groupId;
    var nowHistoryMsgSeq = that.data.nowHistoryMsgSeq;
    console.log(nowHistoryMsgSeq);
    if (nowHistoryMsgSeq == 0) {
      wx.showModal({
        title: '提示',
        content: '无更多历史消息',
        success: function(res) {
          // if (res.confirm) {
          //   console.log('用户点击确定')
          // } else {
          //   console.log('用户点击取消')
          // }
        }
      })
    } else {
      //拉取群组漫游消息
      webim.syncGroupMsgs({
        "GroupId": groupId,
        "ReqMsgSeq": nowHistoryMsgSeq,
        "ReqMsgNumber": 10 //请求数 unreadMsgNum + 10
      }, function(resp) {
        console.log("查询成功------------------", resp);
        var newMsg;
        var msgs = [];
        for (var i in resp) {
          newMsg = resp[i];
          //处理消息
          var msg = that.dealMsg(newMsg);
          msgs.push(msg);
        }
        //展示历史消息
        that.showHistoryMsgs(msgs);
        //设置历史消息记录,为加载更多历史消息准备参数
        if (nowHistoryMsgSeq > 10) {
          that.setData({
            nowHistoryMsgSeq: nowHistoryMsgSeq - 10
          });
        } else {
          that.setData({
            nowHistoryMsgSeq: 0
          });
        }
      }, function(err) {
        console.log("查询失败------------------", err.ErrorInfo)
      });
    }
  },
  /**
   * 展示历史消息
   */
  showHistoryMsgs: function(data) {
    //获取当前显示消息
    var msgs = this.data.msgs || [];
    //新获取到的历史消息
    var newMsgs = data;
    //数组合并
    newMsgs = newMsgs.concat(msgs);
    //赋值
    this.setData({
      msgs: newMsgs
    })
  },
  /**
   * 展示消息
   */
  showMsgs: function(data) {
    //获取当前显示消息
    var msgs = this.data.msgs || [];
    //加入新消息
    msgs.push(data);
    // console.log(msgs)
    //赋值
    this.setData({
      msgs: msgs
    })
    this.goBottom(500);
  },
  /**
   * 处理消息
   */
  dealMsg: function(msg) {
    // console.log(1111);
    console.log(msg);
    //获取发送者ID
    var fromAccount = msg.getFromAccount();
    //获取发送者昵称
    var fromAccountNick = msg.getFromAccountNick();
    if (fromAccountNick == "@TIM#SYSTEM") {
      fromAccountNick = "系统"
    }
    //获取是否自己发送
    var isSend = msg.getIsSend();
    //获取random
    var random = "r" + msg.getRandom();
    //解析群消息
    var content = this.convertMsgtoHtml(msg);
    //获取消息类型
    var xxType = msg.elems["0"].type;
    if (msg.elems.length > 1) {
      xxType = "textAndFace"
    } else if (msg.elems["0"].type == "TIMTextElem") {
      xxType = "textAndFace"
    } else if (msg.elems["0"].type == "TIMFaceElem") {
      xxType = "textAndFace"
    }

    return {
      fromAccountNick: fromAccountNick,
      content: content,
      xxType: xxType,
      random: random,
      isSend: isSend
    }
  },
  /**
   * 解析群消息
   */
  convertMsgtoHtml: function(msg) {
    var html = "",
      elems, elem, type, content;
    var array = [];
    var data;
    //获取消息包含的元素数组
    elems = msg.getElems();
    for (var i in elems) {
      elem = elems[i];
      type = elem.getType(); //获取元素类型
      content = elem.getContent(); //获取元素对象
      switch (type) {
        case webim.MSG_ELEMENT_TYPE.TEXT:
          // html += this.convertTextMsgToHtml(content);
          data = {
            "elemData": this.convertTextMsgToHtml(content),
            "elemType": "text"
          };
          array.push(data);
          break;
        case webim.MSG_ELEMENT_TYPE.FACE:
          // html += this.convertFaceMsgToHtml(content);
          data = {
            "elemData": this.convertFaceMsgToHtml(content),
            "elemType": "face"
          };
          array.push(data);
          break;
        case webim.MSG_ELEMENT_TYPE.IMAGE:
          html += this.convertImageMsgToHtml(content);
          break;
        case webim.MSG_ELEMENT_TYPE.SOUND:
          html += this.convertSoundMsgToHtml(content);
          break;
        case webim.MSG_ELEMENT_TYPE.FILE:
          html += this.convertFileMsgToHtml(content);
          break;
        case webim.MSG_ELEMENT_TYPE.LOCATION: //暂不支持地理位置
          //html += convertLocationMsgToHtml(content);
          break;
        case webim.MSG_ELEMENT_TYPE.CUSTOM:
          html += convertCustomMsgToHtml(content);
          break;
        case webim.MSG_ELEMENT_TYPE.GROUP_TIP:
          html += this.convertGroupTipMsgToHtml(content);
          // console.log(html)
          break;
        default:
          webim.Log.error('未知消息元素类型: elemType=' + type);
          break;
      }
    }
    // return webim.Tool.formatHtml2Text(html);
    if (array.length == 0) {
      return html;
    } else {
      return array;
    }
  },
  /**
   * 解析文本消息元素
   */
  convertTextMsgToHtml: function(content) {
    return content.getText();
  },
  /**
   * 解析表情消息元素
   */
  convertFaceMsgToHtml: function(content) {
    // console.log(content);
    return content.getIndex();
    // return content.getData();
    // return content;
    var faceUrl = null;
    var data = content.getData();
    var index = webim.EmotionDataIndexs[data];
    faceUrl = "../groupImages/emojis/" + index + ".gif";

    // var emotion = webim.Emotions[index];
    // if (emotion && emotion[1]) {
    //   faceUrl = emotion[1];
    // }
    if (index >= 0 & index <= 20) {
      return "<image src='" + faceUrl + "' class='emoji'></image>";
    } else {
      return data;
    }
  },
  /**
   * 解析图片消息元素
   */
  convertImageMsgToHtml: function(content) {
    // console.log(content);
    var smallImage = content.getImage(webim.IMAGE_TYPE.SMALL); //小图
    var bigImage = content.getImage(webim.IMAGE_TYPE.LARGE); //大图
    var oriImage = content.getImage(webim.IMAGE_TYPE.ORIGIN); //原图
    if (!bigImage) {
      bigImage = smallImage;
    }
    if (!oriImage) {
      oriImage = smallImage;
    }
    // return "<image src='" + smallImage.getUrl() + "#" + bigImage.getUrl() + "#" + oriImage.getUrl() + "' style='CURSOR: hand' id='" + content.getImageId() + "' bigImgUrl='" + bigImage.getUrl() + "' onclick='imageClick(this)' />";
    return smallImage.getUrl();
  },
  /**
   * 解析语音消息元素
   */
  convertSoundMsgToHtml: function(content) {
    // var second = content.getSecond();//获取语音时长
    // var downUrl = content.getDownUrl();
    // if(webim.BROWSER_INFO.type == 'ie' && parseInt(webim.BROWSER_INFO.ver) <= 8) {
    //   return '[这是一条语音消息]demo暂不支持ie8(含)以下浏览器播放语音,语音URL:' + downUrl;
    // }
    // return '<audio src="' + downUrl + '" controls="controls" onplay="onChangePlayAudio(this)" preload="none"></audio>';
    // return downUrl;
  },
  /**
   * 解析文件消息元素
   */
  convertFileMsgToHtml: function(content) {
    // console.log(content);
    var fileSize = Math.round(content.getSize() / 1024);
    // return '<a href="' + content.getDownUrl() + '" title="点击下载文件" ><i class="glyphicon glyphicon-file">&nbsp;' + content.getName() + '(' + fileSize + 'KB)</i></a>';
    return content.getName();
  },
  /**
   * 解析群提示消息元素
   */
  convertGroupTipMsgToHtml: function(content) {
    var WEB_IM_GROUP_TIP_MAX_USER_COUNT = 10;
    var text = "";
    var maxIndex = WEB_IM_GROUP_TIP_MAX_USER_COUNT - 1;
    var opType, opUserId, userIdList;
    var memberCount;
    opType = content.getOpType(); //群提示消息类型（操作类型）
    opUserId = content.getOpUserId(); //操作人id
    switch (opType) {
      case webim.GROUP_TIP_TYPE.JOIN: //加入群
        userIdList = content.getUserIdList();
        //text += opUserId + "邀请了";
        for (var m in userIdList) {
          text += userIdList[m] + ",";
          if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
            text += "等" + userIdList.length + "人";
            break;
          }
        }
        text = text.substring(0, text.length - 1);
        text += "进入房间";
        //房间成员数加1
        // memberCount = $('#user-icon-fans').html();
        memberCount = parseInt(memberCount) + 1;
        break;
      case webim.GROUP_TIP_TYPE.QUIT: //退出群
        text += opUserId + "离开房间";
        //房间成员数减1
        if (memberCount > 0) {
          memberCount = parseInt(memberCount) - 1;
        }
        break;
      case webim.GROUP_TIP_TYPE.KICK: //踢出群
        text += opUserId + "将";
        userIdList = content.getUserIdList();
        for (var m in userIdList) {
          text += userIdList[m] + ",";
          if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
            text += "等" + userIdList.length + "人";
            break;
          }
        }
        text += "踢出该群";
        break;
      case webim.GROUP_TIP_TYPE.SET_ADMIN: //设置管理员
        // text += opUserId + "将";
        text += opUserId + "设置了新的管理员";
        // userIdList = content.getUserIdList();
        // console.log(content);
        // for (var m in userIdList) {
        //   // text += userIdList[m] + ",";
        //   text += userIdList[m];
        //   if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
        //     text += "等" + userIdList.length + "人";
        //     break;
        //   }
        // }
        // text += content.userinfo["0"].NickName+"设为管理员";
        break;
      case webim.GROUP_TIP_TYPE.CANCEL_ADMIN: //取消管理员
        text += opUserId + "取消了旧的管理员";
        userIdList = content.getUserIdList();
        // for (var m in userIdList) {
        //   // text += userIdList[m] + ",";
        //   text += userIdList[m];
        //   if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
        //     text += "等" + userIdList.length + "人";
        //     break;
        //   }
        // }
        // text += "以前的管理员资格";
        break;

      case webim.GROUP_TIP_TYPE.MODIFY_GROUP_INFO: //群资料变更
        text += opUserId + "修改了群资料";
        // var groupInfoList = content.getGroupInfoList();
        // var type, value;
        // for (var m in groupInfoList) {
        //   type = groupInfoList[m].getType();
        //   value = groupInfoList[m].getValue();
        //   switch (type) {
        //     case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.FACE_URL:
        //       text += "群头像为" + value + "; ";
        //       break;
        //     case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NAME:
        //       text += "群名称为" + value + "; ";
        //       break;
        //     case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.OWNER:
        //       text += "群主为" + value + "; ";
        //       break;
        //     case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NOTIFICATION:
        //       text += "群公告为" + value + "; ";
        //       break;
        //     case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.INTRODUCTION:
        //       text += "群简介为" + value + "; ";
        //       break;
        //     default:
        //       text += "未知信息为:type=" + type + ",value=" + value + "; ";
        //       break;
        //   }
        // }
        break;

      case webim.GROUP_TIP_TYPE.MODIFY_MEMBER_INFO: //群成员资料变更(禁言时间)
        text += opUserId + "修改了群成员资料:";
        var memberInfoList = content.getMemberInfoList();
        var userId, shutupTime;
        for (var m in memberInfoList) {
          userId = memberInfoList[m].getUserId();
          shutupTime = memberInfoList[m].getShutupTime();
          text += userId + ": ";
          if (shutupTime != null && shutupTime !== undefined) {
            if (shutupTime == 0) {
              text += "取消禁言; ";
            } else {
              text += "禁言" + shutupTime + "秒; ";
            }
          } else {
            text += " shutupTime为空";
          }
          if (memberInfoList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
            text += "等" + memberInfoList.length + "人";
            break;
          }
        }
        break;
      default:
        text += "未知群提示消息类型：type=" + opType;
        break;
    }
    return text;
  },
  /**
   * 生命周期函数--监听该页面用户下拉刷新事件
   */
  onPullDownRefresh: function() {
    var that = this;
    var groupId = that.data.groupId;
    var nowHistoryMsgSeq = that.data.nowHistoryMsgSeq;
    // console.log(nowHistoryMsgSeq);
    if (nowHistoryMsgSeq == 0) {
      wx.showModal({
        title: '提示',
        content: '无更多历史消息',
        success: function(res) {
          // if (res.confirm) {
          //   console.log('用户点击确定')
          // } else {
          //   console.log('用户点击取消')
          // }
        }
      })
    } else {
      //拉取群组漫游消息
      webim.syncGroupMsgs({
        "GroupId": groupId,
        "ReqMsgSeq": nowHistoryMsgSeq,
        "ReqMsgNumber": 10 //请求数 unreadMsgNum + 10
      }, function(resp) {
        console.log("查询成功------------------", resp);
        var newMsg;
        var msgs = [];
        for (var i in resp) {
          newMsg = resp[i];
          //处理消息
          var msg = that.dealMsg(newMsg);
          msgs.push(msg);
        }
        //展示历史消息
        that.showHistoryMsgs(msgs);
        //设置历史消息记录,为加载更多历史消息准备参数
        if (nowHistoryMsgSeq > 10) {
          that.setData({
            nowHistoryMsgSeq: nowHistoryMsgSeq - 10
          });
        } else {
          that.setData({
            nowHistoryMsgSeq: 0
          });
        }
      }, function(err) {
        console.log("查询失败------------------", err.ErrorInfo)
      });
    }
    wx.stopPullDownRefresh();
  },
  // 隐藏表情选择框
  hideEmojis: function() {
    this.setData({
      showEmojis: false
    });
  },
  // 隐藏或显示表情选择框
  toggleEmojis: function() {
    const {
      showEmojis,
      showFiles
    } = this.data;
    if (showFiles) {
      this.setData({
        showEmojis: true,
        showFiles: false
      });
    } else {
      if (showEmojis) {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight - manageHeight}px`,
          showEmojis: !showEmojis
        })
      } else {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight - emojiHeight - manageHeight}px`,
          showEmojis: !showEmojis
        });
        this.goBottom(50);
      }
    }
  },
  // 隐藏或显示图片选择框
  toggleFiles: function() {
    const {
      showEmojis,
      showFiles
    } = this.data;
    if (showEmojis) {
      this.setData({
        showEmojis: false,
        showFiles: true
      });
    } else {
      if (showFiles) {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight - manageHeight}px`,
          showFiles: !showFiles
        })
      } else {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight - emojiHeight - manageHeight}px`,
          showFiles: !showFiles
        });
        this.goBottom(50);
      }
    }
  },
  inputFocus: function() {
    const {
      showEmojis,
      showFiles
    } = this.data;
    if (showEmojis || showFiles) {
      this.setData({
        scrollHeight: `${windowHeight - inputHeight - manageHeight}px`,
        showEmojis: false,
        showFiles: false,
      });
    }
  },

  blurInput: function(e) {
    console.log(e);
    this.setData({
      msgContent: e.detail.value
    })
  },
  // 点击滚动框
  scrollClick: function() {
    const {
      showEmojis,
      showFiles
    } = this.data;
    if (showEmojis || showFiles) {
      this.setData({
        scrollHeight: `${windowHeight - inputHeight - manageHeight}px`,
        showEmojis: false,
        showFiles: false,
      });
    }
  },
  // 滚动聊天
  goBottom: function(n = 0) {
    timeouts.push(setTimeout(() => {
      this.setData({
        scrollTop: 9999
      })
    }, n))
  },
  // 点击表情
  clickEmoji: function(e) {
    const {
      key
    } = e.currentTarget.dataset;
    const {
      msgContent
    } = this.data;
    this.setData({
      msgContent: msgContent + key
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
		var tjzt = options.tjzt;
    that.setData({ 
			urlStr: urlStr,
			tjzt: tjzt,
			});
    // 获取表情包
    const emojiList = Object.keys(emojis).map(key => ({
      key: key,
      img: emojiToPath(key)
    }))
    // 获取屏幕高度信息
    const sysInfo = wx.getSystemInfoSync()
    windowHeight = sysInfo.windowHeight
    const scrollHeight = `${windowHeight - inputHeight - manageHeight}px`;
    // 更新状态
    this.setData({
      emojiList,
      sysInfo,
      scrollHeight,
      disp: 1
    })

    //获取全局变量中的人员类型
    var rylx = getApp().globalData.wxUserInfo.rylx;
    console.log(rylx)
    var arr = [];
    arr = rylx.split(",");
    for (var j in arr) {
      if (arr[j] == "tjy") {
        that.setData({
          disp: 0
        });
      }
    }

    //获取全局变量中的基础ID和姓名以及签名鉴权
    var jcid = getApp().globalData.wxUserInfo.jcid;
    console.log(jcid)
    var xm = getApp().globalData.wxUserInfo.xm;
    var usersig = getApp().globalData.wxUserInfo.usersig;
    //获取页面传递过来的群组id和当前最大消息数以及未读消息数量
    var groupId = options.groupId;
    getApp().globalData.groupId = groupId;
    var nowMsgSeq = options.nowMsgSeq;
    var unreadMsgNum = options.unreadMsgNum;
    console.log(groupId + "-----" + nowMsgSeq + "-----" + unreadMsgNum);

    //用户信息对象
    var loginInfo = {
      'sdkAppID': 1400116995, //用户标识接入SDK的应用ID，必填。
      'appIDAt3rd': 1400116995, //App 用户使用 OAuth 授权体系分配的 Appid，必填 
      'identifier': jcid, //用户帐号，必填   （这个就是自己服务器里，每个用户的账号，可以自己设置）
      'identifierNick': xm, //用户昵称，选填
      'accountType': 32114, //账号类型，必填   (这个可以在后台管理看到，但是腾讯的文档上是没有这个的！！！但是这个必须填，不填报错）
      'userSig': usersig //鉴权 Token，identifier 不为空时，必填   我觉得这个也是必填的，这个需要在一开始就从后端获取。
    };
    //事件回调对象 监听事件
    var listeners = {
      "onConnNotify": onConnNotify, //监听连接状态回调变化事件,必填
      "onMsgNotify": onMsgNotify //监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
    };
    //监听连接状态回调变化事件
    var onConnNotify = function(resp) {
      var info;
      switch (resp.ErrorCode) { //链接状态码
        case webim.CONNECTION_STATUS.ON:
          webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
          break;
        case webim.CONNECTION_STATUS.OFF:
          info = '连接已断开，无法收到新消息，请检查下您的网络是否正常: ' + resp.ErrorInfo;
          alert(info);
          webim.Log.warn(info);
          break;
        case webim.CONNECTION_STATUS.RECONNECT:
          info = '连接状态恢复正常: ' + resp.ErrorInfo;
          alert(info);
          webim.Log.warn(info);
          break;
        default:
          webim.Log.error('未知连接状态: =' + resp.ErrorInfo); //错误信息
          break;
      }
    };
    //监听新消息事件  注：其中参数 newMsgList 为 webim.Msg 数组，即 [webim.Msg]。
    //newMsgList 为新消息数组，结构为[Msg]
    function onMsgNotify(newMsgList) {
      var newMsg;
      for (var j in newMsgList) { //遍历新消息
        newMsg = newMsgList[j];
        if (newMsg.sess._impl.id == groupId) { //获取属于当前群组的消息
          //处理消息
          var msg = that.dealMsg(newMsg);
          console.log(msg);
          //展示消息
          that.showMsgs(msg);
          console.log(newMsg.seq);
          that.setData({
            toView: msg.random
          });
          //设置消息已读
          // var tmpOpt = {
          //   'GroupId': groupId,
          //   'MsgReadedSeq': newMsg.seq
          // };
          // webim.groupMsgReaded(tmpOpt, function (resp) {
          //   console.log("成功已读");
          // }, function (err) {
          //   console.log("失败已读------------------", err.ErrorInfo)
          // });
        }
      }
    };
    //云通信登录
    webim.login(loginInfo, listeners, options, function(resp) {
      console.log("登录成功");

      //获取个人资料
      webim.getProfilePortrait({
        "To_Account": [jcid],
        "TagList": [
          "Tag_Profile_IM_Nick"
        ]
      }, function(resp) {
        console.log("获取个人资料成功------------------");
        console.log(resp);
        console.log(resp.UserProfileItem["0"].ProfileItem);
        if (resp.UserProfileItem["0"].ProfileItem == undefined || resp.UserProfileItem["0"].ProfileItem["0"].Value == jcid) {
          //修改昵称
          that.setProfilePortrait({
            'ProfileItem': [{
              "Tag": "Tag_Profile_IM_Nick",
              "Value": xm
            }]
          });
        }
      }, function(err) {
        console.log("获取个人资料失败------------------" + err);
      });
      //拉取群组漫游消息
      webim.syncGroupMsgs({
        "GroupId": groupId,
        "ReqMsgSeq": nowMsgSeq,
        "ReqMsgNumber": 10 //请求数 unreadMsgNum + 10
      }, function(resp) {
        console.log("查询成功------------------");
        var newMsg;
        var msgs = [];
        for (var i in resp) {
          newMsg = resp[i];
          //处理消息
          var msg = that.dealMsg(newMsg);
          msgs.push(msg);
        }
        //展示历史消息
        that.showHistoryMsgs(msgs);
        //设置历史消息记录,为加载更多历史消息准备参数
        if (nowMsgSeq > 10) {
          that.setData({
            nowHistoryMsgSeq: nowMsgSeq - 10
          });
        }
        // 设置群成员未读消息数量
        wx.request({
          url: urlStr+"im/setUnreadNum",
          data: {
            "jcid": jcid,
            "qzid": groupId
          },
          success: function(r) {
            console.log(r);
          }
        });

      }, function(err) {
        console.log("查询失败------------------", err.ErrorInfo)
      });
    }, function(err) {
      console.log("登录失败------------------", err.ErrorInfo)
    });
    //获取全局唯一的录音管理器
    var recorderManager = wx.getRecorderManager();
    recorderManager.onError(function() {
      // 录音失败的回调处理
      console.log("录音失败");
    });
    recorderManager.onStop(function(res) {
      // 停止录音之后，把录取到的音频放在res.tempFilePath
      console.log(res.tempFilePath);
      var voice = res.tempFilePath;
      //执行上传
      wx.uploadFile({
        url: urlStr+'upload/uploadFile',
        filePath: voice,
        name: 'file',
        success: function(res) {
          //对上传文件 返回值 进行数据转换
          res.data = JSON.parse(res.data);
          //返回服务器存的文件名
          console.log(res.data.data);
          var fileName = res.data.data;
          var src = urlStr+'upload/' + fileName;
          //发送群组消息(语音)
          that.onSendMsg(src, "2", function(res) {
            console.log("发送语音成功")
          }, function(res) {
            console.log("发送语音失败")
          })
        }
      });
    });
    var innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.onError((res) => {
      // 播放音频失败的回调
      console.log(res);
    });

    //获取所有群组成员信息
    wx.request({
      url: urlStr+'im/queryQzcyListAndQzjlByQzid',
      data: {
        qzid: groupId
      },
      success: function(res) {

        var qzcyInfo = res.data.data.qzcy;
        console.log(qzcyInfo);
        that.setData({
          qzcyInfo: res.data.data.qzcy
        })
      }
    })

    that.setData({
      groupId: groupId,
      recorderManager: recorderManager,
      innerAudioContext: innerAudioContext,
    });
  }
})