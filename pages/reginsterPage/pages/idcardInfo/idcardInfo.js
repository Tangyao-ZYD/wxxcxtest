Page({

  /**
   * 页面的初始数据
   */
	data: {
		multiIndex: [0, 0, 0],
		nation: ['汉族', '藏族', '裕固族', '彝族', '瑶族', '锡伯族', '乌孜别克族', '维吾尔族', '佤族', '土家族', '土族', '塔塔尔族', '塔吉克族', '水族', '畲族', '撒拉族', '羌族', '普米族', '怒族', '纳西族', '仫佬族', '苗族', '蒙古族', '门巴族', '毛南族', '满族', '珞巴族', '僳僳族', '黎族', '拉祜族', '柯尔克孜族', '景颇族', '京族', '基诺族', '回族', '赫哲族', '哈萨克族', '哈尼族', '仡佬族', '高山族', '鄂温克族', '俄罗斯族', '鄂伦春族', '独龙族', '东乡族', '侗族', '德昂族', '傣族', '达斡尔族', '朝鲜族', '布依族', '布朗族', '保安族', '白族', '阿昌族', '壮族'],
		nationIndex: 0,
		mz: '0',
		date: '1990-01-01',
		dateFor_sfzqx: '1990-01-01',
		region: ['请选择', '请选择', '请选择'],
		regionNew: ['请选择', '请选择', '请选择'],
		customItem: '请选择',
		showBtn: false,
		openId: '',
		nickName: '',
		urlStr: ""
	},
  /**
   * 生命周期函数--监听页面加载
   *  */
	onLoad: function (options) {
		var that = this;
		var urlStr = getApp().globalData.urlStr;

		//获取人员类型
		var r = options.rylx;
		var arr = [];
		arr = r.split(",");
		//将 首页传过来的 值 给本页面赋值
		that.setData({
			parameForBasicinfo: options.parameForBasicinfo,
			sfzxp: options.sfzxp,
			sfzxpbm: options.sfzxpbm,
			openId: getApp().globalData.openId,
			nickName: getApp().globalData.nickName,
			type: arr,
			urlStr: urlStr
		});

    /*判断 人员类型是否为空(判断提交按钮显示 为  下一步 or 完成  
    showBtn: true = 完成，showBtn: false = 下一步)*/
		if (arr != null && arr != "") {
			that.setData({
				showBtn: true
			});
		} else {
			that.setData({
				showBtn: false
			});
		}

		//获取身份证信息中所需 imagePath 参数 的值（身份证正面、身份证反面）20180514162810.jpg
		var sfzxp = options.sfzxp;
		var sfzxpbm = options.sfzxpbm;
		//定义两个请求参数
		var parameSfzxp = 'ocrType=0&idcardType=0&fileName=' + sfzxp;
		var parameSfzxpbm = 'ocrType=0&idcardType=1&fileName=' + sfzxpbm;

		//身份证正面 信息查询
		wx.request({
			url: urlStr + 'distinguiImagesInfo/showOcrImageByType',
			// data: parameSfzxp,
			data: {
				ocrType: 0,
				idcardType: 0,
				fileName: sfzxp
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
								// console.log("用户点击确定");
								//身份证正面信息识别失败，则返回上一级页面，提示重新上传身份证照片
								wx.navigateBack({
									delta: 1
								});
							}
						}
					})
				} else {
					//识别成功 赋值给页面上的填写框

					//判断性别
					var xb = 0;

					if (r.data.data.sex == "男") {
						xb = 0;
					} else {
						xb = 1;
					}
					//设置民族填写项的值
					for (var i = 0; i < that.data.nation.length; i++) {
						if (r.data.data.nation == i) {
							that.setData({
								nationIndex: i,
							});
							break;
						}
					}
					//判断户籍所在地是为空（由于部分地区 身份证地区号变更或者失效 便在库中查询不到户籍所在地）
					if (r.data.data.prov != null) {
						that.setData({
							region: [r.data.data.prov, r.data.data.city, r.data.data.dist],
						});
					} else {
						that.setData({
							region: ['请选择', '请选择', '请选择'],
						});
					}

					//设置值
					that.setData({
						name: r.data.data.name,
						xb: xb,
						sfzh: r.data.data.id,
						date: r.data.data.birth,
						hjszd: r.data.data.address
					});
				}
			}
		});
		//身份证反面 信息查询
		wx.request({
			url: urlStr + 'distinguiImagesInfo/showOcrImageByType',
			data: {
				ocrType: 0,
				idcardType: 1,
				fileName: sfzxpbm
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
								//身份证反面信息识别失败，则返回上一级页面，提示重新上传身份证照片
								wx.navigateBack({
									delta: 1
								});
							}
						}
					})
				} else {
					//识别信息成功，则赋值页面上的填写框
					//查询身份证信息
					that.setData({
						dateFor_sfzqx: r.data.data.valid_date,
					});
				}
			}
		})


	},
  /**
   * 性别单选操作
   */
	radioCheckedChangeForSex: function (e) {
		this.setData({
			radioCheckVal: e.detail.value
		});
	},
  /**
   * 时间选择器 触发方法（出生日期）
   */
	bindDateChange: function (e) {
		this.setData({
			date: e.detail.value
		})
	},
  /**
   * 时间选择器 触发方法(身份证期限)
   */
	bindDateChangeFor_sfzqx: function (e) {
		this.setData({
			dateFor_sfzqx: e.detail.value
		})
	},
  /**
   * 省市区 地区联动选择 触发方法（户籍地址）
   */
	bindRegionChange: function (e) {
		this.setData({
			region: e.detail.value
		})
	},
  /**
   * 省市区 地区联动选择 触发方法（现居住地址）
   */
	bindRegionNewChange: function (e) {
		this.setData({
			regionNew: e.detail.value
		})
	},
  /**
   * 民族 下拉选择项 触发方法
   */
	bindPickerChange: function (e) {
		this.setData({
			nationIndex: e.detail.value,
			mz: e.detail.value,
		})
	},

  /**
   * 姓名非空验证
   */
	xm_Verification: function (e) {
		var that = this;
		if (e.detail.value) {
			//不为空
			that.setData({
				msg_xm: "",
				focus_xm: false
			});
		} else {
			that.setData({
				msg_xm: "姓名不能为空，请重新输入",
				focus_xm: true
			});
		}
	},
  /**
    * 现住地址非空验证
    */
	xzdxz_Verification: function (e) {
		var that = this;
		if (e.detail.value) {
			//不为空
			that.setData({
				msg_xzdxz: ""
			});
		} else {
			that.setData({
				msg_xzdxz: "现住地址不能为空，请重新输入"
			});
		}
	},

  /**
   * 联系电话非空验证
   */
	lxdh_Verification: function (e) {
		var that = this;
		if (e.detail.value) {
			//电话号码格式验证

			//不为空
			that.setData({
				msg_lxdh: "",
				focus_lxdh: false
			});
		} else {
			that.setData({
				msg_lxdh: "联系电话不能为空，请重新输入",
				focus_lxdh: true
			});
		}
	},
  /**
   * 身份证号码非空验证
   */
	sfzh_Verification: function (e) {
		var that = this;
		var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
		if ((reg.test(e.detail.value))) {

			//不为空
			that.setData({
				msg_sfzh: ""
			});
		} else if (e.detail.value.length == 0) {
			that.setData({
				msg_sfzh: "身份证号码不能为空，请重新输入"
			});
		} else if (!(reg.test(e.detail.value))) {
			//身份证号码格式验证
			that.setData({
				msg_sfzh: "身份证号码格式不正确，请重新输入"
			});
		}
	},

	// /**
	//  * 非空验证
	//  */
	// sfzh_Verification: function(e) {
	//   var that = this;
	//   if (e.detail.value) {
	//     //身份证号码格式验证

	//     //不为空
	//     that.setData({
	//       msg_sfzh: "",
	//       focus_sfzh: false
	//     });
	//   } else {
	//     that.setData({
	//       msg_sfzh: "身份证号码不能为空，请重新输入",
	//       focus_sfzh: true
	//     });
	//   }
	// },

  /**
   * 点击 完成 或 下一步  获取输入的相关数据
   */
	formSubmit: function (e) {
		var that = this;
		var formData = e.detail.value;
		//人员类型
		var rylxArr = that.data.type;


		if (rylxArr != null && rylxArr != "") {
			console.log("不为空，执行下一步");
		} else {
			console.log("人员类型为空，注册为当事人");
		}
		var rylx = '';
		if (rylxArr.length != 0) {
			for (var i = 0; i < rylxArr.length; i++) {
				rylx += rylxArr[i] + ',';
			}
		}
		//截取掉最后一个，
		rylx = rylx.substring(0, rylx.length - 1);


		//获取 户籍所在地 现居住地址
		var hj_sheng = formData.ssq[0];
		var hj_shi = formData.ssq[1];
		var hj_qu = formData.ssq[2];
		var hjszdxq = formData.hjszdxq;

		//现居住地地址 详情
		var xj_sheng = formData.xjd[0];
		var xj_shi = formData.xjd[1];
		var xj_qu = formData.xjd[2];
		var xzdxz = formData.xzdxz;

		//当事人信息
		var zh = formData.zh;
		var mm = formData.mm;
		var xm = formData.xm;
		var xb = formData.xb;
		var lxdh = formData.lxdh;
		var sfzh = formData.sfzh;
		var sfzqx = formData.sfzhqx;
		var sfzxp = that.data.imgName;
		var csrq = formData.csrq;
		var mz = that.data.mz;

		var openId = that.data.openId;
		var nickName = that.data.nickName;


		//参数
		var parame = {
			"xm": xm,
			"xb": xb,
			"sfzh": sfzh,
			"sfzqx": sfzqx,
			"csrq": csrq,
			"mz": mz,
			"hjszdxz": hjszdxq,
			"provinceHj": hj_sheng,
			"cityHj": hj_shi,
			"districtHj": hj_qu,
			"xzdxz": xzdxz,
			"provinceXz": xj_sheng,
			"cityXz": xj_shi,
			"districtXz": xj_qu,
			"rylx": rylx,
			"openId": openId,
			"wxh": null,
		};
		var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
		//判断填写项是否为空
		if ((xm != null && xm != "") &&
			((/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(sfzh)) && sfzh != null && sfzh != "") &&
			(csrq != null && csrq != "") &&
			(mz != null && mz != "") && (hjszdxq != null && hjszdxq != "") &&
			(hj_sheng != null && hj_sheng != "请选择") &&
			(hj_shi != null && hj_shi != "请选择") &&
			(hj_qu != null && hj_qu != "请选择") &&
			(xzdxz != null && xzdxz != "") &&
			(xj_sheng != null && xj_sheng != "请选择") &&
			(xj_shi != null && xj_shi != "请选择") &&
			(xj_qu != null && xj_qu != "请选择")) {

			//如果没有选择人员类型 直接执行完成操作  代表为当事人  否则 跳转 到人员类型页面进行添加
			if (rylx.length <= 0) {

				//获取注册第一个页面的用户输入的值（并将其转换为一个JSON 对象）
				that.data.parameForBasicinfo = JSON.parse(that.data.parameForBasicinfo);
				var parameForBasicinfo = that.data.parameForBasicinfo;

				//整合第一个页面的值和本页的值
				var obj = Object.assign(parame, parameForBasicinfo);
				//执行注册
				wx.request({
					url: that.data.urlStr + 'register/submitRegister',
					data: parame,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					method: 'POST',
					success: function (res) {
						if (res.statusCode == 200) {
							//提示用户 注册完成，请等待审核
							wx.showModal({
								title: '提示',
								content: '注册完成，请等待审核',
								showCancel: false,
								success: function (res) {
									if (res.confirm) {

										//注册完成  跳转到首页
										wx.switchTab({
											url: '../../../../pages/indexPage/index/index',
										});
									}

								}
							})
						}
					}
				});
			} else {
				//选择人员类型，点击下一步 
				var p = parame;
				p = JSON.stringify(p);
				wx.navigateTo({
					url: '../../pages/zcRylx/zcRylx?idcardInfo=' + p + '&parameForBasicinfo=' + that.data.parameForBasicinfo + '&rylx=' + rylx,
				});
			}
		} else {
			var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			if (xj_sheng == "请选择" && xj_shi == "请选择" && xj_qu == "请选择" && xzdxz == "") {
				//console.log("请完善填写内容");
				wx.showModal({
					title: '提示',
					content: '请完善填写内容',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {

						}
					}
				})
			} else if (hj_sheng == "请选择" || hj_shi == "请选择" || hj_qu == "请选择" || xj_sheng == "请选择" || xj_shi == "请选择" || xj_qu == "请选择") {
				//户籍所在地或现住地址未选择 省市区 的时候，提示用户请选择
				wx.showModal({
					title: '提示',
					content: '请选择现住地址 或 户籍所在地',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {

						}
					}
				})
			} else if (xzdxz == "" || xzdxz.length == 0) {
				wx.showModal({
					title: '提示',
					content: '现住详细地址不能为空',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {

						}
					}
				})
				that.setData({
					msg_xzdxz: "现住详细地址不能为空，请重新输入"

				})
			} else if (!(reg.test(sfzh))) {
				//身份证号码格式验证
				that.setData({
					msg_idcard: "身份证号码格式不正确，请重新输入",
					focus_idcard: false
				});
				wx.showModal({
					title: '提示',
					content: '身份证号码格式不正确',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {

						}
					}
				})

			}

		}
	}
})