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
var PerfPlus = $hx_exports.PerfPlus = function(pos,offset) {
	if(offset == null) offset = 0;
	if(pos == null) pos = "TR";
	this.currentFps = 0;
	this.currentMs = 0;
	this.currentMem = "0";
	this._pos = pos;
	this._offset = offset;
	this._time = 0;
	this._ticks = 0;
	this._fpsMin = Infinity;
	this._fpsMax = 0;
	if(this._perfObj != null && ($_=this._perfObj,$bind($_,$_.now)) != null) this._startTime = this._perfObj.now(); else this._startTime = new Date().getTime();
	this._prevTime = -PerfPlus.MEASUREMENT_INTERVAL;
};
PerfPlus.prototype = {
	start: function(win) {
		this._ui = new PerfUI();
		if(win == null) win = window;
		this._win = win;
		this._perfObj = this._win.performance;
		this._memoryObj = this._perfObj.memory;
		this._memCheck = this._perfObj != null && this._memoryObj != null && this._memoryObj.totalJSHeapSize > 0;
		this._win.requestAnimationFrame($bind(this,this._tick));
		if(window.performance.getEntriesByType != null) {
			this._ui.addResources(this._perfObj.getEntriesByType("resource"));
			this.resourceCount = this._ui.resourceCount;
			this.loadDuration = this._ui.loadDuration;
		}
	}
	,_now: function() {
		if(this._perfObj != null && ($_=this._perfObj,$bind($_,$_.now)) != null) return this._perfObj.now(); else return new Date().getTime();
	}
	,_tick: function() {
		var time;
		if(this._perfObj != null && ($_=this._perfObj,$bind($_,$_.now)) != null) time = this._perfObj.now(); else time = new Date().getTime();
		this._ticks++;
		if(time > this._prevTime + PerfPlus.MEASUREMENT_INTERVAL) {
			this.currentMs = Math.round(time - this._startTime);
			this._ui.setMs(this.currentMs);
			this.currentFps = Math.round(this._ticks * 1000 / (time - this._prevTime));
			this._fpsMin = Math.min(this._fpsMin,this.currentFps);
			this._fpsMax = Math.max(this._fpsMax,this.currentFps);
			this._ui.setFps(this.currentFps);
			this._prevTime = time;
			this._ticks = 0;
			if(this._memCheck) {
				this.currentMem = this._getFormattedSize(this._memoryObj.usedJSHeapSize,2);
				this._ui.setMem(this.currentMem);
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
		this._ui.destroy();
	}
};
var PerfUI = function() {
	this.resourceCount = 0;
	this.loadDuration = 0;
	this._data = { FPS : 0, MS : 0, MEMORY : "0"};
	this._menu = new dat.gui.GUI();
	this._menu.add(this._data,"FPS",1,60).listen();
	this._menu.add(this._data,"MS").listen();
	this._menu.add(this._data,"MEMORY").listen();
};
PerfUI.prototype = {
	setFps: function(val) {
		if(val >= 0) this._data.FPS = val;
	}
	,setMs: function(val) {
		if(val >= 0) this._data.MS = val;
	}
	,setMem: function(val) {
		this._data.MEMORY = val;
	}
	,addResources: function(data) {
		var folder = this._menu.addFolder("RESOURCE COUNT");
		this._resourcesData = data;
		this.resourceCount = data.length;
		var resources = { TOTAL : data.length, types : [], files : []};
		this._types = { count : 0, duration : 0};
		folder.add(resources,"TOTAL");
		var types = [];
		var _g = 0;
		while(_g < data.length) {
			var res = data[_g];
			++_g;
			var ext = res.name.substring(res.name.lastIndexOf(".") + 1,res.name.length);
			if(HxOverrides.indexOf(types,ext,0) == -1) types.push(ext);
		}
		var fileTypes = folder.add(resources,"types",types);
		folder.add(this._types,"count").listen();
		folder.add(this._types,"duration").listen();
		fileTypes.onChange($bind(this,this._typeStats));
		this._typeStats(types[0]);
		this._fileData = { duration : 0};
		var filesFolder = this._menu.addFolder("ALL RESOURCES");
		var files = [];
		var _g1 = 0;
		while(_g1 < data.length) {
			var res1 = data[_g1];
			++_g1;
			files.push(res1.name);
			this.loadDuration += res1.duration;
		}
		var allFiles = filesFolder.add(resources,"files",files);
		filesFolder.add(this._fileData,"duration").listen();
		allFiles.onChange($bind(this,this._fileStats));
		this._fileStats(files[0]);
	}
	,_typeStats: function(val) {
		var count = 0;
		var duration = 0;
		var _g = 0;
		var _g1 = this._resourcesData;
		while(_g < _g1.length) {
			var res = _g1[_g];
			++_g;
			var ext = res.name.substring(res.name.lastIndexOf(".") + 1,res.name.length);
			if(ext == val) {
				count++;
				duration += res.duration;
			}
		}
		this._types.count = count;
		this._types.duration = duration;
	}
	,_fileStats: function(val) {
		var duration = 0;
		var _g = 0;
		var _g1 = this._resourcesData;
		while(_g < _g1.length) {
			var res = _g1[_g];
			++_g;
			if(res.name == val) duration += res.duration;
		}
		this._fileData.duration = duration;
	}
	,destroy: function() {
		this._menu.destroy();
	}
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
PerfPlus.MEASUREMENT_INTERVAL = 1000;
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports);

//# sourceMappingURL=perf-plus.js.map