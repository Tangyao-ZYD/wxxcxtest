const timeouts = [];
Page({
  //定义初始化数据  每当数据发生变化时，会自动触发页面循环
  data: {
    inputValue: '',
    returnValue: '',
    allContentList: [], //图灵机器人秘钥 key: "d13b441029804ee99fc4e3b617a5f557",
    num: 0,
    stars: 0,
    img_arr:[],//上传图片集合,\
    userInfo:'',
    zxid:'',
    hfInfo:[],
    scrollTop: 9999
  },
  onLoad: function(options) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    that.setData({ urlStr: urlStr });
    //查询该咨询信息的回复信息
    that.setData({
      zxid: options.zxid,
      jcid: getApp().globalData.wxUserInfo.jcid
    });
		//修改回复信息sfyd (是否已读)
		wx.request({
			url: urlStr+'reply/sfydUpdate',
			data: {
				zxid: options.zxid
			},
			success: function (res) {
			}
		})

		//查询聊天信息
    wx.request({
      url: urlStr+'consultation/queryConsulfoById',
      data: { id: options.zxid},
      success: function(res) {
        console.log(res);
        if(res.data.data!=null){
          that.setData({
            hfInfo: res.data.data.hfInfo,
            zxInfo: res.data.data.zxInfo,
            userInfo: res.data.data.userInfo
          });
          if (res.data.data.pjxxInfo != null){
            that.setData({
              pjxxInfo: res.data.data.pjxxInfo,
              stars: that.starCount(res.data.data.pjxxInfo.pjfs)
            });
          } 
        }else{
          that.setData({
            hfInfo: null
          });
          
        }
      }
    })

  },
  //绑定键盘按下事件，讲输入的值赋给data
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value,
    })
  },
  // 滚动聊天
  goBottom: function (n = 0) {
    timeouts.push(setTimeout(() => {
      this.setData({
        scrollTop: 9999
      })
    }, n))
  },
  /**
   * 回复信息
   */
  formSubmit:function(e){
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    var formData = e.detail.value;

    var zxid = that.data.zxid;
    var gtlx = 1;
    var xxlx = 1;
    var nr = formData.nr;
		var cjr = that.data.jcid;

		if (nr == "" || null == nr) {
			      wx.showModal({
				        title: '提示',
				        content: "内容为空，不能发送",
				        showCancel: false
			      });
			      return;
		      }
		      that.setData({
			        disabled: false
		      })
    var parame = {zxid:zxid,gtlx:gtlx,xxlx:xxlx,nr:nr,cjr:cjr};
    wx.request({
      url: urlStr+'reply/addReplyInfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data:parame,
      success:function(res){
          console.log(res);
          if(res.data.state == 0){
            console.log("回复成功");
            wx.request({
              url: urlStr+'consultation/queryConsulfoById',
              data: { id: that.data.zxid },
              success: function (res) {
                var hfInfo = [];

                that.setData({
                  inputTemp: '',
                  hfInfo: res.data.data.hfInfo
                })
              }
            })
            that.goBottom(500);
          }else{
            console.log("回复失败");
          }
      }
    })
  },
  /**
   * 发送图片
   */
  sendImg:function(e){
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    if (that.data.img_arr.length < 9) {
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'], // 可以指定来源是相册(album)还是相机(camera)，
        success: function (res) {
          console.log(res)
          var tempFilePaths = res.tempFilePaths;
          var tPath = res.tempFilePaths[0];
          //执行上传
          wx.uploadFile({
            url: urlStr+'upload/uploadFile',
            filePath: tPath,
            name: 'file',
            formData: {
              'user': 'test'
            },
            success: function (r) {
              //对上传图片 返回值 进行数据转换
              r.data = JSON.parse(r.data);
              console.log(r.data);
              //上传成功
              if (r.data.data != null && r.data.data != 'undifind'){
                var zxid = that.data.zxid;
                var gtlx = 1;
                var xxlx = 2;
                var nr = r.data.data;
                var cjr = that.data.jcid;
                var parame = { zxid: zxid, gtlx: gtlx, xxlx: xxlx, nr: nr, cjr: cjr };
                console.log(parame);
                wx.request({
                  url: urlStr+'reply/addReplyInfo',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  method: 'POST',
                  data: parame,
                  success: function (res) {
                    console.log(res);
                    if (res.data.state == 0) {
                      console.log("回复成功");
                    } else {
                      console.log("回复失败");
                     
                    }
                  }
                });
              }else{
                console.log("发送图片失败");
              }
            }
          })

        }
      })
    } else {
      wx.showToast({
        title: '一次最多上传9张图片',
        icon: 'loading',
        duration: 2000
      });
    }
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
  /**
   * 点击头像跳转个人信息页面
   */
  bindFunGrxx:function(){
    console.log(this.data.userInfo)
    var xm = this.data.userInfo.xm;
    var lxdh = this.data.userInfo.lxdh;
    var jl = this.data.userInfo.jl;
    var tx = this.data.userInfo.tx;
    // console.log(xm);
    wx.navigateTo({
      url: '../zxGrxx/zxGrxx?xm=' + xm + '&lxdh=' + lxdh + '&jl=' + jl + '&tx=' + tx,
    })
  },
  /**
   * 展示图片
   */
  showImg: function (e) {
    //获取data-src
    var src = e.currentTarget.dataset.src;
    var imgList = [src];
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    });
  }

    

})