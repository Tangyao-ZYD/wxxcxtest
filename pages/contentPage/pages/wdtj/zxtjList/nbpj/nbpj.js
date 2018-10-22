var app = getApp()
Page({
  data: {
    star: 0,
    starMap: [1, 2, 3, 4, 5],
    stars: [0, 1, 2, 3, 4],
		normalSrc: 'https://www.thinkllwx.cn/SpringBootJN/show/images?fileName=normal.png',
		selectedSrc: 'https://www.thinkllwx.cn/SpringBootJN/show/images?fileName=selected.png',
		halfSrc: 'https://www.thinkllwx.cn/SpringBootJN/show/images?fileName=half.png',
    key: 0, //评分
    pjfs:0,
  },

  onLoad: function(options) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    this.setData({
      pjr: getApp().globalData.wxUserInfo.jcid,
      urlStr: urlStr
    });
  },


  //点击右边,半颗星
  selectLeft: function(e) {
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    // console.log("得" + key + "分")
    this.setData({
      key: key
    })

  },
  //点击左边,整颗星
  selectRight: function(e) {
    var key = e.currentTarget.dataset.key
    // console.log("得" + key + "分")
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
    var xxid = this.data.xxid;
    // var bpjr = this.data.bpjr;
    var pjr = this.data.pjr;
    var formData = e.detail.value;
    var pjnr = formData.pjnr;
    var pjfs = this.data.key;
    var parame = {
      xxid: xxid,
      pjlx : 1,
      pjnr : pjnr,
      pjr : pjr,
      // bpjr : bpjr,
      pjfs : pjfs
    };
  },
  //计算行星显示规则
  starCount: function (originStars) {
    var urlStr = getApp().globalData.urlStr;
    //计算星星显示需要的数据，用数组stars存储五个值，分别对应每个位置的星星是全星、半星还是空星
    var starNum = originStars * 10 / 10, stars = [], i = 0;
    do {
      if (starNum >= 1) {
				stars[i] = urlStr+'show/images?fileName=selected.png';
      } else if (starNum >= 0.5) {
				stars[i] = urlStr+'show/images?fileName=half.png';
      } else {
				stars[i] = urlStr+'show/images?fileName=normal.png';
      }
      starNum--;
      i++;
    } while (i < 5)
    return stars;
  },


});