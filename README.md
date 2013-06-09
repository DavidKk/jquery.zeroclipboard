zeroclipboard jQuery plugin - 点击复制文字插件
====================

1. [Git](https://github.com/DavidKk/jquery.zeroclipboard)
2. [Online Demo]()
3. [David]()

介绍 - Introduction
---------------

1. 修改自 zeroclipboard plugin - Modify by zeroclipboard v1.1.7;
2. 能够绑定 selector, 每次 createElement 时都会拥有该方法, 不用重复绑定;
3. $.fn.copy 即可调用, 但是必须点击才能触发复制 因为不点击会禁止;
4. `通过 e.copyText()` 函数进行绑定;

实例 - Demo
---------------

冒泡形式绑定 `live`
```bash
$(document).on('copy', 'button', function(e) {
	var text = $('#copyText').val();
	e.copyText(text); // 必须 copyText
	trace('copy success');
	$('#test').focus();
});
```

普通形式绑定 
```bash
$('#copy').bind('copy', function(e) {
	var text = $('#copyText').val();
	e.copyText(text);
	trace('copy success');
	$('#test').focus();
});
```