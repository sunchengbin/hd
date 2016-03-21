/**
 * Created by sunchengbin on 15/11/7.
 */
define(['config'],function(config){
    var SEARCHPLUG = {
        init : function(wraper,value,type){
            var _this = this;
            $(wraper).prepend(_this.createSearchForm(value,type));
            this.handleFn();
        },
        handleFn : function(){
            var _keyword = document.querySelector('.j_keyword');
            _keyword.addEventListener('focus',function(){
                if($('.j_search_btn').length){
                   return;
                }
                $('.j_search_wraper').append('<a class="j_search_btn" href="javascript:;">搜索</a>');
                $('.j_search_wraper').addClass('focus_wraper');
            });
            _keyword.addEventListener('blur',function(){
                $('.j_search_btn').remove();
                $('.j_search_wraper').removeClass('focus_wraper');
                var _keyword = $('.j_keyword').val();
                if(_keyword){
                    window.location.href = config.URLHOST+'search_result.html?keytype=search&keyword='+encodeURIComponent(_keyword);
                }
            });
        },
        createSearchForm : function(value,type){
            var _htm = '';
            _htm+='<div class="search-form-wraper j_search_wraper">';
            if(type){
                _htm+='<div class="change-country fl">'
                    +'<img class="" src="http://s.hdour.com/images/icon/hanguo.png"/>'
                    +'<div class="">韩国</div>'
                    +'</div>';
            }
            _htm+='<div class="search-form clearfix">'
                +'<i class="search-btn fl"></i>'
                +'<input type="text" class="j_keyword" value="'+(value?value:'')+'" placeholder="搜索商品名"/>'
                +'</div>'
                +'</div>';
            return _htm;
        }
    };
    return SEARCHPLUG;
})