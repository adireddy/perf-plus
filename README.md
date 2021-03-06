# ![perf plus logo](https://raw.githubusercontent.com/adireddy/perf-plus/master/assets/logo.png)
Advanced stats library to monitor, frame time, memory and resource details.

Uses `performance.now()` with `Date.now()` fallback on older browsers.

Tested in **Chrome**, should also work in **Firefox**, **IE** & **Opera**.

Resource details not supported in **Safari**.

## Installation

`npm install perf-plus.js`

## API

`var perf = new PerfPlus();`

Make sure you call `start` method after all the resources are loaded for accurate resource details.

`perf.start();`

The following data is available:

- `perf.currentFps` - current frame rate
- `perf.averageFps` - average frame rate
- `perf.minFps` - minimum frame rate
- `perf.maxFps` - maximum frame rate
- `perf.currentMs` - current time between frames in milli seconds
- `perf.currentMem` - current memory usage (Chrome only)
- `perf.resourceCount` - total resources loaded by the app
- `perf.resourceLoadDuration` - loadDuration of all the resources
- `perf.pageLoadTime` - dom load time

To destroy stats call

`perf.destroy();`

## UI

<img alt="basic" src="https://raw.githubusercontent.com/adireddy/perf-plus/master/assets/ui.png" width="245" height="159" />

Powered by [dat.GUI](https://github.com/dataarts/dat.gui)

## Bookmarklet

```js
javascript:(function(){
    var script=document.createElement('script');script.src='//cdn.rawgit.com/adireddy/perf-plus/53db290a194b91af93d1fb34d3d3b602fbfe74d3/dist/perf-plus.min.js';document.head.appendChild(script);script.onload=function(){window.perf = new PerfPlus();window.perf.start();}
}())
```

## Licensing Information

<a rel="license" href="http://opensource.org/licenses/MIT">
<img alt="MIT license" height="40" src="http://upload.wikimedia.org/wikipedia/commons/c/c3/License_icon-mit.svg" /></a>

This content is released under the [MIT](http://opensource.org/licenses/MIT) License.