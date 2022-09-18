module.exports = {
  "./**/*.{js,jsx,ts,tsx}": (fileName) => [`yarn run lint ${fileName.join(" ")}`, "tsc -p ./tsconfig.json --noEmit"],
};
