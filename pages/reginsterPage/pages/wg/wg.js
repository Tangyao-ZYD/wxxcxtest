Page({

  /**
   * 页面的初始数据
   */
  data: {
    wgTypeIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  /**
   * 工种类型 选择器 触发方法
   */
  bindPickerChangeForType: function (e) {
    this.setData({
      wgTypeIndex: e.detail.value
    })
  },
})