/**
 * Created by sunchengbin1 on 2015/6/18.
 * 项目最基本的小方法
 * 编写规范：
 * 所有内部变量已下划线方式开头和分割例如（_this_dom）
 * function命名用驼峰式例如（getFrameContet）
 */
define(function(){
    /*
     * dom属性是用于存储关于dom操作的小方法
     * num属性用于存储数字方面的计算小方法
     * arr属性用于存储数组的一些特殊方法
     * str属性用于存储字符串的一些特殊方法
     * reg属性存储正则表达式
     * others存储其他一些需要的方法和内容
     * */
    var SUN = {version:'1.0',dom:{},num:{},arr:{},str:{},reg:{},others:{}};



    SUN.dom = {

        /*获取特定iframe的内容，一般用于读取利用iframe实现的异步提交（例如上传图片后返回值的读取）*/

        getFrameContent : function(frameid){
            var _document = document,
                _navigator = navigator;
            return _navigator.userAgent.indexOf('MSIE') != -1?_document.frames[frameid].document.body.innerHTML:_document.getElementById(frameid).contentDocument.body.innerHTML;
        },

        /*给input添加验证事件*/

        limitIsNum: function (target, callback) {
            var _old_num = Number($.trim(target.val()));
            target.unbind('blur').bind('blur', function () {
                var _this = $(this),
                    _val = $.trim(_this.val());
                _old_num = (isNaN(_val) || Number(_val) < 0) ? _old_num : _val;
                _this.val(_old_num);
                callback && callback.call(_this,_old_num);
            });
        }
    };
    SUN.str = {

        /*计算字符串的字节长度*/

        charLength : function(str){
            var _bytesCount = 0,
                i = 0;
            for ( ; i < str.length; i++) {
                if (/^[\u0000-\u00ff]$/.test(str.charAt(i))) {
                    _bytesCount += 1;
                } else {
                    _bytesCount += 2;
                }
            }
            return _bytesCount;
        }
    };
    SUN.num = {

        /*处理浮点型数字*/

        transToFloat : function(num,exponent){
            if(isNaN(num)){
                alert('请传数字');
                return;
            }
            num = Number(num);
            return parseInt(num * Math.pow(10, exponent) + 0.5)/Math.pow(10,exponent);
        }
    };

    SUN.arr = {

        /*数组去重*/

        unique : function(arr){
            if(!$.isArray(arr)){
                alert('请传入数组');
                return;
            }
            var _res = [],
                _json = {},
                i = 0;
            for (; i < arr.length; i++) {
                if (!_json[arr[i]]) {
                    _res.push(arr[i]);
                    _json[arr[i]] = 1;
                }
            }
            return _res;
        }
    };

    SUN.others = {

        /*
         * 全局zindex
         * 用于同一页面出现多个弹窗或者弹出块的zindex值
         */

        zindex : 2015,

        /*
         * json对象转化为字符串
         * 一般用于把json对象转换成字符串赋值给页面input的value中
         */

        jsonToStr : function(o){
            var _r = [];
            if (typeof o == "string") {
                return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
            }
            if (typeof o == "object") {
                if (!o.sort) {
                    for (var i in o) {
                        _r.push("\"" + i + "\"" + ":" + arguments.callee(o[i]));
                    }
                    _r = "{" + _r.join() + "}";
                } else {
                    for (var i = 0; i < o.length; i++) {
                        _r.push(arguments.callee(o[i]))
                    }
                    _r = "[" + _r.join() + "]";
                }
                return _r;
            }
            return o.toString();
        },

        /*[{name:1},...]用于这种对象数组根据某一个属性的排序方法*/
        /*升序排列*/

        ascFn : function(data,proname){
            return data.sort(asc);
            function asc(a,b){
                return a[proname] - b[proname];
            };
        },

        /*降序排列*/

        descFn : function(data,proname){
            return data.sort(desc);
            function desc(a,b){
                return b[proname] - a[proname];
            };
        },

        /*获取url中的特定参数值*/

        getUrlPrem : function(key,url){
            var _search = url || document.location.search,
                _pattern = new RegExp("[?&]" + key + "\=([^&]+)", "g"),
                _matcher = _pattern.exec(_search),
                _items = null;
            if (null != _matcher) {
                try {
                    _items = decodeURIComponent(decodeURIComponent(_matcher[1]));
                } catch (e) {
                    try {
                        _items = decodeURIComponent(_matcher[1]);
                    } catch (e) {
                        _items = _matcher[1];
                    }
                }
            }
            return _items;
        },

        /*setTimeout实现的轮询
         *   fn方法有一个callback函数代表fn函数执行完之后需要执行的
         *   base.others.setInterval(fn,1000);
         *   var i = 0;
         *   function fn(callback){
         *       console.log(this)
         *       callback(function(){
         *       if(i == 4){
         *           this.interval = false;
         *       }
         *       console.log(i++)
         *   });
         * */

        setInterval : function(fn,time){
            var _this = this;
            _this.interval = true;
            setTimeout(function(){
                var _args = arguments;
                fn.call(_this,function(callback){
                    callback.call(_this);
                    _this.interval && setTimeout(_args.callee,time);
                });

            },time);
        },

        /*
         * 克隆object对象
         * 应用场景(通过原型继承实现的接口在调用时,为了防止重复功用统一个对象造成互相干扰.)
         * */

        clone : function(object){
            var F = function(){};
            F.prototype = object;
            return new F();
        },

        /*
         * extend继承父类
         * */
        extend : function(father,chirld){
            var F = function(){};
            F.prototype = chirld.prototype;
            father.prototype = new F();
            father.prototype.constructor = father;
            father.chirld = chirld.prototype;
            if(chirld.prototype.constructor == Object.prototype.constructor){
                chirld.prototype.constructor = chirld;
            }
        }

    };
    return SUN;
})
