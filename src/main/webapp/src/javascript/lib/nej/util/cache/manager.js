/*
 * ------------------------------------------
 * 持久化数据管理器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module  util/cache/manager */
NEJ.define([
    'base/global',
    'base/klass',
    'base/util',
    'util/cache/cache'
],function(NEJ,_k,_u,_t0,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 分块持久化数据管理器
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/cache/manager'
     * ],function(_t){
     *     // 实例化管理器
     *     var inst = _t._$$StorageManager._$allocate({
     *         key:'userId',
     *         prefix:'test-user-',
     *         limit:2
     *     });
     *    
     *     // memory中存储结构类似：
     *     // {
     *     //    // 数据引用数及对应的块标识
     *     //    'test-user-index':{
     *     //         '1':{ref:1,block:0},
     *     //         '2':{ref:1,block:0},
     *     //         '3':{ref:1,block:1}
     *     //     },
     *     //     // 每块包含的数据ID列表
     *     //     'test-user-block':[
     *     //         [1,2],
     *     //         [3]
     *     //     ],
     *     //     // 所有数据的映射表
     *     //     'test-user-data':{
     *     //         '1':{userId:1,name:'11111'},
     *     //         '2':{userId:2,name:'22222'},
     *     //         '3':{userId:3,name:'33333'}
     *     //     },
     *     //     // 每个块的初始数据长度
     *     //     'test-user-blen':[
     *     //         2,1
     *     //     ]
     *     // }
     *    
     *     // storage中存储结构类似：
     *     // test-user-index:{'1':{b:'0',r:1},'2':{b:'0',r:2},'3':{b:'1',r:1},'test-user-blen':[2,1]}
     *     // test-user-0:[{userId:1,name:'11111'},{userId:2,name:'22222'}]
     *     // test-user-1:[{userId:3,name:'33333'}]
     *    
     *     // 添加数据
     *     inst._$add({userId:1,name:'11111'});
     *     inst._$add({userId:2,name:'22222'});
     *     inst._$add({userId:3,name:'33333'});
     *     // 重复添加更新引用计数
     *     inst._$add({userId:1,name:'11111'});
     *     // 删除数据，优先删除引用计数，当引用计数为0时删除storage中数据
     *     inst._$delete(1);
     *     // 更新数据
     *     inst._$update({userId:1,name:'aaaaaa'});
     *     // 取数据对象
     *     var user = inst._$get(1);
     * });
     * ```
     *
     * @class    module:util/cache/manager._$$StorageManager
     * @extends  module:util/cache/cache._$$CacheAbstract
     *
     * @param    {Object} config - 配置参数
     * @property {String} key    - 数据标识键名称，默认为id
     * @property {String} prefix - 存储键前缀，也用于标识数据块，相同前缀的数据为同一份
     * @property {Number} limit  - 单块数据长度限制，默认单块数组长度为500
     */
    _p._$$StorageManager = _k._$klass();
    _pro = _p._$$StorageManager._$extend(_t0._$$CacheAbstract);
    /**
     * 控件重置
     *
     * @protected
     * @method module:util/cache/manager._$$StorageManager#__reset
     * @param  {Object} arg0 - 配置参数
     * @return {Void}
     */
    _pro.__reset = (function(){
        var _lock = {};
        return function(_options){
            this.__super(_options);
            this.__pkey = _options.key||'id';
            this.__prefix = ''+(_options.prefix||'');
            this.__limit = parseInt(_options.limit)||500;
            // init data
            if (!_lock[this.__prefix]){
                _lock[this.__prefix] = !0;
                this.__doInitDataFromStorage();
            }
        };
    })();
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/cache/manager._$$StorageManager#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        delete this.__pkey;
        delete this.__limit;
        delete this.__prefix;
    };
    /**
     * 构建存储结构
     * 
     * @protected
     * @method module:util/cache/manager._$$StorageManager#__doInitDataFromStorage
     * @return {Void}
     */
    _pro.__doInitDataFromStorage = function(){
        var _ext,
            _prefix = this.__prefix,
            _midx = this.__getIndex();
        // init form storage data
        _u._$forIn(
            this.__getDataInStorage(_prefix+'index'),
            function(_conf,_id){
                if (_id==_prefix+'blen'){
                    _ext = _conf;
                    return;
                }
                _midx[_id] = {
                    ref:_conf.r,
                    block:_conf.b
                };
            }
        );
        this.__setDataInCache(_prefix+'blen',_ext||[]);
    };
    /**
     * 取索引块数据
     * 
     * @protected
     * @method module:util/cache/manager._$$StorageManager#__getIndex
     * @return {Object} 索引块数据
     */
    _pro.__getIndex = function(){
        return this.__getDataInCacheWithDefault(
            this.__prefix+'index',{}
        );
    };
    /**
     * 取数据缓存集合，数据缓存
     *
     * @protected
     * @method module:util/cache/manager._$$StorageManager#__getData
     * @return {Object} 数据缓存集合
     */
    _pro.__getData = function(){
        return this.__getDataInCacheWithDefault(
            this.__prefix+'data',{}
        );
    };
    /**
     * 取块信息集合
     *
     * @protected
     * @method module:util/cache/manager._$$StorageManager#__getBlock
     * @return {Object} 块信息集合
     */
    _pro.__getBlock = function(){
        return this.__getDataInCacheWithDefault(
            this.__prefix+'block',[]
        );
    };
    /**
     * 取块信息集合
     *
     * @protected
     * @method module:util/cache/manager._$$StorageManager#__getBlockLen
     * @return {Object} 块信息集合
     */
    _pro.__getBlockLen = function(){
        return this.__getDataInCacheWithDefault(
            this.__prefix+'blen',[]
        );
    };
    /**
     * 分配块索引
     *
     * @protected
     * @method module:util/cache/manager._$$StorageManager#__getBlockIndex
     * @return {Number} 索引值
     */
    _pro.__getBlockIndex = function(){
        var _result = -1,
            _block = this.__getBlock(),
            _list = this.__getBlockLen();
        _u._$forIn(
            _list,function(_length,_index){
                var _arr = _block[_index];
                // block loaded and length < block limit
                if (!!_arr&&_arr.length<this.__limit){
                    _result = _index;
                    return !0;
                }
                // not load block and length < block limit
                if (!_arr&&_length<this.__limit){
                    this.__doLoadBlock(_index);
                    // check real length
                    if (_block[_index].length<this.__limit){
                        _result = _index;
                        return !0;
                    }
                }
            },this
        );
        // new block index
        if (_result<0){
            _result = _list.length;
            _list.push(0);
            _block[_result] = [];
        }
        return _result;
    };
    /**
     * 载入块数据
     *
     * @protected
     * @method module:util/cache/manager._$$StorageManager#__doLoadBlock
     * @return {Void}
     */
    _pro.__doLoadBlock = function(_bidx){
        var _arr = [],
            _hash = this.__getData(),
            _index = this.__getIndex(),
            _list = this.__getDataInStorage(this.__prefix+_bidx);
        _u._$forEach(
            _list,function(_data){
                // sync data to index
                var _tid = _data[this.__pkey],
                    _conf = _index[_tid]||{};
                _conf.block = _bidx;
                _index[_tid] = _conf;
                // cache data
                _hash[_tid] = _data;
                _arr.push(_tid);
            },this
        );
        // cache block
        this.__getBlock()[_bidx] = _arr;
    };
    /**
     * 持久化索引块数据
     *
     * @protected
     * @method module:util/cache/manager._$$StorageManager#__doFlushIndex
     * @return {Void}
     */
    _pro.__doFlushIndex = function(){
        // flush index
        var _hash = {};
        _u._$forIn(
            this.__getIndex(),function(_conf,_id){
                var _tmp = {b:_conf.block};
                if (_conf.ref!=null){
                    _tmp.r = _conf.ref;
                }
                _hash[_id] = _tmp;
            }
        );
        // dump block attr
        var _arr = [];
        _u._$forEach(
            this.__getBlock(),function(_list){
                _arr.push(_list.length);
            }
        );
        _hash[this.__prefix+'blen'] = _arr;
        this.__setDataInStorage(this.__prefix+'index',_hash);
    };
    /**
     * 持久化块数据
     *
     * @protected
     * @method module:util/cache/manager._$$StorageManager#__doFlushBlock
     * @param  {String|Array} arg0 - 块标识，没传表示序列化所有块
     * @return {Void}
     */
    _pro.__doFlushBlock = function(_key){
        var _map = this.__getBlock();
        if (_key!=null){
            if (!_u._$isArray(_key)){
                var _arr = [];
                _u._$forEach(
                    _map[_key],function(_id){
                        var _item = this._$get(_id);
                        if (!!_item) _arr.push(_item);
                    },this
                );
                this.__setDataInStorage(
                    this.__prefix+_key,_arr
                );
            }else{
                _u._$forEach(_key,this.__doFlushBlock,this);
            }
            return;
        }
        // flush all blocks
        _u._$forIn(_map,function(_list,_key){
            this.__doFlushBlock(_key);
        },this);
    };
    /**
     * 取单项数据或者列表数据
     * 
     * @method module:util/cache/manager._$$StorageManager#_$get
     * @param  {String|Array} arg0 - 项标识列表
     * @return {Object|Array}        项数据列表
     */
    _pro._$get = function(_id){
        // dump item
        if (!_u._$isArray(_id)){
            var _map = this.__getData();
            // try to fetch from storage
            if (!_map[_id]){
                // 1 - check index
                var _index = this.__getIndex(),
                    _conf = _index[_id];
                if (!_conf||_conf.block==null) return;
                // 2 - check block loaded
                var _bidx = _conf.block,
                    _block = this.__getBlock();
                if (!!_block[_bidx]) return;
                // 3 - load data from storage
                this.__doLoadBlock(_bidx);
            }
            return _map[_id];
        }
        // dump list
        var _arr = [];
        _u._$forEach(_id,function(_tid){
            _arr.push(this._$get(_tid));
        },this);
        return _arr;
    };
    /**
     * 添加数据
     *
     * @method module:util/cache/manager._$$StorageManager#_$add
     * @param  {Object|Array} arg0 - 单个数据或列表
     * @return {Void}
     */
    _pro._$add = (function(){
        var _batch;
        return function(_data){
            var _bidx;
            if (!_u._$isArray(_data)){
                var _id = _data[this.__pkey],
                    _item = this._$get(_id),
                    _index = this.__getIndex();
                // add ref and update data if exist
                if (!!_item){
                    var _conf = _index[_id],
                        _ref = _conf.ref;
                    _conf.ref = !_ref?1:(_ref+1);
                    this._$update(_data);
                    this.__doFlushIndex();
                    return;
                }
                // add to cache
                this.__getData()[_id] = _data;
                _bidx = this.__getBlockIndex();
                var _list = this.__getBlock()[_bidx];
                if (_u._$indexOf(_list,_id)<0){
                    _list.push(_id);
                }
                _index[_id] = {ref:1,block:_bidx};
            }else{
                _batch = [];
                _u._$forEach(_data,this._$add,this);
                _bidx = _batch;
                _batch = null;
            }
            if (!!_batch){
                if (_u._$indexOf(_batch,_bidx)<0){
                    _batch.push(_bidx);
                }
                return;
            }
            // flush to storage
            this.__doFlushIndex();
            this.__doFlushBlock(_bidx);
        };
    })();
    /**
     * 删除数据
     * 
     * @method module:util/cache/manager._$$StorageManager#_$delete
     * @param  {String|Array} arg0 - 数据标识列表
     * @return {Void}
     */
    _pro._$delete = (function(){
        var _batch;
        return function(_id){
            if (!_u._$isArray(_id)){
                // check data
                var _data = this._$get(_id);
                if (!_data) return;
                // check data index
                var _index = this.__getIndex(),
                    _conf = _index[_id]||_o;
                if (_conf.ref>1){
                    // check ref
                    _conf.ref--;
                }else{
                    // remove data from block list
                    delete _index[_id];
                    var _bidx = _conf.block,
                        _list = this.__getBlock()[_bidx],
                        _idx = _u._$indexOf(_list,_id);
                    if (_idx>=0){
                        _list.splice(_idx,1);
                        if (!_batch){
                            this.__doFlushBlock(_bidx);
                        }else if(_u._$indexOf(_batch,_bidx)<0){
                            _batch.push(_bidx);
                        }
                    }
                }

            }else{
                _batch = [];
                _u._$forEach(_id,this._$delete,this);
                this.__doFlushBlock(_batch);
                _batch = null;
            }
            if (!!_batch) return;
            // flush to storage
            this.__doFlushIndex();
        };
    })();
    /**
     * 更新数据
     * 
     * @method module:util/cache/manager._$$StorageManager#_$update
     * @param  {Object} arg0 - 数据对象
     * @return {Void}
     */
    _pro._$update = function(_data){
        var _id = _data[this.__pkey],
            _item = this._$get(_id);
        // add item
        if (!_item){
            this._$add(_item);
            return;
        }
        // update item in cache
        var _changed = !1;
        NEJ.X(_item,_data,function(_value,_key){
            _changed = _changed||(_value!==_item[_key]);
        });
        if (!_changed) return;
        // flush block
        var _index = this.__getIndex(),
            _conf = _index[_id]||_o,
            _bidx = _conf.block;
        if (_bidx!=null){
            this.__doFlushBlock(_bidx);
        }
    };
    /**
     * 迁移数据集，如果是数据列表直接使用_$add方法，
     * 如果数据可能存在重复迁移则建议迁移后使用_$syncRef同步引用计数
     * 
     * @method module:util/cache/manager._$$StorageManager#_$migrate
     * @param  {Object} arg0 - 数据集
     * @return {Void}
     */
    _pro._$migrate = function(_hash){
        var _arr = [];
        _u._$forIn(_hash,function(_item){
            _arr.push(_item);
        });
        this._$add(_arr);
    };
    /**
     * 同步引用计数
     * 
     * @method module:util/cache/manager._$$StorageManager#_$syncRef
     * @param  {Object} arg0 - ID对应的引用计数信息,{id:2}
     * @return {Void}
     */
    _pro._$syncRef = function(_map){
        var _index = this.__getIndex();
        _u._$forIn(
            _map,function(_ref,_id){
                var _conf = _index[_id]||{};
                _conf.ref = _ref;
                _index[_id] = _conf;
            },this
        );
        this.__doFlushIndex();
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});