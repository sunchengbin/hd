/**
 * banner轮播图类
 * @class SlideBanner
 * @static
 * @requires
 * @author Leo
 */
define(function() {
	var SlideBanner = {
		hasPrototype: false,
		IsAndroid: (/Android|HTC/i.test(window.navigator.userAgent) || !!(window.navigator['platform'] + '').match(/Linux/i)),
		createNew: function(param) {
			var _this = this,
				param = param || {};
			if (!_this.hasPrototype) {
				_this.init.prototype = SlideBanner;
				_this.hasPrototype = true;
			}
			return new _this.init(param);
		},
		init: function(param) {
			var _this = this;

			// 滚动元素
			_this.dom = param.dom || document.getElementById("slider");

			// 父元素
			_this.parentDom = _this.dom.parentNode;

			// 子元素
			_this.childrens = _this.dom.children;

			// 子元素数量
			_this.bannerCount = _this.childrens.length;

			// 计数 page
			_this.curPage = param.curPage || 1;

			// 容器宽度
			//this.boxWidth = this.parentDom.clientWidth;
			_this.boxWidth = window.innerWidth;
			_this.boxHeight = _this.parentDom.clientHeight;

			// 手指开始位置
			_this.startPos = {
				x: 0,
				y: 0
			}

			// 手指移动距离
			_this.moveDes = {
				x: 0,
				y: 0
			}

			// 自动执行对象
			_this.autoTime = null;

			//自动执行间隔时间，默认3秒
			_this.intervalTime = param.intervalTime || 3000;

			//动画过度速度,参数格式为css3动画执行时间参数
			_this.transformSpeed = param.transformSpeed || '0.6s';

			//是否需要轮播
			_this.auto = true;
			if (typeof param.auto != 'undefined' && param.auto === false) {
				_this.auto = false;
			}

			//是否需要tab
			_this.needTab = true;
			if (typeof param.needTab != 'undefined' && param.needTab === false) {
				_this.needTab = false;
			}

			_this.tabBox = param.tabBox || undefined;

			_this.tabItemHtml = param.tabItemHtml || "<i></i>";

			_this.tabCurrentClass = param.tabCurrentClass || 'cur';

			// 有更多才整理DOM、绑定事件、轮播执行
			if (_this.bannerCount > 1) {
				if (!_this.formated) {
					_this.formatDom();
				}
				_this.bindEvent();
				//初始化增加一倍延迟；
				if (_this.auto) {
					setTimeout(function() {
						_this.autoRun();
					}, _this.intervalTime - 2000);
				}
			}

		},
		formatDom: function() {
			var _this = this,
				first = _this.childrens[0].cloneNode();
			last = _this.childrens[_this.bannerCount - 1].cloneNode();
			first.innerHTML = _this.childrens[0].innerHTML;
			last.innerHTML = _this.childrens[_this.bannerCount - 1].innerHTML;
			_this.dom.appendChild(first);
			_this.dom.insertBefore(last, _this.childrens[0]);

			if (_this.needTab) {
				if (!_this.tabBox) {
					_this.tabBox = document.createElement('div');
					_this.tabBox.className = "slide_tab";
					_this.parentDom.appendChild(_this.tabBox);
				}
				var tabsHtml = '';
				for (var i = 0; i < _this.bannerCount; i++) {
					tabsHtml += _this.tabItemHtml;
				}
				_this.tabBox.innerHTML = tabsHtml;
				_this.tabItems = _this.tabBox.children;
			}
			// _this.parentDom.style.webkitTransformStyle = 'preserve-3d';
			// _this.parentDom.style.webkitPerspective = '1000';
			// _this.parentDom.style.webkitBackfaceVisibility = 'hidden';

			_this.setSize();

			//定位到当前page
			_this.toPage();

			_this.formated = true;
		},
		setSize: function() {
			var _this = this;
			for (var i = 0, clen = _this.childrens.length; i < clen; i++) {
				_this.childrens[i].style.width = _this.boxWidth + 'px';
				// _this.childrens[i].style.height = _this.boxHeight + 'px';
			};

			_this.dom.style.width = (_this.boxWidth * _this.childrens.length) + 'px';
			// _this.dom.style.height = _this.boxHeight + 'px';


			// _this.parentDom.style.width = _this.boxWidth + 'px' ;
			// _this.parentDom.style.height = _this.boxHeight + 'px';
		},
		autoRun: function() {
			var _this = this;

			if (!_this.auto) {
				return false;
			}

			clearTimeout(_this.autoTime);

			_this.autoTime = null;
			_this.autoTime = setTimeout(function() {
				_this.curPage++;
				_this.adjustTranslate();
				_this.toPageAnimation();
				clearTimeout(_this.autoTime);
				_this.autoRun();
			}, _this.intervalTime);
		},
		bindEvent: function() {
			var _this = this,

				touchstart = function(event) {
					_this.touchstart.call(this, event, _this);
				},
				touchmove = function(event) {
					if (_this.bannerCount > 1) {
						_this.touchmove.call(this, event, _this);
					}
				},

				touchend = function(event) {
					if (_this.bannerCount > 1) {
						_this.touchend.call(this, event, _this);
					}
				};

			var resize = "onorientationchange" in window ? "orientationchange" : "resize";
			_this.dom.addEventListener("touchstart", touchstart, false);
			_this.dom.addEventListener("touchmove", touchmove, false);
			_this.dom.addEventListener("touchend", touchend, false);
			_this.dom.addEventListener("touchcancel", touchend, false);
			_this.dom.addEventListener("webkitTransitionEnd", function() {
				_this.isScrolling = undefined;
			}, false);

			window.addEventListener("resize", function() {
				_this.resize();
			}, false);

			if (_this.auto && _this.IsAndroid) {
				window.addEventListener("focus", function() {
					_this.autoRun();
				}, false);
				window.addEventListener("blur", function() {
					clearTimeout(_this.autoTime);
				}, false);
			}

		},
		touchstart: function(event, obj) {
			clearTimeout(obj.autoTime);
			obj.autoTime = null;

			// 初始化手指起始位置
			obj.startPos.x = event.targetTouches[0].pageX;
			obj.startPos.y = event.targetTouches[0].pageY;

			// 初始化移动距离
			obj.moveDes.x = obj.moveDes.y = 0;
			// obj.dom.style.webkitTransition = "none";
			obj.dom.style.webkitTransition = '0s';

		},
		touchmove: function(event, obj) {
			obj.moveDes.x = event.targetTouches[0].pageX - obj.startPos.x;
			obj.moveDes.y = event.targetTouches[0].pageY - obj.startPos.y;

			var offsetX = obj.getTranslate();

			if (typeof obj.isScrolling == 'undefined') {
				obj.isScrolling = !!(obj.isScrolling || Math.abs(obj.moveDes.x) < Math.abs(obj.moveDes.y));
			}
			if (obj.isScrolling != true) {
				event.preventDefault();
				// obj.dom.style.webkitTransition = "none";
				obj.dom.style.webkitTransition = "0s";
				obj.dom.style.webkitTransform = "translate3d(" + (offsetX + obj.moveDes.x) + "px, 0,0)";
				// obj.dom.style.left = (offsetX + obj.moveDes.x) + "px";
			}
		},
		touchend: function(event, obj) {
			obj.isScrolling = undefined;

			if (Math.abs(obj.moveDes.x) > 40) {
				if (obj.moveDes.x < 0) {
					obj.curPage++;
				} else {
					obj.curPage--;
				}
			}
			obj.adjustTranslate(obj.moveDes.x);
			obj.toPageAnimation();

			if (obj.auto) {
				obj.autoRun();
			}
		},
		resize: function() {
			var _this = this;
			clearTimeout(_this.autoTime);
			// _this.boxWidth = _this.parentDom.offsetWidth;
			var ch = _this.parentDom.clientHeight;
			if (ch != 0) {
				_this.boxWidth = window.innerWidth;
				_this.boxHeight = ch;
				_this.setSize();

				_this.toPage();
				if (_this.auto) {
					_this.autoRun();
				}
			}

		},
		getTranslate: function() {
			var _this = this;
			return -(_this.boxWidth * _this.curPage);
		},
		setTranslate: function(x) {
			var _this = this;
			_this.dom.style.webkitTransition = "0s";
			_this.dom.style.webkitTransform = "translate3d(" + x + "px, 0,0)";
			// _this.dom.style.left = x + "px";
		},
		adjustTranslate: function(offsetX) {
			var _this = this,
				offsetX = offsetX || 0;

			if (_this.curPage > _this.bannerCount) {
				_this.curPage = 1;
				_this.setTranslate(offsetX);
			} else if (_this.curPage < 1) {
				_this.curPage = _this.bannerCount;
				_this.setTranslate((-(_this.boxWidth * (_this.bannerCount + 1))) + offsetX);
			}
		},
		toPage: function() {
			var _this = this,
				translate = _this.getTranslate();
			_this.setTranslate(translate);
			if (_this.needTab) {
				_this.setTab();
			}
			_this.lazyImg();
		},
		toPageAnimation: function() {
			var _this = this,
				translate = _this.getTranslate(_this);

			setTimeout(function() {
				// _this.dom.style.webkitTransitionProperty = "-webkit-transform";
				_this.dom.style.webkitTransitionDuration = _this.transformSpeed;
				_this.dom.style.webkitTransform = "translate3d(" + translate + "px, 0,0)";
				// _this.dom.style.left = translate + "px";
			}, 10);
			if (_this.needTab) {
				_this.setTab();
			}
			_this.lazyImg();
		},
		setTab: function() {
			var _this = this,
				idx = _this.curPage - 1;
			for (var i = 0; i < _this.tabItems.length; i++) {
				_this.tabItems[i].className = _this.tabItems[i].className.replace(_this.tabCurrentClass, '');
				if (i == idx) {
					_this.tabItems[i].className = _this.tabItems[i].className + ' ' + _this.tabCurrentClass;
				}
			}
		},
		lazyInt: false,
		lazyLoaded: false,
		lazyImg: function() {
			var _this = this,
				n = _this.curPage,
				imgs = [];
			if (_this.lazyLoaded) {
				return;
			}

			if (!_this.lazyInt && n == 1) {
				imgs.push(_this.childrens[0].querySelector('img.banner_lazy'));
				imgs.push(_this.childrens[n].querySelector('img.banner_lazy'));
				imgs.push(_this.childrens[n + 1].querySelector('img.banner_lazy'));
				imgs.push(_this.childrens[_this.bannerCount + 1].querySelector('img.banner_lazy'));
				imgs.push(_this.childrens[_this.bannerCount].querySelector('img.banner_lazy'));
			} else {
				imgs.push(_this.childrens[n + 1].querySelector('img.banner_lazy'));
				imgs.push(_this.childrens[n - 1].querySelector('img.banner_lazy'));
			}

			if (imgs.length > 0) {
				for (var i = 0, x = imgs.length; i < x; i++) {
					if (imgs[i] && imgs[i].hasAttribute('data-url')) {
						imgs[i].src = imgs[i].getAttribute('data-url');
						imgs[i].removeAttribute('data-url');
						imgs[i].className = imgs[i].className.replace(/banner_lazy/g, '').trim();
					}
				};
			}
			if (_this.dom.querySelectorAll('img.banner_lazy').length == 0) {
				_this.lazyLoaded = true;
			}
		}

	}
	return SlideBanner;
});