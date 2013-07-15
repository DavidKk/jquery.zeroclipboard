

var old = $.fn.copy;
$.fn.copy = function(func) {
	return func && this.bind('copy', func);
};

// Default Options
$.fn.copy.defaults = {
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

// Resolve Conflict
$.fn.copy.noConflict = function() {
	$.fn.copy = old;
	return this;
};



// 必须支持 swf 才能使用该功能
if (false === ZeroClipboard.prototype._suport) {
	throw '[ZeroClipboard]: swf is not suport';
}

var zero = new ZeroClipboard();

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