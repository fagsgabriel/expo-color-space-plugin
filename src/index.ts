import {
  ConfigPlugin,
  withDangerousMod,
} from 'expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

interface ColorSpacePluginConfig {
  colorSpace?: 'SRGB' | 'displayP3'
}

/**
 * Expo plugin to configure color space settings in iOS AppDelegate
 */
const withColorSpacePlugin: ConfigPlugin<ColorSpacePluginConfig | void> = (config, options = {}) => {
  const colorSpace = options?.colorSpace || 'displayP3';
  
  // Only modify iOS since color space configuration is iOS-specific
  config = withDangerousMod(config, [
    'ios',
    async (config) => {
      const iosDir = config.modRequest.platformProjectRoot;
      const projectName = config.modRequest.projectName || config.name;
      
      if (!projectName) {
        throw new Error('Expo Color Space Plugin: Project name not found in config');
      }
      
      // Paths to AppDelegate files
      const appDelegateSwiftPath = path.join(iosDir, projectName, 'AppDelegate.swift');
      const bridgingHeaderPath = path.join(iosDir, projectName, `${projectName}-Bridging-Header.h`);

      try {        
        // Modify Bridging Header to add the import
        await modifyBridgingHeader(bridgingHeaderPath);
        
        // Modify AppDelegate.swift to add the color space configuration
        await modifyAppDelegateSwift(appDelegateSwiftPath, colorSpace);
                
      } catch (error) {
        console.error('❌ Expo Color Space Plugin: Error modifying AppDelegate files:', error);
        throw error;
      }

      return config;
    },
  ]);

  return config;
};

/**
 * Modifies Bridging Header to add the RCTColorSpaceUtils import
 */
async function modifyBridgingHeader(filePath: string): Promise<void> {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Bridging header not found at ${filePath}`);
    return;
  }

  let headerContent = fs.readFileSync(filePath, 'utf8');
  const importStatement = '#import <React/RCTColorSpaceUtils.h>';
  
  // Check if import already exists
  if (headerContent.includes(importStatement)) {
    console.log('ℹ️ RCTColorSpaceUtils import already exists in bridging header');
    return;
  }

  // Add the import after existing content
  headerContent = headerContent.trim() + '\n' + importStatement + '\n';
  
  fs.writeFileSync(filePath, headerContent);
  console.log('✅ Added RCTColorSpaceUtils import to bridging header');
}

/**
 * Modifies AppDelegate.swift to add the color space configuration
 */
async function modifyAppDelegateSwift(
  filePath: string, 
  colorSpace: string
): Promise<void> {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ AppDelegate.swift not found at ${filePath}`);
    return;
  }

  let swiftContent = fs.readFileSync(filePath, 'utf8');
  const colorSpaceValue = colorSpace === 'displayP3' ? 'displayP3' : 'SRGB';
  const colorSpaceCall = `    RCTColorSpaceUtils.applyDefaultColorSpace(RCTColorSpace.${colorSpaceValue})`;
  
  // Remove any existing color space calls first
  swiftContent = swiftContent.replace(/\s*RCTColorSpaceUtils\.applyDefaultColorSpace\([^)]+\)\s*\n?/g, '');
  
  // Check if we still have color space calls (shouldn't happen after removal)
  if (swiftContent.includes('RCTColorSpaceUtils.applyDefaultColorSpace')) {
    console.log('ℹ️ Color space configuration already exists in AppDelegate.swift');
    return;
  }

  // Find the return super.application line in didFinishLaunchingWithOptions
  const returnRegex = /(\s*return super\.application\(application, didFinishLaunchingWithOptions: launchOptions\))/;
  const match = swiftContent.match(returnRegex);
  
  if (!match) {
    console.warn('⚠️ Could not find return super.application line in AppDelegate.swift');
    return;
  }

  const returnStart = match.index!;
  // Insert the color space configuration right before the return statement
  swiftContent = swiftContent.slice(0, returnStart) + 
    '\n' + colorSpaceCall + '\n' + 
    swiftContent.slice(returnStart);
  
  fs.writeFileSync(filePath, swiftContent);
  console.log(`✅ Added color space configuration (${colorSpace}) to AppDelegate.swift`);
}

export default withColorSpacePlugin;
