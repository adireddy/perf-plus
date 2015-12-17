import js.html.PerformanceResourceTiming;
import dat.controllers.Controller;
import dat.gui.GUI;

class PlusUI {

	var _menu:GUI;
	var _data:Dynamic;
	var _types:Dynamic;
	var _fileData:Dynamic;
	var _resourcesData:Array<PerformanceResourceTiming>;

	public var resourceCount(default, null):Int;
	public var loadDuration(default, null):Float;

	public function new() {
		_init();
	}

	inline function _init() {
		resourceCount = 0;
		loadDuration = 0;
		_data = { FPS: 0, MS: 0, MEMORY: "0" };
		_menu = new GUI();
		_menu.add(_data, "FPS", 0, 60).listen();
		_menu.add(_data, "MS").listen();
		_menu.add(_data, "MEMORY").listen();
	}

	public function setFps(val:Float) {
		if (val >= 0) _data.FPS = val;
	}

	public function setMs(val:Float) {
		if (val >= 0) _data.MS = val;
	}

	public function setMem(val:String) {
		_data.MEMORY = val;
	}

	public function addResources(data:Array<PerformanceResourceTiming>) {
		var folder = _menu.addFolder("RESOURCES DATA");
		_resourcesData = data;
		resourceCount = data.length;
		var resources = { TOTAL: data.length, DURATION: 0, types: [], files: [] };
		_types = { count: 0, duration: 0 };

		folder.add(resources, "TOTAL");

		var types:Array<String> = [];
		for (res in data) {
			loadDuration += res.duration;
			var ext = _stripQueryString(res.name);
			if (types.indexOf(ext) == -1) types.push(ext);
		}
		resources.DURATION = Std.int(loadDuration);
		folder.add(resources, "DURATION");

		var fileTypes = folder.add(resources, "types", types);
		folder.add(_types, "count").listen();
		folder.add(_types, "duration").listen();
		fileTypes.onChange(_typeStats);
		_typeStats(types[0]);

		_fileData = { duration: 0 };
		var filesFolder = _menu.addFolder("ALL RESOURCES");
		var files:Array<String> = [];
		for (res in data) {
			files.push(res.name);
		}
		var allFiles = filesFolder.add(resources, "files", files);
		filesFolder.add(_fileData, "duration").listen();
		allFiles.onChange(_fileStats);
		_fileStats(files[0]);
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
		var duration:Float = 0;
		for (res in _resourcesData) {
			if (res.name == val) {
				duration += res.duration;
			}
		}
		_fileData.duration = duration;
	}

	inline function _stripQueryString(val:String):String {
		val = val.indexOf("?") > -1 ? val.substring(0, val.indexOf("?")) : val;
		return val.substring(val.lastIndexOf(".") + 1, val.length);
	}

	public function destroy() {
		_menu.destroy();
		_init();
	}
}