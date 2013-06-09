/*!jquery.zeroclipboard - v0.1.0 - 2013-06-09
 * Homepage https://github.com/DavidKk/jquery.zeroclipboard
 * Copyright 2013 David;
 * Description Modify by zeroclipboard v1.1.7
 * Require jQuery
 *
 * 能够绑定 selector, 每次 createElement 时都会拥有该方法, 不用重复绑定
 * $.fn.copy 即可调用, 但是必须点击才能触发复制 因为不点击会禁止
**/

;(function($) {

// options 配置文件
var options = {
	debug: $.debug || true,
	SWF_PATH: '../swf/ZeroClipboard.swf',
	BASE_PATH: (function() {
		var $scripts = $('head').children('script');
		var len = $scripts.length;
		var js = $scripts[len-1].src, local = location.href.replace(/\?+(.*)/, '');
		var basePath = js.substring(0, js.lastIndexOf('/') + 1).replace(/core\/$/, '');
		
		var protocolPreg = /^(https?|ftp|gopher|telnet|file|notes|ms-help):\/\//;
		if (basePath.match(protocolPreg)) return basePath;

		var protocol = local.match(protocolPreg);
		protocol = protocol && protocol[0];

		return protocol + document.domain + '/' + basePath;
	})(),
	ALLOW_SCRIPT_ACCESS: 'sameDomain'
};

/*!	ZeroClipboard 主程序 **/
var ZeroClipboard = function() {};

ZeroClipboard.prototype = {
	_suport: (function() {
		try {
			if (new ActiveXObject('ShockwaveFlash.ShockwaveFlash')) return true;

		} catch (e) {
			if (navigator.mimeTypes['application/x-shockwave-flash']) return true;
		}

		return false;
	})(),
	_constructor: (function() {
		var loadSwfHandle = function() {
			var CACHE_TOKEN = (options.debug ? ('?' + (Date.now ? Date.now() : new Date().getTime())) : '');
			var $ctn = $('<div class="global-zeroclipboard-container" style="cursor:pointer;"></div>').css({
				position: 'absolute',
				left: -9999,
				top: -9999,
				width: 15,
				height: 15,
				zIndex: 99999,
				opcity: 0,
				visiable: 'hidden'
			})
			.html([
			'<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="global-zeroclipboard-flash-bridge" width="100%" height="100%">',
				'<param name="movie" value="' + options.BASE_PATH + options.SWF_PATH + CACHE_TOKEN + '"/>',
				'<param name="allowScriptAccess" value="' + options.ALLOW_SCRIPT_ACCESS + '"/>',
				'<param name="scale" value="exactfit"/>',
				'<param name="loop" value="false"/>',
				'<param name="menu" value="false"/>',
				'<param name="quality" value="best"/>',
				'<param name="bgcolor" value="#ffffff"/>',
				'<param name="wmode" value="transparent"/>',
				'<param name="flashvars" value=""/>',
				'<embed src="' + options.BASE_PATH + options.SWF_PATH + CACHE_TOKEN + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="100%" height="100%" name="global-zeroclipboard-flash-bridge" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" wmode="transparent" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="" scale="exactfit"></embed>',
			'</object>'
			].join(''))
			.appendTo('body');

			this.htmlBridge = $ctn.get(0);
			this.flashBridge = document['global-zeroclipboard-flash-bridge'] || this.htmlBridge.children[0].lastElementChild;
			this.ready = false;
		};

		return function() {
			var self = this;
			$(document).ready(function() {
				loadSwfHandle.apply(self);
				self = loadSwfHandle = undefined;
			});
		};
	})(),
	copyText: function(text) {
		if (this.ready && 'string' === typeof text) {
			this.flashBridge.setText(text);
			return true;
		}

		return false;
	},
	setSize: function(width, height) {
		if (false !== this.ready) this.flashBridge.setSize.apply(this.flashBridge, arguments);
		return this;
	},
	setHandCursor: function() {
		this.flashBridge.setHandCursor.apply(this.flashBridge, arguments);
		return this;
	},
	fixed: function(target) {
		if (false === this.ready) return this;
		var $tar = $(target), oft = $tar.offset();
		var width = $tar.outerWidth(), height = $tar.outerHeight();

		$(this.htmlBridge).css({
			width: width,
			height: height,
			left: oft.left,
			top: oft.top,
			zIndex: (Number($tar.css('zIndex')) || 9998) + 1
		});

		this.setSize(width, height);
		return this;
	},
	reset: function() {
		$(this.htmlBridge).css({
			left: -9999,
			top: -9999
		});

		this.current = undefined;
		return this;
	},
	setCurrent: function(el) {
		this.current = el;
		return this;
	},
	dispatch: function(eventName, args) {
		eventName = eventName.toLowerCase();
		switch (eventName) {
			case 'load':
				this.ready = (args && parseFloat(args.flashVersion.replace(',', '.').replace(/[^0-9\.]/gi, '')) >= 10);
				this.setHandCursor(true);
				break;
			case 'mouseout':
				zero.reset();
				break;
			case 'datarequested':
				$(this.current).trigger('click').trigger('copyText');
				break;
			default:
				$(this.current).trigger(eventName);
		}
	},
	destroy: function() {
		$(this.htmlBridge).remove();
		$(this.flashBridge).remove();
		this.htmlBridge = this.flashBridge = undefined;
		return this;
	}
};

// 必须支持 swf 才能使用该功能
if (false === ZeroClipboard.prototype._suport) {
	throw '[ZeroClipboard]: swf is not suport';
}

var zero = new ZeroClipboard();
zero._constructor();

if ('undefined' !== typeof module) {
	module.exports = zero;

} else if ('function' === typeof define && define.amd) {
	define(function() {
		return zero;
	});
} else {
	window.ZeroClipboard = zero;
}

if ($.event.special.copy) {
	throw '[ZeroClipboard]: $.event.special.copy is already exists';
}

// extends jquery.event
$.event.special.copy = (function() {
	var mouseoverHandle = function() {
		zero.fixed(this);
		zero.setCurrent(this);
	};

	return {
		add: function(obj) {
			var sel = obj.selector;
			var oldHandle = obj.handler;
			obj.handler = function(event) {
				event.copyText = function() {
					return zero.copyText.apply(zero, arguments);
				};

				oldHandle.call(this, event);
			};

			$(this).delegate(sel, 'mouseover', mouseoverHandle)
				.delegate(sel, 'copyText', obj.handler);
		},
		remove: function(obj) {
			var sel = obj.selector;
			$(this).undelegate(sel, 'mouseover', mouseoverHandle)
				.undelegate(sel, 'copyText', obj.handler);

			obj.handler = undefined;
		}
	};
})();

// extend jquery api
$.fn.copy = function(func) {
	return func && this.bind('copy', func);
};

})(jQuery);