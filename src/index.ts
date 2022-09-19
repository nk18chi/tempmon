#!/usr/bin/env node
"use strict";

import chokidar, { FSWatcher } from "chokidar";
import fse from "fs-extra";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const watchDirectory = process.env.TEMPMON_WATCH_DIRECTORY || "./src/**";
const tempDirectory = process.env.TEMPMON_TEMPLATE_DIRECTORY || "./template";
const watcher: FSWatcher = chokidar.watch(watchDirectory, {
  persistent: true,
  ignoreInitial: true,
});

watcher
  .on("ready", () => console.log(`[tempmon] ready for changes. template directory -> ${tempDirectory}, watch diretory -> ${watchDirectory}`))
  .on("addDir", async (directory: string) => {
    try {
      // 1. copy files from template into the created folder
      fse.copySync(tempDirectory, directory);

      // 2. convert tempmon__fileName to fileName in the content/file name
      const fileArr = directory.split(path.sep);
      const fileName = fileArr[fileArr.length - 1];
      const patterns = [
        { from: /\${tempmon__fileName}/gi, to: fileName },
        { from: /\${tempmon__fileName__lowercase}/gi, to: fileName.toLowerCase() },
        { from: /\${tempmon__fileName__UPPERCASE}/gi, to: fileName.toUpperCase() },
        { from: /\${tempmon__fileName__Firstcapital}/gi, to: `${fileName.charAt(0).toUpperCase()}${fileName.substr(1).toLowerCase()}` },
      ];
      const fileNames: string[] = await fse.readdir(directory);
      fileNames.forEach((file) => {
        // 2.1 convert tempmon__fileName to fileName in the content of the file
        const absolutePath = path.join(directory, file);
        let data = fse.readFileSync(absolutePath, { encoding: "utf8" });
        patterns.forEach(({ from, to }) => {
          data = data.replace(from, to);
        });
        fse.writeFileSync(absolutePath, data);

        // 2.2 rename the fileName if it contains tempmon__fileName
        patterns.forEach(({ from, to }) => {
          const absolutePath = path.join(directory, file);
          if (file.match(from)) {
            fse.renameSync(absolutePath, absolutePath.replace(from, to));
          }
        });
      });

      // 3. show completion log
      console.log(`[tempmon] custom files have been added in ${directory}`);
    } catch (err) {
      console.log(err);
    }
  });

export default watcher;
