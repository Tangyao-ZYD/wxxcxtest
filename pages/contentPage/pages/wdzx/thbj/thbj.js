
var app = getApp();
var num;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cl: "https://www.thinkllwx.cn/SpringBootJT/show/images?fileName=addImg.png",
    array: ["请选择","律师", "调解员", "法官"],
    toast1Hidden: true,
    modalHidden: true,
    modalHidden2: true,
    notice_str: '',
    index: 0,
    zxnr: '',
    zxlx: '',
    img_arr: [],
    clImgName:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    that.setData({ urlStr: urlStr });
    var lx = options.lx;
    var zxid = options.zxid;
    that.setData({
      lx:lx,
    });
    console.log(lx);
    //执行查询
    wx.request({
      url: urlStr+'consultation/queryConsulfoById',
      data:{id:zxid},
      success:function(res){
        if (res.data.data != null) {
          that.setData({
            userInfo: res.data.data.userInfo,
            zxInfo: res.data.data.zxInfo,
            pjxxInfo: res.data.data.pjxxInfo,
            zxClList: res.data.data.zxClList
          });
          var imgLen = 5 - (res.data.data.zxClList.length);
          that.setData({
            imgLen: imgLen,
            index:res.data.data.zxInfo.fwry
          });
        }
      }
    })

  },
  /**上传图片 触发方法(营业执照等)*/
  upimg: function () {

    var that = this;
    var urlStr = getApp().globalData.urlStr;
    var imgLen = that.data.imgLen;
    if (that.data.img_arr.length < imgLen) {
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'], // 可以指定来源是相册(album)还是相机(camera)，
        success: function (res) {
          console.log(res)
          that.setData({
            img_arr: that.data.img_arr.concat(res.tempFilePaths),

          })
          var tempFilePaths = res.tempFilePaths;
          var tPath = res.tempFilePaths[0];

          num = that.data.img_arr.length
          //执行上传
          wx.uploadFile({
            url: urlStr+'upload/uploadFile',
            filePath: tPath,
            name: 'file',
            formData: {
              'user': 'test'
            },
            success: function (r) {
              var clImgName = that.data.clImgName;
              //对上传图片 返回值 进行数据转换
              r.data = JSON.parse(r.data);
              clImgName += r.data.data + ",";
              console.log(r.data );
              that.setData({
                clImgName: clImgName
              })
              console.log(that.data.clImgName)
            }
          })

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


  //问题内容
  bindTextAreaBlur: function (e) {
    var that = this;
    that.setData({
      zxnr: e.detail.value
    })
  },
  /**
   * 咨询类型 下拉选择项 触发方法
   */
  bindPickerChange: function (e) {
    var that = this;
    that.setData({
      index: e.detail.value,
      zxlx: that.data.array[e.detail.value],
    })
  },
  //form表单提交
  formSubmit: function (e) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    var wxUserAllInfo = getApp().globalData.wxUserAllInfo;
    var formData = e.detail.value;

    var zxzt = formData.zxzt;
    var zxnr = formData.zxnr;
    var zxlx = formData.zxlx;
    var cl = that.data.clImgName;
    cl += this.data.zxInfo.fj;
    //去掉最后一个逗号(如果不需要去掉，就不用写)
    if (cl.length > 0) {
      cl = cl.substr(0, cl.length - 1);
    }
    var parame = {
      zxzt: zxzt,
      zxnr: zxnr,
      fwry: zxlx,
      fj: cl,
      fqr: wxUserAllInfo.basicinfo.jcid,
    }
    console.log(parame);
    //判断填写项是否完整
    if ((zxzt != null && zxzt != "") && (zxnr != null && zxnr != "") && (zxlx != null && zxlx != 0) && (cl != null && cl != "")) {
      wx.request({
        url: urlStr+'consultation/addConsulfo',
        data: parame,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          if (res.data.state == 0) {
            // 提示用户 申请完成，请等待审核
            wx.showModal({
              title: '提示',
              content: '申请完成，请等待审核',
              showCancel: false,
              success: function (res) {
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
    } else {
      wx.showModal({
        title: '提示',
        content: '申请未填写完成，请重新输入',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {


          }
        }
      })
    }
  },
  formReset: function () {
    console.log('form发生了reset事件');
    this.modalTap2();
  },



  toast1Change: function (e) {
    this.setData({ toast1Hidden: true });
  },
  //弹出确认框
  modalTap: function (e) {
    this.setData({
      modalHidden: false
    })
  },
  confirm_one: function (e) {
    console.log(e);
    this.setData({
      modalHidden: true,
      toast1Hidden: false,
      notice_str: '提交成功'
    });
  },
  cancel_one: function (e) {
    console.log(e);
    this.setData({
      modalHidden: true,
      toast1Hidden: false,
      notice_str: '取消成功'
    });
  },
  //弹出提示框
  modalTap2: function (e) {
    this.setData({
      modalHidden2: false
    })
  },
  modalChange2: function (e) {
    this.setData({
      modalHidden2: true
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
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



})