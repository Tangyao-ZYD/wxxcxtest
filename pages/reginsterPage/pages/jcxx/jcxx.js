Page({

  /**
   * 页面的初始数据
   */
	data: {
		idcard_z: '',
		idcard_f: '',
		showBtn: false,
		idcardName_z: '',
		idcardName_f: '',
		pictureName: '',
		openId: '',
		nickName: '',
		items: [{
			name: 'rddb',
			value: '人大代表'
		},
		{
			name: 'wg',
			value: '务工人员'
		},
		{
			name: 'qy',
			value: '企业'
		},
		],
		time: '获取验证码', //倒计时 
		currentTime: 61,
		parameForBasicinfo: {},
		urlStr: ""
	},
  /**
   * 生命周期函数--监听页面加载
   *  */
	onLoad: function (options) {
		var that = this
		//将 首页传过来的 值 给本页面赋值
		var openId = getApp().globalData.openId;
		var nickName = getApp().globalData.nickName;
		var urlStr = getApp().globalData.urlStr;
		var idcard_z = urlStr + 'show/images?fileName=ida.png';
		var idcard_f = urlStr + 'show/images?fileName=idb.png';
		that.setData({
			openId: openId,
			nickName: nickName,
			urlStr: urlStr,
			idcard_z: idcard_z,
			idcard_f: idcard_f
		});

	},

  /**
   * 人员注册类型 触发方法
   */
	checkboxChange: function (e) {
		console.log('checkbox发生change事件，携带value值为：', e.detail.value)
	},
  /**
   * 上传图片 触发方法
   */
	btnChoose: function (e) {
		var that = this;
		var src = e.target.dataset.index;
		//选择图片
		wx.chooseImage({
			count: 1, // 允许上传张数
			sizeType: ['compressed'], // 可以指定是原图(original)还是压缩图(compressed)，
			sourceType: ['album', 'camera'], // 可以指定来源是相册(album)还是相机(camera)，
			success: function (res) {
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
				var tempFilePaths = res.tempFilePaths
				//赋值 让其显示
				that.setData({
					"src": res.tempFilePaths[0]
				});
				//上传
				var tPath = res.tempFilePaths[0];
				//执行上传
				wx.uploadFile({
					url: that.data.urlStr + 'upload/uploadFile',
					filePath: tPath,
					name: 'file',
					formData: {
						'user': 'test'
					},
					success: function (res) {

						//对上传图片 返回值 进行数据转换
						var data_ = JSON.parse(res.data);
						//判断 图片显示地方 上传成功后作相应的操作（图片名称赋值）
						if (src == "idcard_z") {
							//身份证正面 信息查询
							wx.request({
								url: that.data.urlStr + 'distinguiImagesInfo/showOcrImageByType',
								data: {
									ocrType: 0,
									idcardType: 0,
									fileName: data_.data
								},
								success: function (r) {
									//判断身份证正面信息是否识别成功成功 如果识别失败  则提示用户
									if (r.data.data == null) {
										//提示用户身份证正面信息识别失败
										wx.showModal({
											title: '提示',
											content: "身份证正面信息识别失败，请重新上传",
											showCancel: false,
											success: function (res) {
												if (res.confirm) {
													// console.log("用户点击确定");"idcard_z": that.data.idcard_z,
													that.setData({

														"idcardName_z": "",
													});
												}
											}
										})
									} else {
										that.setData({
											"idcard_z": tPath,
											"idcardName_z": data_.data,
										});

									}
								}
							});
						} else if (src == "idcard_f") {
							//身份证反面 信息查询
							wx.request({
								url: that.data.urlStr + 'distinguiImagesInfo/showOcrImageByType',
								data: {
									ocrType: 0,
									idcardType: 1,
									fileName: data_.data
								},
								header: {
									'content-type': 'application/x-www-form-urlencoded'
								},
								method: 'POST',
								success: function (r) {
									//判断身份证反面信息是否识别成功，如果识别失败，则提示用户
									if (r.data.data == null) {
										//提示用户身份证反面信息识别失败
										wx.showModal({
											title: '提示',
											content: "身份证反面信息识别失败，请重新上传",
											showCancel: false,
											success: function (res) {
												if (res.confirm) {
													// console.log("用户点击确定"); 
													that.setData({
														"idcardName_f": "",
													});
												}
											}
										})
									} else {
										//识别信息成功，则赋值页面上的填写框
										//console.log("身份证信息识别成功：" + r.data.data.valid_date);
										//查询身份证信息
										that.setData({
											"idcard_f": tPath,
											"idcardName_f": data_.data,
										});
									}
								}
							})
						} else {
							that.setData({
								"picture": tPath,
								"pictureName": res.data.data,
							});
						}

					}
				})
			}
		})
	},



  /**
   * 联系电话非空验证
   */
	lxdh_Verification: function (e) {
		var that = this;
		var phone = e.detail.value;

		if ((/^1[34578]\d{9}$/.test(phone))) {
			//不为空
			that.setData({
				msg_lxdh: "",
				focus_lxdh: false,
				lxdh: phone,
			});
		} else if (e.detail.value.length == 0) {
			that.setData({
				msg_lxdh: "联系电话不能为空，请重新输入",
				focus_lxdh: true
			});
		} else if (!(/^1[34578]\d{9}$/.test(phone))) {
			that.setData({
				msg_lxdh: "联系电话格式错误，请重新输入",
				focus_lxdh: true
			});
		}
	},



  /**
   * 点击 完成 或 下一步  获取输入的相关数据
   */
	formSubmit: function (e) {
		var that = this;
		var formData = e.detail.value;
		//人员类型
		var rylxArr = formData.rylx;
		var rylx = '';
		if (rylxArr.length != 0) {
			for (var i = 0; i < rylxArr.length; i++) {
				rylx += rylxArr[i] + ',';
			}
		}
		rylx = rylx.substring(0, rylx.length - 1);
		//当事人信息
		var lxdh = formData.lxdh;

		var idcardName_z = that.data.idcardName_z;
		var idcardName_f = that.data.idcardName_f;
		var openId = that.data.openId;
		var nickName = that.data.nickName;


		var parame = {
			"lxdh": lxdh,
			"sfzxp": idcardName_z,
			"sfzxpbm": idcardName_f,
			"openId": openId,
			"nickName": nickName
		};
		//获取 上传身份证图片获取的用户相关信息
		//判断填写项是否为空
		if ((lxdh != null && lxdh != "") && (idcardName_z != null && idcardName_z != "") && (idcardName_f != null && idcardName_f != "")) {
			//点击下一步判断输入框的值，是否规范 ，否则点击下一步失败
			if (!(/^1[34578]\d{9}$/.test(lxdh))) {
				that.setData({
					msg_lxdh: "联系电话格式错误，请重新输入"
				});
				wx.showModal({
					title: '提示',
					content: '请输入正确的联系电话',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							//console.log('用户点击确定');
							//点击确定操作
						}
					}
				})
			} else {
				var p = parame;
				p = JSON.stringify(p);
				wx.navigateTo({
					url: '../../pages/idcardInfo/idcardInfo?parameForBasicinfo=' + p + '&rylx=' + rylx + "&sfzxp=" + idcardName_z + "&sfzxpbm=" + idcardName_f,
				});
			}
		} else {
			if (idcardName_z == "" && idcardName_f == "" && lxdh == "") {
				wx.showModal({
					title: '提示',
					content: '请完善填写内容',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							//console.log('用户点击确定');
							//点击确定操作
						}
					}
				})
			} else if (idcardName_z == "" || idcardName_f == "") {
				wx.showModal({
					title: '提示',
					content: '请上传身份证相片',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							//console.log('用户点击确定');
							//点击确定操作
						}
					}
				})
			} else if (lxdh == "" || lxdh.length == 0) {
				that.setData({
					msg_lxdh: "联系电话不能为空，请重新输入"
				});
				wx.showModal({
					title: '提示',
					content: '请输入联系电话',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							//console.log('用户点击确定');
							//点击确定操作
						}
					}
				})
			}

		}
	}
})