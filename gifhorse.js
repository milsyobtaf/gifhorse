#! /usr/bin/env node

var fs = require('fs');
var packageJson = require('./package.json');
var program = require('commander');
var Ffmpeg = require('ffmpeg');
var imagemagick = require('imagemagick');
var chalk = require('chalk');

program
  .version(packageJson.version)
  .usage('<input> [options] <output>')
  .option('-s, --start [start]', 'Start time in clip probably something like 01:23:45')
  .option('-d, --duration [duration]', 'Duration time for clip like 5 if you want it to be 5 seconds long')
  .option('-w, --width [width]', 'Width in pixels that you want the thing to be')
  .option('-f, --fps [fps]', 'Frames per Earth second')
  .option('-a, --annotation [annotation]', 'Words to put on top of the pictures')
  .option('-p, --pointsize [pointsize]', 'Size for the text to be')
  .action(function (input, output) {
    program.input = input;
    program.output = output.replace(/\.[^.]*$/, '');
    program.filename = output.match(/[^\/]+(?=\.)/);
  })
  .parse(process.argv);

var logger = {
  good: function(message) {
    var horseEmoji = '🐎';
    return console.log(horseEmoji + '  ' + chalk.green('clop clop: ' + message));
  },
  bad: function(message) {
    var horseHeadEmoji = '🐴';
    return console.log(horseHeadEmoji + '  ' + chalk.red('NEIGH: ' + message));
  }
};

function annotate(file) {
  logger.good('words are being put on the thing!');
  var pointsize = program.pointsize || 15;
  return imagemagick.convert([
    file,
    '-pointsize', pointsize,
    '-font', 'HelveticaNeueB',
    '-strokewidth', '2',
    '-stroke', 'black',
    '-fill', 'white',
    '-gravity', 'south',
    '-annotate', '+0+' + pointsize / 2, program.annotation,
    '-stroke', 'none',
    '-annotate', '+0+' + pointsize / 2, program.annotation,
    program.output + '.gif'
  ], function(error) {
    if (!error) {
      logger.good(program.output + '.gif exists now probably!');
      return fs.unlink(file);
    }
    return logger.bad(error);
  });
}

try {
  var ffmpegProcess = new Ffmpeg(program.input);
  return ffmpegProcess.then(function (video) {
    logger.good('video processing is happening!');
    var format = program.annotation ? 'm4v' : 'gif';
    var path = format === 'gif' ? '' : '/tmp/';
    var filename = program.filename + '.' + format;
    video.addCommand('-ss', program.start || '00:00:00');
    video.addCommand('-t', program.duration || '99:99:99');
    video
      .setVideoFormat(format)
      .setDisableAudio()
      .setVideoSize(program.width ? program.width + 'x?' : '320x?', true, false)
      .setVideoFrameRate(program.fps || 15)
      .save(path + filename, function (error, file) {
        if (!error) {
          return program.annotation ? annotate(file) : logger.good(file + ' exists now probably!');
        }
        return logger.bad(error);
      });
  }, function (error) {
    return logger.bad(error);
  });
} catch (exception) {
  if (exception.code) {
    return logger.bad(exception.code + ' ' + exception.msg);
  }
  return logger.bad(exception);
}
