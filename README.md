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
* `-F`, `--fontface`: The font to do the words in
* `-p`, `--pointsize`: Size for the text to be

## Example

```
$ gifhorse test.mp4 -s 3 -d 2 -w 160 -f 15 -a "idk what I'm doing" -F HelveticaNeueB -p 30 test.gif
```

This command uses a video file called `test.mp4` to create a gif called `test.gif` with the following characteristics:

- starts `3` seconds into the video
- contains the next `2` seconds of the video
- is `160` pixels wide
- is `15` frames per second
- has the text `idk what I'm doing`
- uses the font `HelveticaNeueB`
- has text that is `30` points in size

## Contributing

See [Contributing](CONTRIBUTING.md).
