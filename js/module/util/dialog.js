/**
 * Created by sunchengbin1 on 2015/6/18.
 * 弹窗模块
 */
define(['base'],function(base){
    var dialog = function(opts){
        var _this = this;
        _this.opts = $.extend({
            top_txt : '<span class="dialog-top-t">提示</span>',//可以是html
            show_top : true,//是否显示头部
            width : 300,//弹窗宽度
            height : null,//弹窗特定高度
            body_txt : '<p class="dialog-body-p">确认删除?</p>',//弹窗内容区字段
            body_fn : null,//插入的body的fn
            c_fn : null,//close按钮点击关闭的回调函数
            cf_fn : null,//点击确定的回调函数
            show_footer : true,//是否显示底部
            cfb_txt : '确定',//确定按钮文字
            cab_txt : '取消',//取消按钮的文字
            can_exist : false,//是否可一同时存在两个dialog,默认不能你存在
            is_confirm : false,//是否是confirm
            is_cover : true,//是否有遮罩层
            event_type : 'click',//所有弹窗按钮的事件type
            //隐藏项在创建了wraper后就会创建,弹窗层的dom对象
            wraper_css : null,
            coverdom : null,//只需要cover浮层时
            animation_css:null,//动画
            cover_css : null//遮罩层自定义样式
        },opts);
        _this.init();
        return _this;
    };
    dialog.prototype = {
        init : function(){
            var _this = this;
            _this.createDialog();
            _this.handleFn().show();
        },
        handleFn : function(){
            var _this = this,
                _wraper = _this.opts.wraper,
                _e_type = _this.opts.event_type;
            _wraper.on(_e_type,'.j_c_btn',function(){
                _this.opts.c_fn && _this.opts.c_fn.call(_this,$(this));
                _this.remove();
            });
            _wraper.on(_e_type,'.j_cf_btn',function(){
                _this.opts.cf_fn && _this.opts.cf_fn.call(_this,$(this));
                _this.remove();
            });
            _wraper.on(_e_type,'.j_ca_btn',function(){
                _this.opts.c_fn && _this.opts.c_fn.call(_this,$(this));
                _this.remove();
            });
            $('.j_dialog_cover').click(function(){
                _this.remove();
            });
            return _this;
        },
        show : function(){
            this.opts.wraper.show();
        },
        remove : function(){
            var _this = this,
                animation_css = _this.opts.animation_css;
            if(animation_css){
                this.opts.wraper.css(animation_css);
                setTimeout(function(){
                    _this.opts.wraper.remove();
                    $('.j_dialog_cover').remove();
                },1000);
            }else{
                this.opts.wraper.remove();
                $('.j_dialog_cover').remove();
            }

        },
        createTop : function(){
            var _this = this,
                _htm = '';
            if(!_this.opts.show_top) return '';
            _htm = '<div class="dialog-top j_d_top">'
                    +_this.opts.top_txt
                    +'<a href="javascript:;" class="j_c_btn fr">关闭</a>'
                    +'</div>';
            return _htm;

        },
        createBody : function(){
            var _this = this,
                _htm = '';
            _htm = '<div class="dialog-body j_d_body">'+_this.opts.body_txt+'</div>';
            return _htm;

        },
        createFooter : function(){
            var _this = this,
                _htm = '';
            if(!_this.opts.show_footer) return '';
            _htm = '<div class="dialog-footer j_d_footer">';
            _htm += '<a href="javascript:;" class="j_cf_btn cf-btn">'+_this.opts.cfb_txt+'</a>';
            if(_this.opts.is_confirm){
                _htm += '<a href="javascript:;" class="j_ca_btn ca-btn">'+_this.opts.cab_txt+'</a>';
            }
            _htm += '</div>';
            return _htm;

        },
        createDialog : function(){
            var _this = this,
                _htm = '<div class="dialog-wraper j_dialog_wraper">'
                        +_this.createTop()
                        +_this.createBody()
                        +_this.createFooter()
                        +'</div>';

            if(!_this.opts.can_exist && $('.j_dialog_wraper').length){
                $('.j_dialog_wraper').remove();
            }
            if(_this.opts.coverdom){
                _htm = _this.opts.body_txt;
            }
            var _dh = $(document).height(),
                _wh = $(window).height(),
                _ch = _dh > _wh?_dh:_wh,
                _cover_css = _this.opts.cover_css?$.extend({'height':_ch},_this.opts.cover_css):{'height':_ch};

            if(_this.opts.is_cover && !$('.j_dialog_cover').length){
                var _cover = $('<div class="dialog-cover j_dialog_cover"></div>'),
                    _zindex = base.others.zindex++;
                _cover.css('zIndex',_zindex);
                $('body').append(_cover);
                $('.j_dialog_cover').css(_cover_css);
            }
            var _wraper = $(_htm);
            _this.opts.wraper = _wraper;
            $('body').append(_wraper);
            _wraper.css(_this.setPosition());

            return _this;
        },
        setPosition : function(){
            var _this = this,
                _zindex = base.others.zindex++,
                _wraper_css = _this.opts.wraper_css,
                _count_position = _this.countPosition();
            if(_wraper_css){
                return $.extend({
                    top : _count_position.top,
                    left : _count_position.left,
                    width : _this.opts.width,
                    zIndex : _zindex
                },_wraper_css);
            }
            return {
                top : _count_position.top,
                left : _count_position.left,
                width : _this.opts.width,
                zIndex : _zindex
            };

        },
        countPosition : function(){
            var _this = this,
                _wraper_css = _this.opts.wraper_css,
                _sco_top = $(window).scrollTop(),
                _sco_left = $(window).scrollLeft(),
                _win_w = $(window).width(),
                _win_h = $(window).height(),
                _d_w = _wraper_css?_wraper_css.width:_this.opts.width,
                _wraper = _this.opts.wraper,
                _d_h = _wraper_css?_wraper_css.height:(_this.opts.height?_this.opts.height:_wraper.height()),
                _d_top_h = _this.opts.show_top?_wraper.find('.j_d_top').height():0,
                _d_footer_h = _this.opts.show_footer?_wraper.find('.j_d_footer').height():0,
                _top = 0,
                _left = 0;
            if(_d_h >= _win_h){
                _wraper.find('.j_d_body').css('maxHeight',(_win_h - _d_top_h - _d_footer_h));
                _top = 20 + _sco_top;
            }else{
                _top = (_win_h - _d_h) / 2 + _sco_top;
            }
            if(_d_w >= _win_w){
                _wraper.find('.j_d_body').css('maxWidth',_d_w);
                _left = 10 + _sco_left;
            }else{
                _left = (_win_w - _d_w) / 2 + _sco_left;
            }
            return {
                top : _top,
                left : _left
            }
        }

    };
    return {
        dialog : function(opts) {
            return new dialog(opts);
        },
        alert : function(opts) {
            return new dialog(opts);
        },
        confirm : function(opts) {
            opts = $.extend({is_confirm:true},opts);
            return new dialog(opts);
        },
        tip : function(opts){
            opts = $.extend({show_footer:false},opts);
            return new dialog(opts);
        },
        loading : function(opts){
            opts = $.extend({show_footer:false,show_top:false},opts);
            return new dialog(opts);
        },
        cover : function(opts){
            opts = $.extend({coverdom:true},opts);
            return new dialog(opts);
        }
    }
})
