module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      "jsx-control-statements",
      [
        "module-resolver",
        {
          root: ["."],
          exptensions: [".js", ".jsx", ".json"],
          alias: {
            "@app": "./src"
          },
        },
      ],
    ]
  };
};
