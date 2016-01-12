/*
 * ------------------------------------------
 * 自定义富媒体编辑器封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/editor/custom */
NEJ.define([
    'base/global',
    'base/klass',
    'ui/editor/editor',
    'util/template/tpl',
    'util/editor/command/fontsize',
    'util/editor/command/fontname',
    'util/editor/command/bold',
    'util/editor/command/italic',
    'util/editor/command/insertorderedlist',
    'util/editor/command/insertunorderedlist',
    'util/editor/command/underline',
    'util/editor/command/strikethrough',
    'util/editor/command/forecolor',
    'util/editor/command/backcolor',
    'util/editor/command/justifyleft',
    'util/editor/command/justifycenter',
    'util/editor/command/justifyright',
    'util/editor/command/link',
    'util/editor/command/format',
    'util/editor/command/uploadimage',
    'util/editor/command/blockquote'
],function(NEJ,_k,_i0,_t0,_t1,_t2,_t3,_t4,_t5,_t6,_t7,_t8,_t9,_t10,_t11,_t12,_t13,_t14,_t15,_t16,_t17,_p,_o,_f,_r){
    var _pro,
        _seed_html;
    /**
     * 富媒体编辑器封装
     *
     * @class   module:ui/editor/custom._$$CustomEditor
     * @extends module:ui/editor/editor._$$Editor
     * @param   {Object} arg0 - 可选配置参数
     */
    _p._$$CustomEditor = _k._$klass();
    _pro = _p._$$CustomEditor._$extend(_i0._$$Editor);
    /**
     * 初始化外观信息
     *
     * @protected
     * @method module:ui/editor/custom._$$CustomEditor#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__super();
        this.__seed_html = _seed_html;
    };
    /**
     * 动态构建控件节点模板
     *
     * @protected
     * @method module:ui/editor/custom._$$CustomEditor#__initNodeTemplate
     * @return {Void}
     */
    _pro.__initNodeTemplate = (function(){
        var _flist = [{cmd:'bold',txt:'加粗',icn:'z-i-30'}
                     ,{cmd:'italic',txt:'斜体',icn:'z-i-31'}
                     ,{cmd:'underline',txt:'下划线',icn:'z-i-32'}
                     ,{cmd:'strikethrough',txt:'删除线',icn:'z-i-40'}
                     ,{cmd:'insertorderedlist',txt:'有序列表',icn:'z-i-61'}
                     ,{cmd:'insertunorderedlist',txt:'无序列表',icn:'z-i-62'}
                     ,{cmd:'foreColor',txt:'字体颜色',icn:'z-i-41'}
                     ,{cmd:'hiliteColor',txt:'背景颜色',icn:'z-i-122'}],
            _tlist = [{cmd:'justifyLeft',txt:'左对齐',icn:'z-i-50'}
                     ,{cmd:'justifyCenter',txt:'居中对齐',icn:'z-i-51'}
                     ,{cmd:'justifyRight',txt:'右对齐',icn:'z-i-52'}
                     ,{cmd:'link',txt:'超链接',icn:'z-i-42'}
                     ,{cmd:'format',txt:'清除格式',icn:'z-i-72'}
                     ,{cmd:'uploadImage',txt:'照片上传',icn:'z-i-82'}];
        return function(){
            _seed_html = _t0._$addNodeTemplate(
                this.__doGenEditorXhtml({
                    toolbar:this.__doGenFontSizeXhtml()
                           +this.__doGenFontNameXhtml()
                           +this.__doGenCmdXhtml({xlist:_flist,hr:!0})
                           +this.__doGenCmdXhtml({xlist:_tlist})
                }));
            this.__seed_html = _seed_html;
        };
    })();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});