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
    var urlStr = getApp().globalData.urlStr;
    that.setData({ urlStr: urlStr });
    var lsid = options.lsid;
		console.log(lsid);
    wx.request({
      url: urlStr+'lawyer/queryByLsid',
      data:{lsid:lsid},
      success:function(r){
        console.log(r);
        if(r.data.data != null){
          that.setData({
            lsInfo:r.data.data
          });
        }else{
          lsInfo: null
        }
      }
    })

  }
})