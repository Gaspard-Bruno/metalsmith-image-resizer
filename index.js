var fs = require('fs');
var path = require('path');
var sharp = require('sharp');
var minimatch = require('minimatch');
var debug = require('debug')('metalsmith-image-resizer');
var async = require('async');


module.exports = function(args) {
  return function(files, metalsmith, done) {
    if (!args.glob) {
      return done(new Error('metalsmith-image-resizer: "glob" arg is required'))
    }

    if (!args.width && !args.height) {
      return done(new Error('metalsmith-image-resizer: either "width" arg or "height" arg are required'))
    }

    applyToFiles(files, args, done)
  }
}

var applyToFiles = function(files, args, cb) {
  async.each(Object.keys(files), function(fileName, cb) {
    applyToFile(fileName, files, args, cb)
  }, function(err) {
    return cb(err)
  })
}

var applyToFile = function(fileName, files, args, cb) {
  if (minimatch(fileName, args.glob)) {
    var sharpFileContents = sharp(files[fileName].contents)
    var width = args.width
    var height = args.height

    if (typeof width === 'number' || typeof height === 'number') {
      resizeOneSize(fileName, args, sharpFileContents, files, cb)
      return
    }

    if (width && width instanceof Array) {
      resizeMultipleWidths(fileName, args, sharpFileContents, files, cb)
      return
    }

    if (width && width instanceof Array) {
      resizeMultipleHeights(fileName, args, sharpFileContents, files, cb)
      return
    }
  } else {
    cb(null)
  }
}

var resizeOneSize = function(fileName, args, fileContents, files, cb) {
  var resizedFile = fileContents.resize(args.width, args.height)
  var suffix = ''

  if (args.suffix) {
    suffix = 'resized'
  }

  createNewFile(fileName, args, resizedFile, suffix, files, cb)
}

var resizeMultipleWidths = function(fileName, args, fileContents, files, cb) {
  var widths = args.width

  async.each(widths, function(width, nestedCb) {
    var resizedFile = fileContents.resize(width)
    var suffix = ''

    if (args.suffix) {
      suffix = '_' + width
    }

    createNewFile(fileName, args, resizedFile, suffix, files, nestedCb)
  }, function(err) {
    cb(err)
  })
}

var resizeMultipleHeights = function(fileName, args, fileContents, files, cb) {
  var heights = args.height

  async.each(heights, function(height, nestedCb) {
    var resizedFile = fileContents.resize(height)
    var suffix = ''

    if (args.suffix) {
      suffix = '_' + height
    }

    createNewFile(fileName, args, resizedFile, suffix, files, nestedCb)
  }, function(err) {
    cb(err)
  })
}

var createNewFile = function(fileName, args, file, suffix, files, cb) {
  var fileNameSplit = fileName.split(".")
  var fileNameWithoutExt = fileNameSplit.slice(0, fileNameSplit.length - 1).join() + suffix
  var fileNameExt = fileNameSplit[fileNameSplit.length - 1]
  var ext = args.ext
  var newFileName = ''

  if (ext) {
    file.toFormat(ext)

    newFileName = [fileNameWithoutExt, args.ext].join(".")
  } else {
    newFileName = [fileNameWithoutExt, fileNameExt].join(".")
  }

  file.toBuffer(function(err, buffer) {

    files[newFileName] = {
      contents: buffer
    }

    cb(err)
  })
}
