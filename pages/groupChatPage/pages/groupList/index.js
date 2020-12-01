
Page({
  /**
   * 页面的初始数据
   */
  data: {
    groupArr: "",
    disp:""
  },
  /**
   * 点击进入具体群组
   */
  queryGroupInfo: function (e) {
    console.log(e);
    //当前最大消息数
    var nowMsgSeq = e.currentTarget.dataset.index;
    //群组id
    var groupId = e.currentTarget.id;
    //未读消息数量
    var unreadMsgNum = e.currentTarget.dataset.id;
    //跳转群组聊天会话页面
    wx.navigateTo({
      url: '../groupInfo/index?groupId=' + groupId + '&nowMsgSeq=' + nowMsgSeq + '&unreadMsgNum=' + unreadMsgNum
    })
  },
  /** 
   * 点击新建群组
   */
  newGroup: function () {
    //跳转新建群组页面
    wx.navigateTo({
      url: "../addGroup/index"
    })
  },
  /**
   * 获取用户所在群组列表信息
   */
  getGroupList: function(){
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    //获取基础ID
    var jcid = getApp().globalData.wxUserInfo.jcid;
    console.log(jcid);
    // var jcid = "yang11";
    //获取用户所在群组列表 
    wx.request({
      url: urlStr+"gtjl/queryGroupListIM",
      data: { "jcid": jcid },
      success: function (r) {
        console.log(r);
        var array = r.data.data.GroupIdList;
        console.log(array);
        if (array.length == 0){
          array = null;
        }else{
          //查询
          
        }
        that.setData({
          groupArr: array
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var urlStr = getApp().globalData.urlStr;
    that.setData({
      disp: 1,
      urlStr: urlStr 
    });
    //获取全局变量中的人员类型
    var rylx = getApp().globalData.wxUserInfo.rylx;
    var arr = [];
		if (rylx != null) {
			arr = rylx.split(",");
		}
    
    for (var j in arr){
      if (arr[j] == "tjy") {
        that.setData({
          disp: 0
        });
      }
    }
  },
  /** 
   * 刷新列表信息
   */
  onShow: function() {
    this.getGroupList(); 
    console.log('刷新列表信息');
  }
})