// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserID: "",
    Password: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //是否自动登录  
    var UserID = wx.getStorageSync("UserID");
    var Password = wx.getStorageSync("Password");
    if (UserID.length != 0 || Password.length != 0) {
      this.setData({
        UserID: UserID,
        Password: Password
      })
      this.btnLoginClick();
    }
  },

  //获取输入帐号
  UserIDInput: function(e) {
    this.setData({
      UserID: e.detail.value
    })
  },

  //获取输入密码
  PasswordInput: function(e) {
    this.setData({
      Password: e.detail.value
    })
  },

  //登录
  btnLoginClick: function(e) {
    console.log("userid:" + this.data.UserID);
    console.log("password:" + this.data.Password);
    console.log("userid:" + e.detail.value.userid);
    console.log("password:" + e.detail.value.password);

    this.setData({
      UserID: e.detail.value.userid,
      Password: e.detail.value.password
    })

    if (this.data.UserID.length == 0 || this.data.Password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var UserID = this.data.UserID;
    var Password = this.data.Password;
    wx.request({
      url: 'https://dinner.geafon.com/Purchase/APILoginSource',
      method: 'POST',
      data: {
        UserID: UserID,
        Password: Password
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success: function(res) {
        console.log("code:" + res.data[0].code);
        if (res.data[0].code == "true") {
          //保存登录信息beg
          wx.clearStorageSync();
          wx.setStorageSync("UserID", UserID);
          wx.setStorageSync("Password", Password);
          //保存登录信息end
          //跳转
          wx.redirectTo({
            url: '../eat/eat?userid=' + UserID
          })
          /*
          if (res.data[0].deptid == "dinner") {
            wx.redirectTo({
              url: '../dinner/dinner'
            })
          } else {
            wx.redirectTo({
              url: '../user/user?userid=' + UserID
            })
          }
          */
        } else {
          var message = res.data[0].message;
          wx.showToast({
            title: message,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function({
        errMsg
      }) {
        wx.showToast({
          title: errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})