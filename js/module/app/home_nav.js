/**
 * Created by sunchengbin on 15/11/4.
 */
define(['cart','config'],function(cart,config){
    var HOME_NAV = {
        init : function(type){
            var _this = this,
                _htm = _this.createNavHtm(type);
            $('body').append(_htm);
        },
        createNavHtm : function(type){
            var _htm = '',
                _good_num = (cart.getGoodNum() != 0 && cart.getGoodNum()>99)?'99+':cart.getGoodNum(),
                _url = location.href,
                _city = localStorage.getItem('CITY');
            _htm+='<nav class="nav-bar clearfix">'
                +'<a href="'+config.URLHOST+'act_home.html" class="'+(type=='home'?'act':'')+'">'
                +'<p class="nav-p"><i class="nav-home"></i></p>'
                +'<p>首页</p>'
                +'</a>'
                +'<a href="'+config.URLHOST+'search_home.html?key=brand" class="'+(type=='brand'?'act':'')+'">'
                +'<p class="nav-p"><i class="nav-brand"></i></p>'
                +'<p>品牌</p>'
                +'</a>'
                +'<a href="'+config.URLHOST+'shop_cart.html" class="'+(type=='shop'?'act':'')+'">'
                +'<p class="nav-p"><i class="nav-shop"></i></p>'
                +'<p>购物车</p>'
                +'<em class="shop-icon j_show_num '+(_good_num!=0?'':'hide')+'">'+(_good_num!=0?_good_num:'')+'</em>'
                +'</a>'
                +'<a href="'+config.URLHOST+'my_centre.html" class="'+(type=='my'?'act':'')+'">'
                +'<p class="nav-p"><i class="nav-my"></i></p>'
                +'<p>我的</p>'
                +'</a>'
                +'</nav>';
            return _htm;
        }
    };
    return HOME_NAV;
})
