/*
 * ------------------------------------------
 * 卡片播放器列表实现文件
 * @version  1.0
 * @author   huxueliang(huxueliang@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/carousel/list */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'util/event',
    'ui/loading/loading',
    'ui/carousel/x'
],function(NEJ,_k,_e,_t,_i0,_i1,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 卡片播放器对象
     *
     * @class    module:util/carousel/list._$$CarouselList 卡片播放器控件
     * @extends  module:util/event._$$EventTarget
     * @param    {Object} arg0 - 可选配置参数
     * @property {String|Node} parent    - 卡片所在父容器节点
     * @property {Number}      current   - 当前选中项
     * @property {Number}      buffer    - 预加载卡片个数
     * @property {Object}      indicator - 指示器参数
     */
    /**
     * 滚动到某张卡片
     *
     * @event  module:ui/carousel/list._$$CarouselList#onscroll
     * @param  {Number} index - 卡片索引
     */
    /**
     * 追加卡片(异步)
     *
     * @event  module:ui/carousel/list._$$CarouselList#onaddmore
     *
     */
    _p._$$CarouselList = _k._$klass();
    _pro = _p._$$CarouselList._$extend(_t._$$EventTarget);
    _pro.__init = function(_options){
        this.__super();
        this.__initLoading();
    };
    /**
     * 初始化加载控件
     *
     * @protected
     * @method module:util/carousel/list._$$CarouselList#__initLoading
     * @return {Void}
     */
    _pro.__initLoading = function(){
        this.__lnode = document.createElement('div');
        this.__lnode.style.position = 'absolute';
        this.__lnode.style.top = '50%';
        this.__lnode.style.left = '100%';
    };
    /**
     * 控件重置函数
     *
     * @protected
     * @method module:util/carousel/list._$$CarouselList#__reset
     * @param  {Object} arg0 - 重置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this._$setEvent('onscroll',_options.onscroll);
        this._$setEvent('onaddmore',_options.onaddmore);
        _options.onscroll = this.__onScroll._$bind(this);
        _options.onbouncerelease = this.__onBounceRelease._$bind(this);
        this.__buffer = _options.buffer||0;
        if(!this.__carousel)this.__carousel = _i1._$$CarouselX._$allocate(_options);
        if(!this.__loading)this.__loading = _i0._$$Loading._$allocate({parent:this.__lnode});
    };
    /**
     * 滚动回调函数
     *
     * @protected
     * @method module:util/carousel/list._$$CarouselList#__onScroll
     * @param  {Number} arg0 - 卡片索引
     * @param  {Object} arg1 - 是否最后一张卡片
     * @return {Void}
     */
    _pro.__onScroll = function(_index,_isLast){
        this._$dispatchEvent('onscroll',_index);
        if(_isLast){
            this.__carousel._$getCardByIndex(_index).appendChild(this.__lnode);
        }
    };
    /**
     * 弹性释放处理函数
     *
     * @protected
     * @method module:util/carousel/list._$$CarouselList#__onBounceRelease
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onBounceRelease= function(_event){
        _event.offset=-(1.5*this.__lnode.offsetWidth);
        if(this.__load) return;
        this.__load = !0;
        this._$dispatchEvent('onaddmore');
    };
    /**
     * 列表回收处理函数
     *
     * @protected
     * @method module:util/carousel/list._$$CarouselList#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__carousel = _i1._$$CarouselX._$recycle(this.__carousel);
        this.__loading = _i0._$$Loading._$recycle(this.__loading);
        _e._$removeByEC(this.__lnode);
        this._$clearEvent();
        this.__super();
    };
    /**
     * 添加卡片（同步）
     * @method module:util/carousel/list._$$CarouselList#_$appendItem
     * @param  {Number}      arg0 - 要添加的卡片索引
     * @param  {String|Node} arg1 - 要添加的卡片内容或节点
     * @return {Void}
     */
    _pro._$appendItem = function(_index,_node){
        this.__carousel._$appendItem(_index,_node);
    };
    /**
     * 滚动下一张卡片
     * @method module:util/carousel/list._$$CarouselList#_$scrollToNext
     * @param  {Number} arg0 - 卡片索引
     * @return {Void}
     */
    _pro._$scrollToNext = function(_index){
        this.__carousel._$scrollToNext(_index);
    };
    /**
     * 滚动上一张卡片
     * @method module:util/carousel/list._$$CarouselList#_$scrollToPrev
     * @param  {Number} arg0 - 卡片索引
     * @return {Void}
     */
    _pro._$scrollToPrev = function(_index){
        this.__carousel._$scrollToPrev(_index);
    };
    /**
     * 滚动到指定卡片
     * @method module:util/carousel/list._$$CarouselList#_$scrollTo
     * @param  {Object} arg0 - 卡片索引
     * @return {Void}
     */
    _pro._$scrollTo = function(_index){
        this.__carousel._$scrollTo(_index);
    };
    /**
     * 滚动到指定卡片
     * @method module:util/carousel/list._$$CarouselList#_$refresh
     * @param  {Number} arg0 - 卡片索引
     * @return {Void}
     */
    _pro._$refresh = function(_index){
        this.__carousel._$refresh();
    };
    /**
     * 往列表末尾追加卡片（异步）
     * @method module:util/carousel/list._$$CarouselList#_$appendMore
     * @param  {Array} arg0 - 要添加的卡片内容数组
     * @return {Void}
     */
    _pro._$appendMore = function(_array){
        this.__load = !1;
        _e._$removeByEC(this.__lnode);
        if(!_array||_array.length<=0)return;
        for(var i=0;i<Math.min(_array.length,this.__buffer);i++){
            this.__carousel._$appendMore(_array[i]);
        }
        window.setTimeout((function(){this.__carousel._$scrollToNext();})._$bind(this),0);
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
})