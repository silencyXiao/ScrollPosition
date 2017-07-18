;(function() {
  /*
   * params *
   * selector: 选择器
   * options.type: 菜单排列方向
   * options.offsetY: 偏移TOP值
   * options.fixedClass: 菜单固定后的className
   */
  
  "use strict";
  var ScrollPosition = function(selector, options) {

    this.options = options || {};
    this.$scrollWrap = $(selector); //包裹层
    this.$scrollPagination = this.$scrollWrap.children('.scroll-pagination'); // 菜单
    this.$scrollContainer = this.$scrollWrap.children('.scroll-container'); // 主要内容容器
    this.paginationHeight = this.$scrollPagination.innerHeight(); // 菜单高度

    var defaults = {
      type: 'horizontal',
      offsetY: 0,
      fixedClass: 'scroll-pagination-fixed'
    };

    for (var i in defaults) {

      if (typeof this.options[i] === 'undefined') {
        this.options[i] = defaults[i];  
      }
      if (typeof this.options[i] === 'object') {

        for (var j in defaults[i]) {

          if (typeof this.options[i][j] === 'undefined') {
            this.options[i][j] = defaults[i][j];
          }
        }  
      }
    }

    var _this = this;

    //获取 遍历所有scroll-section的 offsetTop值，并存到一个数组中
    _this.offsetArr = (function() {

      var offset = [];
      var $secItems = _this.$scrollContainer.children('.scroll-section'); // 内容区块

      for (var i = 0, len = $secItems.length; i < len; i++) {

        if ( _this.options.type === 'horizontal') {
          var sectionOffset = ($secItems.eq(i).offset().top - _this.paginationHeight) >= 0 
            ? ($secItems.eq(i).offset().top - _this.paginationHeight - _this.options.offsetY) 
            : 0;   
        } else if (_this.options.type === 'vertical') {
          var sectionOffset = ($secItems.eq(i).offset().top) >= 0 
            ? ($secItems.eq(i).offset().top - _this.options.offsetY) 
            : 0;   
        }

        offset.push(sectionOffset);
      }
      offset.push($(document).height());
      return offset;
    })();

    //点击菜单触发滚动
    _this.$scrollPagination.on('click', 'li', function() {
      _this.changePagination(this);
    });

    //window滚动触发
    $(window).on('scroll', function() {
      _this.scrollPosition(this);
    });
  }

  ScrollPosition.prototype = {
    //给ScrollPosition 原型添加changePagination方法
    changePagination: function(obj) {

      var currentIndex = $(obj).index();  
      var currentOffset = this.offsetArr[currentIndex];

      $('html, body').animate({
        scrollTop:currentOffset
      }, 300);
    },
    //给ScrollPosition 原型添加scrollPosition方法
    scrollPosition: function(obj) {

      var windowHeight = $(window).height(); //浏览器窗口高度
      var documentHeight = $(document).height(); //页面文档高度
      var wrapHeight = this.$scrollWrap.height(); //整个模块的高度
      var wrapOffset = this.$scrollWrap.offset().top; // 整个模块的偏移值
      var wrapScrollTop = $(obj).scrollTop();

      //滚动距离大于整个模块的offsetTop时固定菜单
      if(wrapScrollTop > wrapOffset && wrapScrollTop <= wrapHeight + wrapOffset) {

        if (this.options.type === 'horizontal') {
          this.$scrollWrap.css('padding-top', this.paginationHeight); //给模块添加一个与菜单高度一样的padding-top  
        }
        if (this.options.fixedClass) {
          this.$scrollPagination.addClass(this.options.fixedClass);  
        }
      }
      //当滚动超过整个模块最底端 或 当滚动还未达到整个模块顶端时，移除固定菜单样式
      if( wrapScrollTop > wrapHeight + wrapOffset || wrapScrollTop <= wrapOffset) {
        this.$scrollPagination.removeClass(this.options.fixedClass);
        this.$scrollWrap.css('padding-top', 0);
      }
      for(var i=0; i<this.offsetArr.length; i++) {
        //如果滚动位置大于当前目标偏移值 且 小于当前目标下一个目标偏移值时显示为当前值
        if(wrapScrollTop >= this.offsetArr[i] && wrapScrollTop < this.offsetArr[i+1]) {
          this.$scrollPagination.find('li').eq(i).addClass('active').siblings('li').removeClass('active');
        }
        //如果当前位置已经达到最底层时，直接点亮最后一个目标的菜单
        if(wrapScrollTop === documentHeight - windowHeight){
          this.$scrollPagination.find('li').eq(i-1).addClass('active').siblings('li').removeClass('active');  
        }
      }
    } 
  }
  //赋值给全局变量 window
  window.ScrollPosition = ScrollPosition;
})();