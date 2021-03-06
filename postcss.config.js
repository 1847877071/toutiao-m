// PostCSS的配置文件
// PostCSS是基于Node.js运行的一个处理CSS的工具，所以它的配置文件也是运行再Node.js中
// PostCSS配置文件需要导出一个对象
module.exports = {
  // 配置要使用的相关插件
  plugins: {
    // 自动添加浏览器厂商声明前缀，用来兼容不同的浏览器
    // VueCLI已经在内部默认配置了autoprefixer
    // 'autoprefixer': {
    // browsers 用来配置需要兼容到的系统（浏览器）环境，这个配置没有问题，但是写到这里会有控制台编译警告，因为VueCLI是通过项目中的.browserslistrc文件来配置要兼容的环境信息的
    // browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 把px转为rem
    'postcss-pxtorem': {
      rootValue: 37.5,
      // 需要转换的css属性，*就是所有有单位的属性都要转换
      // 正常的情况下按照你的设计稿来
      // 750宽的设计稿，750/10=75
      // 375宽的设计稿，375/10=37.5
      // Vant组件库是基于375宽写的
      // 移动端页面一般都是以iphone 6/7/8为原型设计的
      // Vant组件库是基于逻辑像素375写的
      // 设计稿是基于物理像素750宽设计的，所以如果设置成75，那么我们就可以在设计稿中测量多少就写多少，但是Vant的样式就会变得很小，小了一半，所以我们还必须设置成37.5，但是在测量我们的设计稿的时候我们必须让i的测量单位/2
      // 更好的办法也可以量多少写多少，见笔记中截图笔记
      propList: ['*']
    }
  }
}
