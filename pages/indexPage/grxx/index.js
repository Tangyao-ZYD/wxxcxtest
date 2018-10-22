Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEdit: 1,
    nation: ['汉族', '藏族', '裕固族', '彝族', '瑶族', '锡伯族', '乌孜别克族', '维吾尔族', '佤族', '土家族', '土族', '塔塔尔族', '塔吉克族', '水族', '畲族', '撒拉族', '羌族', '普米族', '怒族', '纳西族', '仫佬族', '苗族', '蒙古族', '门巴族', '毛南族', '满族', '珞巴族', '僳僳族', '黎族', '拉祜族', '柯尔克孜族', '景颇族', '京族', '基诺族', '回族', '赫哲族', '哈萨克族', '哈尼族', '仡佬族', '高山族', '鄂温克族', '俄罗斯族', '鄂伦春族', '独龙族', '东乡族', '侗族', '德昂族', '傣族', '达斡尔族', '朝鲜族', '布依族', '布朗族', '保安族', '白族', '阿昌族', '壮族'],
    nationIndex: 0,
    date: '1990-01-01',
    gz: '',
    qylb: '',
    dbjb: '',
    wghy: '',
    lslx: '',
    lszt: '',
    jglb: '' ,
    jb:'',
    dbjbForPickerIndex: 0,
    typeForPickerIndex: 0,
    wgTypeIndex: 0,
    wghyTypeIndex: 0,
    typeOfLawyerPickerIndex:0,
    lsztTypeIndex:0, 
    jglbTypeIndex: 0,
    jbTypeIndex:0,
    sfzxp:'',
    sfzxpbm:'',
    rddbzxp:'',
    yyzz:'',
    frsfzxpbm:'',
    frsfzxp:'',
    sqwts:'',
    lszxp:'',
		disabledType:true,
		disabledTypeXzdz:true,
		urlStr:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //判断是否注册 审核通过
    var isRegister = getApp().globalData.isRegister;
    var isReviewed = getApp().globalData.isReviewed;
		var urlStr = getApp().globalData.urlStr;
		that.setData({ urlStr: urlStr})
    if (isRegister == 1) {
      if (isReviewed == 0) {
        //审核未通过
        wx.showModal({
          title: '提示',
          content: "审核未通过",
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../index/index',
              });
            }
          }
        });
      } else {
        //获取 个人信息 内容
        var wxUserAllInfo = getApp().globalData.wxUserAllInfo;
        that.setData({
          wxUserAllInfo: wxUserAllInfo,
          sfzxp: wxUserAllInfo.basicinfo.sfzxp,
          sfzxpbm: wxUserAllInfo.basicinfo.sfzxpbm,

        });
				//名族选择器下拉填充
        for (var i = 0; i < that.data.nation.length; i++) {
          if (wxUserAllInfo.basicinfo.mz == i) {
            that.setData({
              nationIndex: i,
            });
            break;
          }
        }

        //查询 下拉框的值(企业)
        if (wxUserAllInfo.enterprise != null) {
          wx.request({
						url: urlStr + 'dictionary/queryDictionaryInfoByDCode?dCode=wx_user_enterprise',
            success: function(r) {
              //查询成功  并作赋值处理
              if (r.data.data != null) {
                var mr = {
                  name: '请选择',
                  value: ''
                };
                var qyList = r.data.data;
                qyList.unshift(mr);
                that.setData({
                  qyArr: qyList
                });
                //设置企业类别填写项的值
                for (var i = 0; i < qyList.length; i++) {
                  if (wxUserAllInfo.enterprise.qylb == qyList[i].value) {
                    that.setData({
                      typeForPickerIndex: i
                    });
                    break;
                  }
                }
                
              }

            },
            fail: function(r) {
              //查询失败
              that.setData({
                qyArr: null
              })
            }
          });
        }

        
        if (wxUserAllInfo.deputies != null){
          //查询 下拉框的值(人大代表)
          wx.request({
						url: urlStr + 'dictionary/queryDictionaryInfoByDCode?dCode=wx_user_deputies_dbjb',
            success: function (r) {
              //查询成功  并作赋值处理
              if (r.data.data != null) {
                var mr = {
                  name: '请选择',
                  value: ''
                };
                var list = r.data.data;
                list.unshift(mr);
                that.setData({
                  rddbArr: list
                });
                //设置人大代表级别填写项的值
                for (var i = 0; i < list.length; i++) {
                  if (wxUserAllInfo.deputies.dbjb == list[i].value) {
                    that.setData({
                      dbjbForPickerIndex: i
                    });
                    break;
                  }
                }
              }
            },
            fail: function (r) {
              //查询失败
              that.setData({
                rddbArr: null
              })
            }
          });
        }
        

        //查询 下拉框的值(务工)
        if (wxUserAllInfo.workers != null){
          wx.request({
						url: urlStr + 'dictionary/queryDictionaryInfoByDCode?dCode=wx_user_workers_gz',
            success: function (r) {
              if (r.data.data != null) {
                var mr = {
                  name: '请选择',
                  value: ''
                };
                var wgList = r.data.data;
                wgList.unshift(mr);

                that.setData({
                  wgArr: wgList
                });

                //设置务工人员工种填写项的值
                for (var i = 0; i < wgList.length; i++) {
                  if (wxUserAllInfo.workers.gz == wgList[i].value) {
                    that.setData({
                      wgTypeIndex: i
                    });
                    break;
                  }
                }

                //查询 下拉框的值(务工行业)
                wx.request({
									url: urlStr + 'dictionary/queryDictionaryInfoByDCode?dCode=wx_user_workers_wghy',
                  success: function (r) {

                    if (r.data.data != null) {
                      var mr = {
                        name: '请选择',
                        value: ''
                      };
                      var wghyList = r.data.data;
                      wghyList.unshift(mr);
                      that.setData({
                        wghyArr: wghyList
                      });
                      //设置务工人员行业填写项的值
                      for (var i = 0; i < wghyList.length; i++) {
                        if (wxUserAllInfo.workers.wghy == wghyList[i].value) {
                          that.setData({
                            wghyTypeIndex: i
                          });
                          break;
                        }
                      }


                    }
                    //查询成功  并作赋值处理
                  },
                  fail: function (r) {
                    //查询失败
                    that.setData({
                      wghyArr: null
                    })
                  }
                })
              }
              //查询成功  并作赋值处理
            },
            fail: function (r) {
              //查询失败
              that.setData({
                wgArr: null
              })
            }
          });

          
        }
        //查询 下拉框的值(律师)
        if (wxUserAllInfo.lawyer != null) {
          wx.request({
						url: urlStr + 'dictionary/queryDictionaryInfoByDCode?dCode=wx_user_lawyer_lslx',
            success: function (r) {
              if (r.data.data != null) {
                var mr = {
                  name: '请选择',
                  value: ''
                };
                var lslxList = r.data.data;
                lslxList.unshift(mr);

                that.setData({
                  lslxArr: lslxList
                });

                //设置律师类型填写项的值
                for (var i = 0; i < lslxList.length; i++) {
                  if (wxUserAllInfo.lawyer.lslx == lslxList[i].value) {
                    that.setData({
                      typeOfLawyerPickerIndex: i
                    });
                    break;
                  }
                }

                //查询 下拉框的值(律师状态)
                wx.request({
									url: urlStr + 'dictionary/queryDictionaryInfoByDCode?dCode=wx_user_lawyer_lszt',
                  success: function (r) {

                    if (r.data.data != null) {
                      var mr = {
                        name: '请选择',
                        value: ''
                      };
                      var lsztList = r.data.data;
                      lsztList.unshift(mr);
                      that.setData({
                        lsztArr: lsztList
                      });
                      //设置务工人员行业填写项的值
                      for (var i = 0; i < lsztList.length; i++) {
                        if (wxUserAllInfo.lawyer.lszt == lsztList[i].value) {
                          that.setData({
                            lsztTypeIndex: i
                          });
                          break;
                        }
                      }


                    }
                    //查询成功  并作赋值处理
                  },
                  fail: function (r) {
                    //查询失败
                    that.setData({
                      lsztArr: null
                    })
                  }
                })
              }
              //查询成功  并作赋值处理
            },
            fail: function (r) {
              //查询失败
              that.setData({
                lslxArr: null
              })
            }
          });


        }


        //查询 下拉框的值(政府人员)
        if (wxUserAllInfo.government != null) {
          wx.request({
						url: urlStr + 'dictionary/queryDictionaryInfoByDCode?dCode=wx_user_government_jglb',
            success: function (r) {
              if (r.data.data != null) {
                var mr = {
                  name: '请选择',
                  value: ''
                };
                var jglbList = r.data.data;
                jglbList.unshift(mr);

                that.setData({
                  jblbArr: jglbList
                });

                //设置机构类别填写项的值
                for (var i = 0; i < jglbList.length; i++) {
                  if (wxUserAllInfo.government.jglb == jglbList[i].value) {
                    that.setData({
                      jglbTypeIndex: i
                    });
                    break;
                  }
                }

                //查询 下拉框的值(政府人员级别)
                wx.request({
									url: urlStr + 'dictionary/queryDictionaryInfoByDCode?dCode=wx_user_government_jb',
                  success: function (r) {

                    if (r.data.data != null) {
                      var mr = {
                        name: '请选择',
                        value: ''
                      };
                      var jbList = r.data.data;
                      jbList.unshift(mr);
                      that.setData({
                        jbArr: jbList
                      });
                      //设置务工人员行业填写项的值
                      for (var i = 0; i < jbList.length; i++) {
                        if (wxUserAllInfo.government.jb == jbList[i].value) {
                          that.setData({
                            jbTypeIndex: i
                          });
                          break;
                        }
                      }


                    }
                    //查询成功  并作赋值处理
                  },
                  fail: function (r) {
                    //查询失败
                    that.setData({
                      jbArr: null
                    })
                  }
                })
              }
              //查询成功  并作赋值处理
            },
            fail: function (r) {
              //查询失败
              that.setData({
                jblbArr: null
              })
            }
          });


        }

      }
    } else {
      //未注册 请注册
      wx.showModal({
        title: '提示',
        content: "暂未注册，请到首页注册",
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../index/index',
            });
          }
        }
      });

    }


  },
  /**
   * 编辑按钮
   */
  clickFun: function() {
    var that = this;
    that.setData({
      isEdit: 0,
			disabledTypeXzdz:false,
    });
  },
  /**
   * 性别单选操作
   */
  radioCheckedChangeForSex: function(e) {
    this.setData({
      radioCheckVal: e.detail.value
    });
  },
  /**
   * 时间选择器 触发方法（出生日期）
   */
  bindDateChange: function(e) {
    //  console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  /**
   * 民族 下拉选择项 触发方法
   */
  bindPickerChange: function(e) {
    this.setData({
      nationIndex: e.detail.value,
      mz: this.data.nation[e.detail.value],
    })
  },
  /**代表级别 选择器 触发方法*/
  bindPickerChangeForDbjb: function(e) {
    var that = this
    that.setData({
      dbjbForPickerIndex: e.detail.value,
      dbjb: that.data.rddbArr[e.detail.value].value
    })
  },
  /**工种 选择器 触发方法*/
  bindPickerChangeForwgType: function(e) {
    var that = this
    that.setData({
      wgTypeIndex: e.detail.value,
      gz: that.data.wgArr[e.detail.value].value
    });
  },
  /**务工行业 选择器 触发方法*/
  bindPickerChangeForwghyType: function(e) {
    var that = this
    that.setData({
      wghyTypeIndex: e.detail.value,
      wghy: that.data.wghyArr[e.detail.value].value
    });
  },
  /**企业类别 选择（下拉框） 触发相对应的方法*/
  bindPickerChangeForType: function(e) {
    var that = this
    that.setData({
      typeForPickerIndex: e.detail.value,
      qylb: that.data.qyArr[e.detail.value].value
    });
  },

  /**律师类型 选择（下拉框） 触发相对应的方法*/
  bindPickerChangeTypeOfLawyer: function (e) {
    var that = this
    that.setData({
      typeOfLawyerPickerIndex: e.detail.value,
      lslx: that.data.lslxArr[e.detail.value].value
    });
  },

  /**律师状态 选择（下拉框） 触发相对应的方法*/
  bindPickerChangelszt: function (e) {
    var that = this
    that.setData({
      lsztTypeIndex: e.detail.value,
      lszt: that.data.lsztArr[e.detail.value].value
    });
  },

  /**机构类别 选择（下拉框） 触发相对应的方法*/
  bindPickerChangeJglb: function (e) {
    var that = this
    that.setData({
      jglbTypeIndex: e.detail.value,
      jglb: that.data.jblbArr[e.detail.value].value
    });
  },
  /**政府级别 选择（下拉框） 触发相对应的方法*/
  bindPickerChangeJb: function (e) {
    var that = this
    that.setData({
      jbTypeIndex: e.detail.value,
      jb: that.data.jbArr[e.detail.value].value
    });
  },

/**基本信息验证 */
  
  /**
    * 现住地址非空验证
    */
  xzdxz_Verification: function (e) {
    var that = this;
    if (e.detail.value) {
      //不为空
      that.setData({
        msg_xzdxz: ""
      });
    } else {
      that.setData({
        msg_xzdxz: "现住地址不能为空，请重新输入"
      });
    }
  },

  /**
   * 提交修改信息
   */
  formSubmit:function(e){
    var that = this;
    var formData = e.detail.value;
		//获取 个人信息 内容
		var wxUserAllInfo = getApp().globalData.wxUserAllInfo;

    
    //获取 户籍所在地 现居住地址
    var hjszdxz = formData.hjszdxz;

    //现居住地地址 详情
    var xzdxz = formData.xzdxz;

    //当事人信息
    var xm = formData.xm;
    var xb = formData.xb;
    var lxdh = formData.lxdh;
    var sfzh = formData.sfzh;
    var sfzqx = formData.sfzqx;
    var sfzxpbm = that.data.sfzxpbm;
    var sfzxp = that.data.sfzxp;
    var csrq = formData.csrq;
    var mz = formData.mz;
   
		if (xzdxz == "" || null == xzdxz){
			wx.showModal({
				title: '提示',
				content: "现居住地地址不能为空",
				showCancel: false
			});
			return;
		}
    
      //参数
      var parame = {
        "jcid": wxUserAllInfo.basicinfo.jcid,
        "provinceXz": wxUserAllInfo.basicinfo.provinceXz,
        "cityXz": wxUserAllInfo.basicinfo.cityXz,
        "districtXz": wxUserAllInfo.basicinfo.districtXz,
        "provinceHj": wxUserAllInfo.basicinfo.provinceHj,
        "cityHj": wxUserAllInfo.basicinfo.cityHj,
        "districtHj": wxUserAllInfo.basicinfo.districtHj,
        "openId": wxUserAllInfo.basicinfo.openId,
        "xm": xm,
        "xb": xb,
        "sfzh": sfzh,
        "sfzqx": sfzqx,
        "sfzxp":sfzxp,
        "sfzxpbm":sfzxpbm,
        "csrq": csrq,
        "mz": mz,
        "hjszdxz": hjszdxz,
        "xzdxz": xzdxz,
				"rylx": wxUserAllInfo.basicinfo.rylx,
        "lxdh": lxdh
      };
      //将 第一页 第二页 以及 本页 的数据 整合在同一个对象中
      var obj = Object.assign(parame);
      /**后台添加  */
      wx.request({
				url: that.data.urlStr + 'register/updatePersonalInfo',
        data: parame,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (r) {
          if (r.statusCode == 200) {
              that.setData({
                isEdit: 1
              })
            //提示用户 个人信息修改完成
            wx.showModal({
              title: '提示',
              content: '个人信息修改完成',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
									that.setData({ disabledTypeXzdz:true})
                  //个人信息修改完成
                  wx.switchTab({
                    url: 'grxx/index',
                  });
                }
              }
            })
          }
        }
      });
  },
	/**
		* 展示图片
		*/
	showImg: function (e) {
		//获取data-src
		var src = e.currentTarget.dataset.src;
		var imgList = [src];
		//图片预览
		wx.previewImage({
			current: src, // 当前显示图片的http链接
			urls: imgList // 需要预览的图片http链接列表
		});
	},
  /**
   * 监听页面显示
   */
  onShow: function (e) {
    var that = this;
    //判断是否注册 审核通过
    var isRegister = getApp().globalData.isRegister;
    if (isRegister != 1) {
        //审核未通过
        wx.showModal({
          title: '提示',
          content: "未登录，请登录",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../index/index',
              });
            }
          }
        });
      }
    
  }
})