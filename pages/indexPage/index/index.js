//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openId:'',
    nickName:'',
    openIdIsExit:0,
    sfdl: '',
		urlStr:"",
    offset: 0,
    limit: 5,
  },
	bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
  },
  /***进入小程序  直接加载 触发该方法 检测登录状态 检测账号是否注册等相关操作 */
  onLoad: function (e) {
    var that = this;

		// var urlStrIng = "https://www.thinkllwx.cn/SpringBootJT/";
		var urlStrIng = "https://www.jtxwx.cn/SpringBootJT/";
		getApp().globalData.urlStr = urlStrIng;
		var urlStr = getApp().globalData.urlStr
		that.setData({urlStr: urlStr})
    wx.login({
      success: function (r) {
        var code = r.code;//登录凭证
        // console.log("code:" + code);
        if (code != null && code != "") {
          //给 nickName 赋值
          //查询 用户的openId 根据 code
          wx.request({
						url: urlStr + 'decodeUser/wxUserInfo',
            data: {code:code},
            success: function (res) {
              //已注册 执行查询相对应的权限 并将用户的 openId保存下来 方便该页面其他方法中 调用
              // console.log(res.data.data);
              that.setData({ openId: res.data.data });
              getApp().globalData.openId = res.data.data;
              //查询成功 通过oenid 查询 是否注册
              if (res.data.data) {
                //查询 openId  是否存在 
                wx.request({
									url: urlStr + 'register/isRegister',
                  data: { openId: res.data.data },
                  success: function (r) {
                    if (r.data.data == null) {
                      //设置 该openid 并未注册过 
                      that.setData({ 
                        openIdIsExit: 0,
                        isRegister:0, 
                      });
                      // console.log("未注册 则显示基础功能");
                      getApp().globalData.isRegister = 0;
                    } else {
                      //标注 openid 注册过
                      that.setData({ 
                        openIdIsExit: 1 ,
                        isRegister:1,
                      });
                      getApp().globalData.isRegister = 1;
                      //检测是否审核通过
                      wx.request({
												url: urlStr + 'login/verification',
                        data:{
                          openId:that.data.openId,
                        },
                        success:function(r){
                          if (r.data.data == null){
                            //审核未通过
                            getApp().globalData.isReviewed = 0;
                            //标注 用户注册 是否通过审核
                            that.setData({
                              isReviewed: 0,
                            });
                          }else{
                            //审核通过
                            getApp().globalData.isReviewed = 1;
                            getApp().globalData.wxUserInfo = r.data.data.basicinfo;
                            getApp().globalData.wxUserAllInfo = r.data.data;
                            //标注 用户注册 是否通过审核
                            that.setData({
                              isReviewed: 1,
                              sfdl: getApp().globalData.wxUserInfo.sfdl
                            });


                          }
                        }
                      });
                    }
                    var news = {
                      xwlx: 'wx_xwjj_xwlx_1',
                      offset: 0,
                      limit: 5,
                    }

                    //查询新闻 ?xwlx=wx_xwjj_xwlx_1
                    wx.request({
                      url: urlStr + 'xwjj/queryWxWxXwjjList',
                      data: news,
                      success: function (r) {
                        var arr = r.data.data;
                        if (arr != null) {
                          that.setData({
                            news: arr,
                          });
                        } else {
                          that.setData({
                            news: null,
                          });
                        }

                      }
                    });
                  }
                })
              } else {
                //如果openId 不存在，提示用户  查询openId失败
                console.log("查询openId失败");
              }
            }
          })
           
        } else {
          console.log('获取用户登录态失败！' + r.errMsg)
        }
      },
      fail: function () {
        console.log('登陆失败');
      }
    });
    
  },
  onShow:function(e){
    var that = this;
   
    wx.login({
      success: function (r) {
        var code = r.code;//登录凭证
        if (code != null && code != "") {
          //给 nickName 赋值
          //查询 用户的openId 根据 code
          wx.request({
						url: that.data.urlStr + 'decodeUser/wxUserInfo',
            data: { code: code },
            success: function (res) {
              //已注册 执行查询相对应的权限 并将用户的 openId保存下来 方便该页面其他方法中 调用
              that.setData({ openId: res.data.data });
              getApp().globalData.openId = res.data.data;
            
              //查询成功 通过oenid 查询 是否注册
              if (res.data.data) {
                //查询 openId  是否存在 
                wx.request({
									url: that.data.urlStr + 'register/isRegister',
                  data: { openId: res.data.data },
                  success: function (r) {
                    if (r.data.data == null) {
                      //设置 该openid 并未注册过 
                      that.setData({
                        openIdIsExit: 0,
                        isRegister: 0,
                      });
                      // console.log("未注册 则显示基础功能");
                      getApp().globalData.isRegister = 0;
                    } else {
                      //标注 openid 注册过
                      that.setData({
                        openIdIsExit: 1,
                        isRegister: 1,
                      });
                      getApp().globalData.isRegister = 1;
                      //检测是否审核通过
                      wx.request({
												url: that.data.urlStr + 'login/verification',
                        data: {
                          openId: that.data.openId,
                        },
                        success: function (r) {
                          if (r.data.data == null) {
                            //审核未通过
                            getApp().globalData.isReviewed = 0;
                            //标注 用户注册 是否通过审核
                            that.setData({
                              isReviewed: 0,
                            });
                          } else {
                            //审核通过
                            getApp().globalData.isReviewed = 1;
                            getApp().globalData.wxUserInfo = r.data.data.basicinfo;
                            getApp().globalData.wxUserAllInfo = r.data.data;
                            //标注 用户注册 是否通过审核
                            that.setData({
                              isReviewed: 1,
                              sfdl: getApp().globalData.wxUserInfo.sfdl
                            });
                          }
                        }
                      });
                    }
                    var news = {
                      xwlx: 'wx_xwjj_xwlx_1',
                      offset: 0,
                      limit: 5,
                    }
                    //查询新闻
                    wx.request({
                      url: that.data.urlStr + 'xwjj/queryWxWxXwjjList',
                      data: news,
                      success: function (r) {
                        var arr = r.data.data;
                        if (arr != null) {
                          that.setData({
                            news: arr,
                          });
                        } else {
                          that.setData({
                            news: null,
                          });
                        }

                      }
                    });

                  }
                })
              } else {
                //如果openId 不存在，提示用户  查询openId失败
                console.log("查询openId失败");
              }
            }
          })

        } else {
          console.log('获取用户登录态失败！' + r.errMsg)
        }
      },
      fail: function () {
        console.log('登陆失败');
      }
    });
  },
  /**登录注册 触发方法（跳转到相对应的页面） */
  // loginFun:function(e){
  //   var that = this;
  //   // 查看是否授权
  //   wx.getSetting({
  //     success: function (res) {
  //       if (res.authSetting['scope.userInfo']) {
  //         that.getUserInfoFun();
  //       }
  //     }
  //   });
    
  // },
  loginFun: function (e) {
    var that = this;
  
    //判断该用户是否存在
    //获取前台传入 参数并作相应的判断（opedId,是否存在作为判断依据）
    var openIdIsExit = that.data.openIdIsExit;

      //跳转到 登录页面
      wx.navigateTo({
        url: '../../../pages/reginsterPage/pages/login/login',
      });
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            that.getUserInfoFun();
          }
        }
      });
      //如果不存在 则跳转到 注册页面(基础页面)
      // wx.navigateTo({
      //   url: '../../../pages/reginsterPage/pages/jcxx/jcxx?openId=' + that.data.openId + '& nickName=' + that.data.nickName,
      // });

  },

  /**
   * 获取用户信息
   */
  getUserInfoFun:function(){
    
    var that = this;
    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    wx.getUserInfo({
      success: function (res) {
        getApp().globalData.nickName = res.userInfo.nickName;
        
        //判断该用户是否存在
        //获取前台传入 参数并作相应的判断（opedId,是否存在作为判断依据）
        var openIdIsExit = that.data.openIdIsExit;

        if (openIdIsExit == 0) {
          //如果不存在 则跳转到 注册页面(基础页面)
          wx.navigateTo({
            url: '../../../pages/reginsterPage/pages/jcxx/jcxx'
          });
        } else {
          //判断是否审核通过  未通过则提示用户
          var isReviewed = that.data.isReviewed;
          if (isReviewed == 0) {
            // console.log("用户注册过，暂未通过审核");
            wx.showModal({
              title: '提示',
              content: '正在审核，请等待...',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {

                }
              }
            })
          } else {
            console.log("用户注册，通过审核");
          }
        }
      }
    })
  },
  /**
   * 查询更多功能
   */
  queryMoreMenu:function(e){
    //进入更多功能页面
    wx.navigateTo({
      url: '../../../pages/indexPage/moreMenu/index',
    });
  },
  /**
   * 点击功能按钮 做相应的页面跳转
   */
  queryContentInfo:function(e){
    var qxbm = e.currentTarget.dataset.id;
    var zsfs = e.currentTarget.dataset.index;
    if (zsfs == 'wx_juris_zsfs_1'){
      //简介类（法院简介、诉服中心简介等等）
     // console.log("简介类功能");
      // wx.navigateTo({
      //   url: '../../../pages/contentPage/pages/content/content?qxbm='+qxbm,
      // });
    } else if (zsfs == 'wx_juris_zsfs_2'){
      //新闻
      wx.navigateTo({
        url: '../../../pages/indexPage/fyxw/fyxw?xwlx=' + qxbm,
      });
    } else if (zsfs == 'wx_juris_zsfs_3'){
      //二级简介类（机构职能、法律法规等等）
      //console.log("二级简介类功能");
			console.log("qxbm : " + qxbm);
      wx.navigateTo({
				url: '../../../pages/contentPage/pages/jgzn/index?gndm=' + qxbm,
      });
    } else if (zsfs == 'wx_juris_zsfs_4'){
      //console.log("成员分工类功能");
      wx.navigateTo({
        url: '../../../pages/contentPage/pages/cyfg/cyfg',
      });
    } else if (zsfs == 'wx_juris_zsfs_5'){
      //console.log("法官名册功能");  
      wx.navigateTo({
        url: '../../../pages/contentPage/pages/fgmc/fgmc',
      });
    }
  },
 
  /**
   * 点击法治动态 查看动态信息
   */
  // queryNewInfo: function (e) {
  //   var id = e.currentTarget.id;
  //   wx.navigateTo({
  //     url: '../../../pages/indexPage/fzdtInfo/fzdtInfo?id=' + id,
  //   });
  // },
  /**
   * 地图
   */
  mapFun:function(e){
    wx.navigateTo({
      url: "../../../pages/indexPage/map/index",
    })
  },
  

  /**
     * 点击新闻 查看新闻信息
     */
  queryNewInfo: function (e) {
    var id = e.currentTarget.id;
    var zylx = e.currentTarget.dataset.index;
    var urlStr = this.data.urlStr;
    if (zylx != 1) {
      //跳转到 新闻详情页面
      wx.navigateTo({
        url: '../../../pages/indexPage/fyxwInfo/index?id=' + id,
      });
    } else {
      wx.request({
        url: urlStr + 'xwjj/queryWxXwjjByXwid?xwid=' + id,
        success: function (r) {
          //判断查询数据 是否有值
          if (r.data.data.info != null) {
            var zylx = r.data.data.info.zylx;//资源类型 0：文本内容 1：文件
            //判断资源类型
            var fileType = r.data.data.fileType;//文件类型
            //下载文件
            wx.downloadFile({
              url: urlStr + 'load/fileDownLoad/' + fileType + '/' + r.data.data.info.nr,
              success: function (res) {
                var filePath = res.tempFilePath;
                //打开文件
                wx.openDocument({
                  filePath: filePath,
                  fileType: fileType,
                  success: function (res) {
                    console.log('打开文档成功')
                  },
                  fail: function (res) {
                    console.log('fail')
                  },
                  complete: function (res) {
                    console.log('complete')
                  }
                })
              },
              fail: function (res) {
                console.log('fail1')
                //wx.showModal({ title: 'fail11' });
              },
              complete: function (res) {
                console.log('complete1')
                //wx.showModal({ title: 'complete1' });
              }
            })

          } else {
            console.log("查询失败");
          }
        }
      });
    }

  },
  /**
   * 智能问答
   */
  clickFunWeb: function (e) {
    wx.navigateTo({
      url: '../znwd/index',
    })
  },
  /**
   * 调解员信息
   */
  queryTjyInfo: function (e) {
    wx.navigateTo({
      url: '../../contentPage/pages/tjymc/index/index',
    })
  },
	
})
