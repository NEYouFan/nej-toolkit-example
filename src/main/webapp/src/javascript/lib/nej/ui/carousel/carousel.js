﻿﻿/*
 * ------------------------------------------
 * 卡片播放器实现文件
 * @version  1.0
 * @author   huxueliang(huxueliang@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/carousel/carousel */
NEJ.define([
    'base/global',
    'base/klass',
    'base/platform',
    'base/element',
    'base/event',
    'base/util',
    'util/event',
    'util/gesture/drag',
    'util/timer/animation',
    'ui/carousel/indicator'
],function(NEJ,_k,_m,_e,_v,_u,_t,_t0,_t1,_i0,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 卡片播放器对象
     *
     * @class     module:ui/carousel/carousel._$$Carousel
     * @extends   module:util/event._$$EventTarget
     * @param     {Object}      config    - 可选配置参数
     * @property  {String|Node} parent    - 卡片所在父容器节点
     * @property  {Number}      mode      - 动画模式(1:3d;2:2d;3:left/top)
     * @property  {Number}      current   - 当前选中项
     * @property  {Number}      buffer    - 预加载卡片个数
     * @property  {Boolean}     nofollow  - 无跟随
     * @property  {Boolean}     nobounce  - 无弹性
     * @property  {Object}      indicator - 指示器参数
     */
    /**
     * 添加卡片
     *
     * @event  module:ui/carousel/carousel._$$Carousel#onaddcard
     * @param  {Number} index - 卡片索引
     *
     */
    /**
     * 准备滚动到某张卡片
     *
     * @event  module:ui/carousel/carousel._$$Carousel#onbeforescroll
     * @param  {Number}  index  -  卡片索引
     * @param  {Boolean} islast - 是否最后一张
     */
    /**
     * 滚动到某张卡片
     *
     * @event  module:ui/carousel/carousel._$$Carousel#onscroll
     * @param  {Number}  index  -  卡片索引
     * @param  {Boolean} islast - 是否最后一张
     *
     */
    /**
     * 回收卡片处理函数
     *
     * @event  module:ui/carousel/carousel._$$Carousel#onrecycle
     * @param  {Number} index - 回收的卡片索引
     * @param  {Object} node  - 卡片的容器节点
     */
    /**
     * 弹性释放事件处理函数
     *
     * @event  module:ui/carousel/carousel._$$Carousel#onbouncerelease
     * @param  {Event} arg0 - 事件对象
     *
     */
    _p._$$Carousel = _k._$klass();
    _pro = _p._$$Carousel._$extend(_t._$$EventTarget,!0);
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__reset
     * @param  {Object} arg0 - 重置属性
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__parent = _e._$get(_options.parent);
        this.__mode = _options.mode||(_m._$SUPPORT.css3d?1:2);
        this.__config = this.__getConfig();
        this.__noBounce = !!_options.nobounce;
        this.__noFollow = !!_options.nofollow;
        this.__transitionProperty = this.__mode==3?(this.__config.v?'top':'left')
                                                  :'-'+_m._$KERNEL.prefix.css+'-transform';
        //init item config
        this.__items={addList:[],delList:[],curList:[],aniList:[],
                      buffer:this.__parent.children.length||parseInt(_options.buffer),
                      curIndex:parseInt(_options.current)||0,strIndex:0};
        if(this.__parent.children.length>0){
            for(var i=0;i<this.__parent.children.length;i++){
                this.__items.curList[i]=this.__parent.children[i];
            }
        }
        //init events
        this._$batEvent({
                'onaddcard':_options.onaddcard,
            'onbeforescroll':_options.onbeforescroll,
                 'onscroll':_options.onscroll,
                'onrecycle':_options.onrecycle||this.__onRecycleItem._$bind(this),
          'onbouncerelease':_options.onbouncerelease
        });
        //init keyboard events
        //init drag events
        this.__doInitDomEvent([
            [document,'keydown',this.__onKeyDown._$bind(this)],
            [this.__parent,'touchmove',_v._$stopDefault],
            [this.__parent,'dragbegin',this.__onDragStart._$bind(this)],
            [this.__parent,'dragging',this.__onDrag._$bind(this)],
            [this.__parent,'dragcomplete',this.__onDragEnd._$bind(this)],
        ]);
        //init indicator
        if(_options.indicator){
            this.__iopt = _options.indicator;
            this.__iopt.onactive=this._$scrollTo._$bind(this);
            this.__iopt.cindex=this.__items.curIndex;
            if(this.__indicator){
                this.__indicator=_i0._$$Indicator._$recycle(this.__indicator);
            }
            this.__indicator=_i0._$$Indicator._$allocate(this.__iopt);
        }
        this.__worh = _options[this.__config.l]||this.__parent[this.__config.o];
        this.__scroll = 0;
        //not webkitRequestAnimationFrame(multi-webview bug);
        window.setTimeout(this._$scrollToCurrent._$bind(this,this.__items.curIndex),0);
    };
    /**
     * 获得配置参数(子类实现)
     *
     * @abstract
     * @method module:ui/carousel/carousel._$$Carousel#__getConfig
     * @return {Object}    配置参数对象
     */
    _pro.__getConfig = f;
    /**
     * 检测键盘事件
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__onKeyDown
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onKeyDown = function(_event){
        if(this.__transitionEnd)return;
        if(_event.keyCode==37){//left
            this._$scrollToPrev();
        }else if(_event.keyCode==39){//right
            this._$scrollToNext();
        }
    };
    /**
     * 获得当前卡片总长度
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__getLength
     * @return {Number}
     */
    _pro.__getLength = function(){
        return this.__items.curList.length
    };
    /**
     * 判断当前图片是否最后一张
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__isLast
     * @param  {Number} index - 当前图片索引
     * @return {Boolean}
     */
    _pro.__isLast = function(_index){
        return (_index||this.__items.curIndex)==this.__getLength()-1?!0:!1;
    };
    /**
     * 判断是否滚动到下一张
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__isNext
     * @param  {Number} arg0 - 滚动距离
     * @return {Boolean}
     */
    _pro.__isNext = function(_movement){
        return (_movement<0)&&Math.abs(_movement)>3;
    }
    /**
     * 判断是否滚动到前一张
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__isPrev
     * @param  {Number} arg0 - 滚动距离
     * @return {Boolean}
     */
    _pro.__isPrev = function(_movement){
        return (_movement>0)&&Math.abs(_movement)>3;
    }
    /**
     * 拖动开始事件处理函数
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__onDragStart
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onDragStart = function(_event){
        if(this.__isLock||(this.__transitionEnd&&this.__noFollow))return;
        if((this.__transitionEnd)&&(!this.__noFollow))this.__doTransitionEnd();
        //for ios default bounce bug (reflow)
        if(!this.__config.v){
            this.__horizontal = Math.abs(_event.detalX)>Math.abs(_event.detalY);
        }else{
            this.__horizontal = Math.abs(_event.detalY)>Math.abs(_event.detalX);
        }
        if(this.__horizontal)_v._$stop(_event);
        this.__dragging = !0;
    };
    /**
     * 拖动事件处理函数
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__onDrag
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onDrag = function(_event){
        if(!this.__dragging||!this.__horizontal||
            this.__isLock||(this.__transitionEnd&&this.__noFollow))return;
        var _movement=this.__scroll=_event[this.__config.m];
        if((_movement>0&&this.__items.curIndex==0)||(_movement<0&&this.__isLast())){
            this.__scroll = !!this.__noBounce?0:_movement/2;
        }
        if(!this.__noFollow){
            this.__updatePosition();
        }else{
            if(this.__isNext(_movement)){//may be next
                this.__dragging = !1;
                this._$scrollToNext();
            }else if(this.__isPrev(_movement)){//prev
                this.__dragging = !1;
                this._$scrollToPrev();
            }
        }
    };
    /**
     * 拖动结束事件处理函数
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__onDragEnd
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onDragEnd = function(_event){
        _v._$stopClick(_event);
        if(!this.__horizontal||this.__isLock||this.__noFollow)return;
        var _movement= _event[this.__config.m],
            _current = this.__items.curIndex,
            _start=this.__items.strIndex,_event={};
        if(this.__isNext(_movement)){//may be next
            this._$scrollToNext();
        }else if(this.__isPrev(_movement)){//may be prev
            this._$scrollToPrev();
        }else{
            this.__addToAniList(_current);
            this.__scrollTo(_current);
        }
    };
    /**
     * 弹性释放时
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__onBounceRelease
     * @return {Void}
     */
    _pro.__onBounceRelease = function(){
        if(this.__noFollow)return;
        var _event={};
        this._$dispatchEvent('onbouncerelease',_event);//scroll to first
        this.__addToAniList(_items.curIndex);
        this.__scrollTo(_items.curIndex,_event.offset);
    }
    /**
     * 滚动事件
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__fireEvent
     * @param  {Event}  arg0 - 事件对象
     * @param  {Object} arg1 - 配置参数
     * @return {Void}
     */
    _pro.__fireEvent = function(_event,_param){
        var _items = this.__items;
        _param = _param||o;
        switch(_event){
            case 'onbeforescroll':{
                this._$dispatchEvent('onbeforescroll',{index:_items.curIndex
                                                      ,nindex:_param.nindex
                                                      ,direction:_param.direction
                                                      ,isLast:this.__isLast(_items.curIndex)});
                break;
            }
            case 'onscroll':{
                this._$dispatchEvent('onscroll',{index:_items.curIndex
                                                ,isLast:this.__isLast(_items.curIndex)});
                break;
            }
        }
    };
    /**
     * 待添加Item列表
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__addToAddList
     * @param  {Number} arg0 - 项索引
     * @return {Void}
     */
    _pro.__addToAddList = function(_index){
        if(_index<0)return;
        this.__items.addList.push(_index);
    }
    /**
     * 待删除Item列表
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__addToDelList
     * @param  {Number} arg0 - 项索引
     * @return {Void}
     */
    _pro.__addToDelList = function(_index){
        var _items = this.__items;
        if(!!_items.curList[_index])
            _items.delList.push(_index);
    }
    /**
     * 动画播放列表
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__addToAniList
     * @return {Void}
     */
    _pro.__addToAniList = function(){
        var _items = this.__items;
        for(var i=0;i<arguments.length;i++){
            _items.aniList[+arguments[i]]=!0;
        }
    }
    /**
     * 滚动到指定卡片
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__scrollTo
     * @param  {Number} arg0 - 卡片索引
     * @param  {Number} arg1 - 偏移量
     * @return {Void}
     */
    _pro.__scrollTo = function(_index,_offset){
        this.__scroll = _offset||0;
        this.__items.curIndex=_index;
        this.__updatePosition();
        if(!!this.__indicator)this.__indicator._$update(this.__items.curIndex);
    };
    /**
     * 更新所有卡片的位置
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__updatePosition
     * @return {Void}
     */
    _pro.__updatePosition = function(){
        var _items = this.__items,
            i=_items.curList.length-1;
        if(_items.aniList.length>0){
            this.__transitionEnd = !0;
            _v._$addEvent(this.__parent,'transitionend',this.__onTransitionEnd._$bind(this));
        }
        while((!!_items.curList[i])&&(i>=0)){
            if((i<=_items.curIndex+1)&&(i>=_items.curIndex-1)){
                this.__setItemPosition(i);
            }else{
                this.__setItemPosition(i);
            }
            i--
        }
    };
    /**
     * 设置卡片的位置
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__setItemPosition
     * @param  {Number} arg0 - 卡片索引
     * @return {Void}
     */
    _pro.__setItemPosition = function(_index){
        var _items=this.__items,
            _item =_items.curList[_index],
            _offset,
            _transition;
        _transition = this.__transitionProperty;
        _transition+= _items.aniList[_index]?' 300ms linear':' 0ms linear';
        _e._$setStyle(_item,'transition',_transition);
        //caculate position
        _offset = this.__getItemOffset(_index);
        var _translate = this.__config.v?[0,_offset]:[_offset,0];
        if(this.__mode==3){
            if(this.__config.v){_item.style.top = _translate[1]+'px';
            }else{_item.style.left = _translate[0]+'px';}
        }else{
            _e._$setStyle(_item,'transform','translate('+_translate[0]+'px,'+_translate[1]+'px)'
                                             +((this.__mode==1)?' translateZ(0)':''));
        }
    };
    /**
     * 计算卡片偏移量
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__getItemOffset
     * @param  {Number} arg0 - 项索引
     * @return {Number} 偏移量
     */
    _pro.__getItemOffset = function(_index){
        return this.__scroll+(-(this.__items.curIndex-_index)*this.__worh);
    };
    /**
     * 添加卡片
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__addItem
     * @param  {Number} arg0 - 开始索引
     * @param  {Number} arg1 - 结束索引
     * @return {Void}
     */
    _pro.__addItem = function(_start,_end){
        if(_start<0)return;
        var i,_current=this.__items.curIndex;
        if(_current>_start&&_current<_end){
            for(i=_current-1;i>=_start;i--)this._$dispatchEvent('onaddcard',i);
            for(i=_current;i<=_end;i++)this._$dispatchEvent('onaddcard',i);
        }else{
            for(i=_start;i<=(_end||_start);i++)this._$dispatchEvent('onaddcard',i);
        }
    };
    /**
     * 滚动停止处理函数
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__onTransitionEnd
     * @param  {Event} _event - 事件对象
     * @return {Void}
     */
    _pro.__onTransitionEnd = function(_event){
        this.__doTransitionEnd();
        this.__fireEvent('onscroll');
    };
    /**
     * 动画结束处理函数
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__doTransitionEnd
     * @return {Void}
     */
    _pro.__doTransitionEnd = function(){
        var _that=this;
        if(!_that.__transitionEnd)return;
        _v._$clearEvent(_that.__parent,'transitionend');
        _u._$forEach(_that.__items.addList,function(_item,_index,_list){
            _that.__addItem(_item);
        });
        _u._$forEach(_that.__items.delList,function(_item,_index){
            _that.__delItem(_item);
        });
        _that.__items.addList=[];
        _that.__items.delList=[];
        _that.__items.aniList=[];
        _that.__scroll = 0;
        _that.__transitionEnd = !1;
    };
    /**
     * 控件销毁函数
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        if(this.__indicator)
            this.__indicator=_i0._$$Indicator._$recycle(this.__indicator);
        var i=this.__items.curList.length-1;
        while(!!this.__items.curList[i]&&i>=0){
            this.__delItem(i);
            i--;
        }
        this._$clearEvent();
        delete this.__parent;
        delete this.__isLock;
        delete this.__items;
        delete this.__scroll;
        delete this.__transitionEnd;
        delete this.__transitionProperty;
        this.__super();
    };
    /**
     * 卡片回收
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__delItem
     * @param  {Number} arg0 - 回收的卡片索引
     * @return {Void}
     */
    _pro.__delItem = function(_index){
        if(_index<0)return;
        var _node = this.__items.curList[_index];
        this.__parent.removeChild(_node);
        if(_index == this.__items.curList.length-1){
            this.__items.curList.pop();
        }else{
            delete this.__items.curList[_index];
        }
        this._$dispatchEvent('onrecycle',_index,_node);
    };
    /**
     * 卡片回收默认处理
     *
     * @protected
     * @method module:ui/carousel/carousel._$$Carousel#__onRecycleItem
     * @param  {Number}       arg0 - 回收项的索引
     * @param  {Node|String}  arg1 - 卡片的容器节点
     * @return {Void}
     */
    _pro.__onRecycleItem = function(_index,_node){
        _e._$remove(_node);
    };
    /**
     * 锁住控件
     * @method module:ui/carousel/carousel._$$Carousel#_$lock
     * @param  {Boolean} arg0 - 是否加锁
     * @return {Void}
     */
    _pro._$lock = function(_isLock){
       this.__isLock = !!_isLock;
    };
    /**
     * 刷新接口
     * @method module:ui/carousel/carousel._$$Carousel#_$refresh
     * @param    {Object} options - 刷新参数
     * @property {Number} current - 当前页
     * @return   {Void}
     */
    _pro._$refresh = function(_options){
        _options = _options||{};
        this.__worh = _options[this.__config.l]||this.__parent[this.__config.o];
        //get item content again
        this._$scrollToCurrent(_options.current||this.__items.curIndex);
    };
    /**
     * 滚动到下一张
     * @method module:ui/carousel/carousel._$$Carousel#_$scrollToNext
     * @return {Void}
     */
    _pro._$scrollToNext = function(){
        var _items = this.__items;
        this.__fireEvent('onbeforescroll',{direction:'next',nindex:_items.curIndex+1});
        //maybe asyn get data
        for(var i=_items.curIndex+1;i<=_items.curIndex+_items.buffer+1;i++){
            if(!_items.curList[i])this.__addToAddList(i);
        }
        if(this.__isLast()){//may be last
            this.__onBounceRelease();
        }else{
            _items.curIndex +=1;
            if(_items.curIndex>_items.buffer)_items.strIndex += 1;
            this.__addToDelList(_items.curIndex-_items.buffer-1);
            this.__addToAniList(_items.curIndex-1,_items.curIndex);
            this.__scrollTo(_items.curIndex);
        }
    };
    /**
     * 滚动到上一张
     * @method module:ui/carousel/carousel._$$Carousel#_$scrollToPrev
     * @return {Void}
     */
    _pro._$scrollToPrev = function(){
        var _items = this.__items;
        this.__fireEvent('onbeforescroll',{direction:'prev',nindex:_items.curIndex-1});
        if(this.__items.curIndex==0){
            this.__onBounceRelease();
        }else{
            this.__addToAddList(_items.curIndex-_items.buffer-1);
            this.__addToDelList(_items.curIndex+_items.buffer);
            _items.curIndex -=1;
            if(_items.curIndex>_items.buffer)_items.strIndex -= 1;
            this.__addToAniList(_items.curIndex,_items.curIndex+1);
            this.__scrollTo(this.__items.curIndex);
        }
    };
    /**
     * 滚到当前项
     * @method module:ui/carousel/carousel._$$Carousel#_$scrollToCurrent
     * @param  {Number} arg0 - 卡片索引
     * @return {Void}
     */
    _pro._$scrollToCurrent = function(_index){
        var _child = this.__parent.children,
            _items = this.__items,
            i=_items.curList.length-1,
            _start=_items.strIndex=_index-_items.buffer>=0?_index-_items.buffer:0,
            _end = _index+_items.buffer;
        if((_child.length!=_items.buffer)||(_child.length==0)){
            while((_items.curList[i])&&(i>=0)){
                this.__delItem(this.__items.curList[i]);
                i--
            }
            _items.curIndex=_index;
            this.__addItem(_start,_end);
        }
        this.__scrollTo(_index);
        this.__fireEvent('onbeforescroll',{nindex:_items.curIndex});
        this.__fireEvent('onscroll');
    };
    /**
     * 添加卡片到容器
     * @method module:ui/carousel/carousel._$$Carousel#_$appendItem
     * @param  {Object}      arg0 - 卡片索引
     * @param  {Node|String} arg1 - 添加的卡片内容
     * @return {Void}
     */
    _pro._$appendItem = function(_index,_node){
        var _container = this.__parent,
            _node = _u._$isString(_node)?_e._$html2node(_node):_node;
        this.__items.curList[_index]=_node;
        if(_index<this.__items.curIndex){
            _container.insertAdjacentElement('afterBegin',_node);
            this.__setItemPosition(_index);
        }else{
            _container.appendChild(_node);
            this.__setItemPosition(_index);
        }
    };
    /**
     * 异步添加项到容器末尾
     * @method module:ui/carousel/carousel._$$Carousel#_$appendMore
     * @param  {String} arg0 - 添加的卡片内容
     * @return {nej.ui._$$Carousel}
     */
    _pro._$appendMore = function(_html){
        var _container = this.__parent,
            _node = _e._$html2node(_html);
        _container.appendChild(_node);
        this.__items.curList[this.__items.curList.length]=_node;
        this.__setItemPosition(this.__items.curList.length);
    };
    /**
     * 返回当前卡片索引
     * @method module:ui/carousel/carousel._$$Carousel#_$getCurrentIndex
     * @return {Number}
     */
    _pro._$getCurrentIndex = function(){
        return this.__items.curIndex;
    }
    /**
     * 根据卡片索引获得卡片
     * @method module:ui/carousel/carousel._$$Carousel#_$getItemByIndex
     * @param  {Number} arg0 - 卡片索引
     * @return {Node}
     */
    _pro._$getItemByIndex = function(_index){
        return this.__items.curList[_index];
    };
    /**
     * 滚动到指定项
     * @method module:ui/carousel/carousel._$$Carousel#_$scrollTo
     * @param  {Number} arg0 - 卡片索引
     * @return {Void}
     */
    _pro._$scrollTo = function(_index){
        if(_index<0)return;
        if(_index==this.__items.curIndex-1){
            this._$scrollToPrev();
        }else if(_index==this.__items.curIndex+1){
            this._$scrollToNext();
        }else{this._$scrollToCurrent(_index);}
    };

    if (SMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});