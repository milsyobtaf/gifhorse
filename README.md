# gifhorse

![](README.gif)

**gifhorse** is a CLI for making gifs(maybe with annotations) from video files.

## Installation

Have a [node](https://nodejs.org/).

Get yourself an [ffmpeg](https://www.ffmpeg.org/) and an [imagemagick](http://www.imagemagick.org/).

Then install **gifhorse**:

```
$ npm i -g gifhorse
```

## Usage

```
$ gifhorse <input> [options] <output>
```

## Options

* `-s`, `--start`: Start time in clip probably something like 01:23:45
* `-d`, `--duration`: Duration time for clip like 5 if you want it to be 5 seconds long
* `-w`, `--width`: Width in pixels that you want the thing to be
* `-f`, `--fps`: Frames per Earth second
* `-a`, `--annotation`: Words to put on top of the pictures
* `-p`, `--pointsize`: Size for the text to be

## Contributing

See [Contributing](CONTRIBUTING.md).
