const path = require("path");
module.exports = {
  target: "node",
  externals: {
    express: "express",
  },
  entry: {
    index: "./public/index.js",
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "public"),
  },
};
