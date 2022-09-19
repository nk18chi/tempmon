# tempmon

tempmon is a tool that helps develop Node.js based applications by monitoring your directory and automatically creating initial files based on your template when a new folder is created in the directory.

![GitHub](https://img.shields.io/github/license/nk18chi/tempmon)
[![CI/Testing](https://github.com/nk18chi/tempmon/actions/workflows/production.yml/badge.svg)](https://github.com/nk18chi/tempmon/actions/workflows/production.yml)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/nk18chi/tempmon)
![GitHub all releases](https://img.shields.io/github/downloads/nk18chi/tempmon/total)

https://user-images.githubusercontent.com/42604585/190933111-1366ba6a-932b-4b22-bc4d-73a4d0a5e00b.mov

## Installation

With NPM

```command
$ npm install tempmon
```

With Yarn

```command
$ yarn add tempmon
```

## Usage

1. Set the template folder path, and the directory path that tempmon should monitor to create initial files under a new folder

create .env under the root. By default, the following paths automatically set up

```
TEMPMON_WATCH_DIRECTORY=./src/**
TEMPMON_TEMPLATE_DIRECTORY=./template
```

2. Create your template files

create the folder that you set for `TEMPMON_TEMPLATE_DIRECTORY` in step 1 and put your template files in it.  
These names in the file name and file contents are replaced with the folder name that you will create

```
// ex. when you create a "simpleButton" folder
${tempmon__fileName}               -> simpleButton
${tempmon__fileName__lowercase}    -> simplebutton
${tempmon__fileName__UPPERCASE}    -> SIMPLEBUTTON
${tempmon__fileName__Firstcapital} -> SimpleButton
```

Here is the example template
[https://github.com/nk18chi/tempmon/test/template](https://github.com/nk18chi/tempmon/test/template)

3. Run `tempmon`

When tempmon is ready, the message shows up in your terminal from tempmon. And then, whenever you create a new folder, the initial files based on your templates are set in it.
