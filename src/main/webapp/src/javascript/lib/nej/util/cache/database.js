/*
 * ------------------------------------------
 * IndexedDB数据库管理器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module  util/cache/database */
NEJ.define([
    'base/global',
    'base/klass',
    'base/util',
    'util/event',
    'base/chain'
],function(NEJ,_k,_u,_t,_x,_p,_o,_f,_r){
    var _pro;
    /**
     * IndexedDB数据库管理器
     *
     * 代码举例：
     * ```javascript
     * NEJ.define([
     *     'util/cache/database'
     * ],function(_t){
     *     // 使用控件取数据
     *     var _db = _t._$$DataBase._$allocate({
     *         namespace:'music.track'
     *     });
     *     _db._$get([1,2,3],{
     *         onload:function(_result){
     *             // result ->
     *             // [{id:1,...},{id:2,...},{id:3,...}]
     *         }
     *     });
     *
     *     // 使用API取数据
     *     _t._$requestByDB({
     *         namespace:'music.track',
     *         action:'get',
     *         param:[1,2,3],
     *         onload:function(_result){
     *             // result ->
     *             // [{id:1,...},{id:2,...},{id:3,...}]
     *         }
     *     });
     * });
     * ```
     *
     * @class    module:util/cache/database._$$DataBase
     * @extends  module:util/event._$$EventTarget
     *
     * @param    {Object} config    - 配置参数
     * @property {String} namespace - 名字空间，默认随机生成，格式[DB].[TB]，如 music.track
     * @property {Number} version   - 版本信息，默认使用时间戳作为版本，必须确保在新的namespace下给的version是递增的
     * @property {String} key       - 标识字段名，默认为id
     */
    /**
     * 数据库准备完成回调
     *
     * @event    module:util/cache/database._$$DataBase#onready
     * @param    {Object}                                 event  - 数据库信息
     * @property {module:util/cache/database._$$DataBase} target - 数据库实例
     */
    /**
     * 数据库操作失败回调
     *
     * @event    module:util/cache/database._$$DataBase#onerror
     * @param    {Object} event   - 错误信息
     * @property {Number} code    - 错误代码
     * @property {String} message - 错误描述
     */
    _p._$$DataBase = _k._$klass();
    _pro = _p._$$DataBase._$extend(_t._$$EventTarget);
    /**
     * 控件重置
     *
     * @protected
     * @method module:util/cache/database._$$DataBase#__reset
     * @param  {Object} arg0 - 配置参数
     * @return {Void}
     */
    _pro.__reset = (function(){
        var _doUpgrade = function(_event){
            //console.log('Upgrade -> '+this.__tbname);
            var _db = _event.target.result;
            this.__database = _db;
            var _index = _u._$indexOf(
                _db.objectStoreNames,
                this.__tbname
            );
            if (_index>=0) return;
            _db.createObjectStore(
                this.__tbname,
                {keyPath:this.__key}
            );
        };
        var _doDBOpened = function(_event){
            //console.log('Success -> '+this.__tbname);
            this.__database = _event.target.result;
            this._$dispatchEvent('onready',{target:this});
            // flush action queue
            _u._$forEach(
                this.__queue,function(_handler){
                    _handler.call(this);
                },this
            );
            delete this.__queue;
        };
        return function(_options){
            this.__super(_options);
            var _arr = (_options.namespace||'').split('.'),
                _dbname = _arr[0]||('db-'+_u._$uniqueID());
            this.__tbname = _arr[1]||('tb-'+_u._$uniqueID());
            this.__key = _options.key||'id';
            // open database
            var _request = indexedDB.open(
                _dbname,_options.version||_u._$uniqueID()
            );
            _request.onsuccess = _doDBOpened._$bind(this);
            _request.onupgradeneeded = _doUpgrade._$bind(this);
        };
    })();
    /**
     * 控件回收
     *
     * @protected
     * @method module:util/cache/database._$$DataBase#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        delete this.__dbname;
        delete this.__tbname;
        delete this.__queue;
        delete this.__key;
        if (!!this.__database){
            this.__database.close();
            delete this.__database;
        }
    };
    /**
     * 判断数据库是否已经准备好
     *
     * @protected
     * @method module:util/cache/database._$$DataBase#__isDBReady
     * @return {Boolean} 是否已经准备好
     */
    _pro.__isDBReady = function(_method,_args){
        if (!this.__database){
            if (!this.__queue)  this.__queue = [];
            var _argc = _r.slice.call(_args,0)||[];
            _argc.unshift(this);
            this.__queue.push(
                _method._$bind.apply(_method,_argc)
            );
            return !1;
        }
        return !0;
    };
    /**
     * 取存储操作对象
     *
     * @protected
     * @method module:util/cache/database._$$DataBase#__getTransaction
     * @param  {Object}  arg0 - 配置信息
     * @return {IDBObjectStore} 存储操作对象
     */
    _pro.__getTransaction = function(_options){
        _options = _options||_o;
        var _tx = this.__database.transaction(
            this.__tbname,
            _options.mode||'readwrite'
        );
        _u._$loop(
            _options,function(_func,_key){
                if (_u._$isFunction(_func)){
                    _tx[_key] = _func;
                }
            },this
        );
        return _tx.objectStore(this.__tbname);
    };
    /**
     * 执行某个操作
     *
     * @protected
     * @method   module:util/cache/database._$$DataBase#__doAction
     * @param    {String}       arg0    - 操作名称，如put/delete
     * @param    {Object|Array} arg1    - 操作的数据信息
     * @property {Function}     onload  - 成功回调
     * @property {Function}     onerror - 失败回调，输入结构{code:xxx,message:'xxxx'}
     * @return   {Void}
     */
    _pro.__doAction = function(_action,_hash,_options){
        var _ready = this.__isDBReady(
            this.__doAction,arguments
        );
        if (!_ready) return;
        // insert records
        _options = _options||_o;
        var _error;
        var _tx = this.__getTransaction({
            oncomplete:function(_event){
                if (!_error){
                    (_options.onload||_f)();
                }else{
                    (_options.onerror||_f)(_error);
                }
            },
            onerror:function(_event){
                // rollback
                _error = _event.target.error;
                _event.preventDefault();
            }
        });
        _u._$loop(_hash,function(_item){
            if (_item!=null){
                //console.log('do '+_action+' -> '+_item);
                _tx[_action](_item);
            }
        });
    };
    /**
     * 异步取指定键的数据信息
     *
     * 脚本举例
     * ```javascript
     * // 取单个数据对象
     * _db._$get('1234568',{
     *     onload:function(_data){
     *         // 数据对象
     *     },
     *     onerror:function(_error){
     *         // _error.code
     *         // _error.message
     *     }
     * });
     *
     * // 取一批数据，以Map形式返回结果
     * _db._$get({'123':null,'234':null,...},{
     *     onload:function(_map){
     *         // _map ->
     *         // {'123':{...},'234':{...}}
     *     },
     *     onerror:function(_error){
     *         // 同上
     *     }
     * });
     *
     * // 取一批数据，以数组形式返回结果
     * _db._$get(['123','234',...]},{
     *     onload:function(_result){
     *         // _result ->
     *         // [{...},{...},{...}]
     *     },
     *     onerror:function(_error){
     *         // 同上
     *     }
     * });
     * ```
     *
     * @method   module:util/cache/database._$$DataBase#_$get
     * @param    {String|Object|Array} arg0   - 指定数据的键
     * @param    {Object}              arg1   - 其他配置信息
     * @property {Function}            onload - 成功获取回调，输入集合类型同传入参数类型一致
     * @return   {Void}
     */
    _pro._$get = (function(){
        var _doLoadBatchData = function(_store,_map,_onload){
            var _count = 0;
            _u._$loop(
                _map,function(_value,_key){
                    _count++;
                    _doLoadData(
                        _store,_key,
                        function(_data,_key){
                            _count--;
                            _map[_key] = _data;
                            if (!_count){
                                _onload(_map);
                            }
                        }
                    );
                }
            );
            if (!_count){
                _onload(_map);
            }
        };
        var _doLoadData = function(_store,_key,_onload){
            var _req = _store.get(_key);
            _req.onsuccess = function(_event){
                _onload(_event.target.result||null,_key);
            };
            _req.onerror = function(_event){
                _onload(null,_key);
            };
        };
        return function(_keys,_options){
            var _ready = this.__isDBReady(
                this._$get,arguments
            );
            if (!_ready) return;
            // do get
            var _store = this.__getTransaction(_options),
                _onload = (_options||_o).onload||_f;
            if (_u._$isArray(_keys)){
                var _map = _u._$array2object(_keys);
                _doLoadBatchData(_store,_map,function(_map){
                    var _arr = [];
                    _u._$forEach(_keys,function(_value,_index){
                        _arr[_index] = _map[_value]||null;
                    });
                    _onload(_arr);
                });
            }else if(_u._$isObject(_keys)){
                _doLoadBatchData(_store,_keys,_onload);
            }else{
                _doLoadData(_store,_keys,_onload);
            }
        };
    })();
    /**
     * 添加单条记录，批量添加见_$import接口
     *
     * 脚本举例
     * ```javascript
     * // 添加记录
     * _db._$add({id:'xxxx',name:'yyyyyy',...});
     * ```
     *
     * @method module:util/cache/database._$$DataBase#_$add
     * @param    {Object|Array} arg0    - 数据对象或者列表
     * @param    {Object}       arg1    - 其他配置信息
     * @property {Function}     onload  - 成功回调，输入集合类型同传入参数类型一致
     * @property {Function}     onerror - 失败回调，输入结构{code:xxx,message:'xxxx'}
     * @return   {Void}
     */
    _pro._$add = function(_data,_options){
        this._$update(_data,_options);
    };
    /**
     * 更新数据，如果需要更新的数据是个HASH表，则可以使用_$import接口
     *
     * 脚本举例
     * ```javascript
     * // 更新单条记录
     * _db._$update({id:'xxxx',name:'yyyyyy',...});
     *
     * // 更新一个列表的数据
     * _db._$update([
     *     {id:'1111',name:'xxxx',...},
     *     {id:'2222',name:'ddddd',...},
     *     {id:'3333',name:'ggggggg',...}
     * ]);
     * ```
     *
     * @method   module:util/cache/database._$$DataBase#_$update
     * @param    {Array|Object} arg0    - 数据对象或者数据列表
     * @param    {Object}       arg1    - 其他配置信息
     * @property {Function}     onload  - 成功回调，输入集合类型同传入参数类型一致
     * @property {Function}     onerror - 失败回调，输入结构{code:xxx,message:'xxxx'}
     * @return   {Void}
     */
    _pro._$update = function(_data,_options){
        if (!_u._$isArray(_data)){
            _data = [_data];
        }
        this.__doAction('put',_data,_options);
    };
    /**
     * 批量导入数据
     *
     * 代码举例
     * ```javascript
     * // 数组形式批量添加记录
     * _db._$import([
     *     {id:'1111',name:'yyyyyy',...},
     *     {id:'2222',name:'yyyyyy',...},
     *     {id:'3333',name:'yyyyyy',...}
     * ]);
     *
     * // Hash表形式批量添加记录
     * db._$import({
     *     1111:{id:'1111',name:'yyyyyy',...},
     *     2222:{id:'2222',name:'yyyyyy',...},
     *     3333:{id:'3333',name:'yyyyyy',...}
     * ]});
     * ```
     *
     * @method   module:util/cache/database._$$DataBase#_$import
     * @param    {Array|Object} arg0    - 数据集合或者数据列表
     * @param    {Object}       arg1    - 其他配置信息
     * @property {Function}     onload  - 成功回调，输入集合类型同传入参数类型一致
     * @property {Function}     onerror - 失败回调，输入结构{code:xxx,message:'xxxx'}
     * @return   {Void}
     */
    _pro._$import = function(_hash,_options){
        this.__doAction('put',_hash,_options);
    };
    /**
     * 删除记录
     *
     * 脚本举例
     * ```javascript
     * // 删除单条记录
     * _db._$delete('xxxx');
     *
     * // 批量删除数据
     * _db._$delete(['123','234']);
     * ```
     *
     * @method   module:util/cache/database._$$DataBase#_$delete
     * @param    {String|Number|Array} arg0    - 记录标识或者列表
     * @param    {Object}              arg1    - 其他配置信息
     * @property {Function}            onload  - 成功回调，输入集合类型同传入参数类型一致
     * @property {Function}            onerror - 失败回调，输入结构{code:xxx,message:'xxxx'}
     * @return   {Void}
     */
    _pro._$delete = function(_ids,_options){
        if (!_u._$isArray(_ids)){
            _ids = [_ids];
        }
        this.__doAction('delete',_ids,_options);
    };
    /**
     * 清除表内容
     *
     * 脚本举例
     * ```javascript
     * // 清除表数据
     * _db._$clear();
     * ```
     *
     * @method module:util/cache/database._$$DataBase#_$clear
     * @param    {Object}   arg0    - 其他配置信息
     * @property {Function} onload  - 成功回调
     * @property {Function} onerror - 失败回调，输入结构{code:xxx,message:'xxxx'}
     * @return   {Void}
     */
    _pro._$clear = function(_options){
        // remove all queue action
        delete this.__queue;
        // check ready
        var _ready = this.__isDBReady(
            this._$clear,arguments
        );
        if (!_ready) return;
        // do clear
        _options = _options||_o;
        this.__getTransaction({
            oncomplete:_options.onload,
            onerror:function(_event){
                // rollback
                _event.preventDefault();
                (_options.onerror||_f)(_event.target.error);
            }
        }).clear();
    };
    /**
     * 请求数据库操作，从数据库请求数据
     *
     * 代码举例
     * ```javascript
     * NEJ.define([
     *     'util/cache/database'
     * ],function(_j){
     *     // 取数据
     *     _j._$request({
     *         namespace:'music.track',
     *         action:'get',
     *         param:[1,2,3],
     *         onload:function(_result){
     *             // result ->
     *             // [{id:1,...},{id:2,...},{id:3,...}]
     *         }
     *     });
     * });
     * ```
     *
     * @method   module:util/cache/database._$request
     * @param    {Object}   arg0      - 可配置参数
     * @property {String}   namespace - 名字空间
     * @property {String}   action    - 操作行为，支持get/add/clear/update/import/delete
     * @property {Variable} param     - 根据action参数确定传入的参数
     * @property {Number}   version   - 版本信息，默认使用时间戳作为版本，必须确保在新的名字空间时给的version是递增的
     * @property {String}   key       - 标识字段名，默认为id
     * @property {Function} onload    - 操作完成回调
     * @property {Function} onerror   - 操作失败回调
     * @return   {Void}
     */
    _p._$request = function(_options){
        var _opt = _u._$merge(
            {},_options,function(_value){
                return _u._$isFunction(_value);
            }
        );
        var _handler,
            _onload = _options.onload||_f,
            _onerror = _options.onerror||_f,
            _db = _p._$$DataBase._$allocate(_opt);
        switch(_options.action){
            case 'get'    : _handler = _db._$get;    break;
            case 'add'    : _handler = _db._$add;    break;
            case 'clear'  : _handler = _db._$clear;  break;
            case 'update' : _handler = _db._$update; break;
            case 'import' : _handler = _db._$import; break;
            case 'delete' : _handler = _db._$delete; break;
        }
        if (!_handler) return;
        _handler.call(_db,_options.param,{
            onload:function(_result){
                _db._$recycle();
                _onload(_result);
            },
            onerror:function(_error){
                _db._$recycle();
                _onerror(_error);
            }
        });
    };

    if (CMPT){
        NEJ.P('nej.j')._$requestByDB = _p._$request;
        NEJ.P('nej.ut')._$$DataBase  = _p._$$DataBase;
    }

    return _p;
});
