/**
 * Created by sunchengbin on 15/11/5.
 */
define(['dialog','cart','fastclick','weixin','config'],function(dialog,cart,fastclick,weixin,config){
    fastclick.attach(document.body);
    var BUY_PLUG = {
        init : function(good,callback){
            if(!weixin.isWeixin) {
                window.location.href = config.URLHOST+'offic_qrcode.html';
            }
            var _dh = $(document).height(),
                _wh = $(window).height(),
                _ch = _dh > _wh?_dh:_wh,
                _this = this;
            this._buy_plug = dialog.cover({
                body_txt: _this.createBuyPlug(good),
                wraper_css : {
                    bottom : 0,
                    left : 0,
                    position:'fixed',
                    width : '100%'
                    //transition: '1s transform',
                    //transform: 'translate3d(0,-200px,0)',
                    //'webkitTransition': '1s',
                    //'webkitTransform': 'translate3d(0,-200px,0)',
                    //backgroundColor:'#fff'
                },
                //animation_css : {
                //    transition: '1s transform',
                //    transform: 'translate3d(0,200px,0)',
                //    'webkitTransition': '1s',
                //    'webkitTransform': 'translate3d(0,200px,0)'
                //},
                is_cover : true
            });
        },
        handelFn : function(callback){
            var _this =this;
            $('body').on('click','.j_good_move',function(){
                var _this = $(this),
                    _num = Number(_this.parent().find('.j_good_info_num').attr('data-val'));
                if(_num > 1){
                    _num--;
                    _this.parent().find('.j_good_info_num').attr('data-val',_num).html(_num);
                }
            });
            $('body').on('click','.j_good_add',function(){
                var _this = $(this),
                    _num = Number(_this.parent().find('.j_good_info_num').attr('data-val')),
                    _limit_all = _this.attr('data-limit-all'),
                    _limit_one = _this.attr('data-limit-one');

                //if(_num == _limit_all){
                //    //库存
                //}else{
                    if(_limit_one != 0 && _num == _limit_one){
                        //单人限购
                        //dialog.alert({
                        //    body_txt: '每人每天限购'+_limit_one+'件',
                        //    is_cover: false
                        //});
                    }else{
                        _num++;
                    }

                //}
                _this.parent().find('.j_good_info_num').attr('data-val',_num).html(_num);
            });
            $('body').on('click','.j_save_btn',function(){
                callback && callback($('.j_good_info_num').attr('data-val'));
                _this._buy_plug.remove();
            });

        },
        createBuyPlug : function(good){
            var _htm = '';
            _htm+='<section class="buy-plug">'
                +'<div class="num-wraper">'
                +'<img class="good-img" src="'+(good.pics?good.pics[0]:good.logoUrl)+'"/>'
                +'<div class="num-info">'
                +'<p>'+good.name+'</p>'
                +'<p>¥'+(good.priceList.vip?good.priceList.vip.price:good.priceList.curRmb.price)+'</p>'
                //+(good.limitAll?'<p>库存'+good.limitAll+'件</p>':'')
                +'</div>'
                +' </div>'
                //+'<div class="good-type clearfix">'
                //+'<span class="explain-tab">颜色</span>'
                //+'<span class="item-type-act">红色</span>'
                //+'<span class="">粉色</span>'
                //+'</div>'
                +'<div class="buy-num clearfix">'
                +'<span class="explain-tab fl">购买数量</span>'
                +'<div class="good-wrap fl">'
                +'<div class="good-num">'
                +'<span class="good-move j_good_move" data-limit-all="'+good.limitAll+'" data-limit-one="'+good.limitOne+'"  data-bool="true">'
                +'<i class="icon iconfont">&#xe6e0;</i>'
                +'</span>'
                +'<p class="j_good_info_num" data-val="1">1</p>'
                //+'<input type="text" class="j_good_info_num" readonly="true" value="1">'
                +'<span class="good-add j_good_add" data-limit-all="'+good.limitAll+'" data-limit-one="'+good.limitOne+'"  data-bool="true">'
                +'<i class="icon iconfont">&#xe6df;</i>'
                +'</span>'
                +'</div>'
                +'</div>'
                +(good.limitOne>0?'<span class="explain-msg fl">限购量'+good.limitOne+'件</span>':'')
                +'</div>'
                +'<p class="">'
                +'<a href="javascript:;" class="j_save_btn">确定</a>'
                +' </p>'
                +' </section>';
            return _htm;
        }
    };
    return BUY_PLUG;
})