import fse from "fs-extra";
import watcher from "./index";

const files = ["index.ts", "${tempmon__fileName}.page.tsx", "${tempmon__fileName}.tsx"];
jest.mock(`fs-extra`, () => ({
  copySync: jest.fn().mockReturnValue(true),
  readdir: jest.fn(() => files),
  readFileSync: jest.fn(
    () => "test, ${tempmon__fileName}, ${tempmon__fileName__lowercase}, ${tempmon__fileName__UPPERCASE}, ${tempmon__fileName__Firstcapital}"
  ),
  writeFileSync: jest.fn(() => true),
  renameSync: jest.fn(() => true),
}));
console.log = jest.fn();

describe("index.js", () => {
  describe("watcher", () => {
    it("ready event", async () => {
      watcher.emit("ready");
      expect(console.log).toHaveBeenCalledWith("[tempmon] ready for changes. template directory -> ./test/template, watch diretory -> ./test/src/**");
    });
    it("addDir event", async () => {
      // before
      expect(fse.copySync).not.toHaveBeenCalled();
      expect(fse.readdir).not.toHaveBeenCalled();
      expect(fse.readFileSync).not.toHaveBeenCalled();
      expect(fse.writeFileSync).not.toHaveBeenCalled();
      expect(fse.renameSync).not.toHaveBeenCalled();

      const directory = "targetDirectory";
      watcher.emit("addDir", directory);

      // after
      expect(fse.copySync).toHaveBeenCalledTimes(1);
      expect(fse.copySync).toHaveBeenCalledWith("./test/template", directory);

      expect(fse.readdir).toHaveBeenCalledTimes(1);
      expect(fse.readdir).toHaveBeenCalledWith(directory);

      expect(fse.readFileSync).toHaveBeenCalledTimes(files.length);
      files.forEach((file, i) => {
        expect(fse.readFileSync).toHaveBeenNthCalledWith(i + 1, `${directory}/${file}`, { encoding: "utf8" });
      });

      expect(fse.writeFileSync).toHaveBeenCalledTimes(files.length);
      files.forEach((file, i) => {
        expect(fse.writeFileSync).toHaveBeenNthCalledWith(
          i + 1,
          `${directory}/${file}`,
          "test, targetDirectory, targetdirectory, TARGETDIRECTORY, Targetdirectory"
        );
      });

      expect(fse.renameSync).toHaveBeenCalledTimes(2);
      [
        ["targetDirectory/${tempmon__fileName}.page.tsx", "targetDirectory/targetDirectory.page.tsx"],
        ["targetDirectory/${tempmon__fileName}.tsx", "targetDirectory/targetDirectory.tsx"],
      ].forEach((arg, i) => {
        expect(fse.renameSync).toHaveBeenNthCalledWith(i + 1, ...arg);
      });

      expect(console.log).toHaveBeenCalledWith("[tempmon] custom files have been added in targetDirectory");
    });
  });
});
