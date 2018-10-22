var app = getApp()
Page({
  data: {
    star: 0,
    starMap: [1, 2, 3, 4, 5],
    stars: [0, 1, 2, 3, 4],
    normalSrc: 'normal.png',
    selectedSrc: 'selected.png',
    halfSrc: 'half.png',
    key: 0, //评分
    pjfs:0,
		disabledpj:false,
  },

  onLoad: function(options) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    that.setData({ urlStr: urlStr });
    
		that.setData({
      xxid: options.zxid,
      bpjr: options.clr,
      pjr: getApp().globalData.wxUserInfo.jcid
    });
    //查询该咨询是否存在评价consultation/queryConsulfoById?id=1
    wx.request({
      url: urlStr+'consultation/queryConsulfoById',
      data: { id: options.zxid},
      success:function(res){
        console.log(res);
        if(res.data.data!= null){
          that.setData({
            userInfo: res.data.data.userInfo,
            zxInfo: res.data.data.zxInfo,
          });
          if (res.data.data.pjxxInfo != null){
            that.setData({
              pjxxInfo: res.data.data.pjxxInfo,
              pjfs: that.starCount(res.data.data.pjxxInfo.pjfs),
							disabledpj:true
            });
          }else{
						that.setData({
							disabledpj: false
						});
					}
        }else{
          that.setData({
            pjxxInfo: null,
            userInfo:null,
            zxInfo: null,
          });
        }
      }
    })
  },


  //点击右边,半颗星
  selectLeft: function(e) {
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    console.log("得" + key + "分")
    this.setData({
      key: key
    })

  },
  //点击左边,整颗星
  selectRight: function(e) {
    var key = e.currentTarget.dataset.key
    console.log("得" + key + "分")
    this.setData({
      key: key
    })
  },
  /**
   * 新增评价信息
   */
  formSubmit:function(e){
    // xxid（信息id）、pjlx（评价类型）、pjnr（评价内容）、
    // pjr（评价人）、bpjr（被评价人）、pjfs（评价分数）
		var that = this;
    var urlStr = getApp().globalData.urlStr;
		var xxid = that.data.xxid;
		var bpjr = that.data.bpjr;
		var pjr = that.data.pjr;
    var formData = e.detail.value;
    var pjnr = formData.pjnr;
		var pjfs = that.data.key;
		console.log("xxid : " + xxid)
		if (null == xxid || xxid == "") {
			wx.showModal({
				title: '提示',
				content: "评价分数不能为空",
				showCancel: false
			});
			return;
		}
		if (null == pjfs || pjfs == ""){
			wx.showModal({
				title: '提示',
				content: "评价分数不能为空",
				showCancel: false
			});
			return;
		}

    var parame = {
      xxid: xxid,
      pjlx : 1,
      pjnr : pjnr,
      pjr : pjr,
      bpjr : bpjr,
      pjfs : pjfs,
      tjgcpj:0
    };

    console.log(parame);
    wx.request({
      url: urlStr+'evaluate/addEvaluateInfo',
      method: 'POST',
      header: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: parame,
      success: function (res) {
        console.log(res);
				wx.navigateTo({
					url: '../yzxUser/yzxUser',
				})
      }
    })
  },

	
  //计算行星显示规则
  starCount: function (originStars) {
    //计算星星显示需要的数据，用数组stars存储五个值，分别对应每个位置的星星是全星、半星还是空星
    var starNum = originStars * 10 / 10, stars = [], i = 0;
    do {
      if (starNum >= 1) {
        stars[i] = '../pj/selected.png';
      } else if (starNum >= 0.5) {
        stars[i] = '../pj/half.png';
      } else {
        stars[i] = '../pj/normal.png';
      }
      starNum--;
      i++;
    } while (i < 5)
    return stars;
  },


});