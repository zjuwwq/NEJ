/*
 * ------------------------------------------
 * 范围裁剪控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _g = _('nej.g'),
        _t = _('nej.ut'),
        _p = _('nej.ui'),
        _proResizer;
    if (!!_p._$$Resizer) return;
    // ui css text
    var _seed_css = _e._$pushCSSText('\
        .#<uispace>-parent{position:relative;}\
        .#<uispace>{position:absolute;border:1px solid #aaa;cursor:move;$<user-select>:none;z-index:1000;}\
        .#<uispace> .zln{width:48px;height:48px;border:1px solid #fff;background:url('+_g._$BLANK_IMAGE+');}\
        .#<uispace> .zpc{border:1px solid #aaa;}\
        .#<uispace> .zpt{position:absolute;width:5px;height:5px;font-size:1px;overflow:hidden;}\
        .#<uispace> .znt{top:-1px;left:-1px;width:100%;cursor:n-resize;}\
        .#<uispace> .znr{top:-1px;right:-1px;height:100%;cursor:e-resize;}\
        .#<uispace> .znb{bottom:-1px;left:-1px;width:100%;cursor:s-resize;}\
        .#<uispace> .znl{top:-1px;left:-1px;height:100%;cursor:w-resize;}\
        .#<uispace> .zntl{top:-1px;left:-1px;cursor:nw-resize;}\
        .#<uispace> .zntr{top:-1px;right:-1px;cursor:ne-resize;}\
        .#<uispace> .znbr{bottom:-1px;right:-1px;cursor:se-resize;}\
        .#<uispace> .znbl{bottom:-1px;left:-1px;cursor:sw-resize;}');
    // html code
    var _seed_point = _e._$addHtmlTemplate('\
        {list 1..8 as x}\
        <div class="zpt ${clazz[x-1]} js-rs-${x}">&nbsp;</div>\
        {/list}');
    var _seed_html
    /**
     * 范围裁剪控件封装
     * 
     * @class   {nej.ui._$$Range}
     * @extends {nej.ui._$$Abstract}
     * @param   {Object}  可选配置参数，其他参数见nej.ut._$$Resize控件所示
     * @config  {Object}  size 初始大小，输入任意两个值，其中ratio为width/height，{width:100,height:200,ratio:0.5}
     * 
     */
    _p._$$Resizer = NEJ.C();
      _proResizer = _p._$$Resizer._$extend(_p._$$Abstract);
    /**
     * 控件初始化
     * @return {Void}
     */
    _proResizer.__init = function(){
        this.__ropt = {
            onbeforeresize:this.__onBeforeResize._$bind(this),
            onresizestart:this._$dispatchEvent._$bind(this,'onresizestart'),
            onresizeend:this._$dispatchEvent._$bind(this,'onresizeend'),
            onresize:this._$dispatchEvent._$bind(this,'onresize'),
            onmove:this._$dispatchEvent._$bind(this,'onmove')
        };
        this.__supInit();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 配置参数
     * @return {Void}
     */
    _proResizer.__reset = (function(){
        var _doParseSize = function(_size){
            if (!_size) return;
            var _width = _size.width,
                _height = _size.height,
                _ratio = _size.ratio;
            if (!!_width&&!!_height){
                return {
                    width:_width-2+'px',
                    height:_height-2+'px'
                };
            }else if(!!_ratio){
                if (!!_width){
                    return {
                        width:_width-2+'px',
                        height:Math.floor(_width/_ratio)-2+'px'
                    }
                }else if(!!_height){
                    return {
                        height:_height-2+'px',
                        width:Math.floor(_height*_ratio)-2+'px'
                    }
                }
            }
        };
        return function(_options){
            this.__supReset(_options);
            var _opt = NEJ.X(NEJ.EX({
                lock:!1,
                min:[50,50]
            },_options),this.__ropt);
            _opt.view = this.__parent;
            _opt.body = this.__body;
            _e._$style(
                this.__nsize,
                _doParseSize(_options.size)
            );
            this.__resize = _t._$$Resize._$allocate(_opt);
        };
    })();
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proResizer.__destroy = function(){
        if (!!this.__resize)
            this.__resize = this.__resize._$recycle();
        this.__supDestroy();
    };
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _proResizer.__initXGui = function(){
        this.__seed_css = _seed_css;
    };
    /**
     * 动态构建控件节点模板
     * @protected
     * @method {__initNodeTemplate}
     * @return {Void}
     */
    _proResizer.__initNodeTemplate = (function(){
        var _clazz = ['znt','znr','znb','znl','zpc zntl','zpc zntr','zpc znbr','zpc znbl'];
        return function(){
            _seed_html = _e._$addNodeTemplate(
                '<div class="'+_seed_css+'"><div class="zln">'+
                   _e._$getHtmlTemplate(_seed_point,{clazz:_clazz})+
                '</div></div>'
            );
            this.__seed_html = _seed_html;
        };
    })();
    /**
     * 初始化节点
     * @return {Void}
     */
    _proResizer.__initNode = function(){
        this.__supInitNode();
        this.__nsize = _e._$getChildren(this.__body)[0];
    };
    /**
     * 大小变化之前触发事件
     * @return {Void}
     */
    _proResizer.__onBeforeResize = function(_event){
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
     * 取裁剪信息
     * @return {Object} 信息
     * @cofnig {Number} top    距离上
     * @cofnig {Number} left   距离左
     * @cofnig {Number} width  宽
     * @cofnig {Number} height 高
     */
    _proResizer._$getResizeBox = function(){
        return this.__resize._$getResizeBox();
    };
};
NEJ.define('{lib}ui/resizer/resizer.js',
          ['{lib}ui/base.js'
          ,'{lib}base/constant.js'
          ,'{lib}util/resize/resize.js'],f);