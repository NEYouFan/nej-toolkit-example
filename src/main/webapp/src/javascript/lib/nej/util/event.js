/*
 * ------------------------------------------
 * @file     控件基类
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/event */
NEJ.define([
    'base/global',
    'base/klass',
    'base/event',
    'base/util'
],function(NEJ,_k,_v,_u,_p,_o,_f,_r){
    var _pro;
    /**
     * 控件基类，主要实现以下功能：
     * * 对事件驱动编程模型的支持
     * * 对控件通用行为及业务逻辑的抽象
     * 
     * ```javascript
     *   NEJ.define([
     *       'base/klass',
     *       'util/event'
     *   ],function(_k,_t,_p,_o,_f,_r){
     *       // 自定义一个控件及使用、回收的流程
     *       var _pro;
     *   
     *       // 第一步
     *       // 定义控件类，从父类继承
     *       _p._$$Widget = _k._$klass();
     *       _pro = _p._$$Widget._$extend(_t._$$EventTarget);
     *   
     *       // 第二步
     *       // 重写控件初始化业务逻辑
     *       _pro.__init = function(_options){
     *           // _options - 配置参数信息
     *           //            初始化时一般不对该参数做处理
     *           // 调用父类初始化业务逻辑
     *           this.__super(_options);
     *           // TODO something
     *       };
     *   
     *       // 第三步
     *       // 重写控件重置业务逻辑
     *       _pro.__reset = function(_options){
     *           // _options - 配置参数信息
     *           //            此处重置控件配置信息
     *           // 调用父类重置业务逻辑
     *           this.__super(_options);
     *           // TODO something
     *       };
     *   
     *       // 第四步
     *       // 重写控件回收业务逻辑
     *       _pro.__destroy = function __destroy(){
     *           // 调用父类回收业务逻辑
     *           this.__super();
     *           // TODO something
     *       };
     *   
     *       // 第五步
     *       // 使用控件
     *       var _widget = _p._$$Widget._$allocate({
     *           a:'aaaaaaaaaaa',
     *           b:'bbbbbbbbbbbbb',
     *           c:'ccccccccccccccc'
     *       });
     *   
     *       // 第六步
     *       // 回收控件
     *       _widget = _widget._$recycle();
     *       // 也可以使用以下方式回收，建议使用上面的回收方式
     *       _widget = _p._$$Widget._$recycle(_widget);
     *   });
     * ```
     * 
     * @class module:util/event._$$EventTarget
     * @param {Object} config - 配置参数，根据控件实际情况提供配置参数支持
     */
    /** 
     * 控件回收前触发事件，控件在具体实现时如需触发回收前的事件
     * 
     * ```javascript
     *   // 重写控件回收业务逻辑触发onbeforerecycle事件
     *   _pro.__destroy = function(){
     *       this._$dispatchEvent('onbeforerecycle');
     *       // 调用父类回收业务逻辑
     *       this.__super();
     *       // TODO something
     *   };
     * 
     *   // 监测onbeforerecycle事件
     *   var _widget = _p._$$Widget._$allocate({
     *       onbeforerecycle:function(_event){
     *           // TODO something
     *       }
     *   });
     * ```
     * 
     * @event module:util/event._$$EventTarget#onbeforerecycle
     * @param {Object} event - 事件触发信息
     */
    /**
     * 控件回收后触发事件，控件在具体实现时如需触发回收后的事件
     * 
     * ```javascript
     *   // 重写控件回收业务逻辑触发onbeforerecycle事件
     *   _pro.__destroy = function(){
     *       // 调用父类回收业务逻辑
     *       this.__super();
     *       // TODO something
     *       this._$dispatchEvent('onaftercycle');
     *   };
     *   
     *   // 监测onaftercycle事件
     *   var _widget = _p._$$Widget._$allocate({
     *       onaftercycle:function(_event){
     *           // TODO something
     *       }
     *   });
     * ```
     * 
     * @event module:util/event._$$EventTarget#onaftercycle
     * @param {Object} event - 事件触发信息
     */
    _p._$$EventTarget = _k._$klass();
    _pro = _p._$$EventTarget.prototype;
    /**
     * 控件分配，NEJ框架提供的所有控件统一使用分配和回收机制，
     * 分配空间时会优先考虑使用前面回收的同种控件，只有在没有可用控件的情况下才会实例化新的控件
     * 
     * ```javascript
     *   // 分配一个控件
     *   var _widget = _p._$$Widget._$allocate({
     *       conf0:'aaaaaaa',
     *       conf1:'bbbbbbbbbbbbb',
     *       onxxx:function(){
     *           // TODO something
     *       }
     *   });
     * ```
     * 
     * @method module:util/event._$$EventTarget._$allocate
     * @see    module:util/event._$$EventTarget._$getInstance
     * @see    module:util/event._$$EventTarget._$getInstanceWithReset
     * @param  {Object}  arg0 - 配置参数，根据控件实际情况提供配置参数支持
     * @return {module:util/event._$$EventTarget} 控件实例
     */
    _p._$$EventTarget._$allocate = function(_options){
        _options = _options||{};
        var _instance = !!this.__pool
                        &&this.__pool.shift();
        if (!_instance){
            _instance = new this(_options);
            this.__inst__ = (this.__inst__||0)+1;
        }
        // reset instance, flag first
        _instance.__reset(_options);
        return _instance;
    };
    /**
     * 控件回收，NEJ框架提供的所有控件统一使用分配和回收机制，
     * 如果提供的实例非当前类的实例则自动调整为输入实例的类来回收此实例
     * 
     * ```javascript
     *   // 回收前面分配的实例有两种方式
     *   // 如果不能确定实例的构造类，则可以直接使用实例的回收接口
     *   _widget._$recycle();
     *   // 如果可以确定实例的构造类，则可以使用构造类的静态回收接口
     *   _p._$$Widget._$recycle(_widget);
     *   // 如果回收多个实例则使用构造类的静态回收接口
     *   _p._$$Widget._$recycle([_widget0,_widget1]);
     * ```
     * 
     * @method module:util/event._$$EventTarget._$recycle
     * @param  {module:util/event._$$EventTarget|module:util/event._$$EventTarget[]} arg0 - 待回收实例或者实例列表
     * @return {Void}
     */
    _p._$$EventTarget._$recycle = (function(){
        var _doRecycle = function(_item,_index,_list){
            _item._$recycle();
            _list.splice(_index,1);
        };
        return function(_instance){
            if (!_instance) return null;
            if (!_u._$isArray(_instance)){
                // instance is not instanceof class
                if (!(_instance instanceof this)){
                    // use constructor recycle instance
                    var _class = _instance.constructor;
                    if (!!_class._$recycle){
                        _class._$recycle(_instance);
                    }
                    return null;
                }
                // delete singleton instance
                if (_instance==this.__instance){
                    delete this.__instance;
                }
                if (_instance==this.__inctanse){
                    delete this.__inctanse;
                }
                // do recycle
                _instance.__destroy();
                // recycle instance
                if (!this.__pool){
                    this.__pool = [];
                } 
                if (_u._$indexOf(this.__pool,_instance)<0){
                    this.__pool.push(_instance);
                }
                return null;
            }
            // recycle instance array
            _u._$reverseEach(_instance,_doRecycle,this);
        };
    })();
    /**
     * 取控件实例（单例），如果控件指明了为单例模式，
     * 则项目中使用该控件时统一使用此接口获取控件实例，使用方式同_$allocate
     * 
     * ```javascript
     *   // 取控件单例，确保在第一次取单例时输入所有配置参数
     *   var _widget = _p._$$Widget._$getInstance({
     *       conf0:'aaaaaaa',
     *       conf1:'bbbbbbbbbbbbb',
     *       onxxx:function(){
     *           // TODO something
     *       }
     *   });
     *   
     *   // 后续取单例忽略配置参数
     *   var _widget1 = _p._$$Widget._$getInstance({
     *       conf0:'bbbbb'  // <-- 如果单例已生成，则这里的配置信息不会生效
     *   });
     * 
     *   // 等价于如下调用
     *   var _widget2 = _p._$$Widget._$getInstance();
     * ```
     * 
     * @method module:util/event._$$EventTarget._$getInstance
     * @see    module:util/event._$$EventTarget._$getInstanceWithReset
     * @see    module:util/event._$$EventTarget._$allocate
     * @param  {Object}  arg0 - 配置参数，根据控件实际情况提供配置参数支持
     * @return {module:util/event._$$EventTarget} 控件实例
     */
    _p._$$EventTarget._$getInstance = function(_options){
        if (!this.__instance){
            this.__instance = this._$allocate(_options);
        }
        return this.__instance;
    };
    /**
     * 取控件实例（单例），如果控件指明了为单例模式，
     * 则项目中使用该控件时统一使用此接口获取控件实例，使用方式同_$getInstance，
     * 该接口同_$getInstance接口的主要区别在于输入的配置参数是否在每次调用接口时都重置
     * 
     * ```javascript
     *   // 取控件单例，确保在第一次取单例时输入所有配置参数
     *   var _widget = _p._$$Widget._$getInstanceWithReset({
     *       conf0:'aaaaaaa',
     *       conf1:'bbbbbbbbbbbbb',
     *       onxxx:function(){
     *           // TODO something
     *       }
     *   });
     *   
     *   // 后续取单例使用新的配置参数
     *   var _widget1 = _p._$$Widget._$getInstanceWithReset({
     *       conf0:'bbbbb'  // <-- 如果单例已生成，则重置这里的配置信息
     *   });
     * ```
     * 
     * @method module:util/event._$$EventTarget._$getInstanceWithReset
     * @see    module:util/event._$$EventTarget._$getInstance
     * @see    module:util/event._$$EventTarget._$allocate
     * @param  {Object}  arg0 - 配置参数，根据控件实际情况提供配置参数支持
     * @param  {Boolean} arg1 - 是否需要先清理已有实例
     * @return {module:util/event._$$EventTarget} 控件实例
     */
    _p._$$EventTarget._$getInstanceWithReset = function(_options,_clear){
        // clear instance
        if (!!_clear&&!!this.__inctanse){
            this.__inctanse._$recycle();
            delete this.__inctanse;
        }
        // allocate instance
        if (!this.__inctanse){
            this.__inctanse = this._$allocate(_options);
        }else{
            this.__inctanse.__reset(_options);
        }
        return this.__inctanse;
    };
    /**
     * 控件初始化，
     * 子类可重写此接口业务逻辑，
     * 子类可通过调用__super接口调用父类的初始化业务逻辑
     * 
     * ```javascript
     *   // 子类控件初始化业务逻辑
     *   _pro.__init = function(){
     *       // 调用父类控件初始化
     *       this.__super();
     *       // TODO something
     *   };
     * ```
     * 
     * @protected
     * @method module:util/event._$$EventTarget#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__events = {};
        this.__events_dom = {};
        this.id = _u._$uniqueID();
    };
    /**
     * 控件重置，此接口用来接收控件配置参数的处理，
     * 控件基类已处理以下业务逻辑：
     * 
     * * 缓存通过配置参数输入的回调事件
     * 
     * 子类重写此接口业务逻辑来处理具体控件对配置参数的处理，
     * 子类通过调用__super接口调用父类的重置业务逻辑
     * 
     * ```javascript
     *   // 子类控件重置业务逻辑
     *   _pro.__reset = function(_options){
     *       // 调用父类控件重置逻辑
     *       this.__super(_options);
     *       // TODO something
     *   };
     * ```
     * 
     * @protected
     * @method module:util/event._$$EventTarget#__reset
     * @param  {Object} arg0 - 配置参数，根据控件实际情况提供配置参数支持
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this._$batEvent(_options);
    };
    /**
     * 控件销毁，当控件在回收时会调用此接口，基类已处理以下业务逻辑：
     * 
     * * 通过配置参数输入的事件回调的清理
     * * 通过__doInitDomEvent接口添加的DOM事件的清理
     * 
     * 一般情况下控件还需回收通过重置接口__reset产生的数据，
     * 子类可重写此接口业务逻辑来触发onbeforerecycle和onafterrecycle事件，
     * 子类可通过调用__super接口调用父类的销毁业务逻辑
     * 
     * ```javascript
     *   // 子类重写控件销毁逻辑
     *   _pro.__destroy = function(){
     *       // 触发回收之前事件
     *       this._$dispatchEvent('onbeforerecycle');
     *       // 调用父类清理逻辑，如果有触发回收之后事件则以下业务逻辑需在触发回收之后事件后面调用
     *       //this.__super();
     *       // 清理本控件的数据
     *       delete this.__conf0;
     *       this.__widget2 = this.__widget2._$recycle();
     *       // 触发回收之后事件，确保在onafterrecycle事件被清理前触发
     *       this._$dispatchEvent('onafterrecycle');
     *       this.__super();
     *   };
     * ```
     * 
     * @protected
     * @method module:util/event._$$EventTarget#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this._$clearEvent();
        this.__doClearDomEvent();
    };
    /**
     * 初始化事件，
     * 重置接口__reset中需要通过_$addEvent接口添加的事件，
     * 使用此接口添加可以在回收时自动被清理
     * 
     * ```javascript
     *   // 子类重置接口添加节点事件
     *   _pro.__reset = function(_options){
     *       this.__super(_options);
     *       // 添加DOM事件或者自定义事件
     *       this.__doInitDomEvent([
     *           [document,'click',this.__onDocClick._$bind(this)],
     *           [window,'ok',this.__onWindowOK._$bind(this)]
     *       ]);
     *   };
     * ```
     * 
     * @protected
     * @method module:util/event._$$EventTarget#__doInitDomEvent
     * @see    module:util/event._$$EventTarget#__doClearDomEvent
     * @param  {Array} arg0 - 待添加的事件配置列表 
     * @return {Void}
     */
    _pro.__doInitDomEvent = (function(){
        var _doAttach = function(_args){
            if (!_args||_args.length<3) return;
            this.__events_dom['de-'+_u._$uniqueID()] = _args;
            _v._$addEvent.apply(_v,_args);
        };
        return function(_list){
            _u._$forEach(_list,_doAttach,this);
        };
    })();
    /**
     * 清除DOM事件，_$recycle接口会自动调用来清理这种DOM事件
     * 
     * ```javascript
     *   // 子类重置接口清理节点事件
     *   _pro.__destroy = function(_options){
     *       this.__doClearDomEvent();
     *       this.__super(_options);
     *   };
     * ```
     * 
     * @protected
     * @method module:util/event._$$EventTarget#__doClearDomEvent
     * @see    module:util/event._$$EventTarget#__doInitDomEvent
     * @return {Void}
     */
    _pro.__doClearDomEvent = (function(){
        var _doRemoveEvent = function(_args,_key,_map){
            delete _map[_key];
            _v._$delEvent.apply(_v,_args);
        };
        return function(){
            _u._$loop(this.__events_dom,_doRemoveEvent);
        };
    })();
    /**
     * 清理所有组合的控件
     * 
     * ```javascript
     *   // 子类重置接口清理组件
     *   _pro.__destroy = function(_options){
     *       this.__doClearComponent(function(_inst){
     *           // 不回收_p._$$Widget2控件实例
     *           return _inst instanceof _p._$$Widget2;
     *       });
     *       this.__super(_options);
     *   };
     * ```
     * 
     * @protected
     * @method module:util/event._$$EventTarget#__doClearComponent
     * @param  {Function} arg0 - 过滤接口，返回true表示不清理该控件
     * @return {Void}
     */
    _pro.__doClearComponent = function(_filter){
        _filter = _filter||_f;
        _u._$loop(this,function(_inst,_key,_map){
            if (!!_inst&&!!_inst._$recycle&&!_filter(_inst)){
                delete _map[_key];
                _inst._$recycle();
            }
        });
    };
    /**
     * 回收控件，通过实例的构造类来回收当前实例
     * 
     * ```javascript
     *   // 通过实例的接口回收当前实例
     *   _widget._$recycle();
     * ```
     * 
     * @method module:util/event._$$EventTarget#_$recycle
     * @see    module:util/event._$$EventTarget#_$allocate
     * @return {Void}
     */
    _pro._$recycle = function(){
        this.constructor._$recycle(this);
    };
    /**
     * 判断是否有注册事件回调
     * 
     * ```javascript
     *   // 分配实例
     *   var _widget = _p._$$Widget._$allocate({
     *       onok:function(){
     *           // TODO
     *       }
     *   });
     *   // 判断控件实例是否注册有onok事件回调
     *   _widget._$hasEvent('onok');
     * ```
     * 
     * @method module:util/event._$$EventTarget#_$hasEvent
     * @param  {String} arg0 - 事件类型
     * @return {Boolean}       是否注册了事件回调
     */
    _pro._$hasEvent = function(_type){
        var _type = (_type||'').toLowerCase(),
            _event = this.__events[_type];
        return !!_event&&_event!==_f;
    };
    /**
     * 删除单个事件回调
     * 
     * ```javascript
     *   var _handler = function(){
     *       // TODO
     *   };
     *   // 分配实例
     *   var _widget = _p._$$Widget._$allocate({
     *       onok:_handler
     *   });
     *   // 删除onok事件回调
     *   _widget._$delEvent('onok',_handler);
     * ```
     * 
     * @method module:util/event._$$EventTarget#_$delEvent
     * @param  {String}   arg0 - 事件类型
     * @param  {Function} arg1 - 事件处理函数
     * @return {Void}
     */
    _pro._$delEvent = function(_type,_event){
        var _type = (_type||'').toLowerCase(),
            _events = this.__events[_type];
        if (!_u._$isArray(_events)){
            if (_events==_event){
                delete this.__events[_type];
            }
            return;
        }
        // batch remove
        _u._$reverseEach(
            _events,function(_func,_index,_list){
                if (_func==_event){
                    _list.splice(_index,1);
                }
            }
        );
        if (!_events.length){
            delete this.__events[_type];
        }
    };
    /**
     * 重置事件，覆盖原有事件
     * 
     * ```javascript
     *   // 分配实例
     *   var _widget = _p._$$Widget._$allocate();
     *   // 设置控件事件回调
     *   _widget._$setEvent('onok',function(){
     *       // TODO something
     *   });
     *   _widget._$setEvent('oncancel',function(){
     *       // TODO something
     *   });
     * ```
     * 
     * @method module:util/event._$$EventTarget#_$setEvent
     * @param  {String}   arg0 - 事件类型，大小写不敏感
     * @param  {Function} arg1 - 事件处理函数
     * @return {Void}
     */
    _pro._$setEvent = function(_type,_event){
        if (!!_type&&_u._$isFunction(_event)){
            this.__events[_type.toLowerCase()] = _event;
        }
    };
    /**
     * 批量添加事件
     * 
     * ```javascript
     *   // 分配实例
     *   var _widget = _p._$$Widget._$allocate();
     *   // 批量设置控件事件回调
     *   _widget._$batEvent({
     *       onok:function(){
     *           // TODO something
     *       },
     *       oncancel:function(){
     *           // TODO something
     *       }
     *   });
     * ```
     * 
     * @method module:util/event._$$EventTarget#_$batEvent
     * @see    module:util/event._$$EventTarget#_$setEvent
     * @param  {Object} arg0 - 事件集合,{type:function}
     * @return {Void}
     */
    _pro._$batEvent = (function(){
        var _doSetEvent = function(_event,_type){
            this._$setEvent(_type,_event);
        };
        return function(_events){
            _u._$loop(_events,_doSetEvent,this);
        };
    })();
    /**
     * 清除事件，没有指定类型则清除所有事件
     * 
     * ```javascript
     *   // 分配实例
     *   var _widget = _p._$$Widget._$allocate({
     *       onok:function(){
     *           // TODO something
     *       }
     *   });
     *   // 清除onok事件回调
     *   _widget._$clearEvent('onok');
     *   // 清除所有时间回调
     *   _widget._$clearEvent();
     * ```
     * 
     * @method module:util/event._$$EventTarget#_$clearEvent
     * @param  {String} arg0 - 事件类型
     * @return {Void}
     */
    _pro._$clearEvent = (function(){
        var _doClearEvent = function(_event,_type){
            this._$clearEvent(_type);
        };
        return function(_type){
            var _type = (_type||'').toLowerCase();
            if (!!_type){
                delete this.__events[_type];
            }else{
                _u._$loop(this.__events,_doClearEvent,this);
            }
        };
    })();
    /**
     * 追加事件，通过此接口可以对同一个事件添加多个回调函数
     * 
     * ```javascript
     *   // 分配实例
     *   var _widget = _p._$$Widget._$allocate({
     *       onok:function(){
     *           // TODO something
     *       }
     *   });
     *   // 追加事件回调
     *   _widget._$addEvent({
     *       onok:function(){
     *           // TODO something
     *       }
     *   });
     * ```
     * 
     * @method module:util/event._$$EventTarget#_$addEvent
     * @param  {String}   arg0 - 事件类型
     * @param  {Function} arg1 - 事件处理函数
     * @return {Void}
     */
    _pro._$addEvent = function(_type,_event){
        // check type and event
        if (!_type||!_u._$isFunction(_event)){
            return;
        }
        // cache event
        _type = _type.toLowerCase();
        var _events = this.__events[_type];
        if (!_events){
            this.__events[_type] = _event;
            return;
        }
        if (!_u._$isArray(_events)){
            this.__events[_type] = [_events];
        }
        this.__events[_type].push(_event);
    };
    /**
     * 调用事件，一般在控件实现的具体业务逻辑中使用
     * 
     * ```javascript
     *   // 分配实例
     *   var _widget = _p._$$Widget._$allocate({
     *       onok:function(){
     *           // TODO something
     *       }
     *   });
     *   // 触发控件onok事件
     *   _widget._$dispatchEvent('onok');
     *   
     *   // 在控件实现的业务逻辑中使用
     *   _pro.__doSomething = function(){
     *       // TODO something
     *       // 触发onok事件
     *       this._$dispatchEvent('onok');
     *   };
     * ```
     * 
     * @method module:util/event._$$EventTarget#_$dispatchEvent
     * @param  {String}   arg0 - 事件类型，不区分大小写
     * @param  {Variable} arg1 - 事件可接受参数，具体看调用时的业务逻辑
     * @return {Void}
     */
    _pro._$dispatchEvent = function(_type){
        var _type = (_type||'').toLowerCase(),
            _event = this.__events[_type];
        if (!_event) return;
        var _args = _r.slice.call(arguments,1);
        // single event
        if (!_u._$isArray(_event)){
            _event.apply(this,_args);
            return;
        }
        // event list
        _u._$forEach(
            _event,function(_handler){
                if (DEBUG){
                    _handler.apply(this,_args);
                }else{
                    try{
                        _handler.apply(this,_args);
                    }catch(ex){
                        // ignore
                        console.error(ex.message);
                        console.error(ex.stack);
                    }
                }
            },this
        );
    };
    
    if (CMPT){
        _p._$$Event = _p._$$EventTarget;
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }
    
    return _p;
});
