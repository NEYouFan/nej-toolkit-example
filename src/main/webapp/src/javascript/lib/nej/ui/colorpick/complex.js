/*
 * ------------------------------------------
 * 颜色选择控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/colorpick/complex */
NEJ.define([
    'base/global',
    'base/klass',
    'base/util',
    'ui/colorpick/colorpick.simple',
    'util/template/jst',
    'text!./complex.html'
],function(NEJ,_k,_u,_i0,_t0,_html,_p,_o,_f,_r){
    var _pro,
        _seed_color = _t0._$add(_html);
    /**
     * 颜色选择控件
     *
     * 页面结构举例
     * ```html
     * <div id='colorpanel-box'></div>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'ui/colorpick/complex'
     * ],function(_i0,_p,_o,_f,r){
     *     var _cp = _i0._$$ComplexColorPick._$allocate({
     *         parent:'colorpanel-box',
     *         defaultColor:'默认rgb颜色',
     *         onselect:function(_event){
     *             console.log(_event.color)
     *         }
     *     });
     * });
     * ```
     *
     * @class    module:ui/colorpick/complex._$$ComplexColorPick
     * @extends  module:ui/colorpick/simple._$$SimpleColorPick
     * @param    {Object} arg0 - 可选配置参数
     * @property {String} defaultColor - 默认颜色值
     */
    /**
     * 确定选择颜色触发事件
     *
     * @event    module:ui/colorpick/complex._$$ComplexColorPick#onselect
     * @param    {Object} arg0  - 颜色信息
     * @property {String} color - 颜色值
     *
     */
    _p._$$ComplexColorPick = _k._$klass();
    _pro = _p._$$ComplexColorPick._$extend(_i0._$$SimpleColorPick);
    /**
     * 初始化节点
     *
     * @protected
     * @method module:ui/carousel/complex._$$ComplexColorPick#__initNode
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        _e._$addClassName(this.__nbox,'zbox2');
    };
    /**
     * 绘制可选颜色列表
     *
     * @protected
     * @method module:ui/carousel/complex._$$ComplexColorPick#__doRenderColorList
     * @return {Void}
     */
    _pro.__doRenderColorList = (function(){
        var _xlist = ['00','33','66','99','cc','ff'],
            _ylist = ['ff0000','00ff00','0000ff','ffff00','00ffff','ff00ff'];
        return function(){
            var _arr = [],
                _test = ['','','',''];
            // top panel
            _u._$forEach(
                _xlist,function(_value,_index){
                    _arr.push(_test.join(_value));
                    _arr.push('000000');
                    for(var i=0;i<3;i++){
                        for(var j=0;j<6;j++){
                            _arr.push(_xlist[i]+_xlist[j]+_xlist[_index]);
                        }
                    }
                }
            );
            // bottom panel
            _u._$forEach(
                _xlist,function(_value,_index){
                    _arr.push(_ylist[_index]);
                    _arr.push('000000');
                    for(var i=3;i<6;i++){
                        for(var j=0;j<6;j++){
                            _arr.push(_xlist[i]+_xlist[j]+_xlist[_index]);
                        }
                    }
                }
            );
            _e._$render(
                this.__nbox,_seed_color,{
                    xlist:_arr
                }
            );
        };
    })();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});