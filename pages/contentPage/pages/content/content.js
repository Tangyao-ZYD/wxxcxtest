var WxParse = require('../../../../utils/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    //获取请求地址
    var urlStr = getApp().globalData.urlStr;
    //将请求地址设置在本页data 中  方便其他方法中调用
    that.setData({ urlStr: urlStr });

    //获取参数
    var qxbm = options.qxbm;
    //查询简介详情
    wx.request({
      url: urlStr+'jjxx/queryJjxxByJjlx?jjlx=' + qxbm,
      success: function (r) {
        //判断查询是否成功  返回值是否为空
        if (r.data.data != null) {
          var zylx = r.data.data.ZYLX;
          if (zylx == 0) {
            var obj = r.data.data;
            that.setData({
              content: obj,
            });
            //富文本内容转换
            WxParse.wxParse("article", "html", obj.JJNR, that, 5);
          } else {
            var fileType = r.data.data.FILETYPE;
            //下载文件
            wx.downloadFile({
              url: urlStr+'load/fileDownLoad/'+fileType+'/'+r.data.data.JJNR,
              success: function (res) {
                var filePath = res.tempFilePath;
                //打开文件
                wx.openDocument({
                  filePath: filePath,
                  fileType: fileType,
                  success: function (res) {
                    console.log('打开文件功')
                  },
                  fail: function (res) {
                    //console.log('fail')
                  },
                  complete: function (res) {
                   // console.log('complete')
                  }
                })
              },
              fail: function (res) {
                //console.log('fail1')
               //wx.showModal({ title: 'fail11' });
              },
              complete: function (res) {
                //console.log('complete1')
                //wx.showModal({ title: 'complete1' });
              }
            })
          }

        }
      }
    });
  },

})