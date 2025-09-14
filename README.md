# expo-color-space-plugin

An Expo plugin that automatically configures color space settings in your iOS app's AppDelegate.

## What it does

This plugin automatically modifies your iOS project files to:

1. **Add the import** to `AppDelegate.h`:
   ```objc
   #import <React/RCTColorSpaceUtils.h>
   ```

2. **Insert the color space configuration** in `AppDelegate.m` before `didFinishLaunchingWithOptions`:
   ```objc
   RCTColorSpaceUtils.applyDefaultColorSpace(RCTColorSpace.SRGB);
   ```

## Installation

```bash
npm install expo-color-space-plugin
```

or

```bash
yarn add expo-color-space-plugin
```

## Usage

### 1. Add to your app config

In your `app.config.js` or `app.config.ts`:

```javascript
export default {
  expo: {
    name: "Your App",
    slug: "your-app",
    // ... other config
    plugins: [
      // ... other plugins
      "expo-color-space-plugin"
      // Or with custom color space:
      // ["expo-color-space-plugin", { "colorSpace": "P3" }]
    ]
  }
}
```

#### Configuration Options

- `colorSpace` (optional): The color space to apply. Options are:
  - `"SRGB"` (default) - Standard RGB color space
  - `"P3"` - Display P3 color space  
  - `"REC2020"` - Rec. 2020 color space

### 2. Rebuild your iOS app

After adding the plugin, you need to rebuild your iOS app:

```bash
# For development builds
expo run:ios

# For EAS builds
eas build --platform ios
```

## How it works

The plugin uses Expo's config plugin system to modify native code during the build process. It:

1. Locates your iOS project's `AppDelegate.h` and `AppDelegate.m` files
2. Safely adds the required import statement to the header file
3. Inserts the color space configuration call at the beginning of the `didFinishLaunchingWithOptions` method
4. Ensures no duplicate entries are created if the plugin runs multiple times

## Requirements

- Expo SDK 47+
- iOS project (the plugin only affects iOS builds)
- React Native with the `RCTColorSpaceUtils` module available

## Troubleshooting

### Plugin not working?

1. **Clean and rebuild**: Remove your iOS build folder and rebuild
   ```bash
   expo run:ios --clear
   ```

2. **Check your Expo version**: Ensure you're using Expo SDK 47 or later

3. **Verify the changes**: After building, you can check that the modifications were applied by looking at:
   - `ios/YourApp/AppDelegate.h` should contain the import
   - `ios/YourApp/AppDelegate.m` should contain the color space call

### Build errors?

If you encounter build errors, ensure that:
- Your React Native version supports `RCTColorSpaceUtils`
- The `React/RCTColorSpaceUtils.h` header is available in your project

## Development

To contribute to this plugin:

```bash
git clone <repo-url>
cd expo-color-space-plugin
npm install
```

### Building the Plugin

The plugin uses TypeScript and needs to be built before use:

```bash
# Build the plugin
npm run build

# Clean build artifacts
npm run clean

# Lint the plugin code
npm run lint
```

### Testing

To test the plugin in a real project:

1. Create a test Expo app
2. Build the plugin: `npm run build`
3. Link this plugin locally: `npm link` in this directory, then `npm link expo-color-space-plugin` in your test app
4. Add the plugin to your test app's config
5. Run `npx expo prebuild` to see the plugin in action
6. Build and verify the changes

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

