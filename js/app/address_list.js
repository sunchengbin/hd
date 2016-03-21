/**
 * Created by sunchengbin on 15/11/11.
 */
require(['zepto','loading','token','dialog','config','base','homenav','lazyload'],function(zepto,loading,token,dialog,config,base,homenav,lazyload) {
    var domloading = loading.domLoading();
    var ADDRESSLIST = {
        init : function(){
            var _this = this;
            token.init({
                callback : function(){
                    _this.getAddressList();
                    _this.handelFn();
                }
            });
        },
        handelFn : function(){
            var _that = this;
            $('.j_wraper').on('click','.j_sel_address',function(){
                var _this = $(this),
                    _id = _this.attr('data-id'),
                    _addresslist = _that.getSelection(JSON.parse(localStorage.getItem('ADDRESS'))),
                    _address = _addresslist[_id];
                localStorage.setItem('SELADDRESS',JSON.stringify(_address));
                location.href = config.URLHOST+'order_confirm.html';
            });
        },
        getSelection : function(addresslist){
            var _address = {};
            $.each(addresslist,function(i,item){
                _address[item.id] = item;
            });
            return _address;
        },
        getAddressList : function(){
            var _this = this;
            //if(!localStorage.getItem('ADDRESS')){
                $.ajax({
                    url : config.HOST+config.ACTIONS.addressList,
                    type : 'post',
                    contentType: 'application/json;charset=UTF-8',
                    dataType:'json',
                    beforeSend: function(request) {
                        request.setRequestHeader("X-Access-Token", localStorage.getItem('TOKEN'));
                    },
                    data : JSON.stringify({
                        page : 1
                    }),
                    success : function(res){
                        if(res.errcode == 0){
                            if(res.detail.total){
                                localStorage.removeItem('ADDRESS');
                                localStorage.setItem('ADDRESS',JSON.stringify(res.detail.addressList));
                            }
                            $('.j_wraper').html(_this.createAddressList(res.detail));
                            lazyload.init();
                            setTimeout(function(){
                                domloading.remove();
                            },1);
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
                        location.reload();
                    }
                });
            //}else{
            //    $('.j_wraper').html(_this.createAddressList(JSON.parse(localStorage.getItem('ADDRESS'))));
            //    //homenav.init();
            //    domloading.remove();
            //}
        },
        transAddress : function(address){
            var _abode = '';
            if(address.dispatchType==10){
                if(address.airport==10){
                    _abode = '仁川机场自提';
                }else{
                    _abode = '金浦机场自提';
                }
            }
            if(address.dispatchType==20){
                _abode = address.abode;
            }
            if(address.dispatchType==30){
                _abode = address.domesticAddr;
            }
            return _abode;
        },
        createAddressList : function(detail){
            var _htm = '',
                _this = this,
                address = detail.addressList,
                _id = base.others.getUrlPrem('addressid');
            if(address){
                _htm += '<ul class="edit-address-wraper j_e_a_w">';
                $.each(address,function(i,item){
                    var _abode = _this.transAddress(item);
                    _htm+='<li id="'+item.id+'" class="j_address_li">'
                        +'<div class="buyer-address">'
                        +'<div class="address-wraper block clearfix '+(_id==item.id?'radioed-i':'')+'">';
                    if(_id){
                        _htm+='<i class="icon iconfont '+(_id?'j_sel_address':'')+' radio-i fl" data-id="'+item.id+'">&#xe601;</i>'
                    }
                    _htm+='<ul class="address-info '+(_id?'j_sel_address':'')+'" data-id="'+item.id+'">'
                        +'<li class="">'+item.name+'</li>'
                        +'<li class="">'+item.phone+'</li>'
                        +'<li class="address-info-li">'+(_abode?_abode:'')+'</li>';
                    if(item.addressPics && item.addressPics.length){
                        _htm += '<li class="address-img clearfix">';
                        $.each(item.addressPics,function(j,img){
                            _htm += '<div class="img" data-img="'+img+'"></div>';
                        });
                        _htm += '</li>';
                    }
                    _htm+='</ul>'
                        //+'<div class="edit-btn">'
                        +'<a href="edit_address.html?addressid='+item.id+(_id?'&type='+_id:'')+'" class="bb">'
                        +'编辑'
                        +'</a>'
                        //+'</div>'
                        +'</div>'
                        +'</div>'
                        +'</li>';
                });
                _htm+='</ul>';
            }
            _htm+='<a href="edit_address.html'+(_id?'?type='+_id:'')+'" class="add-new block">添加新地址</a>';
            return _htm;
        }
    };
    ADDRESSLIST.init();
})