(function (console, $hx_exports) { "use strict";
var HxOverrides = function() { };
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
var PerfPlus = $hx_exports.PerfPlus = function(win,showUI) {
	if(showUI == null) showUI = true;
	this.currentFps = 0;
	this.averageFps = 0;
	this.currentMs = 0;
	this.currentMem = "0";
	this.resourceCount = 0;
	this.resourceLoadDuration = 0;
	this.pageLoadTime = 0;
	this._totalFps = 0;
	this._updateIntervalCount = 0;
	this._time = 0;
	this._ticks = 0;
	this.minFps = Infinity;
	this.maxFps = 0;
	if(this._perfObj != null && ($_=this._perfObj,$bind($_,$_.now)) != null) this._startTime = this._perfObj.now(); else this._startTime = new Date().getTime();
	this._prevTime = -PerfPlus.MEASUREMENT_INTERVAL;
	if(win == null) win = window;
	this._win = win;
	this._showUI = showUI;
	this._perfObj = this._win.performance;
};
PerfPlus.prototype = {
	_addResources: function() {
		if(window.performance.getEntriesByType != null) {
			this._perfObj.setResourceTimingBufferSize(500);
			var data = this._perfObj.getEntriesByType("resource");
			this._ui.addResources(data);
			this.resourceCount = data.length;
			this.resourceLoadDuration = this._ui.resourceLoadDuration;
			this.types = this._ui.fileTypes;
			this.files = this._ui.files;
			this.types.sort(function(comp1,comp2) {
				return Reflect.compare(comp1.duration,comp2.duration);
			});
			this.types.reverse();
			this.files.sort(function(comp11,comp21) {
				return Reflect.compare(comp11.duration,comp21.duration);
			});
			this.files.reverse();
		}
	}
	,start: function() {
		this._ui = new PlusUI(this._showUI);
		this._memoryObj = this._perfObj.memory;
		this._memCheck = this._perfObj != null && this._memoryObj != null && this._memoryObj.totalJSHeapSize > 0;
		this._addResources();
		this._win.requestAnimationFrame($bind(this,this._tick));
		if(window.performance.timing != null) {
			this.pageLoadTime = this._perfObj.timing.responseEnd - this._perfObj.timing.navigationStart;
			this.pageRenderTime = this._perfObj.timing.loadEventStart - this._perfObj.timing.domLoading;
			if(this._showUI) this._ui.setTiming(this.pageLoadTime);
		}
		if(window.performance.memory != null) {
			this.heapSizeLimit = this._ui.getFormattedSize(this._perfObj.memory.jsHeapSizeLimit,2);
			this.totalHeapSize = this._ui.getFormattedSize(this._perfObj.memory.totalJSHeapSize,2);
			this.usedHeapSize = this._ui.getFormattedSize(this._perfObj.memory.usedJSHeapSize,2);
		}
		if(window.performance.navigation != null) {
			var _g = this._perfObj.navigation.type;
			switch(_g) {
			case 0:
				this.navigationType = "url, link, form or script redirect";
				break;
			case 1:
				this.navigationType = "page refresh";
				break;
			case 2:
				this.navigationType = "back or forward button";
				break;
			case 255:
				this.navigationType = "unknown";
				break;
			}
			this.redirectCount = this._perfObj.navigation.redirectCount;
		}
	}
	,_init: function() {
		this.currentFps = 0;
		this.averageFps = 0;
		this.currentMs = 0;
		this.currentMem = "0";
		this.resourceCount = 0;
		this.resourceLoadDuration = 0;
		this.pageLoadTime = 0;
		this._totalFps = 0;
		this._updateIntervalCount = 0;
		this._time = 0;
		this._ticks = 0;
		this.minFps = Infinity;
		this.maxFps = 0;
		if(this._perfObj != null && ($_=this._perfObj,$bind($_,$_.now)) != null) this._startTime = this._perfObj.now(); else this._startTime = new Date().getTime();
		this._prevTime = -PerfPlus.MEASUREMENT_INTERVAL;
	}
	,_now: function() {
		if(this._perfObj != null && ($_=this._perfObj,$bind($_,$_.now)) != null) return this._perfObj.now(); else return new Date().getTime();
	}
	,_tick: function() {
		var time;
		if(this._perfObj != null && ($_=this._perfObj,$bind($_,$_.now)) != null) time = this._perfObj.now(); else time = new Date().getTime();
		this._ticks++;
		if(time > this._prevTime + PerfPlus.MEASUREMENT_INTERVAL) {
			this._updateIntervalCount++;
			this.currentMs = Math.round(time - this._startTime);
			if(this._showUI) this._ui.setMs(this.currentMs);
			this.currentFps = Math.round(this._ticks * 1000 / (time - this._prevTime));
			this.minFps = Math.min(this.minFps,this.currentFps);
			this.maxFps = Math.max(this.maxFps,this.currentFps);
			this._totalFps += this.currentFps;
			this.averageFps = this._totalFps / this._updateIntervalCount;
			if(this._showUI) this._ui.setFps(this.currentFps);
			this._prevTime = time;
			this._ticks = 0;
			if(this._memCheck) {
				this.currentMem = this._getFormattedSize(this._memoryObj.usedJSHeapSize,2);
				if(this._showUI) this._ui.setMem(this.currentMem);
			}
		}
		this._startTime = time;
		this._win.requestAnimationFrame($bind(this,this._tick));
	}
	,_getFormattedSize: function(bytes,frac) {
		if(frac == null) frac = 0;
		var sizes = ["Bytes","KB","MB","GB","TB"];
		if(bytes == 0) return "0";
		var precision = Math.pow(10,frac);
		var i = Math.floor(Math.log(bytes) / Math.log(1024));
		return Math.round(bytes * precision / Math.pow(1024,i)) / precision + " " + sizes[i];
	}
	,destroy: function() {
		if(this._showUI) this._ui.destroy();
		this.currentFps = 0;
		this.averageFps = 0;
		this.currentMs = 0;
		this.currentMem = "0";
		this.resourceCount = 0;
		this.resourceLoadDuration = 0;
		this.pageLoadTime = 0;
		this._totalFps = 0;
		this._updateIntervalCount = 0;
		this._time = 0;
		this._ticks = 0;
		this.minFps = Infinity;
		this.maxFps = 0;
		if(this._perfObj != null && ($_=this._perfObj,$bind($_,$_.now)) != null) this._startTime = this._perfObj.now(); else this._startTime = new Date().getTime();
		this._prevTime = -PerfPlus.MEASUREMENT_INTERVAL;
	}
};
var PlusUI = function(showUI) {
	if(showUI == null) showUI = true;
	this._showUI = showUI;
	this.resourceCount = 0;
	this.resourceLoadDuration = 0;
	this._data = { FPS : 0, MS : 0, TIMING : 0, MEMORY : "0"};
	if(this._showUI) {
		this._menu = new dat.gui.GUI();
		this._menu.add(this._data,"FPS",0,60).listen();
		this._menu.add(this._data,"MS").listen();
		this._menu.add(this._data,"TIMING").listen();
		this._menu.add(this._data,"MEMORY").listen();
	}
};
PlusUI.prototype = {
	_init: function() {
		this.resourceCount = 0;
		this.resourceLoadDuration = 0;
		this._data = { FPS : 0, MS : 0, TIMING : 0, MEMORY : "0"};
	}
	,setFps: function(val) {
		if(val >= 0) this._data.FPS = val;
	}
	,setMs: function(val) {
		if(val >= 0) this._data.MS = val;
	}
	,setTiming: function(val) {
		this._data.TIMING = val;
	}
	,setMem: function(val) {
		this._data.MEMORY = val;
	}
	,addResources: function(data,bytesPerMs) {
		if(bytesPerMs == null) bytesPerMs = 0;
		var folder = null;
		if(this._showUI) folder = this._menu.addFolder("RESOURCES DATA");
		this._resourcesData = data;
		this.resourceCount = data.length;
		var resources = { TOTAL : data.length, DURATION : 0, types : [], files : []};
		this._types = { count : 0, duration : 0};
		if(this._showUI) folder.add(resources,"TOTAL");
		this._fileTypes = [];
		this.fileTypes = [];
		var _g = 0;
		while(_g < data.length) {
			var res = data[_g];
			++_g;
			this.resourceLoadDuration += res.duration;
			var ext = this._stripQueryString(res.name);
			if(HxOverrides.indexOf(this._fileTypes,ext,0) == -1) {
				this._fileTypes.push(ext);
				this._typeStats(ext);
				this.fileTypes.push({ name : ext, count : this._types.count, duration : this._types.duration});
			}
		}
		resources.DURATION = this.resourceLoadDuration | 0;
		if(this._showUI) folder.add(resources,"DURATION");
		if(this._showUI) {
			var fileTypes = folder.add(resources,"types",this._fileTypes);
			folder.add(this._types,"count").listen();
			folder.add(this._types,"duration").listen();
			fileTypes.onChange($bind(this,this._typeStats));
		}
		this._typeStats(this._fileTypes[0]);
		this._fileData = { duration : 0};
		this._files = [];
		this.files = [];
		var _g1 = 0;
		while(_g1 < data.length) {
			var res1 = data[_g1];
			++_g1;
			this._files.push(res1.name);
			this._fileStats(res1.name);
			this.files.push({ name : this._stripUrlAndQueryString(res1.name), count : 1, duration : this._fileData.duration, url : res1.name, size : this.getFormattedSize(this._fileData.duration * bytesPerMs,2)});
		}
		if(this._showUI) {
			var filesFolder = this._menu.addFolder("ALL RESOURCES");
			var allFiles = filesFolder.add(resources,"files",this.files);
			filesFolder.add(this._fileData,"duration").listen();
			allFiles.onChange($bind(this,this._fileStats));
		}
		this._fileStats(this._files[0]);
	}
	,_typeStats: function(val) {
		var count = 0;
		var duration = 0;
		var _g = 0;
		var _g1 = this._resourcesData;
		while(_g < _g1.length) {
			var res = _g1[_g];
			++_g;
			var ext = this._stripQueryString(res.name);
			if(ext == val) {
				count++;
				duration += res.duration;
			}
		}
		this._types.count = count;
		this._types.duration = duration;
	}
	,_fileStats: function(val) {
		var _g = 0;
		var _g1 = this._resourcesData;
		while(_g < _g1.length) {
			var res = _g1[_g];
			++_g;
			if(res.name == val) {
				this._fileData.duration = res.duration;
				break;
			}
		}
	}
	,getFormattedSize: function(bytes,frac) {
		if(frac == null) frac = 0;
		var sizes = ["Bytes","KB","MB","GB","TB"];
		if(bytes == 0) return "0";
		var precision = Math.pow(10,frac);
		var i = Math.floor(Math.log(bytes) / Math.log(1024));
		return Math.round(bytes * precision / Math.pow(1024,i)) / precision + " " + sizes[i];
	}
	,_stripQueryString: function(val) {
		if(val.indexOf("?") > -1) val = val.substring(0,val.indexOf("?")); else val = val;
		val = val.substring(val.lastIndexOf(".") + 1,val.length);
		if(val.length > 20) return "unknown";
		return val;
	}
	,_stripUrlAndQueryString: function(val) {
		if(val.indexOf("?") > -1) val = val.substring(0,val.indexOf("?")); else val = val;
		return val.substring(val.lastIndexOf("/") + 1,val.length);
	}
	,destroy: function() {
		if(this._showUI) this._menu.destroy();
		this.resourceCount = 0;
		this.resourceLoadDuration = 0;
		this._data = { FPS : 0, MS : 0, TIMING : 0, MEMORY : "0"};
	}
};
var Reflect = function() { };
Reflect.compare = function(a,b) {
	if(a == b) return 0; else if(a > b) return 1; else return -1;
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
PerfPlus.MEASUREMENT_INTERVAL = 1000;
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports);

//# sourceMappingURL=perf-plus.js.map