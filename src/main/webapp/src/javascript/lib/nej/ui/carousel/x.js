/*
 * ------------------------------------------
 * 水平模块播放器实现文件
 * @version  1.0
 * @author   huxueliang(huxueliang@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/carousel/x */
NEJ.define([
    'base/global',
    'base/klass',
    'ui/carousel/carousel'
],function(NEJ,_k,_i0,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 卡片水平播放器对象
     *
     * @class   module:ui/carousel/x._$$CarouselX
     * @extends module:ui/carousel/carousel._$$Carousel
     */
    _p._$$CarouselX = _k._$klass();
    _pro = _p._$$CarouselX._$extend(_i0._$$Carousel);
    /**
     * 获得配置参数
     *
     * @protected
     * @method module:ui/carousel/x._$$CarouselX#__getConfig
     * @return {Object}    配置参数对象
     */
    _pro.__getConfig = function(){
        return {
            m:'moveX',
            p:'m41',
            l:'width',
            o:'offsetWidth',
            v:!1
        };
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});

