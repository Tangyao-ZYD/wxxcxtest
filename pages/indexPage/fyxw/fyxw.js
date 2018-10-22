var WxParse = require('../../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		urlStr:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
		var urlStr = getApp().globalData.urlStr;
		that.setData({urlStr: urlStr})
    var xwlx = options.xwlx; //新闻类型
    //查询法院新闻列别信息wx_xwjj_xwlx_2
    wx.request({
			url: urlStr + 'xwjj/queryWxWxXwjjList?xwlx=' + xwlx,
      success:function(r){
        //判断 查询出的数据 是否为空 
        var arr = r.data.data;
        if(r.data.data != null){
          that.setData({
            news: arr,
          });
        }else{
          that.setData({
            news: null,
          });
        }

      }
    });
  },
  /**
   * 点击新闻 查看新闻信息
   */
  queryNewInfo: function (e) {
    var id = e.currentTarget.id;
    //跳转到 新闻详情页面
    wx.navigateTo({
      url: '../../../pages/indexPage/fyxwInfo/index?id=' + id,
    });
  }

})