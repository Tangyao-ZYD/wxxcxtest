Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkedId: 3,
    idNum: 2,
    img_arr: [],
    wsImgName: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var urlStr = getApp().globalData.urlStr;
    that.setData({ urlStr: urlStr });
  },


  // 上传
  /**上传图片 触发方法(营业执照等)*/
  upimg: function() {
    var that = this; 
    var url = getApp().globalData.url;
    if (that.data.img_arr.length < 5) {
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'], // 可以指定来源是相册(album)还是相机(camera)，
        success: function(res) {
          // console.log(res)
          that.setData({
            img_arr: that.data.img_arr.concat(res.tempFilePaths),

          })
          var tempFilePaths = res.tempFilePaths;
          var tPath = res.tempFilePaths[0];

          //执行上传
          wx.uploadFile({
            url: urlStr+'upload/uploadFile',
            filePath: tPath,
            name: 'file',
            formData: {
              'user': 'test'
            },
            success: function(r) {
              var wsImgName = that.data.wsImgName;
              //对上传图片 返回值 进行数据转换
              r.data = JSON.parse(r.data);
              wsImgName += r.data.data + ",";

              that.setData({
                wsImgName: wsImgName
              })
              // console.log(that.data.wsImgName)
            }
          })

        }
      })
    } else {
      wx.showToast({
        title: '最多上传5张图片',
        icon: 'loading',
        duration: 3000
      });
    }
  },
/**
 * 调解报结
 */
  formSubmit: function(e) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    var formData = e.detail.value;

    var tjbg = formData.tjbg;
    var tjjg = formData.tjjg;
    var clmc = that.data.wsImgName;
    //去掉最后一个逗号(如果不需要去掉，就不用写)
    if (clmc.length > 0) {
      clmc = clmc.substr(0, clmc.length - 1);
    }
    var parame = {
      tjbg: tjbg,
      tjjg: tjjg,
      clmc: clmc
    };

		if ((tjbg != null || tjbg != "") && (tjjg != null || tjjg != "") && (clmc != null || clmc != "")) {
      wx.request({
        url: '',
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
                    url: '',
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
        content: '办结未填写完成，请重新输入',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {


          }
        }
      })
    }

  },











  /**
   * 标题点击事件
   */
  checkFun: function(e) {
    //切换选中样式
    var checkedId = e.currentTarget.dataset.index;
    this.setData({
      checkedId: checkedId,
    });
    // console.log("----------" + checkedId)
    if (checkedId == 1) {
      // console.log("----------")
      wx.navigateTo({
        url: "../xqIndex/xqIndex"
      })
    } else if (checkedId == 2) {
      wx.navigateTo({
        url: "../zxtj/zxtj"
      })
    }
  }

})