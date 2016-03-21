/**
 * 滚动延迟加载图片，需要提前加载一个预置图片格式为<span data-url="http://www.test.com/1.jpg" class="lazy"></span>
 * @class BackgroundLazyload
 * @static
 * @requires xn.mobile.lib.base.js
 * @author Leo
 */
define(function() {
    var BackgroundLazyload = {
        time: null,
        hasEvent: false,
        init: function(type) {
            clearTimeout(BackgroundLazyload.time);

            BackgroundLazyload.time = setTimeout(function() {
                BackgroundLazyload.lazyLoadImage(type);
            }, 130);

            /* 绑定一次即可 */
            if (!BackgroundLazyload.hasEvent) {
                window.addEventListener('scroll', function() {

                    clearTimeout(BackgroundLazyload.time);

                    BackgroundLazyload.time = setTimeout(function() {

                        BackgroundLazyload.lazyLoadImage();

                    }, 100);

                }, false);
                BackgroundLazyload.hasEvent = true;
            }
        },
        lazyLoadImage: function(type, wrap) {
            var imageEls = document.querySelectorAll('[data-img]'),
                i,
                l = imageEls.length;
            for (i = 0; i < l; i++) {
                /*直接进行加载当页全部图片，而不进行滚动加载*/
                if (type && type == 'all') {
                    BackgroundLazyload.imageReplace(imageEls[i]);
                } else {
                    BackgroundLazyload.imageVisiable(imageEls[i]);
                }

            }
        },

        /**
         * 判断元素是否在可视区域
         * @param {DOM} imageEl 指定的图片
         * @param {DOM} imageEl 图片容器
         */
        imageVisiable: function(imageEl) {
            var pos = imageEl.getBoundingClientRect();

            if ((pos['top'] > 0 && window['innerHeight'] * 2 - pos['top'] > 0) || (pos['top'] <= 0 && pos['bottom'] >= 0)) {
                BackgroundLazyload.imageReplace(imageEl);
            } else {
                return;
            }
        },

        /**
         * 给img元素赋予新的背景图片地址
         * @param {DOM} imageEl 指定的图片
         */
        imageReplace: function(imageEl) {
            if (!imageEl) return;

            var imgEl = $(imageEl),
                imgSrc = imgEl.attr('data-img');

            if (!!imgSrc) {
                if(!imgEl.is('img')){
                    imgEl.css('background-image', 'url(' + imgSrc + ')');
                    imgEl.removeAttr('data-img');
                }else{
                    imgEl.attr("src",imgSrc);
                    imgEl.removeAttr('data-img');
                }

            }

        }
    };

    return BackgroundLazyload;
});