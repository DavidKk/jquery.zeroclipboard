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

$.fn.copy = function(func) {
	return func && this.bind('copy', func);
};