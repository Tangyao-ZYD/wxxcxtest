Page({

  /**
   * 页面的初始数据
   */
  data: {
    dbjbForPickerIndex:0,
    src: '../../images/g.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  /**
   * 人大代表级别 选择器 触发方法
   */
  bindPickerChangeForDbjb: function (e) {
    this.setData({
      dbjbForPickerIndex: e.detail.value
    })
  },
  /**
   * 上传图片 触发方法(营业执照)
   */
  btnChoose: function () {
    var that = this;
    //选择图片
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(res.tempFilePaths[0]);
        that.setData({ "src": res.tempFilePaths[0] });
      }
    })
  }
})