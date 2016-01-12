/*
 * ------------------------------------------
 * 列表模块基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/list/module */
NEJ.define([
    'base/global',
    'base/klass',
    'base/util',
    'base/event',
    'base/element',
    'ui/item/list',
    'ui/pager/pager',
    'util/event',
    'util/template/jst',
    'util/template/tpl',
    'util/cache/list'
],function(NEJ,_k,_u,_v,_e,_i0,_i1,_t0,_t1,_t2,_t3,_p,_o,_f,_r){
    var _pro;
    /**
     * 列表模块基类
     *
     * @class    module:util/list/module._$$ListModule
     * @extends  module:util/event._$$EventTarget
     *
     * @param    {Object}        config - 可选配置参数
     * @property {String|Node}   parent - 列表容器节点
     * @property {Number}        limit  - 每页显示数量，默认10项
     * @property {Number}        first  - 首页显示数量，默认为limit的值
     * @property {String|Object} item   - 列表JST模版标识或者Item配置，{clazz:'xxx',klass:_$$Item||'jst key',prefix:'xxx'}
     * @property {Object}        cache  - 缓存配置信息，{key:'primary key',lkey:'list key',data:{},ext:{},klass:_$$CacheList,list:[],clear:true,total:200}
     * @property {Object}        pager  - 分页器配置信息，{parent:'xxx',klass:_$$Pager,index:2,fixed:true}
     */
    /**
     * 下拉刷新列表之前处理业务逻辑，可用于处理loading状态的显示
     * 
     * @event    module:util/list/module._$$ListModule#onbeforepullrefresh
     * @param    {Object}  event   - 事件信息
     * @property {Node}    parent  - 容器节点
     * @property {String}  value   - 设置此参数返回用以显示loading的html代码或者节点
     * @property {Boolean} stopped - 设置此参数用以表明loading已处理，后续逻辑忽略处理loading状态
     */
    /**
     * 下拉刷新列表载入之后处理业务逻辑，可用于处理loading状态的隐藏
     * 
     * @event    module:util/list/module._$$ListModule#onafterpullrefresh
     * @param    {Object}  event   - 事件信息
     * @property {Node}    parent  - 容器节点
     * @property {String}  value   - 设置此参数返回用以显示loading的html代码
     * @property {Boolean} stopped - 设置此参数用以表明loading已处理，后续逻辑忽略处理loading状态
     */
    /**
     * 加载列表之前处理业务逻辑，可用于处理loading状态的显示
     * 
     * @event    module:util/list/module._$$ListModule#onbeforelistload
     * @param    {Object}  event   - 事件信息
     * @property {Node}    parent  - 容器节点
     * @property {String}  value   - 设置此参数返回用以显示loading的html代码或者节点
     * @property {Boolean} stopped - 设置此参数用以表明loading已处理，后续逻辑忽略处理loading状态
     */
    /**
     * 列表载入之后处理业务逻辑，可用于处理loading状态的隐藏
     * 
     * @event    module:util/list/module._$$ListModule#onafterlistload
     * @param    {Object}  event   - 事件信息
     * @property {Node}    parent  - 容器节点
     * @property {String}  value   - 设置此参数返回用以显示loading的html代码
     * @property {Boolean} stopped - 设置此参数用以表明loading已处理，后续逻辑忽略处理loading状态
     */
    /**
     * 为空列表时显示的信息
     * 
     * @event    module:util/list/module._$$ListModule#onemptylist
     * @param    {Object}  event   - 事件信息
     * @property {Node}    parent  - 容器节点
     * @property {String}  value   - 设置此参数返回用以显示的html代码
     * @property {Boolean} stopped - 设置此参数用以表明已处理，后续逻辑忽略处理状态
     */
    /**
     * 页码变化触发事件
     * 
     * @event    module:util/list/module._$$ListModule#onpagechange
     * @param    {Object}  event   - 事件信息
     * @property {Number}  index   - 当前页码
     * @property {Boolean} stopped - 设置此参数用以表明已处理，后续逻辑忽略分页处理
     */
    /**
     * 列表显示之前处理业务逻辑，此事件确保列表有数据
     * 
     * @event    module:util/list/module._$$ListModule#onbeforelistrender
     * @param    {Object} event  - 事件信息
     * @property {Node}   parent - 容器节点
     */
    /**
     * 列表显示之后处理业务逻辑，此事件确保列表有数据
     * 
     * @event    module:util/list/module._$$ListModule#onafterlistrender
     * @param    {Object} event  - 事件信息
     * @property {Node}   parent - 容器节点
     */
    /**
     * 列表清除之前处理业务逻辑
     * 
     * @event    module:util/list/module._$$ListModule#onbeforelistclear
     * @param    {Object} event  - 事件信息
     * @property {Node}   parent - 容器节点
     */
    /**
     * 请求更新列表项数据，主要用于处理删除之前的确认，
     * 确认完成后可调用模块的_$delete接口将数据从服务器上删除
     * 
     * @event  module:util/list/module._$$ListModule#ondelete
     * @param  {Object} event - 列表项数据
     */
    /**
     * 删除列表项之前回调，主要用来预处理调用Cache中的删除接口时的信息
     * 
     * @event    module:util/list/module._$$ListModule#onbeforedelete
     * @param    {Object} event - 事件信息
     * @property {String} id    - 列表项标识
     * @property {String} key   - 列表标识
     * @property {Object} data  - 列表项数据
     */
    /**
     * 删除列表项之后回调，主要用来额外处理列表呈现的业务逻辑
     * 
     * @event    module:util/list/module._$$ListModule#onafterdelete
     * @param    {Object}  event   - 事件信息
     * @property {String}  key     - 列表标识
     * @property {Object}  data    - 删除的列表项数据
     * @property {Boolean} stopped - 是否阻止列表刷新逻辑
     */
    /**
     * 请求更新列表项数据，针对JST模版的用户点击行为，
     * 主要用于处理收集更新数据，更新数据收集完成后可调用模块的_$update接口将数据更新到服务器
     * 
     * @event  module:util/list/module._$$ListModule#onupdate
     * @param  {Object} event - 列表项数据
     */
    /**
     * 更新列表项之前回调，主要用来预处理调用Cache中的更新接口时的信息
     * 
     * @event    module:util/list/module._$$ListModule#onbeforeupdate
     * @param    {Object} event - 事件信息
     * @property {String} id    - 列表项标识
     * @property {String} key   - 列表标识
     * @property {Object} data  - 列表项数据
     */
    /**
     * 更新列表项之后回调，主要用来额外处理列表呈现的业务逻辑
     * 
     * @event    module:util/list/module._$$ListModule#onafterupdate
     * @param    {Object}  event   - 事件信息
     * @property {String}  key     - 列表标识
     * @property {Object}  data    - 删除的列表项数据
     * @property {Boolean} stopped - 是否阻止列表刷新逻辑
     */
    /**
     * 错误处理回调
     * 
     * @event  module:util/list/module._$$ListModule#onerror
     */
    _p._$$ListModule = _k._$klass();
    _pro = _p._$$ListModule._$extend(_t0._$$EventTarget);
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/list/module._$$ListModule#__reset
     * @param  {Object} arg0 - 配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__ropt = {};
        this.__super(_options);
        this.__lbox = _e._$get(_options.parent);
        this.__iopt = {parent:this.__lbox};
        this.__limit = parseInt(_options.limit)||10;
        this.__first = parseInt(_options.first)||this.__limit;
        this.__doResetTemplate(_options.item);
        this.__doResetCache(_options.cache||_o);
        this.__doResetPager(_options.pager||_o);
        this._$refresh();
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/list/module._$$ListModule#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this._$dispatchEvent('onbeforerecycle');
        this.__doClearListBox();
        this.__super();
        if (this.__ropt.clear){
            this.__cache._$clearListInCache(this.__ropt.key);
        }
        this.__cache._$recycle();
        if (!!this.__pager){
            this.__pager._$recycle();
            delete this.__pager;
        }
        delete this.__pkls;
        delete this.__popt;
        delete this.__pulling;
        delete this.__cache;
        delete this.__lbox;
        delete this.__ikls;
        delete this.__iopt;
        delete this.__iext;
        delete this.__ropt;
    };
    /**
     * 根据数据ID取项节点ID
     * 
     * @protected
     * @method module:util/list/module._$$ListModule#__getItemBodyId
     * @param  {String} 数据ID
     * @return {String} 节点ID
     */
    _pro.__getItemBodyId = function(_id){
        return this.__getItemId(_id)+
               _t1._$seed();
    };
    /**
     * 取项标识
     *
     * @protected
     * @method module:util/list/module._$$ListModule#__getItemId
     * @param  {String} arg0 - 数据标识
     * @return {String}        项标识
     */
    _pro.__getItemId = function(_id){
        var _prefix = (this.__iopt||_o).prefix||'';
        return _prefix+_id;
    };
    /**
     * 取当前偏移量的分页信息
     *
     * @protected
     * @method module:util/list/module._$$ListModule#__getPageInfo
     * @param  {Number} arg0 - 偏移位置
     * @param  {Number} arg1 - 长度
     * @return {Object}        分页信息，如：{index:1,total:4}
     */
    _pro.__getPageInfo = function(_point,_offset,_limit,_length){
        var _result = {
            index:1,
            total:1
        };
        if (_offset>=_point){
            _result.index = Math.floor((_offset-_point)/_limit)+2;
        }
        if (_length>_point){
            _result.total = Math.ceil((_length-_point)/_limit)+1;
        }
        return _result;
    };
    /**
     * 重置JST模版
     * 
     * @protected
     * @method module:util/list/module._$$ListModule#__doResetJSTTemplate
     * @param  {String} arg0 - JST标识
     * @return {Void}
     */
    _pro.__doResetJSTTemplate = function(_key){
        delete this.__ikls;
        this.__ikey = _key;
        this.__doInitDomEvent([[
            this.__lbox,'click',
            this.__onCheckAction._$bind(this)
        ]]);
    };
    /**
     * 重置列表项模版配置
     *
     * @protected
     * @method module:util/list/module._$$ListModule#__doResetTemplate
     * @param  {String|Object} arg0 - 列表项模版配置
     * @return {Void}
     */
    _pro.__doResetTemplate = function(_item){
        // if item is jst-key
        if (_u._$isString(_item)){
            this.__doResetJSTTemplate(_item);
            return;
        }
        // if item is jst with options
        _u._$merge(this.__iopt,_item);
        // filter jst extend function
        this.__iext = _u._$merge(
            {},_item,function(_it){
                return !_u._$isFunction(_it);
            }
        );
        var _klass = this.__iopt.klass;
        delete this.__iopt.klass;
        if (_u._$isString(_klass)){
            this.__doResetJSTTemplate(_klass);
            return;
        }
        // if item is Item template
        delete this.__ikey;
        this.__ikls = _klass;
        this.__iopt.ondelete = this
            ._$dispatchEvent._$bind(this,'ondelete');
        this.__iopt.onupdate = this
            ._$dispatchEvent._$bind(this,'onupdate');
    };
    /**
     * 重置缓存信息配置
     *
     * @protected
     * @method module:util/list/module._$$ListModule#__doResetCache
     * @param  {Object} arg0 - 缓存配置
     * @return {Void}
     */
    _pro.__doResetCache = function(_cache){
        var _klass = _cache.klass,
            _copt  = _u._$merge({},_cache);
        this.__ropt.key = _copt.lkey;
        this.__ropt.ext = _copt.ext;
        this.__ropt.data = _copt.data||{};
        this.__ropt.clear = !!_copt.clear;
        this.__iopt.pkey = _copt.key||'id';
        _copt.onerror = 
            this._$dispatchEvent._$bind(this,'onerror');
        _copt.onlistload =
            this.__cbListLoad._$bind(this);
        _copt.onpullrefresh =
            this.__cbPullRefresh._$bind(this);
        if (!!_klass&&('onlistchange' in _klass)){
            this.__doInitDomEvent([[
                _klass,'listchange',
                this.__cbListChange._$bind(this)
            ]]);
        }else{
            _copt.onitemadd = this.
                __cbItemAdd._$bind(this);
            _copt.onitemdelete = this.
                __cbItemDelete._$bind(this);
            _copt.onitemupdate = this.
                __cbItemUpdate._$bind(this);
        }
        this.__cache = (_klass||_t3._$$CacheList)._$allocate(_copt);
        // set total
        if (_cache.total!=null){
            this.__cache._$setTotal(
                this.__ropt.key,
                _cache.total
            );
        }
        // set list
        if (!!_cache.list){
            this.__cache._$setListInCache(
                this.__ropt.key,
                _cache.list
            );
        }
    };
    /**
     * 重置分页器配置
     *
     * @protected
     * @method module:util/list/module._$$ListModule#__doResetPager
     * @param  {Object} 分页器配置
     * @return {Void}
     */
    _pro.__doResetPager = function(_pager){
        this.__pkls = _pager.klass||_i1._$$Pager;
        this.__popt = _u._$merge({},_pager);
        // parse bind pager
        if (_u._$isArray(_pager.parent)){
            this.__popt.parent = _pager.parent[0];
            this.__pbid = _pager.parent.slice(1);
            if (!this.__pbid||!this.__pbid.length){
                delete this.__pbid;
            }
        }
        delete this.__popt.klass;
    };
    /**
     * 清理列表容器
     *
     * @protected
     * @method module:util/list/module._$$ListModule#__doClearListBox
     * @return {Void}
     */
    _pro.__doClearListBox = (function(){
        var _reg0 = /^(?:table|tr|tbody|ul|ol|select)$/i;
        return function(){
            this._$dispatchEvent('onbeforelistclear',{
                parent:this.__lbox
            });
            if (!!this.__items&&this.__items.length>0){
                this.__items = this.__ikls
                    ._$recycle(this.__items);
                delete this.__items;
            }
            if (_reg0.test(this.__lbox.tagName)){
                _e._$clearChildren(this.__lbox);
            }else{
                this.__lbox.innerHTML = '';
            }
        };
    })();
    /**
     * 切换分页器的显示状态
     *
     * @protected
     * @method module:util/list/module._$$ListModule#__doSwitchPagerShow
     * @return {Void}
     */
    _pro.__doSwitchPagerShow = function(_display){
        if (!!this.__popt.fixed) return;
        _e._$setStyle(this.__popt.parent,'display',_display);
        _u._$forEach(
            this.__pbid,function(_parent){
                _e._$setStyle(_parent,'display',_display);
            },this
        );
    };
    /**
     * 通过分页器刷新当前页
     *
     * @protected
     * @method module:util/list/module._$$ListModule#__doRefreshByPager
     * @return {Void}
     */
    _pro.__doRefreshByPager = function(){
        var _index = this.__popt.index||1;
        delete this.__popt.index;
        if (!!this.__pager){
            _index = this.__pager._$getIndex();
        }
        this.__doChangePage({
            last:_index,
            index:_index
        });
    };
    /**
     * 页码变化处理逻辑
     * 
     * @protected
     * @method module:util/list/module._$$ListModule#__doChangePage
     * @param  {Object} arg0 - 页码信息
     * @return {Void}
     */
    _pro.__doChangePage = function(_event){
        this._$dispatchEvent('onpagechange',_event);
    };
    /**
     * 偏移量变化处理逻辑
     * 
     * @protected
     * @method module:util/list/module._$$ListModule#__doChangeOffset
     * @param  {Number} arg0 - 偏移量
     * @return {Void}
     */
    _pro.__doChangeOffset = function(_offset){
        this.__ropt.offset = _offset;
        this.__doLoadList();
    };
    /**
     * 生成请求对象信息
     *
     * @protected
     * @method module:util/list/module._$$ListModule#__doGenRequestOpt
     * @param  {Object} arg0 - 预处理请求信息
     * @return {Object}        处理后请求信息
     */
    _pro.__doGenRequestOpt = function(_options){
        return _options;
    };
    /**
     * 加载数据列表
     *
     * @protected
     * @method module:util/list/module._$$ListModule#__doLoadList
     * @return {Void}
     */
    _pro.__doLoadList = function(){
        this.__doBeforeListLoad();
        // load data from cache
        var _data = this.__ropt.data;
        _data.offset = this.__ropt.offset;
        var _first = _data.offset==0;
        _data.total  = _first;
        this.__ropt.limit =
              _first?this.__first:this.__limit;
        _data.limit  = this.__ropt.limit;
        this.__cache._$getList(
            this.__doGenRequestOpt(
                _u._$merge({},this.__ropt)
            )
        );
    };
    /**
     * 数据列表载入完成回调
     *
     * @protected
     * @method module:util/list/module._$$ListModule#__cbListLoad
     * @param  {Object} arg0 - 请求信息
     * @return {Void}
     */
    _pro.__cbListLoad = function(_options){
        if (_options.key!=this.__ropt.key||
            _options.offset!=this.__ropt.offset) return;
        //console.log('list load -> '+_options.key);
        this.__doBeforeListShow();
        // check list
        var _list = this.__cache.
            _$getListInCache(_options.key);
        if (!_list||!_list.length){
            // check load error
            if (!this._$cache()._$isLoaded(_options.key)){
                this._$dispatchEvent('onlistloaderror',{
                    parent:this.__lbox
                });
            }else{
                this.__doShowEmpty();
            }
            return !0;
        }
        // render list
        var _limit = _options.limit,
            _offset = _options.offset;
        if (!this.__cache._$isFragmentFilled(_options.key,_offset,_limit)){
            this._$dispatchEvent('onlistloaderror',{
                parent:this.__lbox
            });
            return !0;
        }
        if (this.__doBeforeListRender(
                  _list,_offset,_limit))
            return;
        this._$dispatchEvent('onbeforelistrender',{
            list:_list,
            offset:_offset,
            parent:this.__lbox
        });
        if (!!this.__ikey){
            // render by jst
            this.__iopt.xlist = _list;
            this.__iopt.beg = _offset;
            this.__iopt.end = Math.min(_list.length,_offset+_limit)-1;
            this.__iopt.act = 'list';
            var _html = _t1._$get(
                this.__ikey,
                this.__iopt,
                this.__iext
            );
            this.__doShowListByJST(_html);
        }else{
            // render by item
            this.__iopt.limit = _limit;
            this.__iopt.offset = _offset;
            var _items = _t2._$getItemTemplate(
                         _list,this.__ikls,this.__iopt);
            this.__doShowListByItem(_items);
        }
        this._$dispatchEvent('onafterlistrender',{
            list:_list,
            offset:_offset,
            parent:this.__lbox
        });
    };
    /**
     * 前向刷新数据列表载入完成回调
     *
     * @protected
     * @method module:util/list/module._$$ListModule#__cbPullRefresh
     * @param  {Object} arg0 - 请求信息
     * @return {Void}
     */
    _pro.__cbPullRefresh = function(_options){
        // unlock pulling
        if (!this.__pulling)
            return;
        delete this.__pulling;
        // recycle loading
        this.__doBeforeListShow('onafterpullrefresh');
        this._$refresh();
    };
    /**
     * 同步分页器
     *
     * @protected
     * @method module:util/list/module._$$ListModule#__doSyncPager
     * @param  {Number}  arg0 - 页码索引
     * @param  {Number}  arg1 - 总页数
     * @return {Boolean}        是否重置页码
     */
    _pro.__doSyncPager = function(_index,_total){
        if (!!this.__pager){
            // limit page total
            if ((this.__popt||_o).limit>0){
                _total = Math.min(
                    _total,this.__popt.limit
                );
            }
            // check pager index and total
            var _index2 = this.__pager._$getIndex(),
                _total2 = this.__pager._$getTotal();
            if (_index2>_total||_total!=_total2){
                this.__pager._$recycle();
                delete this.__pager;
                this.__doChangePage({
                    last:_index2,
                    index:Math.min(_index,_total)
                });
                return !0;
            }
        }else{
            // check pager instance
            this.__popt.index = _index;
            this.__popt.total = _total;
            this.__pager = this.__pkls._$allocate(this.__popt);
            this.__pager._$setEvent('onchange',this.__doChangePage._$bind(this));
            _u._$forEach(
                this.__pbid,function(_parent){
                    this.__pager._$bind(_parent);
                },this
            );
        }
    };
    /**
     * 格式化数据
     *
     * @protected
     * @method module:util/list/module._$$ListModule#__doFormatData
     * @param  {Object} arg0 - 数据信息
     * @return {Void}
     */
    _pro.__doFormatData = (function(){
        var _seed = +new Date;
        return function(_data){
            var _id = _data[this.__iopt.pkey];
            if (!_id){
                _data['dirty-data'] = !0;
                _data[this.__iopt.pkey] = 'dirty-'+_seed++;
            }
            return _data;
        };
    })();
    /**
     * 分离脏数据
     *
     * @protected
     * @method module:util/list/module._$$ListModule#__doSplitDirty
     * @param  {Object} arg0 - 数据信息
     * @return {String}        数据标识
     */
    _pro.__doSplitDirty = function(_data){
        var _id = _data[this.__iopt.pkey];
        if (!!_data['dirty-data']){
            delete _data['dirty-data'];
            delete _data[this.__iopt.pkey];
        }
        return _id;
    };
    /**
     * 插入单项
     *
     * @protected
     * @method module:util/list/module._$$ListModule#__doInsertOneItem
     * @param  {String} arg0 - 插入位置
     * @param  {Object} arg1 - 数据对象
     * @return {Void}
     */
    _pro.__doInsertOneItem = (function(){
        var _doInsert = function(_pos,_body){
            this.__lbox.insertAdjacentElement(_pos,_body);
        };
        return function(_pos,_data){
            var _xlist = [_data];
            if (!!this.__ikey){
                // render by jst
                this.__iopt.xlist = _xlist;
                this.__iopt.beg = 0;
                this.__iopt.end = 0;
                this.__iopt.act = 'add';
                this.__doShowListByJST(
                    _t1._$get(
                        this.__ikey,
                        this.__iopt,
                        this.__iext
                    ),_pos
                );
            }else{
                // render by item
                this.__iopt.limit = 1;
                this.__iopt.offset = 0;
                this.__iopt.parent =
                      _doInsert._$bind(this,_pos);
                var _items = _t2._$getItemTemplate(
                             _xlist,this.__ikls,this.__iopt);
                this.__iopt.parent = this.__lbox;
                this.__doShowListByItem(_items);
            }
        };
    })();
    /**
     * 加载数据之前处理逻辑，子类实现具体业务逻辑
     * 
     * @abstract
     * @method module:util/list/module._$$ListModule#__doBeforeListLoad
     * @return {Void}
     */
    _pro.__doBeforeListLoad = _f;
    /**
     * 数据载入之后处理逻辑，子类实现具体业务逻辑
     * 
     * @abstract
     * @method module:util/list/module._$$ListModule#__doBeforeListShow
     * @return {Void}
     */
    _pro.__doBeforeListShow = function(_name){
        var _event = {
            parent:this.__lbox
        };
        this._$dispatchEvent(_name||'onafterlistload',_event);
        if (!_event.stopped){
            _e._$removeByEC(this.__ntip);
        }
    };
    /**
     * 列表绘制之前处理逻辑，子类实现具体业务逻辑
     * 
     * @abstract
     * @method module:util/list/module._$$ListModule#__doBeforeListRender
     * @return {Void}
     */
    _pro.__doBeforeListRender = _f;
    /**
     * 呈现提示信息
     * 
     * @protected
     * @method module:util/list/module._$$ListModule#__doRenderMessage
     * @param  {String} arg0 - 消息内容
     * @param  {String} arg1 - 位置信息
     * @return {Void}
     */
    _pro.__doRenderMessage = function(_message,_pos){
        if (_u._$isString(_message)){
            if (!this.__ntip)
                 this.__ntip = _e._$create('div');
            this.__ntip.innerHTML = _message;
        }else{
            this.__ntip = _message;
        }
        this.__lbox.insertAdjacentElement(
            _pos||'beforeEnd',this.__ntip
        );
    };
    /**
     * 通过事件回调检测显示信息
     * 
     * @protected
     * @method module:util/list/module._$$ListModule#__doShowMessage
     * @param  {String} arg0 - 事件名称
     * @param  {String} arg1 - 默认显示内容
     * @return {Void}
     */
    _pro.__doShowMessage = function(_name,_default,_pos){
        var _event = {
            parent:this.__lbox
        };
        if (!!_name){
            this._$dispatchEvent(_name,_event);
        }
        if (!_event.stopped){
            this.__doRenderMessage(
                _event.value||_default,_pos
            );
        }
    };
    /**
     * 列表为空时处理逻辑，子类实现具体业务逻辑
     * 
     * @abstract
     * @method module:util/list/module._$$ListModule#__doShowEmpty
     * @return {Void}
     */
    _pro.__doShowEmpty = _f;
    /**
     * 以jst模版方式绘制列表，子类实现具体业务逻辑
     * 
     * @abstract
     * @method module:util/list/module._$$ListModule#__doShowListByJST
     * @return {Void}
     */
    _pro.__doShowListByJST = _f;
    /**
     * 以item模版方式绘制列表，子类实现具体业务逻辑
     * 
     * @abstract
     * @method module:util/list/module._$$ListModule#__doShowListByItem
     * @return {Void}
     */
    _pro.__doShowListByItem = _f;
    /**
     * 检查列表行为
     *
     * @protected
     * @method module:util/list/module._$$ListModule#__onCheckAction
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onCheckAction = (function(){
        var _reg0 = /^(?:delete|update)$/;
        return function(_event){
            var _node = _v._$getElement(_event,'d:action');
            if (!_node) return;
            var _action = _e._$dataset(_node,'action');
            if (!_reg0.test(_action)) return;
            var _id = _e._$dataset(_node,'id');
            if (!_id) return;
            var _item = this.__cache._$getItemInCache(_id);
            if (!_item) return;
            _v._$stop(_event);
            this._$dispatchEvent('on'+_action,{
                data:_item,
                id:_item[this.__iopt.pkey],
                body:_e._$get(this.__getItemBodyId(_id))
            });
        };
    })();
    /**
     * 添加列表项回调，子类按需实现具体业务逻辑
     * 
     * @abstract
     * @method module:util/list/module._$$ListModule#__cbItemAdd
     * @return {Void}
     */
    _pro.__cbItemAdd = _f;
    /**
     * 删除列表项
     * 
     * @protected
     * @method   module:util/list/module._$$ListModule#__doDeleteItem
     * @param    {Object} arg0 - 列表项信息
     * @property {String} id   - 项标识
     * @property {Object} data - 项绑定的数据信息
     * @return   {Void}
     */
    _pro.__doDeleteItem = function(_event){
        var _data = _event.data||{},
            _options = {
                data:_data,
                key:this.__ropt.key,
                id:_data[this.__iopt.pkey]
            };
        this._$dispatchEvent('onbeforedelete',_options);
        this.__cache._$deleteItem(_options);
    };
    /**
     * 删除列表项回调，子类按需实现具体业务逻辑
     * 
     * @abstract
     * @method module:util/list/module._$$ListModule#__cbItemDelete
     * @return {Void}
     */
    _pro.__cbItemDelete = _f;
    /**
     * 更新列表项
     * 
     * @protected
     * @method   module:util/list/module._$$ListModule#__doUpdateItem
     * @param    {Object} arg0 - 列表项信息
     * @property {String} id   - 项标识
     * @property {Object} data - 项绑定的数据信息
     * @return   {Void}
     */
    _pro.__doUpdateItem = function(_event){
        var _data = _event.data||{},
            _options = {
                data:_data,
                key:this.__ropt.key
            };
        this._$dispatchEvent('onbeforeupdate',_options);
        this.__cache._$updateItem(_options);
    };
    /**
     * 更新列表项回调，子类可按需重写具体业务逻辑
     * 
     * @protected
     * @method module:util/list/module._$$ListModule#__cbItemUpdate
     * @return {Void}
     */
    _pro.__cbItemUpdate = function(_event){
        this.__doCheckResult(_event,'onafterupdate');
        if (_event.stopped) return;
        var _id = _event.data[this.__iopt.pkey];
        if (!!this.__items){
            var _item = _t2._$getItemById(
                this.__getItemId(_id)
            );
            if (!!_item) _item._$refresh(_event.data);
        }else{
            var _node = this._$getItemBody(_id);
            if (!_node) return;
            var _list = this.__cache._$getListInCache(_event.key),
                _index = _u._$indexOf(_list,_event.data);
            if (_index<0) return;
            this.__iopt.xlist = _list;
            this.__iopt.beg  = _index;
            this.__iopt.end  = _index;
            this.__iopt.act  = 'update';
            var _html = _t1._$get(
                this.__ikey,
                this.__iopt,
                this.__iext
            );
            _node.insertAdjacentHTML('afterEnd',_html);
            _e._$remove(_node);
        }
        this._$dispatchEvent('onafterupdaterender',{
            data:_event.data,
            parent:this.__lbox
        });
    };
    /**
     * 验证操作结果
     * 
     * @protected
     * @method module:util/list/module._$$ListModule#__doCheckResult
     * @param  {Object} arg0 - 事件信息
     * @return {Void}
     */
    _pro.__doCheckResult = function(_event,_name){
        var _item = _event.data;
        if (!_item||_item[this.__iopt.pkey]==null){
            this._$dispatchEvent('onerror',_event);
            _event.stopped = !0;
        }
        if (!_event.stopped){
            this._$dispatchEvent(_name,_event);
        }
    };
    /**
     * 追加数据片段回调
     *
     * @abstract
     * @method module:util/list/module._$$ListModule#__cbAppendList
     * @param  {Number} arg0 - 偏移量
     * @param  {Number} arg1 - 数量
     * @return {Void}
     */
    _pro.__cbAppendList = _f;
    /**
     * 前向追加数据片段回调
     *
     * @abstract
     * @method module:util/list/module._$$ListModule#__cbUnshiftList
     * @param  {Number} arg0 - 偏移量
     * @param  {Number} arg1 - 数量
     * @return {Void}
     */
    _pro.__cbUnshiftList = _f;
    /**
     * 列表变化回调（删除/添加），子类按需实现具体业务逻辑
     * 
     * @protected
     * @method module:util/list/module._$$ListModule#__cbListChange
     * @return {Void}
     */
    _pro.__cbListChange = function(_event){
        if (_event.key!=this.__ropt.key) return;
        switch(_event.action){
            case 'add':
                this.__cbItemAdd(_event);
            break;
            case 'delete':
                this.__cbItemDelete(_event);
            break;
            case 'update':
                this.__cbItemUpdate(_event);
            break;
            case 'refresh':
                this._$refresh();
            break;
            case 'unshift':
                this.__cbUnshiftList(
                    _event.offset,
                    _event.limit
                );
            break;
            case 'append':
                this.__cbAppendList(
                    _event.offset,
                    _event.limit
                );
            break;
        }
    };
    /**
     * 更新某一项数据
     * 
     * @method module:util/list/module._$$ListModule#_$update
     * @param  {Object} arg0 - 需要更新的数据
     * @return {Void}
     */
    _pro._$update = function(_item){
        this.__doUpdateItem({data:_item});
    };
    /**
     * 删除某一项数据
     * 
     * @method module:util/list/module._$$ListModule#_$delete
     * @param  {Object} arg0 - 需要删除的数据
     * @return {Void}
     */
    _pro._$delete = function(_item){
        this.__doDeleteItem({data:_item});
    };
    /**
     * 添加一项数据
     * 
     * @method module:util/list/module._$$ListModule#_$add
     * @param  {Object} arg0 - 需要添加的数据
     * @return {Void}
     */
    _pro._$add = function(_item){
        this.__cache._$addItem({
            data:_item,
            key:this.__ropt.key
        });
    };
    /**
     * 取缓存实例
     * 
     * @method module:util/list/module._$$ListModule#_$cache
     * @return {module:util/cache/list._$$CacheList} 列表缓存实例
     */
    _pro._$cache = function(){
        return this.__cache;
    };
    /**
     * 往前追加列表项
     *
     * @method module:util/list/module._$$ListModule#_$unshift
     * @param  {Object} arg0 - 数据信息
     * @return {Number}        插入项标识
     */
    _pro._$unshift = function(_data){
        this.__doInsertOneItem(
            'afterBegin',
            this.__doFormatData(_data)
        );
        return this.__doSplitDirty(_data);
    };
    /**
     * 往后追加列表项
     *
     * @method module:util/list/module._$$ListModule#_$append
     * @param  {Object} arg0 - 数据信息
     * @return {Number}        插入项标识
     */
    _pro._$append = function(_data){
        this.__doInsertOneItem(
            'beforeEnd',
            this.__doFormatData(_data)
        );
        return this.__doSplitDirty(_data);
    };
    /**
     * 刷新模块
     * 
     * @method module:util/list/module._$$ListModule#_$refresh
     * @param  {Number} arg0 - 刷新到的页码
     * @return {Void}
     */
    _pro._$refresh = function(){
        this.__doClearListBox();
        this.__doRefreshByPager();
    };
    /**
     * 先清数据再刷新模块
     * 
     * @method module:util/list/module._$$ListModule#_$refreshWithClear
     * @return {Void}
     */
    _pro._$refreshWithClear = function(){
        this.__cache._$clearListInCache(this.__ropt.key);
        this._$refresh();
    };
    /**
     * 前向刷新列表
     * 
     * @method module:util/list/module._$$ListModule#_$pullRefresh
     * @return {Void}
     */
    _pro._$pullRefresh = function(){
        // lock pulling
        if (!!this.__pulling)
            return;
        this.__pulling = !0;
        // show loading
        this.__doShowMessage(
            'onbeforepullrefresh',
            '列表刷新中...','afterBegin'
        );
        // refresh data
        this.__cache._$pullRefresh({
            key:this.__ropt.key,
            data:this.__ropt.data
        });
    };
    /**
     * 取列表总数
     *
     * @method module:util/list/module._$$ListModule#_$getTotal
     * @return {Number} 列表总数
     */
    _pro._$getTotal = function(){
        return this.__cache._$getTotal(this.__ropt.key);
    };
    /**
     * 取分页器实例
     *
     * @method module:util/list/module._$$ListModule#_$getPager
     * @return {Void}
     */
    _pro._$getPager = function(){
        return this.__pager;
    };
    /**
     * 取ITEM列表
     *
     * @method module:util/list/module._$$ListModule#_$items
     * @return {Array} ITEM列表
     */
    _pro._$items = function(){
        return this.__items;
    };
    /**
     * 取列表项节点
     *
     * @method module:util/list/module._$$ListModule#_$getItemBody
     * @param  {String} arg0 - 数据标识
     * @return {Node}          节点
     */
    _pro._$getItemBody = function(_id){
        if (!!this.__ikey){
            // render by jst
            return _e._$get(
                this.__getItemBodyId(_id)
            );
        }else{
            // render by item
            var _item = _t2._$getItemById(
                this.__getItemId(_id)
            );
            if (!!_item){
                return _item._$getBody();
            }
        }
    };
    /**
     * 判断列表是否载入完成
     *
     * @method module:util/list/module._$$ListModule#_$isLoaded
     * @return {Boolean}
     */
    _pro._$isLoaded = function(){
        return this.__cache._$isLoaded(this.__ropt.key);
    };
    /**
     * 显示信息
     *
     * @method module:util/list/module._$$ListModule#_$showMessage
     * @param  {String|Node} arg0 - 消息内容
     * @return {Void}
     */
    _pro._$showMessage = function(_html){
        this.__doClearListBox();
        this.__doShowMessage(null,_html);
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});
