#! /usr/bin/env node

var fs = require('fs');
var exec = require('child_process').exec;
var crypto = require('crypto');
var packageJson = require('./package.json');
var program = require('commander');
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
  program.output = cmdOutput;
}

function annotate() {
  logger.good('words are being put on the thing!');
  exec([
    'convert', program.annotationPath,
    '-pointsize', program.pointsize || (program.pointsize = 15),
    program.fontface ? '-font' : '', program.fontface ? program.fontface : '',
    '-strokewidth', '2',
    '-stroke', 'black',
    '-fill', 'white',
    '-gravity', 'south',
    '-annotate', '+0+' + program.pointsize / 2, '"' + program.annotation + '"',
    '-stroke', 'none',
    '-annotate', '+0+' + program.pointsize / 2, '"' + program.annotation + '"',
    program.output
  ].join(' '));
}

try {
  program.palette = '/tmp/palette.png';
  program.filters = 'fps=' + program.fps + ',scale=' + (program.width || 320) + ':-1:flags=lanczos';
  program.annotationPath = program.annotation && '/tmp/' + crypto.randomBytes(20).toString('hex') + '.m4v';

  logger.good('a palette is being did!');
  exec([
    'ffmpeg',
    '-ss', program.start || '00:00:00',
    '-t', program.duration || '99:99:99',
    '-i', program.input,
    '-vf', program.filters + ',palettegen',
    '-y', '/tmp/palette.png'
  ].join(' '));

  logger.good('video processing is happening!');
  exec([
    'ffmpeg',
    '-ss', program.start || '00:00:00',
    '-t', program.duration || '99:99:99',
    '-i', program.input,
    '-i', program.palette,
    '-lavfi', '"' + program.filters + ' [x]; [x][1:v] paletteuse' + '"',
    '-y', program.annotationPath ? program.annotationPath : program.output
  ].join(' '), program.annotation
    ? annotate
    : logger.good(program.output + ' exists now probably!')
  );

} catch (exception) {
  return exception.code
    ? logger.bad(exception.code + ' ' + exception.msg)
    : logger.bad(exception);
}
