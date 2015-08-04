#! /usr/bin/env node

var fs = require('fs');
var crypto = require('crypto');
var packageJson = require('./package.json');
var program = require('commander');
var Ffmpeg = require('ffmpeg');
var imagemagick = require('imagemagick');
var chalk = require('chalk');

var cmdInput, cmdOutput;

var logger = {
  good: function(message) {
    var horseEmoji = '🐎';
    return console.log(horseEmoji + chalk.green('  clop clop: ' + message));
  },
  bad: function(message) {
    var horseHeadEmoji = '🐴';
    return console.log(horseHeadEmoji + chalk.red('  NEIGH: ' + message));
  }
};

program
  .version(packageJson.version)
  .usage('<input> [options] <output>')
  .option('-s, --start [start]', 'Start time in clip probably something like 01:23:45')
  .option('-d, --duration [duration]', 'Duration time for clip like 5 if you want it to be 5 seconds long')
  .option('-w, --width [width]', 'Width in pixels that you want the thing to be')
  .option('-f, --fps [fps]', 'Frames per Earth second')
  .option('-a, --annotation [annotation]', 'Words to put on top of the pictures')
  .option('-F, --fontface [fontface]', 'The font to do the words in')
  .option('-p, --pointsize [pointsize]', 'Size for the text to be')
  .action(function (input, output) {
    cmdInput = input;
    cmdOutput = output;
  })
  .parse(process.argv);

if (typeof cmdInput !== 'string' || typeof cmdOutput !== 'string') {
  logger.bad('Input or output is missing! Do the -h thing!');
  process.exit(1);
} else {
  program.input = cmdInput;
  program.output = cmdOutput.replace(/\.[^.]*$/, '');
  program.filename = cmdOutput.match(/[^\/]+(?=\.)/);
}

function annotate(file) {
  logger.good('words are being put on the thing!');
  var pointsize = program.pointsize || 15;
  var options = [
    file,
    '-pointsize', pointsize,
    '-strokewidth', '2',
    '-stroke', 'black',
    '-fill', 'white',
    '-gravity', 'south',
    '-annotate', '+0+' + pointsize / 2, program.annotation,
    '-stroke', 'none',
    '-annotate', '+0+' + pointsize / 2, program.annotation,
    program.output + '.gif'
  ];
  program.fontface && options.splice(3, 0, '-font', program.fontface);
  return imagemagick.convert(options, function(error) {
    fs.unlink(file);
    !error
      ? logger.good(program.output + '.gif exists now probably!')
      : logger.bad(error);
  });
}

try {
  var ffmpegProcess = new Ffmpeg(program.input);
  return ffmpegProcess.then(function (video) {
    logger.good('video processing is happening!');
    var path = program.annotation
      ? '/tmp/' + (crypto.randomBytes(20).toString('hex')) + '.m4v'
      : program.filename + '.gif';
    video.addCommand('-ss', program.start || '00:00:00');
    video.addCommand('-t', program.duration || '99:99:99');
    video
      .setDisableAudio()
      .setVideoSize(program.width ? program.width + 'x?' : '320x?', true, false)
      .setVideoFrameRate(program.fps || 15)
      .save(path, function (error, file) {
        return !error
          ? program.annotation
            ? annotate(file)
            : logger.good(file + ' exists now probably!')
          : logger.bad(error);
      });
  }, function (error) {
    return logger.bad(error);
  });
} catch (exception) {
  return exception.code
    ? logger.bad(exception.code + ' ' + exception.msg)
    : logger.bad(exception);
}
