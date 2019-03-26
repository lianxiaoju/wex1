/**
 * Global function in mini-program, non-business logic.
 */
const $ = module.exports = {};

$.relaunch = () => {
  const PATH = 'pages/home';
  if (wx.canIUse('reLaunch')) {
    wx.reLaunch({
      url: '/' + PATH + '?restart=true'
    });
  } else if (PATH === getCurrentPages()[0].route.split('?')[0]) {
    wx.navigateBack({
      delta: 99
    });
  } else {
    this.$redirect({
      url: '/' + PATH + '?restart=true'
    });
  }
};

$.isPageOpened = (route) => {
  return getCurrentPages().some(p => p.route == route);
};
