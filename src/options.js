
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