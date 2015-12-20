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

	var _time:Float;
	var _startTime:Float;
	var _prevTime:Float;
	var _ticks:Int;
	var _memCheck:Bool;

	var _perfObj:Performance;
	var _memoryObj:MemoryInfo;

	var _ui:PlusUI;
	var _win:Window;

	var _totalFps:Float;
	var _updateIntervalCount:Float;

	public function new(?win:Window) {
		_init();
		if (win == null) win = Browser.window;
		_win = win;
	}

	public function start() {
		_ui = new PlusUI();

		_perfObj = cast _win.performance;
		_memoryObj = _perfObj.memory;
		_memCheck = (_perfObj != null && _memoryObj != null && _memoryObj.totalJSHeapSize > 0);

		_win.requestAnimationFrame(cast _tick);

		if (untyped __js__("window.performance").getEntriesByType != null) {
			_ui.addResources(_perfObj.getEntriesByType("resource"));
			resourceCount = _ui.resourceCount;
			resourceLoadDuration = _ui.resourceLoadDuration;
		}

		if (untyped __js__("window.performance").timing != null) {
			pageLoadTime = _perfObj.timing.domComplete - _perfObj.timing.fetchStart;
			_ui.setTiming(pageLoadTime);
		}
	}

	inline function _init() {
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

			_ui.setMs(currentMs);

			currentFps = Math.round((_ticks * 1000) / (time - _prevTime));
			minFps = Math.min(minFps, currentFps);
			maxFps = Math.max(maxFps, currentFps);
			_totalFps += currentFps;
			averageFps = _totalFps / _updateIntervalCount;
			_ui.setFps(currentFps);

			_prevTime = time;
			_ticks = 0;

			if (_memCheck) {
				currentMem = _getFormattedSize(_memoryObj.usedJSHeapSize, 2);
				_ui.setMem(currentMem);
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
		_ui.destroy();
		_init();
	}
}