import js.html.PerformanceResourceTiming;
import dat.controllers.Controller;
import dat.gui.GUI;

class PerfUI {

	var _menu:GUI;
	var _data:Dynamic;
	var _types:Dynamic;
	var _fileData:Dynamic;
	var _resourcesData:Array<PerformanceResourceTiming>;

	public var resourceCount(default, null):Int;
	public var loadDuration(default, null):Float;

	public function new() {
		resourceCount = 0;
		loadDuration = 0;
		_data = { FPS: 0, MS: 0, MEMORY: "0" };
		_menu = new GUI();
		_menu.add(_data, "FPS", 1, 60).listen();
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
		var folder = _menu.addFolder("RESOURCE COUNT");
		_resourcesData = data;
		resourceCount = data.length;
		var resources = { TOTAL: data.length, types: [], files: [] };
		_types = { count: 0, duration: 0 };

		folder.add(resources, "TOTAL");

		var types:Array<String> = [];
		for (res in data) {
			var ext = res.name.substring(res.name.lastIndexOf(".") + 1, res.name.length);
			if (types.indexOf(ext) == -1) types.push(ext);
		}

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
			loadDuration += res.duration;
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
			var ext = res.name.substring(res.name.lastIndexOf(".") + 1, res.name.length);
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

	public function destroy() {
		_menu.destroy();
	}
}