/*
 * ------------------------------------------
 * 指示器对象实现文件
 * @version  1.0
 * @author   huxueliang(huxueliang@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/carousel/indicator */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'util/event'
],function(NEJ,_k,_e,_t,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 指示器对象
     *
     * @class     module:ui/carousel/indicator._$$Indicator
     * @extends   module:util/event._$$EventTarget
     * @param     {Object}       arg0   - 可选配置参数
     * @property  {String|Node}  parent - 控件所在容器节点
     * @property  {Number}       cindex - 当前指示项
     * @property  {String}       cstyle - 当前指示项样式
     */
    /**
     * 指定项触发事件
     *
     * @event  module:ui/carousel/indicator._$$Indicator#onactive
     * @param  {Number} arg0 - 指定项在所有项目中的位置
     *
     */
    _p._$$Indicator = _k._$klass();
    _pro = _p._$$Indicator._$extend(_t._$$EventTarget);
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/carousel/indicator._$$Indicator#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__body = _e._$get(_options.parent);
        this.__cstyle = _options.cstyle;
        this.__doInitDomEvent([
            [this.__body,'tap',this.__onActive._$bind(this)]
        ]);
        this._$setEvent('onactive',_options.onactive);
        this._$update(_options.cindex);
    };
    /**
     * 点击指示器事件
     *
     * @protected
     * @method module:ui/carousel/indicator._$$Indicator#__onActive
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onActive = function(_event){
        var _element = _event.target;
            _child = this.__body.children;
        for(var i=0;i<_child.length;i++){
            if(_child[i]==_element){
                this._$dispatchEvent('onactive',i);
                break;
            }
        }
    };
    /**
     * 更新指示器位置
     *
     * @method module:ui/carousel/indicator._$$Indicator#_$update
     * @param  {Number} arg0 - 当前项索引
     * @return {Void}
     */
    _pro._$update = function(_current){
        var _child = this.__body.children,
            _ntmp=_e._$getByClassName(this.__body,this.__cstyle);
        if(!!_ntmp&&_ntmp.length>0){
            for(var i=0;i<_ntmp.length;i++){
                _e._$delClassName(_ntmp[i],this.__cstyle);
            }
        }
        _e._$addClassName(_child[_current],this.__cstyle);
        this.__current = _current;
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});