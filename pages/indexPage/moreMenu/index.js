Page({

  /**
   * 页面的初始数据
   */
	data: {
		urlStr: "",
	},

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		var that = this;
		var urlStr = getApp().globalData.urlStr;
		that.setData({ urlStr: urlStr});
		//查询 权限（法制宣传）
		wx.request({
			url: urlStr + "touristJurisdiction/findJurisdictionByOpenId",
			data: { btnPage: 1 },
			success: function (r) {
				if (r.data.data != null) {
					that.setData({
						fzxcMenus: r.data.data,
					});
				} else {
					that.setData({
						fzxcMenus: null,
					});
				}

				//查询 权限(司法公开）
				wx.request({
					url: urlStr + "touristJurisdiction/findJurisdictionByOpenId?btnPage=2",
					success: function (r) {
						if (r.data.data != null) {
							that.setData({
								sfgkMenus: r.data.data,
							});
						} else {
							that.setData({
								sfgkMenus: null,
							});
						}

					}
				});

			}
		});

	},
  /**
   * 功能权限的点击事件
   */
	clickFun: function (e) {
		var qxbm = e.currentTarget.dataset.id;
		var zsfs = e.currentTarget.dataset.index;
		console.log(qxbm + "--" + zsfs);
		if (qxbm == 0) {
			wx.showToast({
				title: '敬请期待',
				icon: 'none',
				duration: 3000,
				mask: true,
			});
		} else {
			if (zsfs == 'wx_juris_zsfs_1') {
				//简介类（法院简介、诉服中心简介等等）
				// console.log("简介类功能");
				wx.navigateTo({
					url: '../../../pages/contentPage/pages/content/content?qxbm=' + qxbm,
				});
			} else if (zsfs == 'wx_juris_zsfs_2') {
				//新闻
				wx.navigateTo({
					url: '../../../pages/indexPage/fyxw/fyxw?xwlx=' + qxbm,
				});
			} else if (zsfs == 'wx_juris_zsfs_3') {
				//二级简介类（机构职能、法律法规等等）
				//console.log("二级简介类功能");
				wx.navigateTo({
					url: '../../../pages/contentPage/pages/jgzn/index?gndm=' + qxbm,
				});
			} else if (zsfs == 'wx_juris_zsfs_4') {
				//console.log("成员分工类功能");
				wx.navigateTo({
					url: '../../../pages/contentPage/pages/cyfg/cyfg',
				});
			} else if (zsfs == 'wx_juris_zsfs_5') {
				//console.log("法官名册功能");  
				wx.navigateTo({
					url: '../../../pages/contentPage/pages/fgmc/fgmc',
				});
			} else if (zsfs == 'wx_juris_zsfs_6') {
				//交通地图
				wx.navigateTo({
					url: '../../../pages/indexPage/map/index',
				});
			} else if (zsfs == 'wx_juris_zsfs_7') {
				//开庭公告
				wx.navigateTo({
					url: '../../../pages/caseInfoPage/pages/ktgg/ktgg',
				});
			} else if (zsfs == 'wx_juris_zsfs_8') {
				//案件查询
				wx.navigateTo({
					url: '../../../pages/caseInfoPage/pages/lacx/lacx',
				});
			} else if (zsfs == 'wx_juris_zsfs_9') {
				//常用文书
				wx.navigateTo({
					url: '../../contentPage/pages/cyws/cyws',
				});
			}
		}

	},
  /**
   * 人员名册页面跳转
   */
	clickFunTest: function (e) {
		wx.navigateTo({
			url: '../../contentPage/pages/lsmc/index/index',
		})
	},
  /**
   * 排行页面
   */
	clickFunTest2: function (e) {
		var dataIndex = e.currentTarget.dataset.index;
		wx.navigateTo({
			url: '../../contentPage/pages/lsmc/phpage/index?dataIndex=' + dataIndex,
		})
	},
	clickFunTestTjy:function(e){
		var tjydataIndex = e.currentTarget.dataset.index;
		wx.navigateTo({
			url: '../../contentPage/pages/tjymc/phpage/index?tjydataIndex=' + tjydataIndex,
		})
	},
	queryTjyInfo: function (e) {
		wx.navigateTo({
			url: '../../contentPage/pages/tjymc/index/index',
		})
	},

	//咨询服务
	clickFunTest3: function (e) {
		wx.navigateTo({
			url: '../../contentPage/pages/wdzx/index/index',
		})
	},

  /**
   * 云通讯页面跳转(添加群组)
   */
	clickFun22: function (e) {
		wx.navigateTo({
			url: '../addGroup/index'
		})
	},
  /**
   * 云通讯页面跳转(管理群组信息)
   */
	clickFun2: function (e) {
		wx.navigateTo({
			url: '../manageGroup/index'
		})
	}


})