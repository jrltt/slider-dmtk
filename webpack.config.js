const path = require("path");

module.exports = () => {
  return {
    context: __dirname,
    entry: "./src/main.ts",
    output: {
      filename: "main.js",
      path: path.join(__dirname, "dist"),
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: "ts-loader",
        },
      ],
    },
    resolve: {
      extensions: [".js", ".ts", ".json"],
    },
  };
};
