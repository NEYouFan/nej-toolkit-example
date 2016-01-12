/*
 * ------------------------------------------
 * UI控件基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/base */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/util',
    'util/event',
    'util/template/tpl'
],function(NEJ,_k,_e,_u,_t,_t0,_p,_o,_f,_r){
    var _pro;
    /**
     * UI控件基类，框架及项目中所有涉及UI的控件均继承此类
     *
     * 脚本举例
     * ```javascript
     * // 分配控件实例
     * NEJ.define([
     *     'ui/base'
     * ],function(_i,_p,_o,_f,_r){
     *     var ctrl = _i._$allocate({
     *         clazz:'xxx',
     *         parent:document.body
     *     });
     *     ctrl._$appendTo(document.body);
     *     // 如果在分配时传入了parent则这步可省略
     *     ctrl._$appendTo(function(_body){
     *         // 如果需要自定义body插入的位置可以输入函数，返回父容器节点
     *         _parent.insertAdjacentElement('afterBegin',_body);
     *         return _parent;
     *     });
     * });
     * ```
     *
     * @class     module:ui/base._$$Abstract
     * @extends   module:util/event._$$EventTarget
     * @param     {Object}               arg0   - 可选配置参数
     * @property  {String}               clazz  - 控件样式
     * @property  {String|Node|Function} parent -  控件所在容器节点或者追加控件节点执行函数
     */
    _p._$$Abstract = _k._$klass();
    _pro = _p._$$Abstract._$extend(_t._$$EventTarget);
    /**
     * 初始化
     *
     * @protected
     * @method module:ui/base._$$Abstract#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__super();
        _e._$dumpCSSText();
        this.__initXGui();
        this.__initNode();
    };
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/base._$$Abstract#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__doInitClass(_options.clazz);
        this._$appendTo(_options.parent);
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/base._$$Abstract#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        // clear parent
        this.__doDelParentClass();
        delete this.__parent;
        // clear body
        _e._$removeByEC(this.__body);
        _e._$delClassName(
            this.__body,
            this.__class
        );
        delete this.__class;
    };
    /**
     * 初始化外观信息，子类实现具体逻辑
     *
     * @abstract
     * @method module:ui/base._$$Abstract#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = _f;
    /**
     * 初始化节点，子类重写具体逻辑
     *
     * @protected
     * @method module:ui/base._$$Abstract#__initNode
     * @return {Void}
     */
    _pro.__initNode = function(){
        if (!this.__seed_html){
            this.__initNodeTemplate();
        }
        this.__body = _t0._$getNodeTemplate(this.__seed_html);
        if (!this.__body){
            this.__body = _e._$create('div',this.__seed_css);
        }
        _e._$addClassName(this.__body,this.__seed_css);
    };
    /**
     * 动态构建控件节点模板，子类实现具体逻辑
     *
     * @abstract
     * @method module:ui/base._$$Abstract#__initNodeTemplate
     * @return {Void}
     */
    _pro.__initNodeTemplate = _f;
    /**
     * 添加节点样式
     *
     * @protected
     * @method module:ui/base._$$Abstract#__doInitClass
     * @param  {String} arg0 - 样式名称
     * @return {Void}
     */
    _pro.__doInitClass = function(_clazz){
        this.__class = _clazz||'';
        _e._$addClassName(this.__body,this.__class);
    };
    /**
     * 父节点增加辅助样式
     *
     * @protected
     * @method module:ui/base._$$Abstract#__doAddParentClass
     * @return {Void}
     */
    _pro.__doAddParentClass = function(){
        if (!!this.__seed_css){
            var _arr = this.__seed_css.split(/\s+/);
            _e._$addClassName(
                this.__parent,
                _arr.pop()+'-parent'
            );
        }
    };
    /**
     * 父节点删除辅助样式
     *
     * @protected
     * @method module:ui/base._$$Abstract#__doDelParentClass
     * @return {Void}
     */
    _pro.__doDelParentClass = function(){
        if (!!this.__seed_css){
            var _arr = this.__seed_css.split(/\s+/);
            _e._$delClassName(
                this.__parent,
                _arr.pop()+'-parent'
            );
        }
    };
    /**
     * 取当前控件节点
     *
     * 脚本举例
     * ```javascript
     * // _mask是一个继承了此基类的实例化对象
     * // 获取当前控件的节点
     *   _mask._$getBody();
     * ```
     *
     * @method module:ui/base._$$Abstract#_$getBody
     * @return {Node} 控件节点
     */
    _pro._$getBody = function(){
        return this.__body;
    };
    /**
     * 控件节点追加至容器
     *
     * 脚本举例
     * ```javascript
     * // _mask是一个继承了此基类的实例化对象
     * _mask._$appendTo(document.body);
     * // 还可以传方法
     * _mask._$appendTo(function(_body){
     *    // 根据情况插入节点
     *    var _parent = document.body;
     *    _parent.insertAdjacentElement('afterBegin',_body);
     *    return _parent;
     * });
     * ```
     *
     * @method module:ui/base._$$Abstract#_$appendTo
     * @param  {String|Node|Function} arg0 - 控件所在容器节点
     * @return {Void}
     */
    _pro._$appendTo = function(_parent){
        if (!this.__body) return;
        this.__doDelParentClass();
        if (_u._$isFunction(_parent)){
            this.__parent = _parent(this.__body);
        }else{
            this.__parent = _e._$get(_parent);
            if (!!this.__parent){
                this.__parent.appendChild(this.__body);
            }
        }
        this.__doAddParentClass();
    };
    /**
     * 显示控件
     *
     * 脚本举例
     * ```javascript
     * // _mask是一个继承了此基类的实例化对象
     * _mask._$show();
     * ```
     *
     * @method module:ui/base._$$Abstract#_$show
     * @return {Void}
     */
    _pro._$show = function(){
        if (!this.__parent||!this.__body||
             this.__body.parentNode==this.__parent){
            return;
        }
        this.__parent.appendChild(this.__body);
    };
    /**
     * 隐藏控件
     *
     * 脚本举例
     * ```javascript
     * // _mask是一个继承了此基类的实例化对象
     * _mask._$hide();
     * ```
     *
     * @method module:ui/base._$$Abstract#_$hide
     * @return {Void}
     */
    _pro._$hide = function(){
        _e._$removeByEC(this.__body);
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});
