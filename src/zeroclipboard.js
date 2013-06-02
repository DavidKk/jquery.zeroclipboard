
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