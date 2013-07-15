function loadSwfHandle() {
	var options = this.options,
	CACHE_TOKEN = (options.debug ? ('?' + (Date.now ? Date.now() : new Date().getTime())) : ''),

	$ctn = $('<div class="global-zeroclipboard-container" style="cursor:pointer;"></div>')
		.css({
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
}