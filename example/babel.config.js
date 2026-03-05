module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@popapp/theme": "../registry/theme",
            "@popapp/components": "../registry/components",
            "@popapp/hooks": "../registry/hooks",
            "@popapp/utils": "../registry/utils",
          },
        },
      ],
      "react-native-reanimated/plugin", // Must be last
    ],
  };
};
