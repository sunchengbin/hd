/**
 * Created by sunchengbin on 15/11/4.
 *
 * goods的结构
 *
 SHOPGOODS = 80630:{
                 id:80630,
                 num:2,
                 info : {
                    "name": "BH LUXE FACIAL CASHEMERE WHITE",
                    "id": "80630",
                    "weight":0.1,//单位kg
                    "logoUrl": "http://img.hdour.com//goods/2015/9/11/107/80630.jpg",
                    "limitOne":5,
                    "limitAll":99999,
                    "priceList": {
                        "local": {
                            "symbol": "₩",
                            "price": 16595,
                            "name": "韩元",
                            "enName": "KRW"
                        },
                        "domestic": {
                            "symbol": "￥",
                            "price": 16595,
                            "name": "人民币",
                            "enName": "RMB"
                        },
                        "curLocal": {
                            "symbol": "₩",
                            "price": 16595,
                            "name": "韩元",
                            "enName": "KRW"
                        },
                        "curRmb": {
                            "symbol": "￥",
                            "price": 16595,
                            "name": "人民币",
                            "enName": "RMB"
                        }
                    }
                }
        }
 */
define([],function(){
    var CART = {
        getGoodNum : function(){
            var _this = this,
                _num = 0,
                _storage = _this.jsonLocalItem('SHOPGOODS');
            if(!_storage){
                return 0;
            }
            for(var pro in _storage){
                _num = _num + Number(_storage[pro].num);
            }
            return _num;
        },
        addCart : function(opts,callback){//添加到购物车
            var  _this = this,
                _storage = _this.jsonLocalItem('SHOPGOODS');
            if(!_storage){
                _storage = {};
            }
            if(_storage[opts.id]){
                _storage[opts.id] = $.extend(_storage[opts.id],opts);
            }else{
                _storage[opts.id] = opts;
            }
            setTimeout(function(){
                localStorage.setItem('SHOPGOODS',JSON.stringify(_storage));
                callback && callback();
                //_this.setGoodsNum();
            },0);
        },
        updateCart : function(opts,callback){//更新购物车种商品
            var  _this = this,
                _storage = _this.jsonLocalItem('SHOPGOODS');
            if(!_storage){
                _storage = {};
            }
            if(_storage[opts.id]){
                _storage[opts.id] = $.extend(_storage[opts.id],opts);
            }else{
                alert('不存在该商品');
            }
            callback && callback();
            setTimeout(function(){
                localStorage.setItem('SHOPGOODS',JSON.stringify(_storage));
                //_this.setGoodsNum();
            },0);
        },
        getOneGoodInfo : function(gid){
            var  _this = this,
                _storage = _this.jsonLocalItem('SHOPGOODS');
            if(_storage && _storage[gid]){
                return _storage[gid].info;
            }
            return null;
        },
        getOneGoodNum : function(gid){
            var  _this = this,
                _storage = _this.jsonLocalItem('SHOPGOODS');
            if(_storage && _storage[gid]){
                return _storage[gid].num;
            }
            return null;
        },
        setGoodsNum : function(){
            var _this = this,
                _num = _this.getGoodNum();
            if(_num){
                if(_num > 99){
                    _num = '99+';
                }
                document.querySelector('.j_show_num').innerHTML = _num;
            }else{
                document.querySelector('.j_show_num').innerHTML = '';
            }
        },
        delGood : function(id){//清除某件商品
            var _this = this,
                _shop_goods = _this.jsonLocalItem('SHOPGOODS');
            if(_shop_goods){
                delete _shop_goods[id];
            }
            var hasProp = false;
            for (var prop in _shop_goods){
                hasProp = true;
                break;
            }
            if(hasProp){
                localStorage.setItem('SHOPGOODS',JSON.stringify(_shop_goods));
            }else{
                localStorage.setItem('SHOPGOODS',null);
            }

            //_this.setGoodsNum();
        },
        jsonLocalItem : function(name){//转义localStorage中的对象
            var _storage = window.localStorage.getItem(name);
            if(_storage){
                return JSON.parse(_storage);
            }else{
                return null;
            }
        },
        setOrderMoney : function(money){
            var _this = this,
                _sum = localStorage.getItem('ORDERMONEY'),
                _money = JSON.parse(money);
            if(_sum){
                _sum = JSON.parse(_sum);
                if(_money.day == _sum.day){
                    var _count = Number(_money.money)+Number(_sum.money);
                    if(_count <= 3000){
                        localStorage.setItem('ORDERMONEY',JSON.stringify({money:_count,day:_money.day}));
                    }
                }else{
                    localStorage.setItem('ORDERMONEY',money);
                }
            }else{
                localStorage.setItem('ORDERMONEY',money);
            }
        },
        getOrderMoney : function(){
            var _sum = localStorage.getItem('ORDERMONEY');
            if(_sum){
                return JSON.parse(_sum).money;
            }else{
                return 0;
            }
        },
        getOrderPostPrice : function(){
            //var _this = this,
            //    _weight_price= 0,
            //    _weight_sum = 0,
            //    _storage = _this.jsonLocalItem('ORDER').goodsList;
            //if(!_storage.length){
            //    return 40;
            //}
            //for(var i = 0;i < _storage.length;i++){
            //    var _weight = Number(_storage[i].info.weight?_storage[i].info.weight:0);
            //    _weight_sum += Number(_storage[i].amount)*_weight;
            //    _weight_price += Number(_storage[i].amount)*_weight*40;
            //}
            //if(_weight_price == 0 || _weight_sum < 1){
            //    return 40;
            //}
            //return _weight_price;
            var _this = this,
                _weight_price = 0,
                _sum = _this.jsonLocalItem('ORDER').moneyInfo.sum;
            if(_sum < 299){
                _weight_price = 20;
            }
            return _weight_price;
        }
    };
    return CART;
})

