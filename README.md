# perf-plus.js
Advances stats library to monitor, frame time, memory and resource details.

Uses `performance.now()` with `Date.now()` fallback on older browsers.

Tested in **Chrome**, should also work in **Firefox**, **IE** & **Opera**.

Resource details not supported in **Safari**.

#### Installation

`npm install perf-plus.js`

#### API

`var stats = new PerfPlus();`

Make sure you call `start` method after all the resources are loaded for accurate resource details.

`stats.start();`

The following data is available:

- `stats.currentFps` - current frame rate
- `stats.currentMs` - current time between frames in milli seconds
- `stats.currentMem` - current memory usage (Chrome only)
- `stats.resourceCount` - total resources loaded by the app
- `stats.loadDuration` - loadDuration of all the resources

To destroy stats call

`stats.destroy();`

#### UI

<img alt="basic" src="https://raw.githubusercontent.com/adireddy/perf-plus/master/assets/ui.png"/>

Powered by [dat.GUI](https://github.com/dataarts/dat.gui)

#### Licensing Information

<a rel="license" href="http://opensource.org/licenses/MIT">
<img alt="MIT license" height="40" src="http://upload.wikimedia.org/wikipedia/commons/c/c3/License_icon-mit.svg" /></a>

This content is released under the [MIT](http://opensource.org/licenses/MIT) License.