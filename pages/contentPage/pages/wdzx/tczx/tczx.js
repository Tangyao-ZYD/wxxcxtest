var app = getApp();
var num;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cl: "",
    array: ["请选择", "律师", "调解员", "法官"],
    toast1Hidden: true,
    modalHidden: true,
    modalHidden2: true,
    notice_str: '',
    index: 0,
    zxnr: '',
    zxlx: '',
    clList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    that.setData({ urlStr: urlStr });

  },
  // /**上传图片 触发方法(营业执照等)*/
  // upimg: function() {
  //   var that = this;
  //   var urlStr = getApp().globalData.urlStr;
  //   if (that.data.img_arr.length < 5) {
  //     wx.chooseImage({
  //       sizeType: ['compressed'],
  //       sourceType: ['album', 'camera'], // 可以指定来源是相册(album)还是相机(camera)，
  //       success: function(res) {
  //         console.log(res)
  //         that.setData({
  //           img_arr: that.data.img_arr.concat(res.tempFilePaths),

  //         })
  //         var tempFilePaths = res.tempFilePaths;
  //         var tPath = res.tempFilePaths[0];

  //         num = that.data.img_arr.length
  //         //执行上传
  //         wx.uploadFile({
  //           url: urlStr+'upload/uploadFile',
  //           filePath: tPath,
  //           name: 'file',
  //           formData: {
  //             'user': 'test'
  //           },
  //           success: function(r) {
  //             console.log(r);
  //             var clImgName = that.data.clImgName;
  //             //对上传图片 返回值 进行数据转换
  //             r.data = JSON.parse(r.data);
  //             clImgName += r.data.data + ",";

  //             that.setData({
  //               clImgName: clImgName
  //             })
  //             console.log(that.data.clImgName)
  //           }
  //         })

  //       }
  //     })
  //   } else {
  //     wx.showToast({
  //       title: '最多上传5张图片',
  //       icon: 'loading',
  //       duration: 3000
  //     });
  //   }
  // },

  /**上传图片*/
    upimg: function () {
        var that = this;
        var clList = this.data.clList;
        var obj = {};
        if (that.data.clList.length < 5) {
            wx.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'], // 可以指定来源是相册(album)还是相机
                success: function (res) {
                    var tempFilePaths = res.tempFilePaths
                    var tPath = res.tempFilePaths;
                    //循环上传图片
                    for (var i = 0; i < tPath.length; i++) {
                        wx.getImageInfo({
                            src: tPath[i],
                            success: function (res) {

                            }
                        })
                        wx.uploadFile({
                            url: that.data.urlStr + 'upload/uploadFile', //仅为示例，非真实的接口地址
                            filePath: tPath[i],
                            name: 'file',
                            formData: {
                                'user': 'test'
                            },
                            success: function (r) {
                                var data = r.data.data

                                //对上传图片 返回值 进行数据转换
                                r.data = JSON.parse(r.data);
                                clList.push(r.data.data);
                                that.setData({
                                    clList: clList,
                                })

                                wx.showToast({
                                    title: '上传成功',
                                    icon: 'succes',
                                    duration: 1000,
                                    mask: true
                                });
                            },
                            fail: function (r) {
                                wx.showToast({
                                    title: '上传失败',
                                    icon: 'succes',
                                    duration: 1000,
                                    mask: true
                                })
                            }
                        })
                    }
                }
            })
        } else {
            wx.showToast({
                title: '最多上传5张图片',
                icon: 'none',
                duration: 2000
            });

        }
    },

    // 删除图片
    deleteImg: function (e) {
        var clList = this.data.clList;
        var index = e.currentTarget.dataset.index;
        clList.splice(index, 1);
        this.setData({
            clList: clList
        });
    },


  //问题内容
  bindTextAreaBlur: function(e) {
    var that = this;
    that.setData({
      zxnr: e.detail.value
    })
  },
  /**
   * 咨询类型 下拉选择项 触发方法
   */
  bindPickerChangeZxlx: function(e) {
    var that = this;
    // that.setData({
    //   index: e.detail.value,
    //   zxlx: that.data.array[e.detail.value],
    // })
    var fwry = e.detail.value;
    that.setData({
      zxlx: fwry,
      index: e.detail.value,
    })
    console.log(this.data.zxlx);
  },
  //form表单提交
  formSubmit: function(e) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    var formData = e.detail.value;

    var zxzt = formData.zxzt;
    var zxnr = formData.zxnr;
    var zxlx = that.data.zxlx;
    var cl = that.data.clList;
    //去掉最后一个逗号(如果不需要去掉，就不用写)
    // if (cl.length > 0) {
    //   cl = cl.substr(0, cl.length - 1);
    // }

    if (null == zxzt || zxzt == "") {
      wx.showModal({
        title: '提示',
        content: "咨询主题不能为空",
        showCancel: false
      });
      return;
    }
    if (null == zxnr || zxnr == "") {
      wx.showModal({
        title: '提示',
        content: "咨询内容不能为空",
        showCancel: false
      });
      return;
    }
    if (null == zxlx || zxlx == "") {
      wx.showModal({
        title: '提示',
        content: "咨询类型不能为空",
        showCancel: false
      });
      return;
    }
    if (null == cl || cl == "") {
      wx.showModal({
        title: '提示',
        content: "材料不能为空",
        showCancel: false
      });
      return;
    }
    //获取 个人信息 内容
    var wxUserAllInfo = getApp().globalData.wxUserAllInfo;
    var parame = {
      zxzt: zxzt,
      zxnr: zxnr,
      fwry: parseInt(zxlx),
      fj: cl,
      fydm:"510121",
      fqr: wxUserAllInfo.basicinfo.jcid,
    }
    console.log(parame);

    wx.showModal({
      title: '提示',
      content: '确定提交申请',
      showCancel: true,
      success: function (res) {
          if (res.confirm) {
            wx.request({
              url: urlStr+'consultation/addConsulfo',
              data: parame,
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              success: function(res) {
                if (res.data.state == 0) {
                  // 提示用户 申请完成，请等待审核
                  wx.showModal({
                    title: '提示',
                    content: '申请完成，请等待审核',
                    showCancel: false,
                    success: function(res) {
                      if (res.confirm) {
                        //申请完成  跳转到首页
                        wx.navigateTo({
                          url: '../sqcg/sqcg',
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        }
     });
    

  },
  formReset: function() {
    console.log('form发生了reset事件');
    this.modalTap2();
  },
  toast1Change: function(e) {
    this.setData({
      toast1Hidden: true
    });
  },
  //弹出确认框
  modalTap: function(e) {
    this.setData({
      modalHidden: false
    })
  },
  confirm_one: function(e) {
    console.log(e);
    this.setData({
      modalHidden: true,
      toast1Hidden: false,
      notice_str: '提交成功'
    });
  },
  cancel_one: function(e) {
    console.log(e);
    this.setData({
      modalHidden: true,
      toast1Hidden: false,
      notice_str: '取消成功'
    });
  },
  //弹出提示框
  modalTap2: function(e) {
    this.setData({
      modalHidden2: false
    })
  },
  modalChange2: function(e) {
    this.setData({
      modalHidden2: true
    })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },



})