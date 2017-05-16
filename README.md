# YouTube Scramblr

This Chrome extension allows you to modify the behaviour of YouTube. It consists of a modules, and each module does
one specific thing.

## Modules:

#### View Count Hider (HVC)
This module allows you to hide all view counters on YouTube globally. This was made to prevent video pre-judgement
and labeling of videos.

In the car community, when you tell someone how much horsepower his car has, that car becomes that number, gets
labeled. This prevents such behaviour with videos on YouTube.

#### Content Filter
This module allows you to filter visible YouTube videos. The filter supports filtering by video title or by the
name of the uploader. This module also supports a child mode, which inverts the filter and only shows content
that is whitelisted inside the filter settings.

#### Comment Filter
This module allows you to filter visible YouTube comments. This filter supports filtering by comment contents
or by comment author. This also supports a strict mode that uses a index-based search (`indexOf`), but it may cause
false positives. (ex. "ass" in "bass")

#### AutoSkip
This module automatically skips known music videos that have a long intro, such as Taylor Swift's I Knew You Were Trouble,
which has a whopping 120 seconds of stuff before the actual music starts.

To support more videos, please see the `src/autoskip.xml` file, and if you want to submit a new video, make a pull request or
open a new issue.

#### Capitalizer
This module automatically fixes titles on YouTube that are all caps. For example, "GONE WRONG" gets converted to a normal,
more down to earth "Gone Wrong". This was made to make a level playing field for videos so videos are not "clickbait"-y
and appear normally.

#### Trump Filter
Does what it says on the can.

This is a joke, as the initial repository of the module was Rob Spectre's Trump Filter.

## Building Scramblr

To build Scramblr you need a POSIX compliant environment such as Linux or macOS and the TypeScript compiler.

Windows Subsystem for Linux (WSL) is also
supported (the extension was developed on WSL) and also are other POSIX implementations such as MSYS2/Cygwin.

To build, you will need node.js, the Microsoft TypesScript Compiler (`tsc`) and GNU Make.

The following binaries need to exit with `EXIT_SUCCESS` to build: `mkdir`, `tsc`, `rm`, `make`,`cd`.

Building steps:

1) Clone the repository:
`git clone https://github.com/smclt30p/scramblr.git`
2) Change directory to the fetched one:
`cd scramblr`
3) Run make on the Makefile:
`make`
4) Deploy the extension files inside the `build` directory:
`make deploy`
5) Use `Load unpacked extension` inside Chrome and point Chrome at the `build` directory.

## How to make new modules?

Please read the documentation in `src/modules/Module.ts` __carefully__.

Next, create a new branch and create a new directory for your module inside `src/modules`.

Inside that directory create a new TypeScript file and name it accordingly to your module.
Inside that file create a new class that implements "Module" and implement all the methods according to
the documentation inside `src/modules/Module.ts`.

After the implementation of your module, submit a pull request and you will be notified if the module has
been merged after testing.

#### How to modify the DOM?
To modify the DOM inside the `service` and `init` methods, use the `docmanager` `DocumentManager` instance that
is passed to the method, and call `requestDocumentModify(() => {})`. Modify the DOM in the callback accordingly.

If you disobey this rule the whole page may freeze and crash if you modify the DOM, because if you modify the DOM
inside `service` method, the `DocumentManager` instance detects a page change and calls `service` again,
which modifies the DOM again and this ends up in an infinite loop.

#### What API's are usefull?
Look inside `src/dom/YoutubeDOM`, more specifically `getVisibleVideos()` and `getVisisbleComments()`.