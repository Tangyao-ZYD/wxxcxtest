var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showView: true,
    openId:'',
    nickName:'',
    time: '获取验证码', //倒计时 
    currentTime: 61,
		urlStr:"",
		lxdh:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    showView: (options.showView == "true" ? true : false);
		var urlStr = getApp().globalData.urlStr;
		this.setData({ urlStr: urlStr})
  },
  /**
   * 切换 登录方式  触发相对应的 函数
   */
  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },

  /**
    * 联系电话非空验证
    */
  lxdh_Verification: function (e) {
    var that = this;
    var phone = e.detail.value;

    if ((/^1[34578]\d{9}$/.test(phone))) {
      //不为空
      that.setData({
        msg_lxdh: "",
        lxdh: phone,
      });
    } else if (e.detail.value.length == 0) {
      that.setData({
        msg_lxdh: "联系电话不能为空，请重新输入"
      });
    } else if (!(/^1[34578]\d{9}$/.test(phone))) {
      that.setData({
        msg_lxdh: "联系电话格式错误，请重新输入"
      });
    }
  },

  /**用户点击登录按钮时触发 该函数 */
  formSubmit: function (e) {

    var that = this;
    //表单获取 先关数据
    var formData = e.detail.value;
    var lxdh = formData.lxdh;
    var yzm = formData.yzm;
    var phoneYZM = that.data.phoneYZM;//服务器发送验证码
    var sfyx = 2;//短信验证码是否有效
    var sfdl = 1

    if (lxdh != null && lxdh !=""){
        wx.request({
					url: that.data.urlStr+'register/isRegisterByLxdh',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          method: "post",
          data: { lxdh: lxdh },
            success: function (r) {
              if(r.data.data != null){
                getApp().globalData.wxUserInfo = r.data.data.basicinfo;
                getApp().globalData.wxUserAllInfo = r.data.data;
                var jcid = r.data.data.basicinfo.jcid;
                var openid = getApp().globalData.openId;
                //保存用户openid 方便下次自动登录
                wx.request({
									url: that.data.urlStr+'basicinfo/updateUserOpenId',
                  data:{jcid:jcid,openid:openid},
                  success:function(res){
                    
                  }
                })
                //识别通过  验证手机号
                if (yzm.length != 0) {
                  if (phoneYZM == yzm) {
                    //查询电话号码存在，登录成功
                    wx.showModal({
                      title: '提示',
                      content: '登录成功',
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                          wx.switchTab({
                            url: '../../../../pages/indexPage/index/index',
                          });
                        }
                       
                      }
                    });


                    
                  } else {
                    // console.log("短信验证失败");
                    sfyx = 1;
                    getApp().globalData.sfdl = 0
                    wx.showModal({
                      title: '提示',
                      content: '短信验证失败',
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                          
                        }
                      }
                    })
                  }
                } else {
                  // console.log("请输入验证码");
                  wx.showModal({
                    title: '提示',
                    content: '请输入验证码',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {

                      }
                    }
                  })
                }


                //返回服务器 短信验证状态
                if (sfyx != 2) {
                  wx.request({
										url: that.data.urlStr+"verifycode/addVerifycode",
                    data: { "fsjg": that.data.fsjg, "sfyx": sfyx, "yzm": phoneYZM },
                    success: function (r) {
											//返回设置状态是否成功
                    }
                  })
                } else {
                  console.log("请等待。。。");
                }

              }else{
                wx.showModal({
                  title: '提示',
                  content: '未注册',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {

                    }
                  }
                });
              }
            }
        })
    }else{
      wx.showModal({
        title: '提示',
        content: '电话号码为空~~~',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
    }
  },

  /**
     * 获取输入的验证码
     */
  btnVerFun: function (e) {
    var yzm = e.detail.value;
		var lxdh = that.data.lxdh;

    this.setData({
      yzm: yzm
    });
  }
  ,
  /**
   * 验证码倒计时效果
   */
  getCode: function (options) {
    
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  },
  getVerificationCode() {
    
    var that = this;

    
    var lxdh = that.data.lxdh;
		if (lxdh.length == 0 || null == lxdh) {
			wx.showModal({
				title: '提示',
				content: '电话号码为空~~~',
				showCancel: false,
				success: function (res) {
					if (res.confirm) {
					}
				}
			});
			console.log("联系电话号码为空")
		}else{
			this.getCode();
			that.setData({
				disabled: true
			});
		}
    if (lxdh.length != 0) {
      //获取短信验证码
      wx.request({
				url: that.data.urlStr+'register/sendSms',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: "post",
        data: { "phone": lxdh },
        success: function (r) {
          if (r.data.state == 0) {
            //成功
            that.setData({
              phoneYZM: r.data.data.yzm,
              fsjg: r.data.data.fsjg,
            });
          } else {
            // console.log("发送验证码失败");
            wx.showModal({
              title: '提示',
              content: '发送验证码失败',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {

                }
              }
            });
          }
        }
      })
    } else {
      // console.log("电话号码为空~~~");
      wx.showModal({
        title: '提示',
        content: '电话号码为空~~~',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {

          }
        }
      });
    }


  },
  /***用户点击注册按钮执行该函数 */
  reBtnFun: function () {
    //查询是否注册（一个账号只能注册一次）
    wx.navigateTo({
      url: '../../pages/jcxx/jcxx',
    })
  }
})