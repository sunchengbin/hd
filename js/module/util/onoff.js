/**
 * Created by sunchengbin on 16/3/20.
 */
define([],function(){
    var ONOFF = function(opts){
        var _this = this;
        _this.config = $.extend({
            wraper : 'body',
            btn : '.j_on_off',
            isOn : true,
            eventType:'click',
            callBack : null,
            val : {//开关对应的值
                on : '开',
                off : '关'
            }
        },opts);
        _this.init();
    };
    ONOFF.prototype = {
        init : function(){
            this.handleFn();
        },
        handleFn : function(){
            var _this = this,
                _config = _this.config;
            $(_config.wraper).on(_config.eventType,_config.btn,function(){
                var _btn = $(this);
                if(_btn.is('.off')){
                    _this.setOn(_btn);
                }else{
                    _this.setOff(_btn);
                }
                //console.log(_this.getValue())
            });
        },
        setOn : function(btn){//设置成打开
            var _this = this;
            _this.config.isOn = true;
            btn.removeClass('off');
            _this.config.callBack && _this.config.callBack.apply(_this);
            _this.animate();
        },
        setOff : function(btn){//设置成关闭
            var _this = this;
            _this.config.isOn = false;
            btn.addClass('off');
            _this.config.callBack && _this.config.callBack.apply(_this);
            _this.animate();
        },
        animate : function(){//开关的动画

        },
        getValue : function(){
            var _this = this,
                _config = _this.config,
                _val = null;
            if(_config.isOn){
                _val = _config.val.on;
            }else{
                _val = _config.val.off;
            }
            return _val;
        }
    };
    return function(opts){
        return new ONOFF(opts);
    }
})
