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
                                title: opts.title,
                                desc: '小伙伴们快来给'+(_isself&&_user_info?JSON.parse(_user_info).user.nickName:_user_name)+'加气质,赢取韩国化妆品',
                                link: _share_url,
                                imgUrl: opts.url,
                                success: function() {
                                    //alert('分享成功');
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
                url : config.HOST + config.ACTIONS.actTemperUser,
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
                            title : '小白免税为你气质买单',
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
            _htm+='<img src="../../images/act/te_banner.jpg"/>'
                +'<div class="user-info clearfix">'
                +'<div class="user-logo '+(isself?'user-logoed':'')+' j_up_img">';
                if(!isself){
                    _htm+='<img class="j_a_img" src="'+(res.qrcodeUrl?res.qrcodeUrl:'../../images/act/no_img.png')+'"/>'
                        +'<p><em>长按识别二维码</em></p>'
                        +'<p><em>关注帮'+(res.sex=='男'?'他':'她')+'加气质</em></p>';
                }else{
                    _htm+='<img class="j_a_img" src="'+(res.portraitUrl?res.portraitUrl:'../../images/act/no_img.png')+'"/>';
                }
            _htm+='</div><div class="user-rank">';
            if(!isself) {
                _htm+='<div class="user-rank-left user-rank-lefted">'
                    +'<img class="j_a_img" src="'+(res.portraitUrl?res.portraitUrl:'../../images/act/no_img.png')+'"/>'
                    + '</div>';
            }else{
                _htm+='<div class="user-rank-left">'
                    + (res.rank ? res.rank : '无')
                    + '</div>';
            }
            _htm+='<div class="user-rank-right">'
                +_this.getTxtHtm(res)
                +'</div>'
                +'</div>'
                +'</div>'
                //+'<p class="btn-wraper clearfix">'
                //+'<a href="javascript:;" class="left-btn"></a>'
                //+'<a href="act_temperament_user.html" class="right-btn"></a>'
                //+'</p>'
                +(isself?'<p class="share-btn j_share_btn"><img src="../../images/act/share_btn.png"/></p>':'')
                //+(isself?'':'<p class="ranking-title"><a href="act_temperament_user.html" class="">我也要参加</a></p>')
            _htm+='<p class="ranking-title"><a href="act_temperament_list.html" class="">气质排行榜</a></p>';
            if(res.childList && res.childList.length){
                _htm+='<img src="../../images/act/ranking_list.png"/>'
                    +'<div class="txt-cont">'
                    +'<span class="angle-s"></span>'
                    +'<p class="clearfix">粉丝们为你增加了'+res.childList.length+'气质点<em class="fr">排名</em></p>'
                    +'<ul>'
                    +_this.getUsersList(res.childList,isself)
                    +'</ul>'
                        //+'<a href="javascript:;" class="get-more block">查看更多</a>'
                    +'</div>';
            }
            _htm+='<img src="../../images/act/act_list.png"/>'
                +'<div class="txt-cont act-wraper">'
                +'<span class="angle-s"></span>'
                +'<div class="clearfix txt-d">'
                +'<em class="">1</em>'
                +'<p>2月4日20:00 ~ 2月14日22:00活动期间,气质排行榜前20的朋友都会获得奖品哦</p>'
                +'</div>'
                +'<div class="clearfix txt-d">'
                +'<em class="">2</em>'
                +'<p>第一名:雪花秀滋阴套盒一份</p>'
                +'<p>第二名:赫拉气垫C21一份</p>'
                +'<p>第三名:雪花秀玉荣撕拉面膜一份</p>'
                +'<p>第四名:兰芝睡眠面膜一份</p>'
                +'<p>第五名:九朵云奇迹马油一份</p>'
                +'<p>第六名:水光针面膜一份</p>'
                +'<p>第七名:芭妮兰卸妆膏一份</p>'
                +'<p>第八名:雨润面膜一份</p>'
                +'<p>第九名:无硅润膏一份</p>'
                +'<p>第十 ~ 二十名:神秘礼品一份</p>'
                +'</div>'
                +'<div class="clearfix txt-d">'
                +'<em class="">3</em>'
                +'<p>活动结束后:客服小白会联系获奖者领取奖品,获奖者也可主动联系客服小白哦</p>'
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
                    +'<p class="no-user">还没有人给你加气质哦</p>'
                    +'<p class="no-user">快分享给好友让他们帮你加气质哦</p>'
                    +'</li>';
            }else{
                $.each(child,function(i,item){
                    var isself = true;
                    if(!item.childName){
                        isself = false;
                    }
                    _htm+='<li class="clearfix" data-id="'+item.childId+'">'
                        +(!isself?'':'<a href="act_temperament_user.html?pid='+item.childId+'&name='+encodeURIComponent(item.childName)+'" class="">')
                        +'<img src="'+(item.portraitUrl?item.portraitUrl:'../../images/service/ser1.jpg')+'"/>'
                        +'<div>'
                        +'<p>'+(item.childName?item.childName:'神秘游客')+'<em class="fr">'+(item.rank?item.rank:'无')+'</em></p>'
                        +'</div>'
                        +(!isself?'':'</a>')
                        +'</li>';
                });
            }
            return _htm;
        },
        getTxtHtm : function(res){
            var _htm = '',
                _txt = actconfig.getRemark(res.sex,res.rank);
            $.each(_txt,function(i,item){
                if(i == 0){
                    _htm+='<h2>'+item+'</h2>';
                }else{
                    _htm+='<p>'+item+'</p>';
                }
            });
            return _htm;
        },
        handleFn : function(){
            $('body').on('click','.j_share_btn',function(){
                dialog.alert({
                    body_txt: '通过微信右上角的按钮,发送给朋友或者分享到朋友圈,让好友帮你抢好礼',
                    is_cover: true
                });
            });
            //$('.j_wraper').on('click','.j_up_img',function(){
            //    weixin.uploadOneImg(function(res){
            //        if(res.errcode == 0){
            //            if(res.photoUrlList.length){
            //                $('.j_a_img').attr('src',res.photoUrlList[0]);
            //            }
            //        }
            //    });
            //});
        }
    };
    ATU.init();
})
