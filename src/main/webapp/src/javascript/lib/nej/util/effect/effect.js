/*
 * ------------------------------------------
 * 动画特效基类实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/effect/effect */
NEJ.define([
    'base/global',
    'base/klass',
    '{platform}effect.js',
    'base/element',
    'base/util',
    'util/event'
],function(NEJ,_k,_h,_e,_u,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 动画特效基类
     * 如果属性没有变化不能写入，此属性的回调不会发生
     * 目前支持的css属性有：
     * width,height,z-index,opacity,margin,padding,font-size,font-weight
     * top,right,bottom,left(需要指定position)
     * 高级浏览器支持color相关属性
     * 属性单位限定px,不支持em或pt
     *
     * 页面结构举例
     * ```html
     * <div id='box' style='position:absolute;z-index:10;'>abc</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     * var _effect = _p._$$Effect._$allocate(
     *    {
     *        node:'box',
     *        transition:[
     *            {
     *                property:'top',
     *                timing:'ease-in',
     *                delay:1,
     *                duration:10
     *            },
     *            {
     *                property:'z-index',
     *                timing:'ease-in',
     *                delay:2,
     *                duration:10
     *            }
     *        ],
     *        styles:['top:+=460','z-index:999'],
     *        onstop:function(){
     *       },
     *        onplaystate:function(){
     *        }
     *    }
     * );
     * // 所有动画统一轨迹和时间
     * var _effect2 = _p._$$Effect._$allocate({
     *        node:'box',
     *        transition:[
     *            {
     *                property:'all',
     *                timing:'ease-in',
     *                delay:1,
     *                duration:10
     *            }
     *        ],
     *        styles:['top:+=460','z-index:999'],
     *        onstop:function(){
     *       },
     *        onplaystate:function(){
     *        }
     * });
     * ```
     *
     * @class     module:util/effect/effect._$$Effect
     * @extends   module:util/event._$$EventTarget
     * @param     {Object}      arg0       - 可选配置参数
     * @property  {String|Node} node       - 动画节点
     * @property  {Array}       transition - 动画属性列表
     * |意义|属性    |延迟启动时间|持续时间|运动轨迹    |
     * |:---|:---    |:---        |:---    |:---        |
     * |属性|property|delay       |duration|timing      |
     * |值  |width   |1           |10      |linear,ease-in,ease-out,ease-in-out|
     * @property  {Array}      styles      - 动画需要改变的css属性
     */
    /**
     * 动画停止的回调
     *
     * @event  module:util/effect/effect._$$Effect#onstop
     * @return {Void}
     */
    /**
     * 动画中间状态回调
     *
     * @event  module:util/effect/effect._$$Effect#onplaystate
     * @return {Void}
     */
    _p._$$Effect = _k._$klass();
    _pro = _p._$$Effect._$extend(_t._$$EventTarget);

    /**
     * 初始化方法
     *
     * @protected
     * @method module:util/effect/effect._$$Effect#onstop#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__node   = _e._$get(_options.node);
        this.__styles = _options.styles||[];
        this.__onstop = _options.onstop||_f;
        this.__transition = _options.transition||[];
        this.__propMap = {};
        this.__animRule= this.__doParseStyle();
        this.__doInitDomEvent([
            [this.__node,'transitionend',this.__onTransitionEnd._$bind(this)]
        ]);
    };

    /**
     * 销毁对象
     *
     * @protected
     * @method module:util/effect/effect._$$Effect#onstop#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        if(!!this.__intvl){
            this.__intvl = window.clearInterval(this.__intvl);
        }
        // 这里回收关于此节点的动画信息
        delete this.__node;
        delete this.__styles;
        delete this.__animRule;
        delete this.__propMap;
        delete this.__lastProp;
        delete this.__transition;
        delete this.__intvl;
        this.__super();
    };

    /**
     * 监听动画结束事件
     *
     * @protected
     * @method module:util/effect/effect._$$Effect#onstop#__onTransitionEnd
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onTransitionEnd = function(_event){
        if(!!this.__start&&this.__isLast(_event)){
            this.__start = !1;
            this._$stop();
        }
    };

    /**
     * 是否是最后结束的属性
     *
     * @protected
     * @method module:util/effect/effect._$$Effect#onstop#__isLast
     * @param  {Event} arg0 - 事件对象
     * @return {Boolean}       是否是最后结束的属性
     */
    _pro.__isLast = function(_event){
        var _name = _event.propertyName,
            _flag = false;
        _u._$forIn(this.__lastProp,function(_value){
            _flag = _name.indexOf(_value) > -1;
        }._$bind(this));
        if(_flag || !!this.__lastProp[_name])
            return !0;
        else
            return !1;
    };
    /**
     * 解析出目标样式
     *
     * @protected
     * @method module:util/effect/effect._$$Effect#onstop#__doParseStyle
     * @return {String} 解析好的目标样式
     */
    _pro.__doParseStyle = (function(){
        // 根据属性的拼写规则，做适当的调整
        var _doParseStyle = function(_style){
            var _list  = _style.split(':'),
                _prop  = _list[0],
                _value = _list[1],
                _node  = this.__node;
            // 需要解析=号
            if(_value.indexOf('=') > -1){
                var _a = parseInt(_e._$getStyle(_node,_prop))||0;
                var _b = parseInt(_value.split('=')[1]);
                if(_value.indexOf('+') > -1)
                    _value = _a + _b;
                else
                    _value = _a - _b;
            }
            // 需要加单位
            if(_h.__doCheckProp(_prop)){
                if(_value.toString().indexOf('px') < 0)
                    _value += 'px';
            }
            this.__propMap[_prop] = _value;
        };
        // 解析动画的规则
        var _doParseAnim = function(_index){
            if(!this.__transition[_index])
                return '';
            var _rule = this.__transition[_index],
                _t = _rule.duration + _rule.delay;
            if( _t > this.__sumtime){
                this.__lastProp = {};
                this.__sumtime = _t;
                this.__lastProp[_rule.property] = _rule.property;
            }else if(_t == this.__sumtime){
                this.__lastProp[_rule.property] = _rule.property;
            }
            return _rule.property + ' ' + _rule.duration + 's ' + _rule.timing + ' ' + _rule.delay + 's,';
        };
        return function(){
            var _animRule = '';
            this.__sumtime = 0;
            this.__lastProp = {}
            _u._$forEach(this.__styles,function(_style,_index){
                _doParseStyle.call(this,_style);
                _animRule += _doParseAnim.call(this,_index);
            }._$bind(this));
            return _animRule;
        };
    })();

    /**
     * 动画开始后，监听节点的样式
     *
     * @protected
     * @method module:util/effect/effect._$$Effect#onstop#__onPlayState
     * @return {Void}
     */
    _pro.__onPlayState = function(){
        this.__state = {};
        _u._$forIn(this.__propMap,function(_value,_prop){
            this.__state[_prop] = _e._$getStyle(this.__node,_prop);
        }._$bind(this));
        this._$dispatchEvent('onplaystate',this.__state);
    };

    /**
     * 开始动画
     *
     * @protected
     * @method module:util/effect/effect._$$Effect#onstop#_$start
     * @return {Void}
     */
    _pro._$start = function(){
        this.__start = !0;
        _h.__onStart(this.__node,this.__propMap,this.__animRule,this.__onstop);
        this.__intvl = window.setInterval(this.__onPlayState._$bind(this),49);
    };

    /**
     * 取消动画
     *
     * @method module:util/effect/effect._$$Effect#_$stop
     * @param  {Boolean} flag - 是否取消动画
     * @return {Void}
     */
    _pro._$stop = function(_flag){
        this.__intvl = window.clearInterval(this.__intvl);
        _h.__onStop(this.__node,this.__propMap,this.__onstop,_flag);
    };

    /**
     * 暂停动画
     *
     * @method module:util/effect/effect._$$Effect#_$paused
     * @return {Void}
     */
    _pro._$paused = function(){
       // todo
    };

    /**
     * 暂停后重新开始动画
     *
     * @method module:util/effect/effect._$$Effect#_$restart
     * @return {Void}
     */
    _pro._$restart = function(){
        // todo
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});
