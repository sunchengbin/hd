/**
 * Created by sunchengbin on 15/11/12.
 */
require(['zepto','loading','token','dialog','config','lazyload','base','homenav','fastclick','weixin'],function(zepto,loading,token,dialog,config,lazyload,base,homenav,fastclick,weixin) {
    var domloading = loading.domLoading();
    fastclick.attach(document.body);
    var EA = {
        init : function(){
            var _this = this;
            token.init({
                wxcallback : function(){
                    _this.initHtm();
                    _this.handleFn();
                }
            });
        },
        handleFn : function(){
            var _this = this;
            $('.j_wraper').on('click','.j_del',function(){
                var _id = $(this).attr('data-id');
                dialog.confirm({
                    body_txt: '确定要删除地址?',
                    is_cover : true,
                    cf_fn : function(){
                        _this.delAddress(_id);
                    }
                });
            });
            $('.j_wraper').on('click','.j_save',function(){
                _this.saveAddress();
            });
            $('.j_wraper').on('click','.j_up_img',function(){
                weixin.uploadOneImg(function(res){
                    if(res.errcode == 0){
                        var _htm = '';
                        $.each(res.photoUrlList,function(i,item){
                            _htm += '<div class="img hotel-address-img j_a_img" data-src="'+res.photoUrlRelative[i]+'" data-view="'+item+'" data-img="'+item+'"></div>';
                        });
                        $('.j_hotel_address').prepend(_htm);
                        lazyload.init();
                    }
                });
            });
            $('.j_wraper').on('click','.j_radio',function(){
                var _this = $(this),
                    _val = _this.attr('data-val');
                var _show_btn = _this.find('.j_show_wraper'),
                    _wraper = _show_btn.attr('data-wraper'),
                    _hide = _show_btn.attr('data-hide');
                //$('.j_show_wraper').each(function(i,item){
                //    var _item = $(item);
                //    if(i != _this.find('.j_show_wraper').indexOf('.j_show_wraper')){
                //        _item.find('.j_show_wraper').hide();
                //    }
                //});
                if(!_this.is('.radioed-i')){
                    if(_val == 20){
                        $('.j_air_wraper').hide();
                        $('.j_address_wraper').show();
                        //$('[data-wraper="j_caddress_wraper"]').html('&#xe615;').attr('data-hide','true');
                        $('.j_caddress_wraper').hide();
                    }else{
                        if(_val == 30){
                            $('.j_caddress_wraper').show();
                            $('.j_address_wraper').hide();
                            $('.j_air_wraper').hide();
                            $('.j_a_img').remove();
                            //$('.j_abode').val('');
                        }else{
                            $('.j_address_wraper').hide();
                            $('.j_air_wraper').show();
                            $('.j_caddress_wraper').hide();
                            $('.j_a_img').remove();
                            //$('.j_abode').val('');
                        }
                    }
                    $('li > .radioed-i').removeClass('radioed-i');
                    _this.addClass('radioed-i');
                    _this.find('.j_show_wraper').show();
                    _show_btn.html('&#xe667;').removeAttr('data-hide');
                }else{
                    if(_hide){
                        _show_btn.html('&#xe667;').removeAttr('data-hide');
                        $('.'+_wraper).show();
                    }else{
                        _show_btn.html('&#xe615;').attr('data-hide','true');
                        $('.'+_wraper).hide();
                    }
                }

            });
            $('.j_wraper').on('click','.j_air_radio',function(){
                var _this = $(this);
                if(!_this.is('.radioed-i')){
                    $('.j_air_wraper .radioed-i').removeClass('radioed-i');
                    _this.addClass('radioed-i');
                }
            });
        },
        delAddress:function(id){
            var _this = this;
            $.ajax({
                url : config.HOST+config.ACTIONS.delAddress,
                type : 'post',
                contentType: 'application/json;charset=UTF-8',
                dataType:'json',
                beforeSend: function(request) {
                    request.setRequestHeader("X-Access-Token", localStorage.getItem('TOKEN'));
                },
                data:JSON.stringify({
                    'id' : id
                }),
                success : function(res){
                    if(res.errcode == 0){
                        _this.delAddressJson(id);
                        location.href = 'address_list.html';
                    }else{
                        if(res.errcode == 201){
                            localStorage.removeItem('TOKEN');
                            location.reload();
                        }else{
                            dialog.alert({
                                body_txt: res.errmsg,
                                is_cover : true
                            });
                        }
                    }
                }
            });
        },
        delAddressJson : function(id){
            var _address = localStorage.getItem('ADDRESS')?JSON.parse(localStorage.getItem('ADDRESS')):null,
                _arr = [];
            if(_address.length){
                $.each(_address,function(i,item){
                    if(item.id != id){
                        _arr.push(item);
                    }
                });
            }
            if(_arr.length){
                localStorage.setItem('ADDRESS',JSON.stringify(_arr));
            }else{
                localStorage.removeItem('ADDRESS');
                localStorage.removeItem('SELADDRESS');
            }

        },
        getSaveData : function(){
            var _pic = [];
            $('.j_a_img').each(function(i,item){
                _pic.push($(item).attr('data-src'));
            });
            var _rpic = [];
            $('.j_a_img').each(function(i,item){
                _rpic.push($(item).attr('data-view'));
            });
            var _dispatchType = $('.radioed-i[data-val]').attr('data-val'),
                _airport = _dispatchType==10?$('.radioed-i[data-air]').attr('data-air'):'',
                _abode = _dispatchType==20?$.trim($('.j_abode').val()):'',
                _domesticAddr = _dispatchType==30?$.trim($('.j_domestic_ems').val()):'',
                _id = base.others.getUrlPrem('addressid');
            if(_id){
                return {
                    id:_id,
                    name: $.trim($('.j_name').val()),
                    phone:$.trim($('.j_phone').val()),
                    passport:$.trim($('.j_passport').val()),
                    dispatchType:_dispatchType,
                    airport:_airport,
                    abode:_abode,
                    domesticAddr:_domesticAddr,
                    addressPics:_pic,
                    picUrl:_rpic
                };
            }else{
                return {
                    name: $.trim($('.j_name').val()),
                    phone:$.trim($('.j_phone').val()),
                    passport:$.trim($('.j_passport').val()),
                    dispatchType:_dispatchType,
                    airport:_airport,
                    abode:_abode,
                    domesticAddr:_domesticAddr,
                    addressPics:_pic,
                    picUrl:_rpic
                };
            }
        },
        saveAddress : function(){
            var _this = this,
                _data = _this.getSaveData(),
                _dispatchType = $('.radioed-i[data-val]').length?Number($('.radioed-i[data-val]').attr('data-val')):null,
                _airport = _dispatchType&&_dispatchType==10?$('.radioed-i[data-air]').attr('data-air'):null,
                _pic = [],
                _abode = $.trim($('.j_abode').val()),
                _domestic_ems = $.trim($('.j_domestic_ems').val());
            $('.j_a_img').each(function(i,item){
                _pic.push($(item).attr('data-src'));
            });
            if(!_data.name){
                alert('请填写名字');
                return false;
            }
            if(!_data.phone){
                alert('请填写手机号');
                return false;
            }
            //if(!_data.passport){
            //    alert('请填写护照号');
            //    return false;
            //}
            if(!_dispatchType){
                alert('请选择地址');
                return false;
            }else{
                if(_dispatchType == 20 && !_pic.length && _abode==''){
                    alert('请填写目标地址');
                    return false;
                }
                if(_dispatchType == 30 && _domestic_ems==''){
                    alert('请填写邮寄地址');
                    return false;
                }
            }
            var domloading = loading.domLoading();
            domloading.init();
            //console.log(_data);
            $.ajax({
                url : config.HOST+config.ACTIONS.newAddress,
                type : 'post',
                contentType: 'application/json;charset=UTF-8',
                dataType:'json',
                beforeSend: function(request) {
                    request.setRequestHeader("X-Access-Token", localStorage.getItem('TOKEN'));
                },
                data : JSON.stringify(_data),
                success : function(res){
                    if(res.errcode == 0){
                        _data['id'] = _data.id?_data.id:res.detail.id;
                        var _sel_address = _data;
                        localStorage.setItem('SELADDRESS',JSON.stringify(_sel_address));
                        var type = base.others.getUrlPrem('type');
                        if(type){
                            location.href = config.URLHOST+'order_confirm.html';
                        }else{
                            location.href = config.URLHOST+'address_list.html';
                        }
                    }else{
                        dialog.alert({
                            body_txt: res.errmsg,
                            is_cover : true
                        });
                    }
                    domloading.remove();
                },
                error : function(){
                    location.reload();
                }
            });
        },
        initHtm : function(){
            var _this = this,
                _address_id = base.others.getUrlPrem('addressid'),
                _address = _address_id?JSON.parse(localStorage.getItem('ADDRESS')):null,
                _address_info = null;
            if(_address){
                $.each(_address,function(i,item){
                    if(item.id == _address_id){
                        _address_info = item;
                    }
                });
            }
            $('.j_wraper').html(_this.createHtm(_address_info));
            lazyload.init();
            //homenav.init();
            domloading.remove();
        },
        createHtm : function(address){
            var _htm = '',
                _address = address?address:{
                    "id": '',
                    "name": "",
                    "phone": "",
                    "passport": "",
                    "airport": "",
                    "dispatchType":0,
                    "abode": "",
                    'domesticAddr':'',
                    "addressPics": [],
                    "addressPicsRelative": []
                };
            _htm += '<ul class="edit-address-wraper">'
                +'<li class="clearfix title">'
                +'姓名:'
                +'<input class="j_name" placeholder="姓名" value="'+_address.name+'">'
                +'</li>'
                +'<li class="clearfix title">'
                +'手机号:'
                +'<input class="j_phone" placeholder="手机号" value="'+_address.phone+'">'
                +'</li>'
                //+'<li class="clearfix title">'
                //+'护照号:'
                //+'<input class="j_passport" placeholder="护照号(选填)" value="'+_address.passport+'">'
                //+'</li>'
                //+'<li class="clearfix title msg-title">'
                //+'＊海关提示：购买国际免税品需提供护照号'
                //+'</li>'
                +'<li class="clearfix title">'
                +'地址信息'
                +'</li>'
                +'<li class="clearfix">'
                +'<p class="j_radio title '+(_address.dispatchType==20?'radioed-i':'')+'" data-val="20">'
                +'<i class="icon iconfont radio-i">&#xe601;</i>'
                +'首尔酒店地址'
                +'<i class="icon iconfont fr '+(_address.dispatchType==20?'':'hide')+' j_show_wraper" data-wraper="j_address_wraper">&#xe667;</i>'
                +'</p>'
                +'<div class="address-wraper j_address_wraper '+(_address.dispatchType==20?'':'hide')+'">'
                +'<p class="title">'
                +'地址信息(以下两种方式任选其一)'
                +'</p>'
                +'<div class="address-edit-wraper">'
                +'<p class="title">'
                +'请将您行程单上的酒店名称和地址拍照给我们'
                +'</p>'
                +'<div class="hotel-address">'
                +'<p>如不会输入目标地址</p>'
                +'<p>请将您旅游行程单上的酒店名称拍照给我们</p>'
                +'<div class="clearfix j_hotel_address">';
            if(_address.addressPics && _address.addressPics.length){
                $.each(_address.addressPics,function(i,item){
                    _htm+='<div class="img hotel-address-img j_a_img" data-src="'+_address.addressPicsRelative[i]+'" data-view="'+item+'" data-img="'+item+'"></div>';
                });
            }
            _htm+='<a class="block hotel-address-img j_up_img" href="javascript:;">'
                +'<i class="icon iconfont">&#xe664;</i>'
                +'</a></div>'
                +'<p class="up-img-msg">注：上传1张图片即可，如需要更详细说明，可上传多张照片</p>'
                +'</div>'
                +'<div class="title">'
                +'如会输入目标地址,请直接填写'
                +'</div>'
                +'<div class="buyer-message-content">'
                +'<textarea class="j_abode" placeholder="填写酒店名称和详细地址">'+(_address.abode?_address.abode:'')+'</textarea>'
                +'</div>'
                +'</div>'
                +'</div>'
                +'</li>'
                +'<li class="clearfix air-title" >'
                +'<p class="j_radio title '+(_address.dispatchType==10?'radioed-i':'')+'" data-val="10">'
                +'<i class="icon iconfont radio-i">&#xe601;</i>'
                +'首尔机场自提'
                +'<i class="icon iconfont fr '+(_address.dispatchType==10?'':'hide')+' j_show_wraper" data-wraper="j_air_wraper">&#xe667;</i>'
                +'</p>'
                +'<div class="address-edit-wraper j_air_wraper '+(_address.dispatchType==10?'':'hide')+'">'
                +'<p class="title j_air_radio '+(_address.airport!='20'?'radioed-i':'')+'" data-air="10">'
                +'<i class="icon iconfont radio-i">&#xe601;</i>仁川机场'
                +'</p>'
                +'<div class="img hotel-address-img" style="background-image: url(../images/renchuan.jpg)"></div>'
                +'</div>'
                +'<div class="address-edit-wraper j_air_wraper '+(_address.dispatchType==10?'':'hide')+'">'
                +'<p class="title j_air_radio '+(_address.airport=='20'?'radioed-i':'')+'"  data-air="20">'
                +'<i class="icon iconfont radio-i">&#xe601;</i>金浦机场'
                +'</p>'
                +'<div class="img hotel-address-img" style="background-image: url(../images/jinpu.jpg)"></div>'
                +'</div>'
                +'</li>'
                +'<li class="clearfix">'
                +'<p class="j_radio title '+(_address.dispatchType==30?'radioed-i':'')+'" data-val="30">'
                +'<i class="icon iconfont radio-i">&#xe601;</i>'
                +'国内收货地址'
                +'<i class="icon iconfont fr '+(_address.dispatchType==30?'':'hide')+' j_show_wraper" data-wraper="j_caddress_wraper">&#xe667;</i>'
                +'</p>'
                +'<div class="address-wraper j_caddress_wraper '+(_address.dispatchType==30?'':'hide')+'">'
                +'<div class="address-edit-wraper">'
                +'<div class="hotel-address">'
                +'<div class="buyer-message-content-ems">'
                +'<textarea class="j_domestic_ems" placeholder="请填写国内收货地址">'+(_address.dispatchType==30?(_address.domesticAddr?_address.domesticAddr:''):'')+'</textarea>'
                +'</div>'
                +'<p>1、此选项不参加99元包邮活动，且无法选择“货到付款”结算。国际直邮299包邮,299以内20运费。由于国际直邮时间较长,需要您耐心等待8~15个工作日。如有疑问欢迎随时骚扰客服小白。</p>'
                +'<p>2、微信支付限制单日或者单笔最高支付3000元人民币，如货款超出此限额，请先联系客服小白通过微信支付。</p>'
                +'</div>'
                +'</div>'
                +'</li>'
                +'</ul>'
                +'<div class="btn-wrapr">'
                +'<a class="block save-btn j_save" data-id="'+_address.id+'" href="javascript:;">保存收货信息</a>'
                +'<a class="block del-btn j_del" data-id="'+_address.id+'" href="javascript:;">删除收货信息</a>'
                +'</div>';
            return _htm;
        }
    };
    EA.init();
})