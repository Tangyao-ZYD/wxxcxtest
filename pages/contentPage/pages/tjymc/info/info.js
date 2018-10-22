Page({

  /**
   * 页面的初始数据
   */
  data: {
    curHdIndex: 5  //默认5星好评 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var tjyid = options.tjyid;
    var urlStr = getApp().globalData.urlStr;
    that.setData({ urlStr: urlStr });
    wx.request({
      url: urlStr+'mediator/queryByTjyid',
      data: { tjyid: tjyid},
      success:function(r){
        
        if(r.data.data != null){
          that.setData({
            tjyInfo:r.data.data
          });
        }else{
          tjyInfo: null
        }
      }
    })

  }
})