/**
 * Created by sunchengbin on 15/11/13.
 */
require(['zepto','fastclick','homenav'],function(zepto,fastclick,homenav){
    fastclick.attach(document.body);
    //homenav.init();
    $('.j_wraper').on('click','li',function(){
        var _this = $(this),
            _tag = _this.attr('data-tag');
        if(!_this.is('.act')){
            $('.info-wraper > div').hide();
            $('.'+_tag).show();
            $('li.act').removeClass('act');
            _this.addClass('act');
        }
    });
})