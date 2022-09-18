module.exports = {
  "./**/*.{js,jsx,ts,tsx}": (fileName) => [
    `yarn run lint ${fileName.filter((f) => !f.includes("tempmon/test/template/")).join(" ")}`,
    "tsc -p ./tsconfig.json --noEmit",
  ],
};
