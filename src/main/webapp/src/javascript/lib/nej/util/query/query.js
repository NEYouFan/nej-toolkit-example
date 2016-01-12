/*
 * NES css selector engine
 * Copyright (C) 1997-2012 NetEase, Inc.
 *
 * NES is released under the MIT license

 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:

 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/*
 * ------------------------------------------
 * CSS选择器API封装实现文件
 * CSS选择器API实现基于NES开源库，此处仅做NEJ规范适配
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/query/query */
NEJ.define([
    'base/global',
    './nes.js'
],function(NEJ,_t0,_p,_o,_f,_r){
    /**
     * 节点选择器
     *
     * 结构示例
     * ```html
     * <ul class="w-tab">
     *   <li class="itm">Tab-0</li>
     *   <li class="itm">Tab-1</li>
     *   <li class="itm">Tab-2</li>
     *   <li class="itm js-selected">Tab-3</li>
     *   <li class="itm">Tab-4</li>
     *   <li class="itm">Tab-5</li>
     * </ul>
     * ```
     *
     * 脚本示例
     * ```javascript
     * NEJ.define([
     *     'util/query/query',
     *     'util/tab/tab'
     * ],function(_e,_t){
     *     // 使用选择器接口来取列表
     *     _t._$$Tab._$allocate({
     *         list:_e._$all('.w-tab > li'),
     *         onchange:function(_event){
     *                // TODO
     *         }
     *     });
     * });
     * ```
     *
     * @method module:util/query/query._$all
     * @param  {String} arg0 - 选择器
     * @param  {Node}   arg1 - 用于匹配的根节点，默认为document
     * @return {Array}         符合规则的节点列表
     */
    _p._$all = function(){
        try{
            return nes.all.apply(nes,arguments);
        }catch(e){
            return null;
        }
    };
    /**
     * 节点选择器
     *
     * 结构示例
     * ```html
     * <ul class="w-tab">
     *   <li class="itm">Tab-0</li>
     *   <li class="itm">Tab-1</li>
     *   <li class="itm">Tab-2</li>
     *   <li class="itm js-selected">Tab-3</li>
     *   <li class="itm">Tab-4</li>
     *   <li class="itm">Tab-5</li>
     * </ul>
     * ```
     *
     * 脚本示例
     * ```javascript
     * NEJ.define([
     *     'util/query/query'
     * ],function(_t){
     *     // 使用选择器接口来取选中的节点
     *     var _node = _t._$one('.w-tab > li.js-selected');
     * });
     * ```
     *
     * @method module:util/query/query._$one
     * @param  {String} arg0 - 选择器
     * @param  {Node}   arg1 - 用于匹配的根节点，默认为document
     * @return {Node}          符合规则的节点
     */
    _p._$one = function(){
        try{
            return nes.one.apply(nes,arguments);
        }catch(e){
            return null;
        }
    };
    // for test only
    _p._$g = nes._get;

    if (CMPT){
        NEJ.copy(NEJ.P('nej.e'),_p);
    }

    return _p;
});