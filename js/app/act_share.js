/**
 * Created by sunchengbin on 16/3/14.
 */
/**
 * Created by sunchengbin on 16/1/15.
 */
//个人用户
require(['zepto','token','dialog','config','base','fastclick','weixin','actconfig','loading'],function(zepto,token,dialog,config,base,fastclick,weixin,actconfig,loading) {
    fastclick.attach(document.body);
    var domloading = loading.domLoading();
    var ATU = {
        init : function(){
            var _this = this;
            token.init({
                callback : function(){
                    var _user_info = localStorage.getItem('USERINFO'),
                        _self_id = _user_info?JSON.parse(_user_info).token.userId:10004,
                        _url_pid = base.others.getUrlPrem('pid'),
                        _pid = _url_pid?_url_pid:_self_id,
                        _share_url = _url_pid?location.href:location.href+'?pid='+_self_id,
                        _isself = !_url_pid || _url_pid == _self_id?1: 0,
                        _user_name = base.others.getUrlPrem('name')?base.others.getUrlPrem('name'):'我';
                    _this.getUserInfo(_pid,function(opts){
                        weixin.wxinit(function(){
                            weixin.updateShare({
                                title: (_isself&&_user_info?JSON.parse(_user_info).user.nickName:_user_name)+'分享了"小白免税"送豪礼活动',
                                desc: '分享关注都拿钱，轻松赚足50元',
                                link: _share_url,
                                imgUrl: opts.url,
                                success: function() {
                                    if(_isself){
                                        weixin.shareSuccess(function(){
                                            alert('分享成功,获得5元红包,请到商城首页右下角"我的"主页查看余额')
                                        });
                                    }
                                    //return true;
                                },
                                cancel: function() {}
                            });
                        },'acttemuser');
                    },_isself);
                },
                type:'acttemuser'
            });
        },
        getUserInfo:function(pid,callback,isself){
            var _this = this;
            _this.handleFn();
            $.ajax({
                url : config.HOST + config.ACTIONS.shareAct,
                type : 'post',
                contentType: 'application/json;charset=UTF-8',
                dataType:'json',
                data: JSON.stringify({
                    parentId : pid
                }),
                success: function (res) {
                    if (res.errcode == 0) {
                        var TOKEN_ERROR = localStorage.getItem('TOKEN_ERROR');
                        if(TOKEN_ERROR){
                            localStorage.removeItem('TOKEN_ERROR');
                        }
                        $('.j_wraper').html(_this.getHtml(res.detail,isself));
                        //if(isself){
                        _this.handleFn();
                        //}
                        domloading.remove();
                        callback && callback({
                            url : (res.detail.portraitUrl?res.detail.portraitUrl:'http://s.hdour.com/images/logo.jpg')
                        });
                    } else {
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
                error:function(){
                    token.errorFn();
                    //window.location.reload();
                }
            });
        },
        getHtml : function(res,isself){
            var _htm = '',
                _this = this;
            _htm+='<img src="../../images/act/top_bg_one.png"/>';
            _htm+='<div class="user-info clearfix">'
                +'<div class="user-logo j_up_img">';
            _htm+='<img class="j_a_img" src="'+(res.qrcodeUrl?res.qrcodeUrl:'../../images/act/no_img.png')+'"/>';
            if(isself){
                _htm+='<p>分享给好友</p>';
                _htm+='<p>让她(他)送我1元红包</p>';
            }else{
                _htm+='<p>长按识别二维码并关注</p>';
                _htm+='<p>送她(他)1元消费红包</p>';
            }
            _htm+='</div><div class="user-rank">';
            _htm+='<div class="user-rank-left user-rank-lefted">'
                +'<img class="j_a_img" src="'+(res.portraitUrl?res.portraitUrl:'../../images/act/no_img.png')+'"/>'
                + '</div>';
            _htm+='<div class="user-rank-right">'
                +_this.getTxtHtm(isself)
                +'</div>'
                +'</div>'
                +'</div>';
            if(!isself){
                _htm+='<p class="i-join"><a href="act_share.html" class="">我也要参加</a></p>';
            }
            if(res.childList && res.childList.length){
                _htm+='<div class="txt-cont">'
                    +'<p class="clearfix">'+(isself?'我':'她(她)')+'已经赚了'+res.childList.length+'元</p>'
                    +'<ul>'
                    +_this.getUsersList(res.childList,isself)
                    +'</ul>'
                    +'</div>';
            }
            _htm+='<img src="../../images/act/act_list.png"/>'
                +'<div class="txt-cont act-wraper">'
                +'<span class="angle-s"></span>'
                +'<div class="clearfix txt-d">'
                +'<em class="">1</em>'
                +'<p>小白免税,让你轻松购买,最全,最真的"棒子国"化妆品。</p>'
                +'</div>'
                +'<div class="clearfix txt-d">'
                +'<em class="">2</em>'
                +'<p>点击我要参加“分享到朋友圈或者直接分享给朋友”即可获得5元消费红包(第一次有效)，每邀请一个新用户扫描分享页面中的二维码即可获得1元消费红包，同时扫码好友产生消费后，还可以获得好友消费金额5%的消费红包。所有红包,全部存入账户余额。</p>'
                +'</div>'
                +'<div class="clearfix txt-d">'
                +'<em class="">3</em>'
                +'<p>关于账户余额查询,请进入“小白免税”公众号“商城首页”右下角的“我的”查看。</p>'
                +'</div>'
                +'<div class="clearfix txt-d">'
                +'<em class="">4</em>'
                +'<p>消费红包不设门槛，对应红包余额可直接用于减免小白免税消费金额，每人最高可得50元小白免税消费红包；消费红包仅用于在小白免税购物时直接抵用消费额，不兑现，不找零。</p>'
                +'</div>'
                +'<div class="clearfix txt-d">'
                +'<em class="">5</em>'
                +'<p>严禁使用各种购买手段参与活动作弊行为，一经发现，取消活动优惠资格。</p>'
                +'</div>'
                +'<p>长按识别二维码联系客服小白</p>'
                +'<div class="wx-er">'
                +'<img src="../../images/service/find_ser_er.jpg"/>'
                +'</div>'
                +'</div>';

            _htm+='<img src="../../images/act/about_top.png"/>'
                +'<a class="block" href="http://s.hdour.com">'
                +'<img src="../../images/act/go_shop.png">'
                +'</a>'
                +'<p class="footer-p">活动最终解释权归北京海兜科技有限公司所有</p>';
            return _htm;
        },
        getUsersList : function(child){
            var _htm = '';
            if(!child.length){
                _htm+='<li class="clearfix">'
                    +'<p class="no-user">还没有人给你送红包</p>'
                    +'<p class="no-user">快分享给好友让他们送你红包哦</p>'
                    +'</li>';
            }else{
                $.each(child,function(i,item){
                    var isself = true;
                    if(!item.childName){
                        isself = false;
                    }
                    _htm+='<li class="clearfix" data-id="'+item.childId+'">'
                        +(!isself?'':'<a href="act_share.html?pid='+item.childId+'&name='+encodeURIComponent(item.childName)+'" class="">')
                        +'<img src="'+(item.portraitUrl?item.portraitUrl:'../../images/service/ser1.jpg')+'"/>'
                        +'<div>'
                        +'<p>'+(item.nickName?item.nickName:'神秘游客')+'<em class="fr">1元</em></p>'
                        +'</div>'
                        +(!isself?'':'</a>')
                        +'</li>';
                });
            }
            return _htm;
        },
        getTxtHtm : function(isself){
            var _htm = '';
            if(isself){
                _htm+='<p>通过微信右上角的按钮</p>' +
                    '<p>分享到朋友圈</p>' +
                    '<p>分享给朋友</p>' +
                    '<p>就送你5元消费红包</p>' +
                    '</div>';
            }else{
                _htm+='<p>长按识别二维码</p>' +
                    '<p>关注送他1元消费红包</p>' +
                    '<p>点击"我要参加"</p>' +
                    '<p>分享抢5元红包</p>' +
                    '</div>';
            }
            return _htm;
        },
        handleFn : function(){
            $('body').on('click','.j_share_btn',function(){
                dialog.alert({
                    body_txt: '通过微信右上角的按钮,发送给朋友或者分享到朋友圈,让好友帮你抢好礼',
                    is_cover: true
                });
            });
        }
    };
    ATU.init();
})
