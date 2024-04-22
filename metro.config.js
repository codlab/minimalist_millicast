/* eslint-env node */
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const resolveFrom = require("resolve-from");

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName.startsWith("event-target-shim") &&
    context.originModulePath.includes("react-native-webrtc")
  ) {
    // Resolve event-target-shim relative to the react-native-webrtc package to use v6.
    // React Native requires v5 which is not compatible with react-native-webrtc.
    const eventTargetShimPath = resolveFrom(
      context.originModulePath,
      moduleName.replace(/(\/index)$/, '')
    );
    // Logic to resolve the module name to a file path...
    // NOTE: Throw an error if there is no resolution.
    return {
      filePath: eventTargetShimPath,
      type: "sourceFile",
    };
  }

  // Ensure you call the default resolver.
  return context.resolveRequest(context, moduleName, platform);
};

const config = {
  // When enabled, the optional code below will allow Metro to resolve
  // and bundle source files with TV-specific extensions
  // (e.g., *.ios.tv.tsx, *.android.tv.tsx, *.tv.tsx)
  //
  // Metro will still resolve source files with standard extensions
  // as usual if TV-specific files are not found for a module.
  //
  // This code is not enabled by default, since it will impact bundling performance,
  // but is available for developers who need this capability.
  //
  // resolver: process.env.BUILDING_FOR_TV
  //   ? {
  //       sourceExts: [].concat(
  //         defaultConfig.resolver.sourceExts.map(e => `tv.${e}`),
  //         defaultConfig.resolver.sourceExts,
  //       ),
  //     }
  //   : undefined,
};

module.exports = mergeConfig(defaultConfig, config);
