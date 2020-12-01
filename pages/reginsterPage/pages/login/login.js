var interval = null //倒计时函数
var addVerifycodeFun = null //添加短信记录日志定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showView: true,
    openId: '',
    nickName: '',
    time: '获取验证码', //倒计时 
    currentTime: 61,
    lxdh: "",
    isRe:"",
    sfyx:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var urlStr = getApp().globalData.urlStr;
    this.setData({
      urlStr: urlStr
    });
    showView: (options.showView == "true" ? true : false);

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
    var urlStr = that.data.urlStr;
    //表单获取 先关数据
    var formData = e.detail.value;
    console.log(formData);
    var lxdh = formData.lxdh;
    var yzm = formData.yzm;
    var phoneYZM = that.data.phoneYZM; //服务器发送验证码
    var sfyx = 2; //短信验证码是否有效
    var sfdl = 1

    if (lxdh != null && lxdh != "") {
      //判断 用户是否注册
      //判断联系电话是否注册
      wx: wx.request({
        url: urlStr + 'register/isRegisterByLxdh',
        data: {
          lxdh: lxdh
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function (res) {
          if (res.data.data.result != 0) {
            wx.showModal({
              title: '提示',
              content: '该电话号码未注册，请先注册！',
              showCancel: false,
            });
            return;
          } else {
            wx.request({
              url: urlStr + 'register/isRegisterByLxdh',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: "post",
              data: {
                lxdh: lxdh
              },
              success: function (r) {
                console.log(r);

                if (r.data.data != null) {
                  getApp().globalData.wxUserInfo = r.data.data.basicinfo;
                  getApp().globalData.wxUserAllInfo = r.data.data;
                  var jcid = r.data.data.basicinfo.jcid;
                  var openid = getApp().globalData.openId;
                  //保存用户openid 方便下次自动登录
                  wx.request({
                    url: urlStr + 'basicinfo/updateUserOpenId',
                    data: {
                      jcid: jcid,
                      openid: openid
                    },
                    success: function (res) {
                      console.log(res);
                    }
                  })
                  //识别通过  验证手机号
                  if (yzm.length != 0) {
                    if (phoneYZM == yzm) {
                      sfyx = 0;
                      console.log("短信验证成功");
                      console.log(that.data.fsjg);
                      //清空定时器（添加短信验证日志定时器）
                      clearInterval(addVerifycodeFun);
                      //返回服务器 短信验证状态
                      wx.request({
                        url: urlStr + "verifycode/addVerifycode",
                        data: {
                          "fsjg": that.data.fsjg,
                          "sfyx": sfyx,
                          "yzm": phoneYZM
                        },
                        success: function (r) {
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
                        }
                      })
                      
                    } else {
                      console.log("短信验证失败");
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
                    console.log("请输入验证码");
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
                  
                } else {
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
          }
        },
      })

    }
    else {
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
    console.log(yzm);
    this.setData({
      yzm: yzm
    });
  },
  /**
   * 验证码倒计时效果
   */
  getCode: function (options) {
    var that = this;
    var urlStr = that.data.urlStr;
    //判断联系电话是否注册
    wx: wx.request({
      url: urlStr + 'register/isRegisterByLxdh',
      data: {
        lxdh: that.data.lxdh
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        console.log(res);
        if (res.data.data.result == 0) {
          var currentTime = that.data.currentTime;
          interval = setInterval(function () {
            currentTime--;
            that.setData({
              time: currentTime + '秒',
              disabled: true
            })
            if (currentTime <= 0) {
              clearInterval(interval)
              that.setData({
                time: '重新发送',
                currentTime: 61,
                disabled: false,
                isRe: 1,
              })
            }
          }, 1000)

          that.setData({
            disabled: true
          });
          //获取短信验证码
          wx.request({
            url: urlStr + 'register/sendSms',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: "post",
            data: {
              "phone": that.data.lxdh
            },
            success: function (r) {
              if (r.data.state == 0 || r.data.state == -2) {
                var yzm = r.data.data.yzm;
                var fsjg = r.data.data.fsjg;
                //成功
                that.setData({
                  phoneYZM: yzm,
                  fsjg: fsjg,
                });

                //定时器（添加日志）
                addVerifycodeFun = setInterval(function () {
                  //添加日志操作
                  wx.request({
                    url: urlStr + "verifycode/addVerifycode",
                    data: {
                      "fsjg": fsjg,
                      "sfyx": that.data.sfyx,
                      "yzm": yzm
                    },
                    success: function (r) {
                      console.log(r);
                      that.setData({
                        yzm:null
                      });
                      clearInterval(addVerifycodeFun);
                    }
                  })
                }, 180000);

              } else {
                console.log("发送验证码失败");
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
          });


        } else {
          // console.log(that.data.isRe+":=====================");
          wx.showModal({
            title: '提示',
            content: '该电话号码未注册，请先注册！',
            showCancel: false,
          });
          // console.log("--------------------------------sdsadsadsa---");
        }
      },
    })


  },
  /**
   * 获取验证码
   */
  getVerificationCode() {
    var that = this;
    var urlStr = that.data.urlStr;
    var lxdh = that.data.lxdh;
    console.log("lxdh" + lxdh);
    if (lxdh.length == 0 || null == lxdh) {
      wx.showModal({
        title: '提示',
        content: '电话号码为空~~~',
        showCancel: false
      });
    } else {
      //判断是否为重新发送
      if (that.data.time =='重新发送'){
        //清空定时器（添加短信验证日志定时器）
        clearInterval(addVerifycodeFun);
        //添加日志操作
        wx.request({
          url: urlStr + "verifycode/addVerifycode",
          data: {
            "fsjg": that.data.fsjg,
            "sfyx": that.data.sfyx,
            "yzm": that.data.phoneYZM
          },
          success: function (r) {
            that.setData({
              yzm: null
            });
          }
        })
      }
      this.getCode();
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