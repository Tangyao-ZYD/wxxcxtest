var WxParse = require('../../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		urlStr:"",
    offset: 0,
    limit: 10,
    xwlx:'',
    news:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
		var urlStr = getApp().globalData.urlStr;
		that.setData({urlStr: urlStr})
    var xwlx = options.xwlx; //新闻类型
    that.setData({
      xwlx: xwlx
    })
    //查询法院新闻列别信息wx_xwjj_xwlx_2
    var news = {
      xwlx: xwlx,
      offset: 0,
      limit: 10,
    }
console.log(xwlx);
    wx.request({
			url: urlStr + 'xwjj/queryWxWxXwjjList',
      data: news,
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
     * 下拉刷新
     */
  onPullDownRefresh: function () {
    var offset = 0;
    var limit = 10;
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    var that = this;
    var xwlx = that.data.xwlx;
    var urlStr = getApp().globalData.urlStr;
    //后台请求参数
    var news = {
      offset: offset,
      limit: 10,
      xwlx:xwlx
    };
        wx.request({
          url: urlStr + 'xwjj/queryWxWxXwjjList',
          data: news,
          success: function (r) {
            //判断 查询出的数据 是否为空 
            var arr = r.data.data;
            if (r.data.data != null) {
              that.setData({
                news: arr,
                offset: offset,
              });
            } else {
              that.setData({
                news: null,
              });
            }
            // 隐藏导航栏加载框  
            wx.hideNavigationBarLoading();
            // 停止下拉动作  
            wx.stopPullDownRefresh();
          }
        });
       
      
   
  },



  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    // 显示加载图标  
    wx.showLoading({
      title: '玩命加载中',
    });
    var offset = that.data.offset+10;
    var xwlx = that.data.xwlx;
    var urlStr = getApp().globalData.urlStr;
    //后台请求参数
    var news = {
      offset: offset,
      limit: 10,
      xwlx: xwlx
    };
    wx.request({
      url: urlStr + 'xwjj/queryWxWxXwjjList',
      data: news,
      success: function (r) {
        //判断 查询出的数据 是否为空 
        var arr = r.data.data;

        // 回调函数  
        var arrList = that.data.news;
        //判断请求返回数据是否为空
        if (arr != null) {
          for (var i = 0; i < arr.length; i++) {
            arrList.push(arr[i]);
          }
        }
        if (r.data.data != null) {
          that.setData({
            news: arrList,
            offset: offset,
          });


        } else {
          //暂更多数据
          wx.showModal({
            title: '提示',
            content: "暂更多数据",
            showCancel: false,
          });
        }


        //停止加载
        wx.hideNavigationBarLoading();
        // 隐藏加载框  
        wx.hideLoading();

      }
    });

  },


  /**
   * 点击新闻 查看新闻信息
   */
	queryNewInfo: function (e) {
		var id = e.currentTarget.id;
		var zylx = e.currentTarget.dataset.index;
		var urlStr = this.data.urlStr;
		if (zylx != 1) {
			//跳转到 新闻详情页面
			wx.navigateTo({
				url: '../../../pages/indexPage/fyxwInfo/index?id=' + id,
			});
		} else {
			wx.request({
				url: urlStr + 'xwjj/queryWxXwjjByXwid?xwid=' + id,
				success: function (r) {
          console.log(r);
          console.log("fileType = " + r.data.data.info.nr);
					//判断查询数据 是否有值
					if (r.data.data.info != null) {
						var zylx = r.data.data.info.zylx;//资源类型 0：文本内容 1：文件
						//判断资源类型
						var fileType = r.data.data.fileType;//文件类型
            
						//下载文件
						wx.downloadFile({
							url: urlStr + 'load/fileDownLoad/' + fileType + '/' + r.data.data.info.nr,
							success: function (res) {
                console.log(res);
								var filePath = res.tempFilePath;
								//打开文件
								wx.openDocument({
									filePath: filePath,
									fileType: fileType,
									success: function (res) {
										console.log('打开文档成功')
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

					} else {
						console.log("查询失败");
					}
				}
			});
		}

	}

})