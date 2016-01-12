var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _u = _('nej.u'),
        _e = _('nej.e'),
        _p = _('nej.ui'),
        _proMyWindow;
    var _seed_html = _e._$addNodeTemplate('<div>您要展示的内容部分</div>');
    /**
     * 弹出层封装基类对象，主要实现层里面内容部分的业务逻辑
     * @class   弹出层封装基类对象
     * @extends {nej.ui._$$CardWrapper}
     * @param   {Object} _options 可选配置参数
     *
     */
    _p._$$MyWindow = NEJ.C();
      _proMyWindow = _p._$$MyWindow._$extend(_p._$$WindowWrapper);

    _proMyWindow.__initXGui = function(){
        this.__seed_html = _seed_html;
    };

	_proMyWindow.__reset = function(_options){
		_options = _options || {};
        _options.draggable = !!_options.draggable ? true : false;
        _options.destroyable = !!_options.destroyable ? true : false;
		this.__super(_options);
	};
};
define('{pro}mywindow.js',
      ['ui/layer/window.wrapper'],f);