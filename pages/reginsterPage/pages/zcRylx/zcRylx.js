var app = getApp();
Page({

  /**
   * 页面的初始数据*/
  data: {
    yyzz: '',
		frsfzxp_z: "",
    frsfzxp_f: '',
    wts: '',
    zjzp: '',
    date: '请选择',
    showView: 'qy',
    showFont: 0,
    gz: '',
    qylb: '',
    dbjb: '',
    wghy: '',
    type: [],
    showBtn: true,
    typeForPickerIndex: 0,
    wgTypeIndex: 0,
    wghyTypeIndex: 0,
    dbjbForPickerIndex: 0,
    openId: '',
    nickName: '',
    parameForBasicinfo: {},
    frsfzxpImgName_z: {},
    frsfzxpImgName_f: {},
    wtsImgName: '',
    zjzpImgName: '',
    yyzzImgName: '',
		urlStr:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
		var urlStr = getApp().globalData.urlStr;
		var yyzz = urlStr + "show/images?fileName=yyzz.jpg";
		// var frsfzxp_z = urlStr + "show/images?fileName=ida.jpg";
		// var frsfzxp_f = urlStr + "show/images?fileName=idb.jpg";
		var wts = urlStr + "show/images?fileName=wts.jpg";
		var zjzp = urlStr + "show/images?fileName=rddbz.jpg";

    that.setData({
			frsfzxp_z: urlStr + "show/images?fileName=ida.png",
			frsfzxp_f: urlStr + "show/images?fileName=idb.png",
			yyzz: yyzz,
			wts:wts,
			zjzp:zjzp,
      openId: getApp().globalData.openId,
      nickName: getApp().globalData.nickName,
      parameForBasicinfo: options.parameForBasicinfo,
      idcardInfo: options.idcardInfo,
			urlStr: urlStr
    });
    //获取人员类型
    var r = options.rylx;
    //var r = "qy,wg,rddb";
    var arr = [];
    arr = r.split(",");
    //设置 人员类型
    this.setData({
      type: arr
    });

    var that = this
    //查询 下拉框的值(企业)
    wx.request({
			url: urlStr+'dictionary/queryDictionaryInfoByDCode?dCode=wx_user_enterprise',
      success: function(r) {
        //查询成功  并作赋值处理
        if (r.data.data != null) {
          var mr = {
            name: '请选择',
            value: ''
          };
          var rdata = r.data.data;
          var List = [];
          for (var i = 0; i < rdata.length; i++) {
            List[0] = mr
            List[i + 1] = rdata[i];
          }
          that.setData({
            qyArr: List
          })
        }

      },
      fail: function(r) {
        //查询失败
        that.setData({
          qyArr: null
        })
      }
    });

    //查询 下拉框的值(人大代表)
    wx.request({
			url: urlStr+'dictionary/queryDictionaryInfoByDCode?dCode=wx_user_deputies_dbjb',
      success: function(r) {
        //查询成功  并作赋值处理
        if (r.data.data != null) {
          var mr = {
            name: '请选择',
            value: ''
          };
          var list = r.data.data;
          list.unshift(mr)

          that.setData({
            rddbArr: list
          })
        }
      },
      fail: function(r) {
        //查询失败
        that.setData({
          rddbArr: null
        })
      }
    });

    //查询 下拉框的值(务工)
    wx.request({
			url: urlStr+'dictionary/queryDictionaryInfoByDCode?dCode=wx_user_workers_gz',
      success: function(r) {

        if (r.data.data != null) {
          var mr = {
            name: '请选择',
            value: ''
          };
          var wgList = r.data.data;
          wgList.unshift(mr);
        
          that.setData({
            wgArr: wgList
          })

        }
        //查询成功  并作赋值处理
      },
      fail: function(r) {
        //查询失败
        that.setData({
          wgArr: null
        })
      }
    })

    //查询 下拉框的值(务工行业)
    wx.request({
			url: urlStr+'dictionary/queryDictionaryInfoByDCode?dCode=wx_user_workers_wghy',
      success: function(r) {

        if (r.data.data != null) {
          var mr = {
            name: '请选择',
            value: ''
          };
          var wghyList = r.data.data;
          wghyList.unshift(mr);
          that.setData({
            wghyArr: wghyList
          })

        }
        //查询成功  并作赋值处理
      },
      fail: function(r) {
        //查询失败
        that.setData({
          wghyArr: null
        })
      }
    })
  },

  /**类型选择（下拉框） 触发相对应的方法*/
  bindPickerChangeForType: function(e) {
    var that = this
    that.setData({
      typeForPickerIndex: e.detail.value,
      qylb: that.data.qyArr[e.detail.value].value
    });


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
  /**代表级别 选择器 触发方法*/
  bindPickerChangeForDbjb: function(e) {
    var that = this
    that.setData({
      dbjbForPickerIndex: e.detail.value,
      dbjb: that.data.rddbArr[e.detail.value].value
    })
  },

  /**时间选择器 触发方法 */
  bindDateChange: function(e) {
    var that = this
    that.setData({
      date: e.detail.value
    })
  },

  /**上传图片 触发方法(营业执照等)*/
  btnChoose: function(e) {
    var that = this;
    var src = e.target.dataset.index;
    //选择图片
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var tPath = res.tempFilePaths[0];

        //上传图片
        wx.uploadFile({
					url: that.data.urlStr +'upload/uploadFile',
          filePath: tPath,
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function(res) {
						var data_ = JSON.parse(res.data);
            //判断 图片显示地方 上传成功后作相应的操作（图片名称赋值）
            if (src == 'yyzz') {
              that.setData({

                "yyzz": tPath,
								yyzzImgName: data_.data,
              });
            } else if (src == 'frsfzxp_z') {
							
							var frsfzxp = data_.data;
              //身份证正面 信息查询
              wx.request({
								url: that.data.urlStr +'distinguiImagesInfo/showOcrImageByType',
                // data: parameSfzxp,
                data: {
                  ocrType: 0,
                  idcardType: 0,
                  fileName: frsfzxp
                },
                success: function(r) {
									console.log("--------")
									console.log(r)
									console.log("--------")
                  //判断身份证正面信息是否识别成功成功 如果识别失败  则提示用户
                  if (r.data.data == null) {
                    //提示用户身份证正面信息识别失败
                    wx.showModal({
                      title: '提示',
                      content: "身份证正面信息识别失败，请重新上传",
                      showCancel: false,
                      success: function(res) {
                        if (res.confirm) {
                          // console.log("用户点击确定");
                          that.setData({
                            "frsfzxp_z": that.data.frsfzxp_z,
                            // frsfzxpImgName_z: r.data.data,
                          });
                        }
                      }
                    })
                  } else {
                    that.setData({
                      frsfzxp_z: tPath,
											frsfzxpImgName_z: r.data.data,
                      frsfzxp: frsfzxp
                    });
                  }
                }
              });


            } else if (src == 'frsfzxp_f') {
							var frsfzxpbm = data_.data;
              //身份证反面 信息查询
              wx.request({
								url: that.data.urlStr +'distinguiImagesInfo/showOcrImageByType',
                data: {
                  ocrType: 0,
                  idcardType: 1,
                  fileName: frsfzxpbm
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                success: function(r) {
                  //判断身份证反面信息是否识别成功，如果识别失败，则提示用户
                  if (r.data.data == null) {
                    //提示用户身份证反面信息识别失败
                    wx.showModal({
                      title: '提示',
                      content: "身份证反面信息识别失败，请重新上传",
                      showCancel: false,
                      success: function(res) {
                        if (res.confirm) {
                          that.setData({
                            "frsfzxp_f": that.data.frsfzxp_f,
                            // frsfzxpImgName_f: res.data.data,
                          });
                          //身份证反面信息识别失败，则返回上一级页面，提示重新上传身份证照片
                          // wx.navigateBack({
                          //   delta: 1
                          // });
                        }
                      }
                    })
                  } else {
                    //识别信息成功，则赋值页面上的填写框
                    //查询身份证信息
                    that.setData({
                      "frsfzxp_f": tPath,
                      frsfzxpImgName_f: r.data.data,
                      frsfzxpbm: frsfzxpbm
                    });
                  }
                }
              })


            } else if (src == 'zjzp') {
              that.setData({
                "zjzp": tPath,
								zjzpImgName: data_.data,
              });
            } else {
              that.setData({
                "wts": tPath,
                wtsImgName: data_.data,
              });
            }
          }
        })


      }
    })
  },


  /**
   * 企业类别
   */
  qylb_Verification: function(e) {
    var that = this;
    if (e.detail.value) {
      //不为空
      that.setData({
        msg_qylb: "",
        focus_qylb: false
      });
    } else {
      that.setData({
        msg_qylb: "企业类别不能为空，请重新选择",
        focus_qylb: true
      });
    }
  },

  /**
   * 企业机构代码
   */
  jgdm_Verification: function(e) {
    var that = this;
    if (e.detail.value) {
      //不为空
      that.setData({
        msg_jgdm: "",
        focus_jgdm: false
      });
    } else if (e.detail.value.length == 0) {
      that.setData({
        msg_jgdm: "机构代码不能为空，请重新输入",
        focus_jgdm: true
      });
    } else if ((/[\u4E00-\u9FA5]/i.test(e.detail.value))) {
      that.setData({
        msg_jgdm: "机构代码不能为中文，请重新输入",
        focus_jgdm: true
      });
    }

  },
  /**
   * 企业法人姓名
   */
  frxm_Verification: function(e) {
    var that = this;
    if (e.detail.value) {
      //不为空
      that.setData({
        msg_frxm: "",
        focus_frxm: false
      });
    } else {
      that.setData({
        msg_frxm: "法人姓名不能为空，请重新输入",
        focus_frxm: true
      });
    }

    //否则提示不可用 
    that.setData({
      focus: true
    })
  },
  /**
   * 证件号码
   */
  zjhm_Verification: function(e) {
    var that = this;
    if ((/^[0-9]*$/.test(e.detail.value))) {
      //不为空
      that.setData({
        msg_zjhm: "",
        focus_zjhm: false
      });
    } else if (e.detail.value.length == 0) {
      that.setData({
        msg_zjhm: "证件号码不能为空，请重新输入",
        focus_zjhm: true
      });
    } else if (!(/^[0-9]*$/.test(e.detail.value))) {
      that.setData({
        msg_zjhm: "证件号码只能输入数字，请重新输入",
        focus_zjhm: true
      });
    }
  },
  /**
   * 法人身份证号码
   */
  idcard_Verification: function(e) {
    var that = this;
    var idcard = e.detail.value
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if ((reg.test(e.detail.value))) {
      //不为空
      that.setData({
        msg_idcard: "",
        focus_idcard: false
      });
    } else if (e.detail.value.length == 0) {
      that.setData({
        msg_idcard: "证件号码不能为空，请重新输入",
        focus_idcard: true
      });
    } else if (!(reg.test(e.detail.value))) {
      that.setData({
        msg_idcard: "法人身份证号码输入格式错误，请重新输入",
        focus_idcard: true
      });
    }
  },
  /**
   * 联系电话非空验证
   */
  frlxfs_Verification: function(e) {
    var that = this;
    var phone = e.detail.value;
    if ((/^1[34578]\d{9}$/.test(phone))) {
      //不为空
      that.setData({
        msg_frlxfs: "",
        focus_frlxfs: false
      });
    } else if (phone.length == 0) {
      that.setData({
        msg_frlxfs: "联系电话不能为空，请重新输入",
        focus_frlxfs: true
      });
    } else if (!(/^1[34578]\d{9}$/.test(phone))) {
      that.setData({
        msg_frlxfs: "联系电话格式错误，请重新输入",
        focus_frlxfs: false
      });
    }
  },

  /**
   * 营业地址
   */
  yydz_Verification: function(e) {
    var that = this;
    if (e.detail.value) {
      //不为空
      that.setData({
        msg_yydz: "",
        focus_yydz: false
      });
    } else {
      that.setData({
        msg_yydz: "营业地址不能为空，请重新输入",
        focus_yydz: true
      });

    }
  },


  /**
   * 单位
   */
  dw_Verification: function(e) {
    var that = this;
    if (e.detail.value) {
      //不为空
      that.setData({
        msg_dw: "",
        focus_dw: false
      });
    } else {
      that.setData({
        msg_dw: "单位不能为空，请重新输入",
        focus_dw: true
      });

    }

    //否则提示不可用 
    that.setData({
      focus: true
    })
  },


  /**点击完成  执行该方法 进行相对应的注册操作 */
  formSubmit: function(e) {

    //定义this(方便调用)
    var that = this;
    //获取form 表单中的值
    var formData = e.detail.value;
    //定义一个 验证标识（是否填写符合要求  如果符合 则执行 注册操作  否则 提示用户 完善填写内容 -1：企业必填项未填写完成，-2：务工必填项未填写完成-3:人大代表必填项未填写完成，1：符合注册条件（必须填写项都填完））
    var verificationState = 0;

    /** 获取 组件 相对应的 值*/

    //人大代表
    var dbjb = '';
    var dw = '';
    var zw = '';
    var xq = '';
    var dp = '';
    var rddbzxp = '';
    var rddbzzjhm = '';


    //企业
    var qylb = '';
    var zzjgdm = '';
    var frxm = '';
    var frsfzh = '';
    var frlxfs = '';
    var yydz = '';
    var yyzz = '';
    var frsfzxp_z = '';
    var frsfzxp_f = '';
    var qywts = '';
    var frsfzqx = '';

    //务工
    var wghy = '';
    var gz = '';

    //判断用户注册类型（并做相对应的填写项做验证）
    for (var i = 0; i < that.data.type.length; i++) {
      if (that.data.type[i] == 'qy') {
        qylb = that.data.qylb;
        zzjgdm = formData.zzjgdm;
        frxm = formData.frxm;
        frsfzh = formData.frsfzh;
        frlxfs = formData.frlxfs;
        yydz = formData.yydz;
        yyzz = that.data.yyzzImgName;
        frsfzxp_z = that.data.frsfzxp;
        frsfzxp_f = that.data.frsfzxpbm;
        qywts = that.data.wtsImgName;
        frsfzqx = formData.frsfzqx;
        //企业填写项验证
        if ((qylb != null && qylb != "") && (!(/[\u4E00-\u9FA5]/i.test(zzjgdm)) && zzjgdm != null && zzjgdm != "") && (frxm != null && frxm != "") &&
          ((/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(frsfzh)) && frsfzh != null && frsfzh != "") && (frlxfs != null && frlxfs != "") && (yydz != null && yydz != "") &&
          (yyzz != null && yyzz != "") && (frsfzqx != null && frsfzqx != "") &&
          (frsfzxp_z != null && frsfzxp_z != "") && (frsfzxp_f != null && frsfzxp_f != "") && (qywts != null && qywts != "")) {
          //企业填写内容 完成
          verificationState = 1;

        } else {
          //提示 企业填写内容 未填写完成 (结束循环)
          verificationState = -1;
          break;
        }
      } else if (that.data.type[i] == 'wg') {
        wghy = that.data.wghy;
        gz = that.data.gz;
        //务工填写项验证
        if ((wghy != null && wghy != "") && (gz != null && gz != "")) {
          //务工人员填写内容完成
          verificationState = 1;
        } else {
          //提示 务工人员填写内容 未填写完成
          verificationState = -2;
          break;
        }

      } else if (that.data.type[i] == 'rddb') {

        dbjb = that.data.dbjb;
        dw = formData.dw;
        zw = formData.zw;
        xq = formData.xq;
        dp = formData.dp;
        rddbzxp = that.data.zjzpImgName;
        rddbzzjhm = formData.rddbzzjhm;

        //人大代表填写项验证    
        if ((dbjb != null && dbjb != "") && ((/^[0-9]*$/.test(rddbzzjhm)) && rddbzzjhm != null && rddbzzjhm != "") && (dw != null && dw != "") && (rddbzxp != null && rddbzxp != "")) {
          //人大代表内容填写完成
          verificationState = 1;

        } else {

          //提示  人大代表人员填写内容 未填写完成
          verificationState = -3;
          break;
        }
      }
    }

    //判断验证状态是否 符合执行 注册操作  如果 verificationState = 1  则执行
    if (verificationState == 1) {
      //获取基础信息 注册页面第一页的内容(并将其转换为一个json对象)

      that.data.parameForBasicinfo = JSON.parse(that.data.parameForBasicinfo);
      var parameForBasicinfo = that.data.parameForBasicinfo;

      //获取身份证读取出来的信息 注册页面第二页的内容(并将其转换为一个json对象)
      that.data.idcardInfo = JSON.parse(that.data.idcardInfo);
      var idcardInfo = that.data.idcardInfo;
      //定义一个 传入后台的参数 方便传值

      var parame = {
        "dbjb": dbjb,
        "rddbzzjhm": rddbzzjhm,
        "dw": dw,
        "zw": zw,
        "xq": xq,
        "dp": dp,
        "rddbzxp": rddbzxp,
        "qylb": qylb,
        "zzjgdm": zzjgdm,
        "frxm": frxm,
        "frsfzh": frsfzh,
        "frlxfs": frlxfs,
        "frsfzqx": frsfzqx,
        "yydz": yydz,
        "yyzz": yyzz,
        "frsfzxp": frsfzxp_z,
        "frsfzxpbm": frsfzxp_f,
        "sqwts": qywts,
        "wghy": wghy,
        "gz": gz
      };
      //将 第一页 第二页 以及 本页 的数据 整合在同一个对象中
      var obj = Object.assign(parame, parameForBasicinfo, idcardInfo);
      /**后台添加  */
      wx.request({
				url: that.data.urlStr +'register/submitRegister',
        data: parame,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(r) {
          if (r.statusCode == 200) {
            //提示用户 注册完成，请等待审核
            wx.showModal({
              title: '提示',
              content: '注册完成，请等待审核',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  //注册完成  跳转到首页
                  wx.switchTab({
                    url: '../../../../pages/indexPage/index/index',
                  });
                }


              }
            })
          }
        }
      });
    } else if (verificationState == -1) {
      if (qylb == "" && zzjgdm == "" && frlxfs == "" && yydz == "" && yyzz == "" && frsfzqx == "" && frsfzxp_z == "" && qywts == "" && frxm == "" && frsfzh == "" && frsfzxp_f == "") {
        //企业填写内容未填写完整（提示用户）
        wx.showModal({
          title: '提示',
          content: '企业填写内容未填写完整',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
            }
          }
        })
      } else if (qylb == "" || qylb.length == 0) {
        wx.showModal({
          title: '提示',
          content: '企业类别未选择，请重新选择',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
            }
          }
        })
      } else if (zzjgdm == "" && frlxfs == "" && yydz == "") {
        that.setData({
          msg_jgdm: "机构代码不能为空，请重新输入",
          msg_frlxfs: "联系方式不能为空，请重新输入",
          msg_yydz: "营业地址不能为空，请重新输入"
        });
      } else if (zzjgdm == "" || zzjgdm.length == 0) {
        that.setData({
          msg_jgdm: "机构代码不能为空，请重新输入"
        });
        //企业填写内容未填写完整（提示用户）
        wx.showModal({
          title: '提示',
          content: '机构代码不能为空，请重新输入',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
            }
          }
        })
      } else if (/[\u4E00-\u9FA5]/i.test(zzjgdm)) {
        that.setData({
          msg_jgdm: "不能输入中文，请重新输入"
        });
        wx.showModal({
          title: '提示',
          content: '机构代码不能输入中文，请重新输入',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
            }
          }
        })
      } else if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(frsfzh))) {
        that.setData({
          msg_idcard: "法人身份证号码输入格式错误，请重新输入",
          focus_idcard: true
        });
        wx.showModal({
          title: '提示',
          content: '法人身份证号码输入格式错误，请重新输入',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
            }
          }
        })
      } else if (frlxfs == "" || frlxfs.length == 0) {
        that.setData({
          msg_frlxfs: "联系方式不能为空，请重新输入"
        });
        wx.showModal({
          title: '提示',
          content: '联系方式不能为空，请重新输入',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
            }
          }
        })
      } else if (!(/^1[34578]\d{9}$/.test(frlxfs))) {
        that.setData({
          msg_frlxfs: "联系方式格式有误，请重新输入",
          focus_frlxfs: false
        });
        wx.showModal({
          title: '提示',
          content: '联系方式格式有误，请重新输入',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
            }
          }
        })
      } else if (yydz == "" || yydz.length == 0) {
        that.setData({
          msg_yydz: "营业地址不能为空，请重新输入"
        });
        wx.showModal({
          title: '提示',
          content: '营业地址不能为空，请重新输入',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '图片未上传，请重新输入',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
            }
          }
        })
      }



    } else if (verificationState == -2) {
      if (wghy == "" && gz == "" && frxm == "") {
        //务工填写内容未填写完整（提示用户）
        wx.showModal({
          title: '提示',
          content: '务工填写内容未填写完整',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
            }
          }
        })
      } else if (wghy == "" || wghy.length == 0) {
        //务工填写内容未填写完整（提示用户）
        wx.showModal({
          title: '提示',
          content: '务工行业未选择',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
            }
          }
        })
      } else if (gz == "" || gz.length == 0) {
        //务工填写内容未填写完整（提示用户）
        wx.showModal({
          title: '提示',
          content: '工种未选择',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
            }
          }
        })
      }
    } else {
      if (dbjb == "" && dw == "" && rddbzzjhm == "") {
        //人大代表填写内容未填写完整（提示用户）
        wx.showModal({
          title: '提示',
          content: '人大代表填写内容未填写完整',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
            }
          }
        })
      } else if (dbjb == "" || dbjb.length == 0) {
        wx.showModal({
          title: '提示',
          content: '代表级别未选择',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
            }
          }
        })
      } else if (dw == "" || dw.length == 0) {
        that.setData({
          msg_dw: "单位不能为空，请重新输入"
        });
        wx.showModal({
          title: '提示',
          content: '单位不能为空，请重新输入',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
            }
          }
        })
      } else if (rddbzzjhm == "" || rddbzzjhm.length == 0) {
        that.setData({
          msg_zjhm: "代表证件号码不能为空，请重新输入"
        });
        wx.showModal({
          title: '提示',
          content: '代表证件号码未输入',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
            }
          }
        })
      } else if (!(/^[0-9]*$/.test(rddbzzjhm))) {
        that.setData({
          msg_zjhm: "代表证件号码格式有误，请重新输入"
        });
        wx.showModal({
          title: '提示',
          content: '代表证件号码有误',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '代表证相片未上传',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              // console.log('用户点击确定');
            }
          }
        })
      }

    }

  },
  /**
   * 下载委托书
   */
  btnDownLoad: function(e) {
    wx.showModal({
      title: '提示',
      content: '是否下载该文书',
      success: function(res) {
        if (res.confirm) {
          const downloadTask = wx.downloadFile({
            //下载
            url: 'https://www.thinkllwx.cn/SpringBootJT/load/fileDownLoad?fileName=sqwts.doc',
            success: function(res) {
              var filePath = res.tempFilePath;

            }


          });
          downloadTask.onProgressUpdate((res) => {
            wx.showToast({
              title: '下载成功',
              icon: 'succes',
              duration: 1000,
              mask: true
            });
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }


})