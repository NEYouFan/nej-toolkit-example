/*
 * ------------------------------------------
 * WEB表单封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/form/form */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/event',
    'base/util',
    'util/event',
    'util/focus/focus',
    'util/counter/counter',
    'util/placeholder/placeholder'
],function(NEJ,_k,_e,_v,_u,_t,_t2,_t0,_t1,_p,_o,_f,_r,_pro){
    /**
     * WEB表单验证封装对象，HTML代码中支持以下属性配置：
     * 
     * | 名称 | 类型 | 说明 |
     * | :--- | :--- | :--- |
     * | data-focus-mode | 0/1                   | 聚焦模式，仅在form节点上设置，见_$focus |
     * | data-focus      | true/false            | 聚焦时检测提示信息，对于需验证的表单控件默认已支持此属性 |
     * | data-auto-focus | true/false            | 自动聚焦项，多个表单项设置了该属性仅第一项有效 |
     * | data-counter    | true/false            | 是否需要显示计数信息，必须同时设置data-max-length或者maxlength |
     * | data-ignore     | true/false            | 临时忽略失去焦点验证，可动态控制验证触发时机 |
     * | data-message    | String                | 验证出错提示信息，多个提示信息可以通过配置或者回调事件定制提示内容 |
     * | data-tip        | String                | 默认提示信息，正常输入状态时的提示信息 |
     * | data-required   | true/false            | 必填项，对于checkbox/radio的required表示必须选中 |
     * | data-type       | url/email/date/number | 输入内容预订类型格式匹配 |
     * | data-time       | String                | 格式：HH:mm:ss.ms，对于data-type为date类型的字段，取出日期值时设定时间为此值 |
     * | data-pattern    | RegExp                | 正则匹配表达式，字符串格式 |
     * | data-min        | String/Number         | 输入值必须大于此设置，适用于number/date型 |
     * | data-max        | String/Number         | 输入值必须小于此设置，适用于number/date型 |
     * | data-format     | String                | 规范date类型的格式，用/或者-来连接日期，用：来连接时间，至少应该有MM/dd/yyyy，默认值为yyyy-MM-dd，适用于date型(yyyy:年，MM:月，dd:日，HH:小时，mm:分钟,ss:秒) |
     * | data-max-length | Number                | 输入长度必须小于此设置，一个中文算两个字符，适用于text/textarea |
     * | data-min-length | Number                | 输入长度必须大于此设置，一个中文算两个字符，适用于text/textarea |
     * | maxlength       | Number                | 输入长度必须小于此设置，一个中文算一个字符，适用于text/textarea |
     * | minlength       | Number                | 输入长度必须大于此设置，一个中文算一个字符，适用于text/textarea |
     *
     * 结构举例
     * ```html
     * <!-- form节点添加data-focus-mode属性 -->
     * <form id="webForm" data-focus-mode="1">
     *   <!-- 必须设置值 -->
     *   <input name="n00" type="text" data-auto-focus="true" data-required="true" data-message="必须输入xxx！" data-tip="这是对xxx的说明！"/>
     *   <select name="n01" data-required="true" data-message="必须选择xxx！">
     *     <option>please select city</option>
     *     <option value="0">Hangzhou</option>
     *     <option value="1">Shanghai</option>
     *   </select>
     *   <input type="checkbox" data-required="true" data-message="必须同意xxx！"/>
     *   <input type="radio" data-required="true" data-message="必须选中xxx！"/>
     *   <!-- 输入URL地址、Email地址、日期、数字 -->
     *   <input name="n10" type="text" data-type="url" data-message="URL地址不合法！"/>
     *   <input name="n11" type="text" data-type="email" data-message="Email地址不合法！"/>
     *   <input name="n12" type="text" data-type="date" data-format="yyyy-MM-dd HH:mm:ss" data-message="日期格式不正确！"/>
     *   <input name="n12" type="text" data-type="number" data-message="只能输入数字！"/>
     *   <!-- 正则匹配输入信息，注意pattern值必须符合正则表达式规则 -->
     *   <input name="n20" type="text" data-pattern="^[\\d]+$" data-message="输入内容必须符合xxx！"/>
     *   <!-- 限制输入长度 -->
     *   <input name="n30" type="text" maxlength="100" data-message="长度超过限制！"/>
     *   <textarea name="n31" maxlength="100" data-message="长度超过限制！"></textarea>
     *   <input name="n32" type="text" data-max-length="100" data-message="长度超过限制！"/>
     *   <textarea name="n33" data-max-length="100" data-message="长度超过限制！"></textarea>
     *   <input name="n34" type="text" minlength="100" data-message="长度必须达到xxx！"/>
     *   <textarea name="n35" minlength="100" data-message="长度必须达到xxx！"></textarea>
     *   <input name="n36" type="text" data-min-length="100" data-message="长度必须达到xxx！"/>
     *   <textarea name="n37" data-min-length="100" data-message="长度必须达到xxx！"></textarea>
     *   <!-- 限制最小值/最大值 -->
     *   <input name="n40" type="text" data-type="number" data-min="10"/>
     *   <input name="n41" type="text" data-type="number" data-max="100"/>
     *   <input name="n42" type="text" data-type="number" data-min="10" data-max="100"/>
     *   <input name="n43" type="text" data-type="date" data-min="2010-08-10"/>
     *   <input name="n44" type="text" data-type="date" data-max="now"/>
     *   <input name="n45" type="text" data-type="date" data-min="now" data-max="2050-10-10"/>
     * </form>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/form/form'
     * ],function(_t){
     *     // 分配表单验证控件实例
     *     var _form = _t._$$WebForm._$allocate({
     *         form:'webForm',
     *         message:{
     *             'password-1':'必须输入密码！',
     *             'password100':'密码强度不够',
     *             'password101':'两次密码不一致',
     *             'pass':'<span class="pass">ok</span>'
     *         }
     *     });
     *    
     *     // 验证表单后提交
     *     if (_form._$checkValidity()){
     *         _form._$submit();
     *     }
     *    
     *     // 或者在验证完表单的配置项后再做表单的其他项验证
     *     if (_form._$checkValidity()){
     *         // TODO other form check
     *         // 验证过程可以调用一下接口显示错误信息
     *         // _form._$showMsgError('n30','invalid message！');
     *         // 验证过程可以调用一下接口显示通过信息
     *         // _form._$showMsgPass('n31','ok！');
     *         _form._$submit();
     *         // 使用ajax请求的话可以通过_form._$data()获取表单信息
     *         doAjaxRequest('/api/form',_form._$data());
     *     }
     *    
     *     // 通过回调自定义提示信息示例代码：
     *     var _form = _t._$$WebForm._$allocate({
     *         form:'webForm',
     *         oninvalid:function(_event){
     *             // check _event.target and _event.code
     *             if (_event.target.name=='password'&&_event.code==-1){
     *                 // 通过设置_event.value设置提示信息
     *                 _event.value = '必须输入密码！';
     *             }
     *             // TODO other check
     *         },
     *         onvalid:function(_event){
     *             // 自定义验证通过提示信息，对应的节点信息_event.target
     *             _event.value = '<span class="pass">pass</span>'
     *         }
     *     });
     *     
     *     // 通过回调自定义验证规则示例代码：
     *     var _form = _t._$$WebForm._$allocate({
     *         form:'webForm',
     *         oncheck:function(_event){
     *             // check _event.target
     *             if (_event.target.name=='password'){
     *                 // 通过_event.value返回验证结果
     *                 // 验证结果必须大于0的值（保留所有小于0的返回值）
     *                 // 也可以返回对象，_event.value = {a:'aaaa',b:'bbbb'}; 
     *                 // 这里的a，b可以在oninvalid时输入的_event中取到
     *                 _event.value = doCheckPassword(_event.target.value); // 100
     *             }
     *             // TODO other check
     *         },
     *         oninvalid:function(_event){
     *             // check _event.target and _event.code
     *             if (_event.target.name=='password'&&_event.code==100){
     *                 // 通过设置_event.value设置提示信息
     *                 _event.value = '密码强度太弱！';
     *             }
     *             // TODO other check
     *         }
     *     });
     * });
     * ```
     *
     * @class    module:util/form/form._$$WebForm
     * @extends  module:util/event._$$EventTarget
     *
     * @param    {Object}      config  - 配置参数
     * @property {String|Node} form    - 表单节点
     * @property {String}      invalid - 验证未通过时添加在表单元素上的样式名称，默认为js-invalid
     * @property {String}      holder  - 如果有placeholder，则可以指定样式名称，默认为js-placeholder
     * @property {String}      focus   - 如果有聚焦效果，则可以通过指定该样式名称，默认为js-focus
     * @property {String}      tip     - 提示信息效果样式名称，默认为js-tip
     * @property {String}      pass    - 提示信息效果样式名称，默认为js-pass
     * @property {String}      error   - 提示信息效果样式名称，默认为js-error
     * @property {Object}      type    - 类型验证扩展，主要扩展data-type值的验证规则，{type:regexp,type:function}
     * @property {Object}      attr    - 验证属性扩展，主要扩展自定义data-xxx的验证规则，{xxx:function}
     * @property {Object}      message - 提示信息内容，{key:value}，
     *                                   错误信息key规则：节点名称+错误代码，
     *                                   如 'username-1':'必须输入用户名！'
     *                                   表示username输入框没有输入内容时错误提示信息为'必须输入用户名！'，
     *                                   默认错误信息key规则：节点名称+'-error'，如username-error，
     *                                   提示信息key规则：节点名称+'-tip'，如username-tip，
     *                                   成功信息key规则：节点名称+'-pass'，如username-pass，
     *                                   默认成功信息key：pass
     */
    /**
     * 对于无法通过配置验证的控件会回调外界辅助验证
     * 
     * @event    module:util/form/form._$$WebForm#oncheck
     * @param    {Object} event  - 验证基本信息
     * @property {Node}   target - 当前验证节点
     * @property {Node}   form   - 表单对象
     * @property {Number} value  - 验证返回结果
     */
    /**
     * 验证未通过触发事件，错误类型对照表
     * 
     * | 错误码 | 说明 |
     * | :---   | :--- |
     * | -1     | 必填项未填值 |
     * | -2     | 类型不匹配，如email, url类型 |
     * | -3     | 值不符合提供的规则 |
     * | -4     | 超过最大长度限制 |
     * | -5     | 未达到最小长度 |
     * | -6     | 未达到给定范围的最小值 |
     * | -7     | 超出给定范围的最大值 |
     * 
     * @event    module:util/form/form._$$WebForm#oninvalid
     * @param    {Object} event  - 验证基本信息
     * @property {Node}   target - 当前验证节点
     * @property {Number} code   - 错误标识
     */
    /**
     * 通过验证提示信息
     * 
     * @event    module:util/form/form._$$WebForm#onvalid
     * @param    {Object} event  - 验证基本信息
     * @property {Node}   target - 当前验证节点
     */
    /**
     * 回车触发事件
     * 
     * @event   module:util/form/form._$$WebForm#onenter
     * @param   {Event} event 事件信息
     */
    _p._$$WebForm = _k._$klass();
    _pro = _p._$$WebForm._$extend(_t._$$EventTarget);
    /**
     * 控件初始化
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__super();
        this.__wopt = {
            tp:{nid:'js-nej-tp'},
            ok:{nid:'js-nej-ok'},
            er:{nid:'js-nej-er'}
        };
    };
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__reset
     * @param  {Object} arg0 - 配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__form = document.forms[_options.form]||
                     _e._$get(_options.form);
        this.__doInitDomEvent([[
            this.__form,'enter',
            this._$dispatchEvent._$bind(this,'onenter')
        ]]);
        this.__message = _options.message||{};
        this.__message.pass = this.__message.pass||'&nbsp;';
        // focus options
        var _mode = this.__dataset(
                    this.__form,'focusMode',1);
        if (!isNaN(_mode)){
            this.__fopt = {
                mode:_mode,
                clazz:_options.focus
            };
        }
        // save class name
        this.__holder = _options.holder;
        this.__wopt.tp.clazz = 'js-mhd '+(_options.tip||'js-tip');
        this.__wopt.ok.clazz = 'js-mhd '+(_options.pass||'js-pass');
        this.__wopt.er.clazz = 'js-mhd '+(_options.error||'js-error');
        this.__invalid = _options.invalid||'js-invalid';
        // init valid rule
        this.__doInitValidRule(_options);
        // refresh validate node
        this._$refresh();
        // auto focus node
        if (!!this.__fnode){
            this.__fnode.focus();
        }
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        this._$reset();
        delete this.__message;
        delete this.__fnode;
        delete this.__vinfo;
        delete this.__xattr;
        delete this.__form;
        delete this.__treg;
        delete this.__vfun;
    };
    /**
     * 取节点自定义数据值
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__dataset
     * @param  {String} arg0 - 自定义属性名
     * @param  {Number} arg1 - 类型，0-字符，1-数值，2-布尔，3-日期
     * @return {String}        值
     */
    _pro.__dataset = function(_node,_attr,_type){
        var _value = _e._$dataset(_node,_attr);
        switch(_type){
            case 1: return parseInt(_value,10);
            case 2: return (_value||'').toLowerCase()=='true';
            case 3: return this.__doParseDate(_value);
        }
        return _value;
    };
    /**
     * 根据类型转数值
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__number
     * @param  {String} arg0 - 值
     * @param  {String} arg1 - 类型
     * @return {Number}        数值
     */
    _pro.__number = function(_value,_type,_time){
        if (_type=='date'){
            return this.__doParseDate(_value,_time);
        }
        return parseInt(_value,10);
    };
    /**
     * 判断节点是否需要验证
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__isValidElement
     * @param  {Node}    arg0 - 节点
     * @return {Boolean}        是否需要验证
     */
    _pro.__isValidElement = (function(){
        var _reg1 = /^button|submit|reset|image|hidden|file$/i;
        return function(_node){
            // with name attr
            // not button
            _node = this._$get(_node)||_node;
            var _type = _node.type;
            return !!_node.name&&
                    !_reg1.test(_node.type||'');
        };
    })();
    /**
     * 判断节点是否需要验证
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__isValidElement
     * @param  {Node}    arg0 - 节点
     * @return {Boolean}        是否需要验证
     */
    _pro.__isValueElement = (function(){
        var _reg1 = /^hidden$/i;
        return function(_node){
            if (this.__isValidElement(_node))
                return !0;
            _node = this._$get(_node)||_node;
            var _type = _node.type||'';
            return _reg1.test(_type);
        };
    })();
    /**
     * 解析日期值
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__doParseDate
     * @param  {String} arg0 - 日期字符串
     * @return {Number}        日期毫秒数
     */
    _pro.__doParseDate = (function(){
        var _reg0 = /[:\.]/;
        return function(_value,_time){
            if ((_value||'').toLowerCase()=='now')
                return +new Date;
            var _date = _u._$var2date(_value);
            if (!!_date){
                // HH:mm:ss.ms
                var _arr = (_time||'').split(_reg0);
                _date.setHours(
                    parseInt(_arr[0],10)||0,
                    parseInt(_arr[1],10)||0,
                    parseInt(_arr[2],10)||0,
                    parseInt(_arr[3],10)||0
                );
            }
            return +_date;
        };
    })();
    /**
     * 解析字符类型规则属性
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__doCheckString
     * @param  {String} arg0 - 规则标识
     * @param  {String} arg1 - 规则属性
     * @return {Void}
     */
    _pro.__doCheckString = function(_id,_name){
        var _rule = this.__vfun[_name],
            _value = this.__dataset(_id,_name);
        if (!_value||!_rule) return;
        this.__doPushValidRule(_id,_rule);
        this.__doSaveValidInfo(_id,_name,_value);
    };
    /**
     * 解析正则类型规则属性
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__doCheckPattern
     * @param  {String} arg0 - 规则标识
     * @param  {String} arg1 - 规则属性
     * @return {Void}
     */
    _pro.__doCheckPattern = function(_id,_name){
        try{
            var _pattern = this.__dataset(_id,_name);
            if (!_pattern) return;
            var _value = new RegExp(_pattern);
            this.__doSaveValidInfo(_id,_name,_value);
            this.__doPushValidRule(_id,this.__vfun[_name]);
        }catch(e){
            // ignore exception
        }
    };
    /**
     * 解析布尔类型规则属性
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__doCheckBoolean
     * @param  {String} arg0 - 规则标识
     * @param  {String} arg1 - 规则属性
     * @return {Void}
     */
    _pro.__doCheckBoolean = function(_id,_name){
        var _rule = this.__vfun[_name];
        if (!!_rule&&this.__dataset(_id,_name,2)){
            this.__doPushValidRule(_id,_rule);
        }
    };
    /**
     * 解析数值类型规则属性
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__doCheckNumber
     * @param  {String} arg0 - 规则标识
     * @param  {String} arg1 - 规则属性
     * @param  {String} arg2 - 规则值
     * @return {Void}
     */
    _pro.__doCheckNumber = function(_id,_name,_value){
        _value = parseInt(_value,10);
        if (isNaN(_value)) return;
        this.__doSaveValidInfo(_id,_name,_value);
        this.__doPushValidRule(_id,this.__vfun[_name]);
    };
    /**
     * 解析dataset中数值类型规则属性
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__doCheckDSNumber
     * @param  {String} arg0 - 规则标识
     * @param  {String} arg1 - 规则属性
     * @return {Void}
     */
    _pro.__doCheckDSNumber = function(_id,_name){
        this.__doCheckNumber(_id,_name,this.__dataset(_id,_name));
    };
    /**
     * 解析属性中数值类型规则属性
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__doCheckATNumber
     * @param  {String} arg0 - 规则标识
     * @param  {String} arg1 - 规则属性
     * @return {Void}
     */
    _pro.__doCheckATNumber = function(_id,_name){
        this.__doCheckNumber(_id,_name,_e._$attr(_id,_name));
    };
    /**
     * 解析dataset中数值类型规则属性
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__doCheckTPNumber
     * @param  {String} arg0 - 规则标识
     * @param  {String} arg1 - 规则属性
     * @return {Void}
     */
    _pro.__doCheckTPNumber = function(_id,_name,_type){
        var _value = this.__number(
                     this.__dataset(_id,_name),
                     this.__dataset(_id,'type'));
        this.__doCheckNumber(_id,_name,_value);
    };
    /**
     * 验证扩展属性
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__doCheckCustomAttr
     * @param  {String} arg0 - 规则标识
     * @return {Void}
     */
    _pro.__doCheckCustomAttr = function(_id){
        _u._$loop(
            this.__xattr,function(v,_name){
                var _value = _e._$dataset(_id,_name);
                if (_value!=null){
                    this.__doSaveValidInfo(_id,_name,_value);
                    this.__doPushValidRule(_id,this.__vfun[_name]);
                }
            },this
        );
    };
    /**
     * 准备表单元素验证信息
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__doPrepareElement
     * @param  {Node} arg0 - 表单元素节点
     * @return {Void}
     */
    _pro.__doPrepareElement = (function(){
        var _reg0 = /^input|textarea$/i,
            _reg1 = /[:\.]/;
        // onfocus
        var _onFocus = function(_event){
            this._$showTip(_v._$getElement(_event));
        };
        // onblur
        var _onBlur = function(_event){
            var _node = _v._$getElement(_event);
            if (!this.__dataset(_node,'ignore',2)){
                this.__doCheckValidity(_node);
            }
        };
        return function(_node){
            // check auto focus node
            if (this.__dataset(
                      _node,'autoFocus',2))
                this.__fnode = _node;
            // check placeholder
            var _holder = _e._$attr(_node,'placeholder');
            if (!!_holder&&_holder!='null')
                _t1._$placeholder(_node,this.__holder);
            // check focus
            if (!!this.__fopt&&
                _reg0.test(_node.tagName))
                _t2._$focus(_node,this.__fopt);
            // check validate condition
            var _id = _e._$id(_node);
            // type check
            // pattern check
            // required check
            // max length
            // min length
            // cn max length
            // cn min length
            // min value check
            // max value check
            this.__doCheckBoolean(_id,'required');
            this.__doCheckString(_id,'type');
            this.__doCheckPattern(_id,'pattern');
            this.__doCheckATNumber(_id,'maxlength');
            this.__doCheckATNumber(_id,'minlength');
            this.__doCheckDSNumber(_id,'maxLength');
            this.__doCheckDSNumber(_id,'minLength');
            this.__doCheckTPNumber(_id,'min');
            this.__doCheckTPNumber(_id,'max');
            this.__doCheckCustomAttr(_id);
            // check date time
            var _time = _e._$dataset(_id,'time');
            if (!!_time){
                this.__doSaveValidInfo(_id,'time',_time);
            }
            // save message content
            var _name = _node.name;
            this.__message[_name+'-tip'] = this.__dataset(_node,'tip');
            this.__message[_name+'-error'] = this.__dataset(_node,'message');
            this._$showTip(_node);
            // node counter
            var _info = this.__vinfo[_id],
                _data = (_info||_o).data||_o,
                _need = this.__dataset(_node,'counter',2);
            if (_need&&(_data.maxlength||_data.maxLength)){
                _t0._$counter(_id,{nid:this.__wopt.tp.nid,clazz:'js-counter'});
            }
            // node need validate
            if (!!_info&&_reg0.test(_node.tagName)){
                this.__doInitDomEvent([
                    [_node,'focus',_onFocus._$bind(this)],
                    [_node,'blur',_onBlur._$bind(this)]
                ]);
            }else if(this.__dataset(_node,'focus',2)){
                this.__doInitDomEvent([
                    [_node,'focus',_onFocus._$bind(this)],
                ]);
            }
        };
    })();
    /**
     * 初始化验证规则
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__doInitValidRule
     * @param  {Object} arg0 - 配置信息
     * @return {Void}
     */
    _pro.__doInitValidRule = (function(){
        // type regexp map
        var _rmap = {
                number:/^[\d]+$/i,
                // xxx://xx.xx.xx/a/b
                url:/^[a-z]+:\/\/(?:[\w-]+\.)+[a-z]{2,6}.*$/i,
                // xxx@xx.xx.xxx
                email:/^[\w-\.]+@(?:[\w-]+\.)+[a-z]{2,6}$/i,
                // xx-x-xx or xxxx-xx-x
                date:function(v,node){
                    var format = this.__dataset(node,'format')||'yyyy-MM-dd';
                    return !v||(!isNaN(this.__doParseDate(v)) && _u._$format(this.__doParseDate(v),format) == v);
                }
            };
        // validate function map
        var _vfun = {
            // value require for text
            // checked require for checkbox or radio
            required:function(_node){
                var _type = _node.type,
                    _novalue = !_node.value,
                    _nocheck = (_type=='checkbox'||
                                _type=='radio')&&!_node.checked;
                if (_nocheck||_novalue) return -1;
            },
            // type supported in _regmap
            type:function(_node,_options){
                var _reg = this.__treg[_options.type],
                    _val = _node.value.trim(),
                    _tested = !!_reg.test&&!_reg.test(_val),
                    _funced = _u._$isFunction(_reg)&&!_reg.call(this,_val,_node);
                if (_tested||_funced) return -2;
            },
            // pattern check
            pattern:function(_node,_options){
                if (!_options.pattern.test(_node.value))
                    return -3;
            },
            // maxlength check
            maxlength:function(_node,_options){
                if (_node.value.length>_options.maxlength)
                    return -4;
            },
            // minlength check
            minlength:function(_node,_options){
                if (_node.value.length<_options.minlength)
                    return -5;
            },
            // data-max-length check
            maxLength:function(_node,_options){
                if (_u._$length(_node.value)>_options.maxLength)
                    return -4;
            },
            // data-min-length check
            minLength:function(_node,_options){
                if (_u._$length(_node.value)<_options.minLength)
                    return -5;
            },
            // min value check
            min:function(_node,_options){
                var _number = this.__number(
                    _node.value,
                    _options.type,
                    _options.time
                );
                if (isNaN(_number)||
                   _number<_options.min)
                    return -6;
            },
            // max value check
            max:function(_node,_options){
                var _number = this.__number(
                    _node.value,
                    _options.type,
                    _options.time
                );
                if (isNaN(_number)||
                   _number>_options.max)
                    return -7;
            }
        };
        // merge extend
        var _doMerge = function(_smap,_new,_key,_dmap){
            var _old = _smap[_key];
            if (_u._$isFunction(_new)&&
                _u._$isFunction(_old)){
                _smap[_key] = _old._$aop(_new);
                return;
            }
            _smap[_key] = _new;
        };
        return function(_options){
            this.__treg = NEJ.X({},_rmap);
            _u._$loop(
                _options.type,
                _doMerge._$bind(null,this.__treg)
            );
            this.__vfun = NEJ.X({},_vfun);
            this.__xattr = _options.attr;
            _u._$loop(
                this.__xattr,
                _doMerge._$bind(null,this.__vfun)
            );
        };
    })();
    /**
     * 添加验证规则
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__doPushValidRule
     * @param  {String}   arg0 - 规则标识
     * @param  {Function} arg1 - 验证规则
     * @return {Void}
     */
    _pro.__doPushValidRule = function(_id,_valid){
        if (!_u._$isFunction(_valid)) return;
        var _info = this.__vinfo[_id];
        if (!_info||!_info.func){
            _info = _info||{};
            _info.func = [];
            this.__vinfo[_id] = _info;
        }
        _info.func.push(_valid);
    };
    /**
     * 缓存验证信息
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__doSaveValidInfo
     * @param  {String}   arg0 - 验证标识
     * @param  {String}   arg1 - 信息标识
     * @param  {Variable} arg2 - 信息内容
     * @return {Void}
     */
    _pro.__doSaveValidInfo = function(_id,_name,_value){
        if (!_name) return;
        var _info = this.__vinfo[_id];
        if (!_info||!_info.data){
            _info = _info||{};
            _info.data = {};
            this.__vinfo[_id] = _info;
        }
        _info.data[_name] = _value;
    };
    /**
     * 验证节点
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__doCheckValidity
     * @param  {String|Node} arg0 - 节点
     * @return {Boolean}            是否通过验证
     */
    _pro.__doCheckValidity = function(_node){
        // check node validate
        _node = this._$get(_node)||_node;
        if (!_node){
            return !0;
        }
        // check validate information
        var _info = this.__vinfo[_e._$id(_node)];
        if (!_info&&this.__isValidElement(_node)){
            this.__doPrepareElement(_node);
            _info = this.__vinfo[_e._$id(_node)];
        }
        if (!_info){
            return !0;
        }
        var _result;
        // check condition
        _u._$forIn(_info.func,
            function(_func){
                _result = _func.call(this,_node,_info.data);
                return _result!=null;
            },this);
        // check custom validate
        if (_result==null){
            var _event = {target:_node,form:this.__form};
            this._$dispatchEvent('oncheck',_event);
            _result = _event.value;
        }
        // dispatch validate event
        var _event = {target:_node,form:this.__form};
        if (_result!=null){
            // merge oncheck result
            if (_u._$isObject(_result)){
                _u._$merge(_event,_result);
            }else{
                _event.code = _result;
            }
            this._$dispatchEvent('oninvalid',_event);
            if (!_event.stopped){
                this._$showMsgError(
                    _node,_event.value||
                    this.__message[_node.name+_result]
                );
            }
        }else{
            this._$dispatchEvent('onvalid',_event);
            if (!_event.stopped){
                this._$showMsgPass(_node,_event.value);
            }
        }
        return _result==null;
    };
    /**
     * 显示信息
     * 
     * @protected
     * @method module:util/form/form._$$WebForm#__doShowMessage
     * @param  {String|Node} arg0 - 表单元素节点
     * @param  {String}      arg1 - 显示信息
     * @param  {String}      arg2 - 信息类型
     * @return {Void}
     */
    _pro.__doShowMessage = (function(){
        var _kmap = {tp:'tip',ok:'pass',er:'error'};
        var _getVisible = function(_type1,_type2){
            return _type1==_type2?'block':'none';
        };
        var _getHolder = function(_node,_type,_message){
            var _holder = _getHolderNode.call(this,_node,_type);
            if (!_holder&&!!_message)
                _holder = _e._$wrapInline(_node,this.__wopt[_type]);
            return _holder;
        };
        var _getHolderNode = function(_node,_type){
            // try get node with id = xxx-tip or xxx-pass or xxx-error
            var _holder = _e._$get(_node.name+'-'+_kmap[_type]);
            if (!_holder)
                _holder = _e._$getByClassName(_node.parentNode,this.__wopt[_type].nid)[0];
            return _holder;
        };
        return function(_node,_message,_type){
            _node = this._$get(_node)||_node;
            if (!_node) return;
            _type=='er' ? _e._$addClassName(_node,this.__invalid)
                        : _e._$delClassName(_node,this.__invalid);
            // set message content
            var _holder = _getHolder.call(this,_node,_type,_message);
            if (!!_holder&&!!_message) _holder.innerHTML = _message;
            // show message node
            _u._$loop(this.__wopt,
                function(_value,_key){
                    _e._$setStyle(
                        _getHolderNode.call(this,_node,_key),
                        'display',_getVisible(_type,_key)
                    );
                },this);
        };
    })();
    /**
     * 显示提示信息
     * 
     * @method module:util/form/form._$$WebForm#_$showTip
     * @param  {String|Node} arg0 - 表单元素节点或者名称
     * @param  {String}      arg1 - 显示信息
     * @return {Void}
     */
    _pro._$showTip = function(_node,_message){
        this.__doShowMessage(
            _node,_message||
            this.__message[_node.name+'-tip'],'tp'
        );
    };
    /**
     * 显示验证通过信息
     * 
     * @method module:util/form/form._$$WebForm#_$showMsgPass
     * @param  {String|Node} arg0 - 表单元素节点或者名称
     * @param  {String}      arg1 - 显示信息
     * @return {Void}
     */
    _pro._$showMsgPass = function(_node,_message){
        this.__doShowMessage(
            _node,_message||
            this.__message[_node.name+'-pass']||
            this.__message.pass,'ok'
        );
    };
    /**
     * 显示错误信息
     * 
     * @method module:util/form/form._$$WebForm#_$showMsgError
     * @param  {String|Node} arg0 - 表单元素节点或者名称
     * @param  {String}      arg1 - 显示信息
     * @return {Void}
     */
    _pro._$showMsgError = function(_node,_message){
        this.__doShowMessage(_node,_message||
            this.__message[_node.name+'-error'],'er');
    };
    /**
     * 设置表单控件值
     * 
     * @method module:util/form/form._$$WebForm#_$setValue
     * @param  {String} arg0 - 表单控件名称
     * @param  {String} arg1 - 值
     * @return {Void}
     */
    _pro._$setValue = (function(){
        var _reg0 = /^(?:radio|checkbox)$/i;
        // get value
        var _getValue = function(_value){
            return _value==null?'':_value;
        };
        // set select value
        var _doSetSelect = function(_value,_node){
            // for multiple select
            if (!!_node.multiple){
                var _map;
                if (!_u._$isArray(_value)){
                    _map[_value] = _value;
                }else{
                    _map = _u._$array2object(_value);
                }
                _u._$forEach(
                    _node.options,function(_option){
                        _option.selected = _map[_option.value]!=null;
                    }
                );
            }else{
                _node.value = _getValue(_value);
            }
        };
        // set node value
        var _doSetValue = function(_value,_node){
            if (_reg0.test(_node.type||'')){
                // radio/checkbox
                _node.checked = _value==_node.value;
            }else if(_node.tagName=='SELECT'){
                // for select node
                _doSetSelect(_value,_node);
            }else{
                // other
                _node.value = _getValue(_value);
            }
        };
        return function(_name,_value){
            var _node = this._$get(_name);
            if (!_node) return;
            if(_node.tagName=='SELECT'||!_node.length){
                // for node
                _doSetValue(_value,_node);
            }else{
                // for node list
                _u._$forEach(
                    _node,
                    _doSetValue._$bind(null,_value)
                );
            }
        };
    })();
    /**
     * 取指定名称的表单控件对象
     * 
     * @method module:util/form/form._$$WebForm#_$get
     * @param  {String} arg0 - 控件名称
     * @return {Node}          表单控件对象
     */
    _pro._$get = function(_name){
        return this.__form.elements[_name];
    };
    /**
     * 取当前表单节点
     * 
     * @method module:util/form/form._$$WebForm#_$form
     * @return {Node} 当前封装的表单节点
     */
    _pro._$form = function(){
        return this.__form;
    };
    /**
     * 取表单数据
     * 
     * @method module:util/form/form._$$WebForm#_$data
     * @return {Object} 数据集合
     */
    _pro._$data = (function(){
        var _reg0 = /^radio|checkbox$/i,
            _reg1 = /^number|date$/;
        var _doDumpValue = function(_node){
            if (_node.tagName=='SELECT'&&!!_node.multiple){
                var _ret = [];
                _u._$forEach(
                    _node.options,function(_option){
                        if (_option.selected){
                            _ret.push(_option.value);
                        }
                    }
                );
                return _ret.length>0?_ret:'';
            }
            return _node.value;
        };
        var _doParseValue = function(_map,_node){
            var _name = _node.name,
                _value = _doDumpValue(_node),
                _info = _map[_name],
                _type = this.__dataset(_node,'type'),
                _time = _e._$dataset(_node,'time');
            // parse value
            if (_reg1.test(_type)){
                if (_u._$isArray(_value)){
                    _u._$forEach(
                        _value,function(v,i,l){
                            l[i] = this.__number(
                                v,_type,_time
                            );
                        },this
                    );
                }else{
                    _value = this.__number(
                        _value,_type,_time
                    );
                }
            }
            // checkbox and radio
            if (_reg0.test(_node.type)&&!_node.checked){
                _value = this.__dataset(_node,'value');
                if (!_value) return;
            }
            // if name exist
            if (!!_info){
                if (!_u._$isArray(_info)){
                    _info = [_info];
                    _map[_name] = _info;
                }
                _info.push(_value);
            }else{
                _map[_name] = _value;
            }
        };
        return function(){
            var _result = {};
            _u._$forEach(
                this.__form.elements,
                function(_node){
                    if (this.__isValueElement(_node)){
                        _doParseValue.call(this,_result,_node);
                    }
                },this);
            return _result;
        };
    })();
    /**
     * 重置表单
     * 
     * @method module:util/form/form._$$WebForm#_$reset
     * @return {Void}
     */
    _pro._$reset = (function(){
        var _doShowTip = function(_node){
            if (this.__isValidElement(_node)){
                this._$showTip(_node);
            }
        };
        return function(){
            this.__form.reset();
            _u._$forEach(
                this.__form.elements,
                _doShowTip,this
            );
        };
    })();
    /**
     * 提交表单
     * 
     * @method module:util/form/form._$$WebForm#_$submit
     * @return {Void}
     */
    _pro._$submit = function(){
        this.__form.submit();
    };
    /**
     * 刷新验证信息
     * 
     * @method module:util/form/form._$$WebForm#_$refresh
     * @return {Void}
     */
    _pro._$refresh = (function(){
        var _doPrepareElement = function(_node){
            if (this.__isValidElement(_node)){
                this.__doPrepareElement(_node);
            }
        };
        return function(){
            // id:{func:[],data:{}}
            // func  - validate function list
            // data  - validate information
            this.__vinfo = {};
            _u._$forEach(
                this.__form.elements,
                _doPrepareElement,this
            );
        };
    })();
    /**
     * 验证表单或者表单控件
     * 
     * @method module:util/form/form._$$WebForm#_$checkValidity
     * @param  {String|Node} arg0 - 表单控件，没有输入表示验证整个表单
     * @return {Boolean}            表单是否通过验证
     */
    _pro._$checkValidity = function(_node){
        _node = this._$get(_node)||_node;
        // check single form element
        if (!!_node){
            return this.__doCheckValidity(_node);
        }
        // check all form elements
        var _result = !0;
        _u._$forEach(
            this.__form.elements,
            function(_node){
                var _pass = this._$checkValidity(_node);
                _result = _result&&_pass;
            },this);
        return _result;
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});