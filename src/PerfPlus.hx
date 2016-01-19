import js.html.XMLHttpRequest;
import PlusUI.FileData;
import js.html.Window;
import web.Performance;
import js.Browser;

@:expose class PerfPlus {

	public static var MEASUREMENT_INTERVAL:Int = 1000;
	public var averageFps:Float;
	public var currentFps:Float;
	public var minFps:Float;
	public var maxFps:Float;
	public var currentMs:Float;
	public var currentMem:String;
	public var resourceCount:Int;
	public var resourceLoadDuration:Float;
	public var pageLoadTime:Float;
	public var pageRenderTime:Float;
	public var types:Array<FileData>;
	public var files:Array<FileData>;

	public var heapSizeLimit:String;
	public var totalHeapSize:String;
	public var usedHeapSize:String;

	public var navigationType:String;
	public var redirectCount:Float;

	var _time:Float;
	var _startTime:Float;
	var _prevTime:Float;
	var _ticks:Int;
	var _memCheck:Bool;

	var _perfObj:Performance;
	var _memoryObj:MemoryInfo;

	var _ui:PlusUI;
	var _win:Window;
	var _showUI:Bool;

	var _totalFps:Float;
	var _updateIntervalCount:Float;

	var _bytesPerMs:Float;

	public function new(?win:Window, ?showUI:Bool = true) {
		_init();
		if (win == null) win = Browser.window;
		_win = win;
		_showUI = showUI;
		_perfObj = cast _win.performance;
	}

	public function doFileSizePingTest(pingUrl:String, originalSize:Float, ?callback:Void -> Void) {
		var startTime = _now();
		var request = new XMLHttpRequest();
		request.open("GET", pingUrl, true);
		request.onload = function() {
			_bytesPerMs = originalSize / (_now() - startTime);
			if (callback != null) callback();
		};
		request.onerror = callback;
		request.send();
	}

	inline function _addResources() {
		if (untyped __js__("window.performance").getEntriesByType != null) {
			var data = _perfObj.getEntriesByType("resource");
			_ui.addResources(data, _bytesPerMs);
			resourceCount = data.length;
			resourceLoadDuration = _ui.resourceLoadDuration;
			types = _ui.fileTypes;
			files = _ui.files;

			types.sort(function(comp1:FileData, comp2:FileData):Int {
				return Reflect.compare(comp1.duration, comp2.duration);
			});
			types.reverse();

			files.sort(function(comp1:FileData, comp2:FileData):Int {
				return Reflect.compare(comp1.duration, comp2.duration);
			});
			files.reverse();
		}
	}

	public function start() {
		_ui = new PlusUI(_showUI);
		_memoryObj = _perfObj.memory;
		_memCheck = (_perfObj != null && _memoryObj != null && _memoryObj.totalJSHeapSize > 0);

		_addResources();

		_win.requestAnimationFrame(cast _tick);

		if (untyped __js__("window.performance").timing != null) {
			pageLoadTime = _perfObj.timing.responseEnd - _perfObj.timing.navigationStart;
			pageRenderTime = _perfObj.timing.loadEventStart - _perfObj.timing.domLoading;
			if (_showUI) _ui.setTiming(pageLoadTime);
		}

		if (untyped __js__("window.performance").memory != null) {
			heapSizeLimit = _ui.getFormattedSize(_perfObj.memory.jsHeapSizeLimit, 2);
			totalHeapSize = _ui.getFormattedSize(_perfObj.memory.totalJSHeapSize, 2);
			usedHeapSize = _ui.getFormattedSize(_perfObj.memory.usedJSHeapSize, 2);
		}

		if (untyped __js__("window.performance").navigation != null) {
			switch (_perfObj.navigation.type) {
				case 0: navigationType = "url, link, form or script redirect";
				case 1: navigationType = "page refresh";
				case 2: navigationType = "back or forward button";
				case 255: navigationType = "unknown";
			}
			redirectCount = _perfObj.navigation.redirectCount;
		}
	}

	inline function _init() {
		_bytesPerMs = 0;
		currentFps = 0;
		averageFps = 0;
		currentMs = 0;
		currentMem = "0";
		resourceCount = 0;
		resourceLoadDuration = 0;
		pageLoadTime = 0;

		_totalFps = 0;
		_updateIntervalCount = 0;

		_time = 0;
		_ticks = 0;
		minFps = Math.POSITIVE_INFINITY;
		maxFps = 0;
		_startTime = _now();
		_prevTime = -MEASUREMENT_INTERVAL;
	}

	inline function _now():Float {
		return (_perfObj != null && _perfObj.now != null) ? _perfObj.now() : Date.now().getTime();
	}

	function _tick() {
		var time = _now();
		_ticks++;

		if (time > _prevTime + MEASUREMENT_INTERVAL) {
			_updateIntervalCount++;
			currentMs = Math.round(time - _startTime);

			if (_showUI) _ui.setMs(currentMs);

			currentFps = Math.round((_ticks * 1000) / (time - _prevTime));
			minFps = Math.min(minFps, currentFps);
			maxFps = Math.max(maxFps, currentFps);
			_totalFps += currentFps;
			averageFps = _totalFps / _updateIntervalCount;
			if (_showUI) _ui.setFps(currentFps);

			_prevTime = time;
			_ticks = 0;

			if (_memCheck) {
				currentMem = _getFormattedSize(_memoryObj.usedJSHeapSize, 2);
				if (_showUI) _ui.setMem(currentMem);
			}
		}
		_startTime = time;

		_win.requestAnimationFrame(cast _tick);
	}

	function _getFormattedSize(bytes:Float, ?frac:Int = 0):String {
		var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
		if (bytes == 0) return "0";
		var precision = Math.pow(10, frac);
		var i = Math.floor(Math.log(bytes) / Math.log(1024));
		return Math.round(bytes * precision / Math.pow(1024, i)) / precision + " " + sizes[i];
	}

	public function destroy() {
		if (_showUI) _ui.destroy();
		_init();
	}
}