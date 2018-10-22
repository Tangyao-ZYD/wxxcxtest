Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr:[],
    limit:20,
    offset:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var parame = { limit:20, offset:0}
    var urlStr = getApp().globalData.urlStr;
    that.setData({ urlStr: urlStr });
    wx.request({
      url: urlStr+'lawyer/queryAll',
      data:parame,
      success:function(r){
        console.log(r);
        if(r.data.data != null){
          that.setData({
            arr:r.data.data,
          });
        }else{
          that.setData({
            arr: null,
          });
        }
      }
    });  
  },
  /**
   * 点击加载更多
   */
  loadMoreFun:function(e){
    var that = this;
    var arr = that.data.arr;
    var urlStr = getApp().globalData.urlStr;
    var limit = that.data.limit;
    var offset = that.data.offset+20;

    var parame = { limit: limit, offset:offset }

    wx.request({
      url: urlStr+'lawyer/queryAll',
      data:parame,
      success:function(r){
        if(r.data.data != null){
          for (var i = 0; i < r.data.data.length; i++) {
            console.log(r.data.data[i]);
            arr.push(r.data.data[i]);
          }
          that.setData({
            arr: arr,
            offset: offset
          });
        }else{
          wx.showToast({
            title: '暂无更多信息',
            icon: 'none',
            duration: 2000,
            mask: true,
          });
        }
      }
    });
    
  },
  /**
   * 人员详情查看
   */
  detailsFun:function(e){
    var lsid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../info/info?lsid='+lsid,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
})