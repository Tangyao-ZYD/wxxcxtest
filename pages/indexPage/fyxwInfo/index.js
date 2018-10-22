var WxParse = require('../../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		urlStr:"",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //查询新闻详情
    var id = options.id;
    var contentType = options.contentType;
		var urlStr = getApp().globalData.urlStr;
		that.setData({
			urlStr: urlStr
		})
    wx.request({
			url: urlStr+'/xwjj/queryWxXwjjByXwid?xwid=' + id,
      success: function (r) {
        //判断查询数据 是否有值
        if (r.data.data.info != null) {
          var zylx = r.data.data.info.zylx;//资源类型 0：文本内容 1：文件
          //判断资源类型
          if (zylx == 0){
            var obj = r.data.data.info;
            that.setData({
              content: obj,
            });
            //富文本内容转换
            WxParse.wxParse('article', 'html', obj.nr, that, 5);
          }else{
            var fileType = r.data.data.fileType;//文件类型
            //下载文件
            wx.downloadFile({
							url: urlStr + 'load/fileDownLoad/' + fileType + '/' + r.data.data.info.nr,
              success: function (res) {
                var filePath = res.tempFilePath;
                //打开文件
                wx.openDocument({
                  filePath: filePath,
                  fileType: fileType,
                  success: function (res) {
                    // console.log('打开文档成功')
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
                console.log('fail1')
                //wx.showModal({ title: 'fail11' });
              },
              complete: function (res) {
                console.log('complete1')
                //wx.showModal({ title: 'complete1' });
              }
            })
          }
          
        }else{
          console.log("查询失败");
        }
      }
    });

  },
  /**
   * 图片预览
   */
  previewImageFun:function(e){s
    var fileName = e.currentTarget.dataset.index;
    if(fileName.length != 0){
      wx.previewImage({
				urls: [urlStr + "show/images?fileName=" + fileName],
      })
    }else{
      console.log("暂无图片预览");
    }
    
  }
  
})