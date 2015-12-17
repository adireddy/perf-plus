package web;

import js.html.PerformanceResourceTiming;
import js.html.PerformanceNavigation;
import js.html.PerformanceTiming;

@:native("performance")
extern class Performance {

	function getEntriesByType(type:String):Array<PerformanceResourceTiming>;

	var timing(default, null):PerformanceTiming;
	var navigation(default, null):PerformanceNavigation;
	var memory(default, null):MemoryInfo;

	function now():Float;
}

typedef MemoryInfo = {
	var usedJSHeapSize:Float;
	var totalJSHeapSize:Float;
	var jsHeapSizeLimit:Float;
}