
// 必须支持 swf 才能使用该功能
if (false === ZeroClipboard.prototype._suport) {
	throw '[ZeroClipboard]: swf is not suport';
}

var zero = new ZeroClipboard();
zero._constructor();

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