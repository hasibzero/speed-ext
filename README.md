# YouTube & Facebook Speed Accelerator

A lightweight browser extension that adds customizable playback speed controls to YouTube and Facebook videos, giving you complete control over how fast or slow you want to watch your content.

## Features

- **🎯 Universal Speed Control**: Adjust playback speed from 0.5x to 4.0x with 0.25x increments
- **🎬 YouTube Integration**: Seamlessly integrates into YouTube's native control bar
- **📱 Facebook Support**: Adds a floating overlay to Facebook videos with smart visibility controls
- **💾 Persistent Speed Settings**: Remembers your last speed setting across videos (especially useful for Facebook feeds)
- **⚡ Real-time Updates**: Instant speed changes with visual feedback
- **🎨 Clean UI**: Minimalist design that blends with the native player interfaces

## Installation

### From Source

1. Clone this repository or download the source code:
   ```bash
   git clone https://github.com/hasibzero/speed-ext.git
   ```

2. Open your Chromium-based browser (Chrome, Edge, Brave, etc.)

3. Navigate to the extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`

4. Enable "Developer mode" using the toggle in the top-right corner

5. Click "Load unpacked" and select the `speed-ext` folder

6. The extension is now installed and active!

## Usage

### YouTube

Once installed, the speed control appears directly in the YouTube player's control bar:

- **Speed Display**: Shows current playback speed (e.g., "1.00x")
- **Speed Slider**: Drag to adjust speed from 0.5x to 4.0x
- **Location**: Integrated into the right controls area of the player

### Facebook

For Facebook videos, a floating overlay appears when you hover over the video:

- **Overlay Position**: Bottom-right corner of the video player
- **Visibility**: Appears on hover, fades when not in use
- **Global Memory**: Your chosen speed is automatically applied to all new videos in your feed
- **Enforcement**: Prevents Facebook from resetting your custom speed

### Speed Range

- **Minimum**: 0.5x (half speed)
- **Maximum**: 4.0x (quadruple speed)
- **Step**: 0.25x increments
- **Default**: 1.0x (normal speed)

## Technical Details

### Architecture

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Content Script**: Runs on YouTube and Facebook pages
- **Permissions**: Minimal - no special permissions required
- **Injection Method**: 
  - YouTube: DOM manipulation into native controls
  - Facebook: Overlay injection with position tracking

### Browser Compatibility

- Google Chrome (recommended)
- Microsoft Edge
- Brave Browser
- Any Chromium-based browser supporting Manifest V3

### Key Features Implementation

- **YouTube**: Injects controls directly into the `.ytp-right-controls` container
- **Facebook**: Creates positioned overlays with automatic video detection
- **Global Speed**: Maintains speed setting across page navigation (Facebook)
- **Speed Enforcement**: Event listeners prevent external speed resets
- **Event Handling**: Prevents click/drag propagation to avoid pausing videos

## File Structure

```
speed-ext/
├── manifest.json     # Extension configuration
├── content.js        # Main logic for both platforms
└── README.md         # This file
```

## Contributing

Contributions are welcome! Here are some ways you can help:

- Report bugs or suggest features by opening an issue
- Submit pull requests with improvements
- Test on different browsers and report compatibility issues
- Improve documentation

## License

This project is open source and available for personal and educational use.

## Support

If you encounter any issues or have questions:

1. Check existing issues on the repository
2. Create a new issue with detailed information about your problem
3. Include browser version, OS, and steps to reproduce

## Acknowledgments

Built to enhance the video watching experience on YouTube and Facebook by providing granular playback speed control that persists across sessions.

---

**Note**: This is a browser extension that modifies the behavior of third-party websites. Use responsibly and in accordance with the terms of service of YouTube and Facebook.
