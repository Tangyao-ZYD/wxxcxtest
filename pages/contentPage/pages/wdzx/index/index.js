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
    var rylx = getApp().globalData.wxUserInfo.rylx;
    var jcid = getApp().globalData.wxUserInfo.jcid;
    this.setData({
      rylx: rylx, 
      jcid: jcid,
      urlStr: urlStr
    });
  },
  clickFunPropose:function(e){
    wx.navigateTo({
      url: '../tczx/tczx',
    })
  },
  //咨询列表
  clickFunYzx: function (e) {
    var rylx = this.data.rylx;
    var jcid = this.data.jcid;
    if(rylx == 'ls' || rylx == 'tjy' || rylx == 'zfry'){
      wx.navigateTo({
        url: '../yzx/yzx',
      })
    }else{
      wx.navigateTo({
        url: '../yzxUser/yzxUser',
      })
    }
    
  }
})