/*
 * ------------------------------------------
 * 范围裁剪控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/resizer/resizer */
NEJ.define([
    'base/global',
    'base/klass',
    'base/constant',
    'base/element',
    'base/util',
    'ui/base',
    'util/resize/resize',
    'util/template/tpl',
    'util/template/jst',
    'text!./resizer.css',
    'text!./resizer.html'
],function(NEJ,_k,_g,_e,_u,_i,_t0,_t1,_t2,_css,_html,_p,_o,_f,_r){
    var _pro,
        _seed_html,
        _seed_point = _t2._$add(_html);
    /**
     * 初始大小
     * @typedef  {Object} module:ui/resizer/resizer._$$Resizer~Size
     * @property {Number} width  - 宽
     * @property {Number} height - 高
     * @property {Number} ratio  - 比例
     */
    /**
     * 最大宽高限制
     * @typedef  {Object} module:ui/resizer/resizer._$$Resizer~Max
     * @property {Number} width  - 宽
     * @property {Number} height - 高
     */
    /**
     * 范围裁剪控件封装
     *
     * @class     module:ui/resizer/resizer._$$Resizer
     * @extends   module:ui/base._$$Abstract
     * @param     {Object} arg0 - 可选配置参数，其他参数见module:util/resize/resize._$$ResizerResize控件所示
     * @property  {module:ui/resizer/resizer._$$Resizer~Size} size - 初始大小，输入任意两个值，其中ratio为width/height
     * @property  {module:ui/resizer/resizer._$$Resizer~Max}  max  - 最大宽高限制
     */
    _p._$$Resizer = _k._$klass();
    _pro = _p._$$Resizer._$extend(_i._$$Abstract);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:ui/resizer/resizer._$$Resizer#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__ropt = {
            onbeforeresize:this.__onBeforeResize._$bind(this),
            onresizestart:this._$dispatchEvent._$bind(this,'onresizestart'),
            onresizeend:this._$dispatchEvent._$bind(this,'onresizeend'),
            onresize:this._$dispatchEvent._$bind(this,'onresize'),
            onmove:this._$dispatchEvent._$bind(this,'onmove')
        };
        this.__super();
    };
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/resizer/resizer._$$Resizer#__reset
     * @param  {Object} arg0 - 配置参数
     * @return {Void}
     */
    _pro.__reset = (function(){
        var _doParseSize = function(_size,_max){
            if (!_size) return;
            var _result,
                _width = _size.width,
                _height = _size.height,
                _ratio = _size.ratio;
            if (!!_width&&!!_height){
                _result = {
                    width:_width-2,
                    height:_height-2
                };
            }else if(!!_ratio){
                if (!!_width){
                    _result = {
                        width:_width-2,
                        height:Math.floor(_width/_ratio)-2
                    };
                }else if(!!_height){
                    _result = {
                        height:_height-2,
                        width:Math.floor(_height*_ratio)-2
                    };
                }
            }
            // fix max limit
            if (!!_max){
                var _maxw = _max.width-2,
                    _maxh = _max.height-2,
                    _orgw = _result.width,
                    _orgh = _result.height,
                    _delta = _maxw/_maxh-_orgw/_orgh;
                if (_delta>0&&_orgh>_maxh){
                    _result.height = _maxh;
                    _result.width = Math.floor(_orgw*_maxh/_orgh);
                }else if(_delta<0&&_orgw>_maxw){
                    _result.width = _maxw;
                    _result.height = Math.floor(_maxw*_orgh/_orgw);
                }
            }
            _result.width += 'px';
            _result.height += 'px';
            return _result;
        };
        return function(_options){
            this.__super(_options);
            var _opt = _u._$merge(_u._$fetch({
                lock:!1,
                min:null
            },_options),this.__ropt);
            _opt.view = this.__parent;
            _opt.body = this.__body;
            _e._$style(
                this.__nsize,
                _doParseSize(_options.size,_options.max)
            );
            this.__resize = _t0._$$Resize._$allocate(_opt);
        };
    })();
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/resizer/resizer._$$Resizer#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        if (!!this.__resize){
            this.__resize._$recycle();
            delete this.__resize;
        }
        this.__super();
    };
    /**
     * 初始化外观信息
     *
     * @protected
     * @method module:ui/resizer/resizer._$$Resizer#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = (function(){
        var _seed_css   = _e._$pushCSSText(
            _css,{blankimage:_g._$BLANK_IMAGE}
        );
        return function(){
            this.__seed_css = _seed_css;
            this.__seed_html = _seed_html;
        };
    })();
    /**
     * 动态构建控件节点模板
     *
     * @protected
     * @method module:ui/resizer/resizer._$$Resizer#__initNodeTemplate
     * @return {Void}
     */
    _pro.__initNodeTemplate = (function(){
        var _clazz = [
            'znt','znr','znb','znl',
            'zpc zntl','zpc zntr','zpc znbr','zpc znbl'
        ];
        return function(){
            _seed_html = _t1._$addNodeTemplate(
                _t2._$get(_seed_point,{clazz:_clazz})
            );
            this.__seed_html = _seed_html;
        };
    })();
    /**
     * 初始化节点
     *
     * @protected
     * @method module:ui/resizer/resizer._$$Resizer#__initNode
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        this.__nsize = _e._$getChildren(this.__body)[0];
    };
    /**
     * 大小变化之前触发事件
     *
     * @protected
     * @method module:ui/resizer/resizer._$$Resizer#__onBeforeResize
     * @return {Void}
     */
    _pro.__onBeforeResize = function(_event){
        _event.stopped = !0;
        _e._$style(
            this.__nsize,{
                width:_event.width-2+'px',
                height:_event.height-2+'px'
            }
        );
        _e._$style(
            this.__body,{
                top:_event.top+'px',
                left:_event.left+'px'
            }
        );
        this._$dispatchEvent('onresize',_event);
    };
    /**
     * 裁剪信息
     *
     * @typedef  {Object} module:ui/resizer/resizer._$$Resizer~ResizeBox
     * @property {Number} top    - 距离上
     * @property {Number} left   - 距离左
     * @property {Number} width  - 宽
     * @property {Number} height - 高
     */
    /**
     * 取裁剪信息
     *
     * @method module:ui/resizer/resizer._$$Resizer#_$getResizeBox
     * @return {module:ui/resizer/resizer._$$Resizer~ResizeBox} 信息
     */
    _pro._$getResizeBox = function(){
        return this.__resize._$getResizeBox();
    };
    /**
     * 更新裁剪信息
     * 
     * @method module:ui/resizer/resizer._$$Resizer#_$update
     * @param  {module:ui/resizer/resizer._$$Resizer~ResizeBox} arg0 - 裁剪信息
     * @return {Void}
     */
    _pro._$update = function(_box){
        this.__resize._$update(_box);
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});