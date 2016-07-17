package web;

import js.html.PerformanceResourceTiming;
import js.html.PerformanceNavigation;
import js.html.PerformanceTiming;

@:native("performance")
extern class Performance {

	function getEntriesByType(type:String):Array<PerformanceResourceTiming>;
	function getEntriesByName(name:String):Array<PerformanceResourceTiming>;
	function getEntries():Array<PerformanceResourceTiming>;
	function setResourceTimingBufferSize(val:Int):Void;

	function clearMarks():Void;
	function clearMeasures():Void;
	function clearResourceTimings():Void;

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