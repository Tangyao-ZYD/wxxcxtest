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
  },
  clickFunWdgt:function(e){
    wx.navigateTo({
      url: '../yzxUser/yzxUser',
    })
  }


})