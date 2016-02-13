import js.html.PerformanceResourceTiming;
import dat.controllers.Controller;
import dat.gui.GUI;

class PlusUI {

	var _menu:GUI;
	var _data:Dynamic;
	var _types:Dynamic;
	var _fileData:Dynamic;
	var _resourcesData:Array<PerformanceResourceTiming>;
	var _showUI:Bool;

	public var resourceCount(default, null):Int;
	public var resourceLoadDuration(default, null):Float;

	public var fileTypes(default, null):Array<FileData>;
	public var files(default, null):Array<FileData>;

	var _fileTypes:Array<String>;
	var _files:Array<String>;

	public function new(?showUI:Bool = true) {
		_showUI = showUI;
		_init();
		if (_showUI) {
			_menu = new GUI();
			_menu.add(_data, "FPS", 0, 60).listen();
			_menu.add(_data, "MS").listen();
			_menu.add(_data, "TIMING").listen();
			_menu.add(_data, "MEMORY").listen();
		}
	}

	inline function _init() {
		resourceCount = 0;
		resourceLoadDuration = 0;
		_data = { FPS: 0, MS: 0, TIMING: 0, MEMORY: "0" };
	}

	public function setFps(val:Float) {
		if (val >= 0) _data.FPS = val;
	}

	public function setMs(val:Float) {
		if (val >= 0) _data.MS = val;
	}

	public function setTiming(val:Float) {
		_data.TIMING = val;
	}

	public function setMem(val:String) {
		_data.MEMORY = val;
	}

	public function addResources(data:Array<PerformanceResourceTiming>, ?bytesPerMs:Float = 0) {
		var folder = null;
		if (_showUI) folder = _menu.addFolder("RESOURCES DATA");
		_resourcesData = data;
		resourceCount = data.length;
		var resources = { TOTAL: data.length, DURATION: 0, types: [], files: [] };
		_types = { count: 0, duration: 0 };

		if (_showUI) folder.add(resources, "TOTAL");

		_fileTypes = [];
		fileTypes = [];
		for (res in data) {
			resourceLoadDuration += res.duration;
			var ext = _stripQueryString(res.name);
			if (_fileTypes.indexOf(ext) == -1) {
				_fileTypes.push(ext);
				_typeStats(ext);
				fileTypes.push({name: ext, count: _types.count, duration: _types.duration });
			}
		}
		resources.DURATION = Std.int(resourceLoadDuration);
		if (_showUI) folder.add(resources, "DURATION");

		if (_showUI) {
			var fileTypes = folder.add(resources, "types", _fileTypes);
			folder.add(_types, "count").listen();
			folder.add(_types, "duration").listen();
			fileTypes.onChange(_typeStats);
		}
		_typeStats(_fileTypes[0]);

		_fileData = { duration: 0 };
		_files = [];
		files = [];
		for (res in data) {
			_files.push(res.name);
			_fileStats(res.name);
			files.push({name: _stripUrlAndQueryString(res.name), count: 1, duration: _fileData.duration, url: res.name, size: getFormattedSize(_fileData.duration * bytesPerMs, 2) });
		}

		if (_showUI) {
			var filesFolder = _menu.addFolder("ALL RESOURCES");
			var allFiles = filesFolder.add(resources, "files", files);
			filesFolder.add(_fileData, "duration").listen();
			allFiles.onChange(_fileStats);
		}
		_fileStats(_files[0]);
	}

	function _typeStats(val) {
		var count:Int = 0;
		var duration:Float = 0;
		for (res in _resourcesData) {
			var ext = _stripQueryString(res.name);
			if (ext == val) {
				count++;
				duration += res.duration;
			}
		}
		_types.count = count;
		_types.duration = duration;
	}

	function _fileStats(val) {
		for (res in _resourcesData) {
			if (res.name == val) {
				_fileData.duration = res.duration;
				break;
			}
		}
	}

	public function getFormattedSize(bytes:Float, ?frac:Int = 0):String {
		var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
		if (bytes == 0) return "0";
		var precision = Math.pow(10, frac);
		var i = Math.floor(Math.log(bytes) / Math.log(1024));
		return Math.round(bytes * precision / Math.pow(1024, i)) / precision + " " + sizes[i];
	}

	inline function _stripQueryString(val:String):String {
		val = val.indexOf("?") > -1 ? val.substring(0, val.indexOf("?")) : val;
		val = val.substring(val.lastIndexOf(".") + 1, val.length);
		if (val.length > 20) return "unknown";
		return val;
	}

	inline function _stripUrlAndQueryString(val:String):String {
		val = val.indexOf("?") > -1 ? val.substring(0, val.indexOf("?")) : val;
		return val.substring(val.lastIndexOf("/") + 1, val.length);
	}

	public function destroy() {
		if (_showUI) _menu.destroy();
		_init();
	}
}

typedef FileData = {
	var name:String;
	var duration:Float;
	@:optional var count:Int;
	@:optional var url:String;
	@:optional var size:String;
}