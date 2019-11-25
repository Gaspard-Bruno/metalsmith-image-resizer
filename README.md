# metalsmith-image-resizer
An image resizing plugin for [Metalsmith](http://www.metalsmith.io/) that allows resizing to mutiple sizes and it's not dependent on imagemagick/graphicsmagick.

## Installation

```
npm install metalsmith-multi-image-resizer --save
```

### Dependencies

`metalsmith-multi-image-resizer` depends on [`sharp`](http://sharp.dimens.io/). If you're on Mac OS X, you'll need to install libvips (`brew install homebrew/science/vips`). If you're on Linux or Windows, no other dependency should be needed.

## Usage

### API

```
var Metalsmith = require('metalsmith');
var imageResizer = require('metalsmith-multi-image-resizer');

Metalsmith(__dirname)
	.source(__dirname + "/src")
	.destination(__dirname + "/build")
	.use(imageResizer({
		glob: "img/backgrounds/*",
		width: 1920,
		height: 1080
	}))
	.build(function(err) {
		if (err) throw err;
	})
```

Resize different globs of images with different options:

```
Metalsmith(__dirname)
	.source(__dirname + "/src")
	.destination(__dirname + "/build")
	.use(imageResizer({
		glob: "img/backgrounds/*",
		width: 1920,
		height: 1080
	}))
	.use(imageResizer({
		glob: "img/people/*",
		width: 200,
		height: 200
	}))
	.build(function(err) {
		if (err) throw err;
	})
```

Specify an extension that you'd like to convert your photos to:

```
Metalsmith(__dirname)
	.source(__dirname + "/src")
	.destination(__dirname + "/build")
	.use(imageResizer({
		glob: "img/backgrounds/*",
		width: 1920,
		height: 1080,
		ext: "jpeg"
	}))
	.build(function(err) {
		if (err) throw err;
	})
```

Resize to only width/height and let the other scale maintaining ratio:

```
Metalsmith(__dirname)
	.source(__dirname + "/src")
	.destination(__dirname + "/build")
	.use(imageResizer({
		glob: "img/backgrounds/*",
		width: 1920
	}))
	.build(function(err) {
		if (err) throw err;
	})
```

Resize to multiple widths/heights and add the size as a suffix in the filename:

```
Metalsmith(__dirname)
	.source(__dirname + "/src")
	.destination(__dirname + "/build")
	.use(imageResizer({
		glob: "img/backgrounds/*",
		"width": [200, 600, 800],
      	"suffix": true
	}))
	.build(function(err) {
		if (err) throw err;
	})
```

Can be also used with a `metalsmith.json` file:

```
{
  "source": "src/pages",
  "destination": "public",
  "plugins": {
    "metalsmith-multi-image-resizer": {
      "glob": "img/backgrounds/*",
      "width": [200, 600, 800],
      "suffix": true
    },
  }
}
```

## Credits

Forked from [metalsmith-image-resizer](https://www.npmjs.com/package/metalsmith-image-resizer) plugin.
