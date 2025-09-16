# PWA Icons

This directory contains the PWA icons for the Asset Management Portal.

## Required Icon Sizes

For a complete PWA experience, you need the following icon sizes:

- **72x72** - Android home screen icon (ldpi)
- **96x96** - Android home screen icon (mdpi)
- **128x128** - Chrome Web Store icon
- **144x144** - Android home screen icon (hdpi)
- **152x152** - iOS touch icon (iPad)
- **192x192** - Android home screen icon (xhdpi) - **Required**
- **384x384** - Android splash screen icon
- **512x512** - Android home screen icon (xxhdpi) - **Required**

## How to Generate Icons

1. Start with a high-resolution source image (at least 512x512)
2. Use an online tool like:
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - [PWA Builder](https://www.pwabuilder.com/imageGenerator)
   - [Favicon.io](https://favicon.io/)

3. Or use command line tools:
   ```bash
   # Using ImageMagick
   convert source.png -resize 192x192 icon-192x192.png
   convert source.png -resize 512x512 icon-512x512.png
   ```

## Icon Guidelines

- Use a square design (1:1 aspect ratio)
- Ensure the icon works well at small sizes
- Use high contrast colors
- Consider maskable icons for better Android integration
- Include padding around the main content for maskable icons

## Current Status

🔴 **Icons needed**: Please add your custom icons to this directory replacing the placeholder files.

The manifest.json is already configured to use these icons.