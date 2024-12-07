module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      '@babel/plugin-transform-class-properties',
      { loose: true }, // Asegura que este plugin usa el modo "loose"
    ],
    [
      '@babel/plugin-transform-private-methods',
      { loose: true }, // Asegura que este plugin usa el modo "loose"
    ],
    [
      '@babel/plugin-transform-private-property-in-object',
      { loose: true }, // Asegura que este plugin usa el modo "loose"
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: true,
        regenerator: true,
      },
    ],
  ],
};
