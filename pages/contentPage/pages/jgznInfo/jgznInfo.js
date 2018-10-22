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
    var urlStr = getApp().globalData.urlStr;
    that.setData({ urlStr: urlStr });

    //获取参数
    var id = options.id;
    //根据id 查询 详情
    wx.request({
      url: urlStr+'xxfz/queryXxById',
      data: { id: id },
      success: function (r) {
        //判断请求返回数据是否为空
        if (r.data.data.info != null) {
          var zylx = r.data.data.info.zylx;//资源类型  0 ：文本内容  1：文件
          //判断资源类型 
          if (zylx == 0){
            var obj = r.data.data.info;
            that.setData({
              content: obj,
            });
            //富文本框内容转换
            WxParse.wxParse('article', 'html', obj.nr, that, 5);
          }else{
            var fileType = r.data.data.fileType;//文件类型
            //下载文件
            wx.downloadFile({
              url: urlStr+'load/fileDownLoad/' + fileType + '/' + r.data.data.info.nr,
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