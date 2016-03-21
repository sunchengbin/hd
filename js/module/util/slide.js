/**
 * Created by sunchengbin on 15/11/4.
 */
define([],function(){
    var SLIDE = {
        init : function(opts){

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
        handleFn : function(){
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
        }
    };
    return SLIDE;
})
