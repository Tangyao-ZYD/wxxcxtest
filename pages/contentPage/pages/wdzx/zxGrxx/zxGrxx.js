Page({

  /**
   * 页面的初始数据
   */
  data: {
    xm:'',
    lxdh:'',
    jl:'',
    tx:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    that.setData({
      xm: options.xm,
      lxdh: options.lxdh,
      jl: options.jl,
      tx: options.tx,
      urlStr: urlStr 
    })
  },

  
})