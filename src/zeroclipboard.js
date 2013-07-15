

var ZeroClipboard = function(options) {
	var self = this;
	this.options = $.extend({}, $.fn.copy.defaults, options);
	
	$(document).ready(function() {
		loadSwfHandle.apply(self);
		self = loadSwfHandle = undefined;
	});
};

ZeroClipboard.prototype = {
	_suport: (function() {
		try {
			if (new ActiveXObject('ShockwaveFlash.ShockwaveFlash')) return true;

		} catch (e) {
			if (navigator.mimeTypes['application/x-shockwave-flash']) return true;
		}

		return false;
	})(),
	constructor: ZeroClipboard,
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