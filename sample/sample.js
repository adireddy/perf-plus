(function (console, $hx_exports) { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Bunny = function(texture) {
	PIXI.Sprite.call(this,texture);
};
Bunny.__super__ = PIXI.Sprite;
Bunny.prototype = $extend(PIXI.Sprite.prototype,{
});
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
var pixi_plugins_app_Application = function() {
	this.pixelRatio = 1;
	this.set_skipFrame(false);
	this.autoResize = true;
	this.transparent = false;
	this.antialias = false;
	this.forceFXAA = false;
	this.roundPixels = false;
	this.clearBeforeRender = true;
	this.preserveDrawingBuffer = false;
	this.backgroundColor = 16777215;
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	this.set_fps(60);
};
pixi_plugins_app_Application.prototype = {
	set_fps: function(val) {
		this._frameCount = 0;
		return val >= 1 && val < 60?this.fps = val | 0:this.fps = 60;
	}
	,set_skipFrame: function(val) {
		if(val) {
			console.log("pixi.plugins.app.Application > Deprecated: skipFrame - use fps property and set it to 30 instead");
			this.set_fps(30);
		}
		return this.skipFrame = val;
	}
	,_setDefaultValues: function() {
		this.pixelRatio = 1;
		this.set_skipFrame(false);
		this.autoResize = true;
		this.transparent = false;
		this.antialias = false;
		this.forceFXAA = false;
		this.roundPixels = false;
		this.clearBeforeRender = true;
		this.preserveDrawingBuffer = false;
		this.backgroundColor = 16777215;
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.set_fps(60);
	}
	,start: function(rendererType,parentDom) {
		if(rendererType == null) rendererType = "auto";
		var _this = window.document;
		this.canvas = _this.createElement("canvas");
		this.canvas.style.width = this.width + "px";
		this.canvas.style.height = this.height + "px";
		this.canvas.style.position = "absolute";
		if(parentDom == null) window.document.body.appendChild(this.canvas); else parentDom.appendChild(this.canvas);
		this.stage = new PIXI.Container();
		var renderingOptions = { };
		renderingOptions.view = this.canvas;
		renderingOptions.backgroundColor = this.backgroundColor;
		renderingOptions.resolution = this.pixelRatio;
		renderingOptions.antialias = this.antialias;
		renderingOptions.forceFXAA = this.forceFXAA;
		renderingOptions.autoResize = this.autoResize;
		renderingOptions.transparent = this.transparent;
		renderingOptions.clearBeforeRender = this.clearBeforeRender;
		renderingOptions.preserveDrawingBuffer = this.preserveDrawingBuffer;
		if(rendererType == "auto") this.renderer = PIXI.autoDetectRenderer(this.width,this.height,renderingOptions); else if(rendererType == "canvas") this.renderer = new PIXI.CanvasRenderer(this.width,this.height,renderingOptions); else this.renderer = new PIXI.WebGLRenderer(this.width,this.height,renderingOptions);
		if(this.roundPixels) this.renderer.roundPixels = true;
		window.document.body.appendChild(this.renderer.view);
		if(this.autoResize) window.onresize = $bind(this,this._onWindowResize);
		window.requestAnimationFrame($bind(this,this._onRequestAnimationFrame));
		this._addStats();
	}
	,pauseRendering: function() {
		window.onresize = null;
		window.requestAnimationFrame(function(elapsedTime) {
		});
	}
	,resumeRendering: function() {
		if(this.autoResize) window.onresize = $bind(this,this._onWindowResize);
		window.requestAnimationFrame($bind(this,this._onRequestAnimationFrame));
	}
	,_onWindowResize: function(event) {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.renderer.resize(this.width,this.height);
		this.canvas.style.width = this.width + "px";
		this.canvas.style.height = this.height + "px";
		if(this.onResize != null) this.onResize();
	}
	,_onRequestAnimationFrame: function(elapsedTime) {
		this._frameCount++;
		if(this._frameCount == (60 / this.fps | 0)) {
			this._frameCount = 0;
			if(this.onUpdate != null) this.onUpdate(elapsedTime);
			this.renderer.render(this.stage);
		}
		window.requestAnimationFrame($bind(this,this._onRequestAnimationFrame));
	}
	,_addStats: function() {
	}
	,_addRenderStats: function(top) {
		if(top == null) top = 0;
		var ren;
		var _this = window.document;
		ren = _this.createElement("div");
		ren.style.position = "absolute";
		ren.style.width = "76px";
		ren.style.top = top + "px";
		ren.style.right = "0px";
		ren.style.background = "#CCCCC";
		ren.style.backgroundColor = "#105CB6";
		ren.style.fontFamily = "Helvetica,Arial";
		ren.style.padding = "2px";
		ren.style.color = "#0FF";
		ren.style.fontSize = "9px";
		ren.style.fontWeight = "bold";
		ren.style.textAlign = "center";
		window.document.body.appendChild(ren);
		ren.innerHTML = ["UNKNOWN","WEBGL","CANVAS"][this.renderer.type] + " - " + this.pixelRatio;
	}
};
var Main = function() {
	this.amount = 100;
	this.count = 0;
	this.isAdding = false;
	this.startBunnyCount = 2;
	this.minY = 0;
	this.minX = 0;
	this.gravity = 0.5;
	this.bunnyTextures = [];
	this.bunnys = [];
	pixi_plugins_app_Application.call(this);
	this._init();
};
Main.main = function() {
	new Main();
};
Main.__super__ = pixi_plugins_app_Application;
Main.prototype = $extend(pixi_plugins_app_Application.prototype,{
	_init: function() {
		this.stats = new PerfPlus();
		this.backgroundColor = 16777215;
		this.onUpdate = $bind(this,this._onUpdate);
		this.onResize = $bind(this,this._onResize);
		pixi_plugins_app_Application.prototype.start.call(this);
		this._setup();
	}
	,_setup: function() {
		this.maxX = window.innerWidth;
		this.maxY = window.innerHeight;
		this.container = new PIXI.Container();
		this.stage.addChild(this.container);
		var bunny1 = PIXI.Texture.fromImage("assets/bunnymark/bunny1.png");
		var bunny2 = PIXI.Texture.fromImage("assets/bunnymark/bunny2.png");
		var bunny3 = PIXI.Texture.fromImage("assets/bunnymark/bunny3.png");
		var bunny4 = PIXI.Texture.fromImage("assets/bunnymark/bunny4.png");
		var bunny5 = PIXI.Texture.fromImage("assets/bunnymark/bunny5.png");
		this.bunnyTextures = [bunny1,bunny2,bunny3,bunny4,bunny5];
		var _g1 = 0;
		var _g = this.startBunnyCount;
		while(_g1 < _g) {
			var i = _g1++;
			var b = new Bunny(this.bunnyTextures[Std.random(5)]);
			b.speedX = Math.random() * 5;
			b.speedY = Math.random() * 5 - 3;
			b.anchor.set(0.5,1);
			this.bunnys.push(b);
			this.container.addChild(b);
		}
	}
	,_onUpdate: function(elapsedTime) {
		if(this.isAdding) {
			if(this.count < 200000) {
				var _g1 = 0;
				var _g = this.amount;
				while(_g1 < _g) {
					var i = _g1++;
					var b = new Bunny(this.bunnyTextures[Std.random(5)]);
					b.speedX = Math.random() * 5;
					b.speedY = Math.random() * 5 - 3;
					b.anchor.set(0.5,1);
					b.scale.set(0.5 + Math.random() * 0.5,0.5 + Math.random() * 0.5);
					this.bunnys.push(b);
					this.container.addChild(b);
					this.count++;
				}
			}
		}
		var _g11 = 0;
		var _g2 = this.bunnys.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			this.bunnys[i1].position.x += this.bunnys[i1].speedX;
			this.bunnys[i1].position.y += this.bunnys[i1].speedY;
			this.bunnys[i1].speedY += this.gravity;
			if(this.bunnys[i1].position.x > this.maxX) {
				this.bunnys[i1].speedX *= -1;
				this.bunnys[i1].position.x = this.maxX;
			} else if(this.bunnys[i1].position.x < this.minX) {
				this.bunnys[i1].speedX *= -1;
				this.bunnys[i1].position.x = this.minX;
			}
			if(this.bunnys[i1].position.y > this.maxY) {
				this.bunnys[i1].speedY *= -0.85;
				this.bunnys[i1].position.y = this.maxY;
				if(Math.random() > 0.5) this.bunnys[i1].speedY -= Math.random() * 6;
			} else if(this.bunnys[i1].position.y < this.minY) {
				this.bunnys[i1].speedY = 0;
				this.bunnys[i1].position.y = this.minY;
			}
		}
	}
	,_onResize: function() {
		this.maxX = window.innerWidth;
		this.maxY = window.innerHeight;
	}
});
var PerfPlus = $hx_exports.PerfPlus = function(win) {
	var _g = this;
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
	this._win.onload = function() {
		_g._ui = new PlusUI();
		_g._perfObj = _g._win.performance;
		_g._memoryObj = _g._perfObj.memory;
		_g._memCheck = _g._perfObj != null && _g._memoryObj != null && _g._memoryObj.totalJSHeapSize > 0;
		_g._win.requestAnimationFrame($bind(_g,_g._tick));
		if(window.performance.getEntriesByType != null) {
			_g._ui.addResources(_g._perfObj.getEntriesByType("resource"));
			_g.resourceCount = _g._ui.resourceCount;
			_g.resourceLoadDuration = _g._ui.resourceLoadDuration;
		}
		if(window.performance.timing != null) {
			_g.pageLoadTime = _g._perfObj.timing.domComplete - _g._perfObj.timing.domLoading;
			_g._ui.setTiming(_g._perfObj.timing.domComplete - _g._perfObj.timing.domLoading);
		}
	};
};
PerfPlus.prototype = {
	_init: function() {
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
			this._ui.setMs(this.currentMs);
			this.currentFps = Math.round(this._ticks * 1000 / (time - this._prevTime));
			this.minFps = Math.min(this.minFps,this.currentFps);
			this.maxFps = Math.max(this.maxFps,this.currentFps);
			this._totalFps += this.currentFps;
			this.averageFps = this._totalFps / this._updateIntervalCount;
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
var PlusUI = function() {
	this.resourceCount = 0;
	this.resourceLoadDuration = 0;
	this._data = { FPS : 0, MS : 0, TIMING : 0, MEMORY : "0"};
	this._menu = new dat.gui.GUI();
	this._menu.add(this._data,"FPS",0,60).listen();
	this._menu.add(this._data,"MS").listen();
	this._menu.add(this._data,"TIMING").listen();
	this._menu.add(this._data,"MEMORY").listen();
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
	,addResources: function(data) {
		var folder = this._menu.addFolder("RESOURCES DATA");
		this._resourcesData = data;
		this.resourceCount = data.length;
		var resources = { TOTAL : data.length, DURATION : 0, types : [], files : []};
		this._types = { count : 0, duration : 0};
		folder.add(resources,"TOTAL");
		var types = [];
		var _g = 0;
		while(_g < data.length) {
			var res = data[_g];
			++_g;
			this.resourceLoadDuration += res.duration;
			var ext = this._stripQueryString(res.name);
			if(HxOverrides.indexOf(types,ext,0) == -1) types.push(ext);
		}
		resources.DURATION = this.resourceLoadDuration | 0;
		folder.add(resources,"DURATION");
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
	,_stripQueryString: function(val) {
		if(val.indexOf("?") > -1) val = val.substring(0,val.indexOf("?")); else val = val;
		return val.substring(val.lastIndexOf(".") + 1,val.length);
	}
	,destroy: function() {
		this._menu.destroy();
		this.resourceCount = 0;
		this.resourceLoadDuration = 0;
		this._data = { FPS : 0, MS : 0, TIMING : 0, MEMORY : "0"};
	}
};
var Std = function() { };
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
pixi_plugins_app_Application.AUTO = "auto";
pixi_plugins_app_Application.RECOMMENDED = "recommended";
pixi_plugins_app_Application.CANVAS = "canvas";
pixi_plugins_app_Application.WEBGL = "webgl";
PerfPlus.MEASUREMENT_INTERVAL = 1000;
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports);
