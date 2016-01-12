/*
 * ------------------------------------------
 * 循环播放封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/cycler/cycler */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/event',
    'base/util',
    'util/event',
    'util/page/simple'
],function(NEJ,_k,_e,_v,_u,_t,_t0,_p,_o,_f,_r){
    var _pro;
    /**
     * 循环播放封装对象
     *
     * 结构举例
     * ```html
     * <div id="nbox"></div>
     * <ul id="pbox">
     *   <li>1</li>
     *   <li>2</li>
     *   <li>3</li>
     * </ul>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/cycler/cycler'
     * ],function(_t){
     *     var _cycler = _t._$$Cycler._$allocate({
     *         list:[
     *             'http://xxxx.com/xxx.jpg',
     *             'http://xxxx.com/xxx.jpg',
     *             'http://xxxx.com/xxx.jpg'
     *         ],
     *         nbox:'nbox',
     *         pbox:'pbox',
     *         event:'click',
     *         interval:5,
     *         onchange:function(_index){
     *             // 切换页面的回调，_index从1到3
     *         }
     *     });
     * });
     * ```
     *
     * @class    module:util/cycler/cycler._$$Cycler
     * @extends  module:util/event._$$EventTarget
     *
     * @param    {Object}      config   - 可选配置参数
     * @property {Array}       list     - 图片地址列表
     * @property {String|Node} nbox     - 图片容器节点
     * @property {String|Node} pbox     - 页码索引容器节点
     * @property {String}      event    - 页码切换事件名称
     * @property {Number}      interval - 轮播时间间隔，单位秒，默认为2s
     */
    /**
     * 图片切换事件
     *
     * @event module:util/cycler/cycler._$$Cycler#onchange
     * @param {Number} event - 页码信息
     */
    _p._$$Cycler = _k._$klass();
    _pro = _p._$$Cycler._$extend(_t._$$EventTarget);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:util/cycler/cycler._$$Cycler#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__popt = {
            index:1,
            onchange:this.__onPageChange._$bind(this)
        };
        this.__super();
    };
    /**
     * 控件重置
     *
     * @protected
     * @method module:util/cycler/cycler._$$Cycler#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__list = _options.list||[];
        this.__nbox = _e._$get(_options.nbox);
        this.__interval = (_options.interval||2)*1000;
        var _list = _e._$getChildren(_options.pbox);
        this.__popt.list  = _list;
        this.__popt.total = _list.length;
        this.__popt.event = _options.event;
        this.__pager = _t0._$$PageSimple._$allocate(this.__popt);
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:util/cycler/cycler._$$Cycler#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        _e._$remove(this.__image);
        delete this.__nbox;
        delete this.__image;
        delete this.__popt.list;
        this.__timer = window.clearTimeout(this.__timer);
    };
    /**
     * 页面变化回调
     *
     * @protected
     * @method   module:util/cycler/cycler._$$Cycler#__onPageChange
     * @param    {Object} arg0  - 页码信息
     * @property {Number} index - 页码信息
     * @return   {Void}
     */
    _pro.__onPageChange = function(_event){
        this.__timer = window.clearTimeout(this.__timer);
        var _index = _event.index,
            _url = this.__list[_index-1];
        if (!!_url)
            this._$setImage(_url);
        this._$dispatchEvent('onchange',_index);
    };
    /**
     * 去到下一页
     *
     * @protected
     * @method module:util/cycler/cycler._$$Cycler#__onNextPage
     * @return {Void}
     */
    _pro.__onNextPage = function(){
        var _index = this.__pager._$getIndex(),
            _total = this.__pager._$getTotal();
        this.__pager._$setIndex((_index+1)%(_total+1));
    };
    /**
     * 图片载入完成触发事件
     *
     * @protected
     * @method module:util/cycler/cycler._$$Cycler#__onImageLoad
     * @param  {Boolean} arg0 - 是否载入成功
     * @return {Void}
     */
    _pro.__onImageLoad = function(_isok){
        this.__timer = window.setTimeout(
            this.__onNextPage._$bind(this),this.__interval);
        _e._$setStyle(this.__imgbox,'opacity',1);
    };
    /**
     * 设置图片
     *
     * 脚本举例
     * ```javascript
     * // 在回调里突然想换另外一张图片来展示
     * _cycler._$setImage('http://abc.com/abc.jpg');
     * ```
     *
     * @method module:util/cycler/cycler._$$Cycler#_$setImage
     * @param  {String} arg0 - 图片地址
     * @return {Void}
     */
    _pro._$setImage = (function(){
        var _css = {
            opacity:0,
            transitionProperty:'opacity',
            transitionDuration:'1s',
            transitionTimingFunction:'ease-in-out'
        };
        var _doSetStyle = function(_value,_key){
            _e._$setStyle(this.__imgbox,_key,_value);
        };
        return function(_url){
            if (!!this.__image)
                _e._$remove(this.__image);
            if (!!this.__imgbox)
                _e._$remove(this.__imgbox);
            this.__image = new Image();
            this.__imgbox = _e._$create('div');
            _u._$forIn(_css,_doSetStyle,this);
            if (_url.indexOf('.png') > -1){
                _e._$setStyle(this.__image,'filter','progid:DXImageTransform.Microsoft.AlphaImageLoader (enabled=true)');
            }
            this.__imgbox.appendChild(this.__image);
            this.__nbox.appendChild(this.__imgbox);
            _v._$addEvent(this.__image,'load',
                this.__onImageLoad._$bind(this,!0));
            _v._$addEvent(this.__image,'error',
                this.__onImageLoad._$bind(this,!1));
            this.__image.src = _url;
        };
    })();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});