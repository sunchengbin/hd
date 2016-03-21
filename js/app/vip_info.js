/**
 * Created by sunchengbin on 15/11/2.
 */
require(['token','dialog','zepto','loading','homenav','lazyload','config','vipuserinfo','gotop'],function(token,dialog,zepto,loading,homenav,lazyload,config,vipuserinfo,gotop){
    var domloading = loading.domLoading();
    var V_U_I = {
        init : function(){
            //var _this = this;
            //token.init({
            //    callback : function(){
            //        _this.getVipInfo();
            //        _this.handlFn();
            //    }
            //});
            var _this = this;
            _this.page = 1;
            token.init({
                callback : function(){
                    _this.getVipInfo(1,function(error){
                        if(error){
                            _this.getVipInfo(1);
                        }
                    });
                    gotop.init(function(){
                        if(_this.page == 0) {
                            $('.j_loading').remove();
                            return false;
                        }else{
                            _this.page++;
                            _this.getVipInfo(_this.page,function(){
                                $('.j_loading').remove();
                            });
                        }
                    });
                    _this.handlFn();
                }
            });
        },
        handlFn : function(){
            var _that = this;
            $('body').on('click','[data-type]',function(){
                var _this = $(this),
                    _type = _this.attr('data-type'),
                    _detail = _that.detail,
                    child = '';
                if(!_detail || _this.is('.act')){return false;}
                if(_type == 1){
                    child = _detail.firstCustomer;
                    $('.j_ratio').html(_detail.firstRatio*100+'%');
                    $('.j_user_sum').html(_detail.firstSubscribeCount);
                    $('.j_o_user_sum').html(_detail.firstOrderCount);
                }else{
                    child = _detail.unFirstCustomer;
                    $('.j_ratio').html(_detail.unFirstRatio*100+'%');
                    $('.j_user_sum').html(_detail.unFirstSubscribeCount);
                    $('.j_o_user_sum').html(_detail.unFirstOrderCount);
                }
                if(!_this.is('.act')){
                    _that.page = 1;
                }
                $('.act[data-type]').removeClass('act');
                _this.addClass('act');
                $('.j_user_lists').html(vipuserinfo.getUserList(child));
            });
        },
        getVipInfo : function(page,callback){
            var _this = this;
            $.ajax({
                url : config.HOST+config.ACTIONS.vipInfo,
                type : 'post',
                contentType: 'application/json;charset=UTF-8',
                dataType:'json',
                beforeSend: function(request) {
                    request.setRequestHeader("X-Access-Token",localStorage.getItem('TOKEN'));
                },
                data:JSON.stringify({
                    page:page,
                    pageSize:30
                }),
                success : function(res){
                    callback && callback();
                    if(res.errcode == 0){
                        if(page == 1){
                            _this.detail = res.detail;
                            $('body').prepend(_this.getTopHtm());
                            $('.j_wraper').html(_this.createUserInfoHtm(_this.transDetail(res.detail)));
                            homenav.init();
                            lazyload.init();
                            domloading.remove();
                        }else{
                            var _type = $('.act[data-type]').attr('data-type'),
                                _users = _type==1?res.detail.firstCustomer:res.detail.unFirstCustomer;
                            $('.j_user_lists ul').append(vipuserinfo.createListHtm(_users));
                            if(res.detail.total == 0){
                                _this.page =0;
                            }else{
                                gotop.enableLoad();
                            }
                        }
                    }else{
                        token.reloadToken(res,function(){
                            dialog.alert({
                                body_txt: res.errmsg,
                                is_cover: true,
                                c_fn : function(){
                                    setTimeout(function(){
                                        window.location.reload();
                                    },0);
                                },//close按钮点击关闭的回调函数
                                cf_fn : function(){
                                    setTimeout(function(){
                                        window.location.reload();
                                    },0);
                                }//点击确定的回调函数
                            });
                        });
                    }
                },
                error : function(){
                    window.location.reload();
                }
            });
        },
        getTopHtm : function(){
            var _user_info = localStorage.getItem('USERINFO')?JSON.parse(localStorage.getItem('USERINFO')):null;
            var _htm = '<section class="user-info-wraper">'
                +'<div class="user-info">'
                +'<div class="img" data-img="'+(_user_info?_user_info.user.logoUrl:config.IMGHOST+'images/icon/defaultimg.png')+'"></div>'
                +'<p>'+(_user_info?_user_info.user.nickName:'游客')+'</p>'
                +'</div>'
                +'</section>';
            return _htm;
        },
        createUserInfoHtm : function(detail){
            var _this = this,
                _htm = '';
            _htm += '<p class="tap_info clearfix">我的余额:<em>'+detail.asset+'</em></p>';
            _htm += '<p class="tap_info clearfix">累计收益:<em>'+detail.earnings+'</em><a href="vip_history.html" class="fr bk">历史收益</a></p>'
                +'<p class="tap_info">累计消费:<em>'+detail.orderTotal+'</em></p>'
                +'<h2 class="tap_title">当前收益详情</h2>'
                +'<div class="detail-tag clearfix">'
                +'<a href="javascript:;" class="block act" data-type="1">'
                +'<p class="">一级用户</p>'
                +'</a>'
                //+'<a href="javascript:;" class="block" data-type="2">'
                //+'<p class="">二级用户</p>'
                //+'</a>'
                +'</div>'
                +'<ul class="info-tag clearfix">'
                +'<li class="info-tag-l">'
                +'<p>返佣比例</p>'
                +'<p class="j_ratio">'+detail.firstRatio*100+'%</p>'
                +'</li>'
                +'<li class="info-tag-l">'
                +'<p>关注人数</p>'
                +'<p class="j_user_sum">'+(detail.firstSubscribeCount?detail.firstSubscribeCount:0)+'</p>'
                +'</li>'
                +'<li>'
                +'<p>下单人数</p>'
                +'<p class="j_o_user_sum">'+(detail.firstOrderCount?detail.firstOrderCount:0)+'</p>'
                +'</li>'
                +'</ul>';
            _htm += '<div class="j_user_lists">';
            _htm += vipuserinfo.getUserList(detail.childList);
            _htm += '</div>';
            return _htm;
        },
        transDetail : function(detail){
            if(detail.total == 0){
                detail.earnings = 0;//累计收益
                detail.orderTotal=0;//累计消费
                detail.firstRatio = detail.firstRatio?detail.firstRatio:0;
                detail.firstSubscribeCount=0;
                detail.firstOrderCount=0;
            }
            return detail;
        }
    };
    V_U_I.init();
})