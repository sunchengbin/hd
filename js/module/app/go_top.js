/**
 * Created by sunchengbin on 15/10/11.
 */
define(['fastclick'],function(fastclick){
    var GoTop = {
        init : function(callback){
            var _this = this;
            _this.is_load = true;
            $(window).scroll(function(){
                var _top = $(window).scrollTop()+50,
                    _w_h = $(window).height(),
                    _d_h = $(document).height(),
                    _max_st = _d_h - _w_h;
                if(_top >= 500){
                    _this.createGoTop();
                    if(_top >= _max_st && _this.is_load){
                        _this.handleLoading(callback);
                    }
                }else{
                    _this.removeGoTop();
                }
            });
        },
        disableLoad : function(){
            this.is_load = false;
        },
        enableLoad : function(){
            this.is_load = true;
        },
        handleLoading : function(callback){
            var _this = this;
            if(callback){
                if(!$('.j_loading').length){
                    $('.j_wraper').append(_this.createLoading());
                    _this.disableLoad();
                }
                callback.apply(_this);
            }
        },
        createLoading : function(){
            var _htm = '<div class="loading-wraper j_loading">加载更多<span class="go-loading-icon "></span></div>';
            return _htm;
        },
        createGoTop : function(){
            var _htm = '';
            _htm+='<a href="javascript:;" class="go-top j_go_top">'
                +'</a>';
            if(!$('.j_go_top').length){
                $('body').append(_htm);
                $(window).ready(function() {
                    var _gotop = document.querySelector('.j_go_top');
                    fastclick.attach(_gotop);
                    _gotop.addEventListener('click',function () {
                        $(window).scrollTop(0);
                    },false);
                });
            }
        },
        removeGoTop : function(){
            $('.j_go_top').remove();
        }
    };
    return GoTop;
})