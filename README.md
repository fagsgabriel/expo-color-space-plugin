# Expo Color Space Plugin

A simple Expo plugin that updates the default color space for iOS apps.

⚠️ **Note**: This is experimental and may affect color consistency with your design tools (like Figma). Consider keeping sRGB if precise color matching with your designs is critical.

## Requirements

- Expo SDK 53+

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

In your `app.config.js`/`app.config.ts`/`app.json`:

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
      // ["expo-color-space-plugin", { "colorSpace": "displayP3" | "SRGB" }]
    ]
  }
}
```

#### Configuration Options

- `colorSpace` (optional): The color space to apply. Options are:
  - `"displayP3"` (default from package) - Display P3 color space for wide color gamut
  - `"SRGB"` - Standard RGB color space (you get this by default without this plugin)

### 2. Rebuild your iOS app

After adding the plugin, you need to prebuild your iOS app:

```bash
npx expo prebuild --clean
```

## How it works

The plugin simply adds one line of code to your iOS AppDelegate to set the default color space. 

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

