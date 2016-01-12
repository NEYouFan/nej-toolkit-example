/*
 * ------------------------------------------
 * 音频播放控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/media/flash */
NEJ.define([
    'base/global',
    'base/klass',
    'base/config',
    'util/flash/flash',
    './media.js'
],function(NEJ,_k,_c,_e,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 音频播放控件
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/media/flash'
     * ],function(_t){
     *     // 首先生成播放对象,只负责逻辑部分，要配合UI来使用
     *     // preload：是否预加载
     *     // url：音频地址
     *     var _media = _t._$$MediaFlash._$allocate({
     *         preload:false,
     *         url:'http://127.0.0.1:8000/nej-baseline/res/test.mp3',
     *         onstatechange:function(_event){
     *             // 状态改变的回调
     *             // 0 | 当前停止状态
     *             // 1 | 当前缓冲状态
     *             // 2 | 当前播放状态
     *             // 3 | 当前暂停状态
     *             // 4 | 播放结束状态
     *         }
     *     });
     *     
     *     // 开始播放
     *     _media._$play();
     *     // 暂停播放
     *     _media._$pause();
     *     // 停止播放
     *     _media._$stop();
     * });
     * ```
     * 
     * @class    module:util/media/flash._$$MediaFlash
     * @extends  module:util/media/media._$$Media
     * 
     * @param    {Object} config - 可选配置参数
     * @property {String} url    - 音频地址
     */
    _p._$$MediaFlash = _k._$klass();
    _pro = _p._$$MediaFlash._$extend(_t._$$Media);
    /**
     * 控件初始化
     *
     * @protected
     * @method module:util/media/flash._$$MediaFlash#__init
     * @return {Void}
     */
    _pro.__init = (function(){
        var _onReady = function(_flash){
            this.__audio = _flash;
            if (!!this.__action){
                this.__action.call(this);
                delete this.__action;
            }
        };
        return function(){
            this.__super();
            _e._$flash({
                hidden:!0,
                src:_c._$get('audio.swf'),
                onready:_onReady._$bind(this),
                onended:this.__onStop._$bind(this),
                onpause:this.__onPause._$bind(this),
                onseeking:this.__onLoading._$bind(this),
                onprogress:this.__onLoading._$bind(this),
                ontimeupdate:this.__onPlaying._$bind(this),
                onvolumechange:this.__onVolumeChange._$bind(this),
                onerror:this.__onError._$bind(this)
            });
        };
    })();
    /**
     * 控件销毁
     *
     * @protected
     * @method module:util/media/flash._$$MediaFlash#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        delete this.__action;
    };
    /**
     * 执行播放操作
     *
     * 
     * @protected
     * @method module:util/media/flash._$$MediaFlash#__doPlay
     * @return {Void}
     */
    _pro.__doPlay = function(){
        if (!!this.__audio){
            if (!!this.__source){
                this.__audio.nej_setSrc(this.__source);
                delete this.__source;
            }
            this.__audio.nej_play();
        }else{
            this.__action = this.__doPlay;
        }
    };
    /**
     * 执行暂停操作
     * 
     * @protected
     * @method module:util/media/flash._$$MediaFlash#__doPause
     * @return {Void}
     */
    _pro.__doPause = function(){
        if (!!this.__audio){
            this.__audio.nej_pause();
        }else{
            this.__action = this.__doPause;
        }
    };
    /**
     * 执行停止操作
     * 
     * @protected
     * @method module:util/media/flash._$$MediaFlash#__doStop
     * @return {Void}
     */
    _pro.__doStop = function(){
        if (!!this.__audio){
            this.__audio.nej_stop();
            this.__doStateChange(0);
        }else{
            this.__action = this.__doStop;
        }
    };
    /**
     * 文件载入触发事件
     * 
     * @protected
     * @method module:util/media/flash._$$MediaFlash#__onLoading
     * @return {Void}
     */
    _pro.__onLoading = function(){
        this.__doStateChange(1);
    };
    /**
     * 暂停触发事件
     * 
     * @protected
     * @method module:util/media/flash._$$MediaFlash#__onPause
     * @return {Void}
     */
    _pro.__onPause = function(){
        this.__doStateChange(3);
    };
    /**
     * 播放过程触发事件
     * 
     * @protected
     * @method module:util/media/flash._$$MediaFlash#__onPlaying
     * @return {Void}
     */
    _pro.__onPlaying = function(_event){
        this.__doStateChange(2);
        this._$dispatchEvent(
            'ontimeupdate',{
                duration:_event.duration,
                current:_event.currentTime
            }
        );
        // check volume
        if (this.__dtvol!=null){
            var _volume = this.__dtvol;
            delete this.__dtvol;
            this.__setVolume(_volume);
        }
    };
    /**
     * 播放错误事件
     *
     * @protected
     * @method module:util/media/flash._$$MediaFlash#__onError
     * @param  {Event} 事件信息
     * @return {Void}
     */
    _pro.__onError = function(_event){
        this.__doError();
        this._$dispatchEvent('onerror',{
            code:_event.code
        });
    };
    /**
     * 设置播放时间
     * 
     * @protected
     * @method module:util/media/flash._$$MediaFlash#__setCurrentTime
     * @return {Void}
     */
    _pro.__setCurrentTime = function(_time){
        if (this.__state==1) return;
        this.__audio.nej_seek(_time||0);
    };
    /**
     * 获取播放时间
     * 
     * @protected
     * @method module:util/media/flash._$$MediaFlash#__getCurrentTime
     * @return {Number} 当前时间
     */
    _pro.__getCurrentTime = function(){
        return this.__audio.nej_flash_get_currentTime();
    };
    /**
     * 设置音量
     * 
     * @protected
     * @method module:util/media/flash._$$MediaFlash#__setVolume
     * @return {Void}
     */
    _pro.__setVolume = function(_volume){
        if (!this.__audio){
            this.__dtvol = _volume;
            return;
        }
        try{
            this.__audio.nej_flash_set_volume(_volume);
        }catch(e){
            this.__dtvol = _volume;
        }
    };
    /**
     * 获取音量
     * 
     * @protected
     * @method module:util/media/flash._$$MediaFlash#__getVolume
     * @return {Number} 音量值
     */
    _pro.__getVolume = function(){
        if (!this.__audio) return;
        return this.__audio.nej_flash_get_volume();
    };
    /**
     * 取媒体总时长
     * 
     * @method module:util/media/flash._$$MediaFlash#_$duration
     * @return {Number} 媒体总时长
     */
    _pro._$duration = function(){
        return !this.__audio?0:this.__audio.nej_flash_get_duration();
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});
