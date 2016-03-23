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
                        //_isself = 0,
                        _isself = !_url_pid || _url_pid == _self_id?1: 0,
                        _user_name = base.others.getUrlPrem('name')?base.others.getUrlPrem('name'):'我';
                    _this.getUserInfo(_pid,function(opts){
                        weixin.wxinit(function(){
                            weixin.updateShare({
                                title: (_isself&&_user_info?(JSON.parse(_user_info).user&&JSON.parse(_user_info).user.nickName?JSON.parse(_user_info).user.nickName:'我'):_user_name)+'分享了"小白免税"送豪礼活动',
                                desc: '呼朋唤友手一抖,轻松赚足50元',
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
            _htm+='<div class="user-info clearfix">';
            if(isself){
                _htm += '<img class="j_a_img" src="'+(res.portraitUrl?res.portraitUrl:'../../images/act/no_img.png')+'"/>';
                _htm += '<p>通过微信右上角的按钮分享到朋友圈</p>';
                _htm += '<p>就送你五元消费红包</p>';
            }else{
                _htm += '<div class="img-box clearfix">';
                _htm += '<img class="two-img" src="'+(res.qrcodeUrl?res.qrcodeUrl:'../../images/act/no_img.png')+'"/>';
                _htm += '<img class="two-img" src="'+(res.portraitUrl?res.portraitUrl:'../../images/act/no_img.png')+'"/>';
                _htm += '</div>';
                _htm += '<p>长按扫描二维码并关注</p>';
                _htm += '<p>即可送他(她)三元“小白免税”消费红包</p>';
            }
            _htm+='</div>';
            if(res.childList && res.childList.length){
                _htm+='<div class="txt-cont">'
                    +'<p class="clearfix">'+(isself?'我':'她(她)')+'已经赚了'+(res.childList.length*3)+'元</p>'
                    +'<ul>'
                    +_this.getUsersList(res.childList,isself)
                    +'</ul>'
                    +'</div>';
            }
            if(isself){
                _htm+='<img src="../../images/act/act_list.png"/>'
                    +'<div class="txt-cont act-wraper">'
                    +'<span class="angle-s"></span>'
                    +'<div class="clearfix txt-d">'
                    +'<em class="">1</em>'
                    +'<p>通过微信右上角按钮分享本活动到朋友圈即可得五元“小白免税”消费红包。</p>'
                    +'</div>'
                    +'<div class="clearfix txt-d">'
                    +'<em class="">2</em>'
                    +'<p>好友通过你分享的页面扫描了二维码关注“小白免税”服务号，你即可得三元“小白免税”消费红包，最高可得45元小白免税消费红包。</p>'
                    +'</div>'
                    +'<div class="clearfix txt-d">'
                    +'<em class="">3</em>'
                    +'<p>你的好友在“小白免税”产生消费后，还可以获得好友消费金额的5%的消费红包，好友消费红包不设上限。</p>'
                    +'</div>'
                    +'<div class="clearfix txt-d">'
                    +'<em class="">4</em>'
                    +'<p>消费红包查看方式：进入“小白免税”服务号，点击“免税商城”，进入免税商城后，点击右下角“我的”按钮，即可在右上角看到你的“小白免税”账户余额。</p>'
                    +'</div>'
                    +'</div>';
            }else{
                _htm+='<p class="i-join"><a href="act_share.html" class="">我也要参加</a></p>';
            }
            _htm+='<img src="../../images/act/about_top.png"/>'
                +'<a class="block" href="http://s.hdour.com" style="margin: 10px 15px;">'
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
                        +'<p>'+(item.nickName?item.nickName:'神秘游客')+'<em class="fr">3元</em></p>'
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
                    '<p>关注送他3元消费红包</p>' +
                    '<p>点击下方大按钮</p>' +
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
