/*
 * ------------------------------------------
 * 日志类别模块实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/klass',
    'base/element',
    'util/tab/view',
    'util/template/tpl',
    'pro/module/module'
], function(_k,_e,_t,_l,_m,_p,_pro){
    /**
     * 日志类别模块对象
     * 
     * @class   {wd.m.b._$$ModuleBlogListBox}
     * @extends {wd.m._$$Module}
     * 
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     * 
     */
    _p._$$ModuleBlogListBox = _k._$klass();
    _pro = _p._$$ModuleBlogListBox._$extend(_m._$$Module);
    /**
     * 构建模块
     * @return {Void}
     */
    _pro.__doBuild = function(){
        this.__super();
        this.__body = _e._$html2node(
            _l._$getTextTemplate('module-id-5')
        );
        // 0 - box type box
        // 1 - class or tag name
        var _list = _e._$getByClassName(this.__body,'j-flag');
        this.__ntip = _list[1];
        this.__nprt = _list[0].parentNode;
        this.__tbview = _t._$$TabView._$allocate({
            list:_e._$getByClassName(_list[0],'j-list')
        });
    };
    /**
     * 刷新模块
     * @param  {Object} 配置信息
     * @return {Void}
     */
    _pro.__onRefresh = function(_options){
        this.__super(_options);
        var _param = _options.param||_o,
            _tname = _param.cid||_param.tid;
        if (!!_tname){
            var _prefix = !!_param.cid?'分类：':'标签：';
            this.__ntip.innerText = _prefix+_tname+'的日志列表';
            _e._$addClassName(this.__nprt,'js-ntbx');
        }else{
            this.__tbview._$match(_param.box||0);
            _e._$delClassName(this.__nprt,'js-ntbx');
        }
    };
    // notify dispatcher
    _m._$regist(
        'blog-list-box',
        _p._$$ModuleBlogListBox
    );
});
