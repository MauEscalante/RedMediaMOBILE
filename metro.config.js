const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'), // Para manejar archivos SVG
  },
  resolver: {
    assetExts: getDefaultConfig().resolver.assetExts.filter(ext => ext !== 'svg'), // Remueve 'svg' de las extensiones de activos
    sourceExts: [...getDefaultConfig().resolver.sourceExts, 'svg'], // Agrega 'svg' como extensión de fuente
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);