Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '../../images/userImg.jpg',
    imgName: '',
    multiIndex: [0, 0, 0],
    nation: ['汉族', '藏族', '裕固族', '彝族', '瑶族', '锡伯族', '乌孜别克族', '维吾尔族', '佤族', '土家族', '土族', '塔塔尔族', '塔吉克族', '水族', '畲族', '撒拉族', '羌族', '普米族', '怒族', '纳西族', '仫佬族', '苗族', '蒙古族', '门巴族', '毛南族', '满族', '珞巴族', '僳僳族', '黎族', '拉祜族', '柯尔克孜族', '景颇族', '京族', '基诺族', '回族', '赫哲族', '哈萨克族', '哈尼族', '仡佬族', '高山族', '鄂温克族', '俄罗斯族', '鄂伦春族', '独龙族', '东乡族', '侗族', '德昂族', '傣族', '达斡尔族', '朝鲜族', '布依族', '布朗族', '保安族', '白族', '阿昌族', '壮族'],
    nationIndex: 0,
    mz: '汉族',
    date: '1990-01-01',
    dateFor_sfzqx: '1990-01-01',
    region: ['请选择', '请选择', '请选择'],
    regionNew: ['请选择', '请选择', '请选择'],
    customItem: '请选择',
    items: [{
        name: 'qy',
        value: '企业'
      },
      {
        name: 'rddb',
        value: '人大代表'
      },
      {
        name: 'wg',
        value: '务工人员'
      },
    ],
    focus: true,
    showBtn: true,
    openId: '',
    nickName: '',
    parameForBasicinfo: {},
    urlStr: ""
  },
  /**
   * 生命周期函数--监听页面加载
   *  */
  onLoad: function(options) {

    //将 首页传过来的 值 给本页面赋值
    var openId = getApp().globalData.openId;
    var nickName = getApp().globalData.nickName;
    var urlStr = getApp().globalData.urlStr;
    // var parameForBasicinfo = getApp.globalData.parameForBasicinfo;
    this.setData({
      openId: openId,
      nickName: nickName,
      urlStr: urlStr
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
   * 人员类型选择操作（单选方法）
   */
  radioCheckedChange: function(e) {
    this.setData({
      radioCheckVal: e.detail.value
    });
  },
  /**
   * 时间选择器 触发方法（出生日期）
   */
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  /**
   * 时间选择器 触发方法(身份证期限)
   */
  bindDateChangeFor_sfzqx: function(e) {
    this.setData({
      dateFor_sfzqx: e.detail.value
    })
  },
  /**
   * 省市区 地区联动选择 触发方法（户籍地址）
   */
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },
  /**
   * 省市区 地区联动选择 触发方法（现居住地址）
   */
  bindRegionNewChange: function(e) {
    this.setData({
      regionNew: e.detail.value
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
  /**
   * 人员注册类型 触发方法
   */
  checkboxChange: function(e) {
    if (e.detail.value.length <= 0) {
      this.setData({
        showBtn: true
      });
    } else {
      this.setData({
        showBtn: false
      });
    }
  },
  /**
   * 上传图片 触发方法
   */
  btnChoose: function() {
    var that = this;
    //选择图片
    wx.chooseImage({
      count: 1, // 允许上传张数
      sizeType: ['original', 'compressed'], // 可以指定是原图(original)还是压缩图(compressed)，
      sourceType: ['album', 'camera'], // 可以指定来源是相册(album)还是相机(camera)，
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        //赋值 让其显示
        that.setData({
          "src": res.tempFilePaths[0]
        });
        //上传
        var tPath = res.tempFilePaths[0];
        wx.uploadFile({
          url: that.data.urlStr + 'upload/uploadFile',
          filePath: tPath,
          name: 'file',
          header:  {            
            "Content-Type":   "multipart/form-data",
                        'accept':   'application/json'
          },
            
          formData: {
            'user': 'test'
          },
          success: function(res) {
            //上传成功后作相应的操作（图片名称赋值）
            res.data = JSON.parse(res.data);
            that.setData({
              imgName: res.data.data
            });
          }
        })
      }
    })
  },
  /**
   * 姓名非空验证
   */
  xm_Verification: function(e) {
    var that = this;
    if (e.detail.value) {
      //不为空
      that.setData({
        msg_xm: "",
        focus_xm: false
      });
    } else {
      that.setData({
        msg_xm: "姓名不能为空，请重新输入",
        focus_xm: true
      });
    }
  },
  /**
   * 联系电话非空验证
   */
  lxdh_Verification: function(e) {
    var that = this;
    if (e.detail.value) {
      //电话号码格式验证

      //不为空
      that.setData({
        msg_lxdh: "",
        focus_lxdh: false
      });
    } else {
      that.setData({
        msg_lxdh: "联系电话不能为空，请重新输入",
        focus_lxdh: true
      });
    }
  },
  /**
   * 身份证号码非空验证
   */
  sfzh_Verification: function(e) {
    var that = this;
    if (e.detail.value) {
      //身份证号码格式验证

      //不为空
      that.setData({
        msg_sfzh: "",
        focus_sfzh: false
      });
    } else {
      that.setData({
        msg_sfzh: "身份证号码不能为空，请重新输入",
        focus_sfzh: true
      });
    }
  },


  /**
   * 点击 完成 或 下一步  获取输入的相关数据
   */
  formSubmit: function(e) {
    var that = this;
    var formData = e.detail.value;
    //人员类型
    var rylxArr = formData.rylx;
    var rylx = '';
    if (rylxArr.length != 0) {
      for (var i = 0; i < rylxArr.length; i++) {
        rylx += rylxArr[i] + ',';
      }
    }
    //获取 户籍所在地 现居住地址
    var hj_sheng = formData.ssq[0];
    var hj_shi = formData.ssq[1];
    var hj_qu = formData.ssq[2];
    var hjszdxq = formData.hjszd;

    //现居住地地址 详情
    var xj_sheng = formData.ssq[0];
    var xj_shi = formData.ssq[1];
    var xj_qu = formData.ssq[2];
    var xzdxz = formData.xzdxz;

    //当事人信息
    var xm = formData.xm;
    var xb = formData.xb;
    var lxdh = formData.lxdh;
    // var sfzqx = formData.dateFor_sfzqx;
    var sfzh = formData.sfzh;
    var sfzxp = that.data.imgName;
    var csrq = formData.csrq;
    var mz = that.data.mz;

    var openId = that.data.openId;
    var nickName = that.data.nickName;

    //参数
    var parame = {
      "xm": xm,
      "xb": xb,
      "lxdh": lxdh,
      "sfzh": sfzh,
      "sfzxp": sfzxp,
      "sfzqx": sfzqx,
      "csrq": csrq,
      "mz": mz,
      "hjszdxz": hjszdxq,
      "province_Hj": hj_sheng,
      "city_Hj": hj_shi,
      "district_Hj": hj_qu,
      "xzdxz": xzdxz,
      "province_Xz": xj_sheng,
      "city_Xz": xj_shi,
      "district_Xz": xj_qu,
      "rylx": rylx,
      "openId": openId,
      "wxh": nickName
    };
    //判断填写项是否为空
    if ((xm != null && xm != "") &&
      (lxdh != null && lxdh != "") &&
      (sfzh != null && sfzh != "") &&
      (sfzxp != null && sfzxp != "") &&
      (csrq != null && csrq != "") &&
      (mz != null && mz != "") &&
      (sfzqx != null && sfzqx != "") &&
      (hjszdxq != null && hjszdxq != "") &&
      (hj_sheng != null && hj_sheng != "请选择") &&
      (hj_shi != null && hj_shi != "请选择") &&
      (hj_qu != null && hj_qu != "请选择") &&
      (xzdxz != null && xzdxz != "") &&
      (xj_sheng != null && xj_sheng != "请选择") &&
      (xj_shi != null && xj_shi != "请选择") &&
      (xj_qu != null && xj_qu != "请选择")) {
				
      //如果没有选择人员类型 直接执行完成操作  代表为当事人  否则 跳转 到人员类型页面进行添加
      if (rylx.length <= 0) {
        //if()  判断 必填项都不为空时 执行
        //检测账号的唯一性
        wx.request({
					url: that.data.urlStr+'basicinfo/queryBasicinfo',
          data: {
            zh: formData.zh
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function(r) {
            //成功后 判断是否存在 存在执行，提示用户该账号存在 否知执行注册
            //https://www.thinkll.com/spring-boot.v.0.1/register/submitRegister
            wx.request({
              url: '',
              data: parame,
              success: function(res) {
                if (res.statusCode == 200) {
                  //提示用户 注册完成，请等待审核
                  wx.showModal({
                    title: '提示',
                    content: '注册完成，请等待审核',
                    showCancel: false,
                    success: function(res) {
                      if (res.confirm) {
                        // console.log('用户点击确定');
                        wx.navigateTo({
                          url: '../../pages/index/index',
                        })
                      }
                    }
                  })
                }
              }
            });
          }
        })
      } else {
        var p = parame;
        p = JSON.stringify(p);
        wx.navigateTo({
          url: '../../pages/test/test?openId=' + openId + '&nickName=' + nickName + '&parameForBasicinfo=' + p + '&rylx=' + rylx,
        });
      }
    } else {
      //console.log("请完善填写内容");
      wx.showModal({
        title: '提示',
        content: '请完善填写内容',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            //console.log('用户点击确定');
            //点击确定操作
          }
        }
      })
    }




  }
})