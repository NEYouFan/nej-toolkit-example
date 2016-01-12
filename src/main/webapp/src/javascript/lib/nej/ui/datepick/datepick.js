/*
 * ------------------------------------------
 * 日期选择控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/datepick/datepick */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/util',
    'ui/layer/card.wrapper',
    'util/calendar/calendar',
    'util/template/tpl',
    'util/template/jst',
    'text!./datepick.css',
    'text!./datepick.html'
],function(NEJ,_k,_e,_u,_i0,_t0,_t1,_t2,_css,_html,_p,_o,_f,_r){
    var _pro,
        _seed_html,
        _seed_css = _e._$pushCSSText(_css),
        _seed_ui = _t1._$parseUITemplate(_html),
        _seed_date = _seed_ui['seedDate'],
        _seed_action = _seed_ui['seedAction'];
    /**
     * 日期选择控件
     *
     * 页面结构举例
     * ```html
     * <style>
     *     // 注意，样式的优先级
     *     // 扩展 < 当前 < 禁止
     *     #datepick-box .js-extended{background:green;}
     *     #datepick-box .js-selected{background:yellow;}
     *     #datepick-box .js-disabled{background:red;}
     * </style>
     * <div id="datepick-box"></div>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'base/element',
     *     'ui/datepick/datepick'
     * ],function(_e,_i0,_p,_o,_f,_r){
     *     var pDate = new Date(1997,7,9)
     *     var nDate = new Date(2013,7,9);
     *     var _dp = _i0._$$DatePick._$allocate({
     *         parent:_e._$get('datepick-box'),
     *         // 默认选中日期
     *         date:'2012-10-10',
     *         // 设置日期的可选范围
     *         range:[pDate,nDate],
     *         onchange:function(_date){
     *             // 选择了一个日期，返回此日期
     *         }
     *     });
     * });
     * ```
     *
     * @class     module:ui/datepick/datepick._$$DatePick
     * @uses      module:util/calendar/calendar._$$Calendar
     * @extends   module:ui/layer/card._$$CardWrapper
     * @param     {Object} arg0  - 可选配置参数
     * @property  {Date}   date  - 设置日期
     * @property  {Array}  range - 可选范围
     */
    /**
     * 日期变化触发事件
     *
     * @event  module:ui/datepick/datepick._$DatePick#onchange
     * @param  {Date} arg0 - 日期
     *
     */
    _p._$$DatePick = _k._$klass();
    _pro = _p._$$DatePick._$extend(_i0._$$CardWrapper);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:ui/datepick/datepick._$$DatePick#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__copt = {
            onselect:this.__onDateChange._$bind(this)
        };
        this.__super();
    };
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/datepick/datepick._$$DatePick#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__copt.range = _options.range;
        this.__calendar = _t0._$$Calendar
                            ._$allocate(this.__copt);
        this._$setDate(_options.date||(new Date()));
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/datepick/datepick._$$DatePick#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        delete this.__copt.range;
        var _calendar = this.__calendar;
        if (!!_calendar){
            delete this.__calendar;
            _calendar._$recycle();
        }
    };
    /**
     * 初始化外观信息
     *
     * @protected
     * @method module:ui/datepick/datepick._$$DatePick#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css  = _seed_css;
        this.__seed_html = _seed_html;
    };
    /**
     * 初始化节点
     *
     * @protected
     * @method module:ui/datepick/datepick._$$DatePick#__initNode
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        var _list = _e._$getChildren(this.__body);
        this.__copt.list = _e._$getByClassName(_list[1],'js-ztag');
        _list = _e._$getChildren(_list[0]);
        this.__copt.yprv = _list[0];
        this.__copt.mprv = _list[1];
        this.__copt.ynxt = _list[2];
        this.__copt.mnxt = _list[3];
        this.__copt.year = _list[4];
        this.__copt.month= _list[5];
    };
    /**
     * 动态构建控件节点模板
     *
     * @protected
     * @method module:ui/datepick/datepick._$$DatePick#__initNodeTemplate
     * @return {Void}
     */
    _pro.__initNodeTemplate = function(){
        _seed_html = _t1._$addNodeTemplate(
            '<div class="'+_seed_css+' zcard">'+
               _t1._$getTextTemplate(_seed_action)+
               _t2._$get(_seed_date)+
            '</div>'
        );
        this.__seed_html = _seed_html;
    };
    /**
     * 日期变化回调函数
     *
     * @protected
     * @method module:ui/datepick/datepick._$$DatePick#__onDateChange
     * @param  {Date} arg0 - 日期
     * @return {Void}
     */
    _pro.__onDateChange = function(_date){
        try{
            this._$dispatchEvent('onchange',_date);
        }catch(e){
            // ignore
        }
        this._$hide();
    };
    /**
     * 设置日期
     *
     * 脚本举例
     * ```javascript
     * _dp._$setDate('2012-12-21');
     * ```
     *
     * @method module:ui/datepick/datepick._$$DatePick#_$setDate
     * @param  {Date} arg0 - 日期
     * @return {Void}
     */
    _pro._$setDate = function(_date){
        _date = _u._$var2date(_date);
        this.__calendar._$setDate(_date);
    };
    /**
     * 取当前时间
     *
     * 脚本举例
     * ```javascript
     * // 返回一个Date对象
     * var _date = _dp._$getDate();
     * ```
     *
     * @method module:ui/datepick/datepick._$$DatePick#_$getDate
     * @return {Date} 日期
     */
    _pro._$getDate = function(){
        return this.__calendar._$getDate();
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});