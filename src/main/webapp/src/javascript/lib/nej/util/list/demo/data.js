define([
    'base/klass',
    'util/cache/abstract'
],function(_k,_d,_p,_pro){

    _p._$$Cache = _k._$klass();
    _pro = _p._$$Cache._$extend(_d._$$CacheListAbstract);

    /**
     * �ӷ������������б�����ʵ�־����߼�
     *
     * @abstract
     * @method   module:util/cache/abstract._$$CacheListAbstract#__doLoadList
     * @param    {Object}   arg0   - ������Ϣ
     * @property {String}   key    - �б��ʶ
     * @property {Number}   offset - ƫ����
     * @property {Number}   limit  - ����
     * @property {String}   data   - �����������
     * @property {Function} onload - �б�������ص�
     * @return   {Void}
     */
    var x = 0;
    _pro.__doLoadList = function(_options){
        if (!x){
            console.log('request from server');
            x = 1;
            var _ret = [];
            for(var i= 0;i<_options.limit;i++){
                _ret.push({
                    id:_options.offset+i,
                    name:'test-'+(+new Date)
                });
            }
            _options.onload({
                total:300,
                result:_ret
            });
            return;
        }
        _options.onload(null);
        this._$dispatchEvent('onerror');
        //_options.onload([]);
    };

    return _p;
});