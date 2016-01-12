/*
 * ------------------------------------------
 * 模块分组管理器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/dispatcher/dsp/single */
NEJ.define([
    'base/klass',
    'base/element',
    './util.js',
    './group.js'
],function(_k,_e,_t0,_t1,_p,_o,_f,_r){
    var _pro;
    /**
     * 模块分组管理器
     * 
     * @class   module:util/dispatcher/dsp/single._$$GroupManagerSingle
     * @extends module:util/dispatcher/dsp/group._$$GroupManager
     * 
     * @param    {Object}  config  - 可选配置参数
     * @property {Boolean} classed - 是否需要切换样式
     */
    _p._$$GroupManagerSingle = _k._$klass();
    _pro = _p._$$GroupManagerSingle._$extend(_t1._$$GroupManager);
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/dispatcher/dsp/single._$$GroupManagerSingle#__reset
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__classed = !!_options.classed;
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/dispatcher/dsp/single._$$GroupManagerSingle#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        delete this.__cmroot;
        delete this.__source;
    };
    /**
     * 判断当前模块是否可以退出
     * 
     * @method module:util/dispatcher/dsp/single._$$GroupManagerSingle#_$exitable
     * @param  {Object}  arg0 - 目标信息
     * @return {Boolean} 是否允许退出当前模块
     */
    _pro._$exitable = function(_event){
        if (!this.__source){
            return !0;
        }
        var _module = this.__source._$getData().module;
        // sure module has loaded
        if (_t0._$isModule(_module)){
            _module._$dispatchEvent('onbeforehide',_event);
        }
        return !_event.stopped;
    };
    /**
     * 刷新当前模块
     * 
     * @method module:util/dispatcher/dsp/single._$$GroupManagerSingle#_$refresh
     * @return {Void}
     */
    _pro._$refresh = function(){
        if (!this.__source) return;
        // keep asynchronous for finishing last process
        window.setTimeout(
            this._$dispatchUMI._$bind(
                this,this.__source._$getPath()
            ),0
        );
    };
    /**
     * 调度到指定UMI的模块,大致调度策略为:
     * 
     * 1. 计算原始节点与目标节点的公共节点
     * 2. 依次刷新根节点到公共节点之间的节点上注册的模块
     * 3. 依次隐藏原始节点到公共节点之间的节点上注册的模块
     * 4. 依次显示公共节点到目标节点之间的节点上注册的模块
     *   
     * 执行过程中遇到任何需要动态载入的模块均自动载入,
     * 子节点执行操作之前必须确保父节点已执行完相应操作
     * 
     * 以下两种情况忽略本次调度逻辑:
     * 
     * * 需要调度的UMI非本组管理器的UMI
     * * 需要调度的UMI上没有注册模块
     * 
     * @method module:util/dispatcher/dsp/single._$$GroupManagerSingle#_$dispatchUMI
     * @param  {String} arg0 - 模块UMI
     * @return {Void}
     */
    _pro._$dispatchUMI = function(_umi){
        if (!this._$hasUMI(_umi)) return;
        var _target = _t0._$getNodeByUMI(this.__root,_umi),
            _data = _target._$getData();
        // no module registed in target
        if (!_data.module) return;
        // update event information
        var _source = this.__source,
            _event  = _data.event,
            _odata  = _o;
        this.__source = _target;
        this.__doClearStopped(_target);
        if (!!_source){
            _odata = _source._$getData().event;
            _event.referer = _odata.href||'';
        }
        // source==target do refresh
        if (_source==_target){
            this.__doModuleRefresh(this.__source);
            return;
        }
        // hide source
        this.__cmroot = _t0._$getCommonRoot(
            this.__root,_source,_target
        );
        if (_source!=null){
            // hide source -> common root
            if (_source!=this.__cmroot){
                if (this.__classed){
                    _e._$delClassName(
                        document.body,
                        _odata.clazz
                    );
                }
                this.__doModuleHide(
                    _source,this.__cmroot
                );
            }
            // refresh common root -> root
            this.__doModuleRefresh(this.__cmroot);
        }else{
            // show common root -> root
            this.__doModuleShow(this.__cmroot);
        }
        // show target
        if (_target!=this.__cmroot){
            if (this.__classed){
                _e._$addClassName(
                    document.body,_event.clazz
                );
            }
            // show target -> common root
            this.__doModuleShow(_target,this.__cmroot);
        }
    };
    /**
     * 指定UMI的模块载入完成
     * 
     * @method module:util/dispatcher/dsp/single._$$GroupManagerSingle#_$loadedUMI
     * @param  {String} arg0 - 模块UMI
     * @return {Void}
     */
    _pro._$loadedUMI = function(_umi){
        if (this._$hasUMI(_umi)){
            this.__doModuleAction(this.__source);
        }
    };
    /**
     * 隐藏当前分组
     * 
     * @method module:util/dispatcher/dsp/single._$$GroupManagerSingle#_$hide
     * @return {Void}
     */
    _pro._$hide = function(){
        if (!this.__source){
            return;
        }
        this._$hideUMI(
            this.__source._$getPath()
        );
        delete this.__cmroot;
        delete this.__source;
    };
    
    return _p;
});
