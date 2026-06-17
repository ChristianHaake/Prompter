# Help

## What does Prompter do?

Prompter is a local browser teleprompter. You write or open a script, adjust the target duration and readability, and start the presentation mode.

## Quick Start

1. Paste text into the text field.
2. Set target duration, font size, mirror mode, focus line, and countdown.
3. Start "Present".
4. In presentation mode, use the spacebar to pause or resume.
5. Use the up and down arrow keys to change the speed.
6. Use `R` to reset and Escape to return to the editor.

## Save and Open Projects

The current draft is automatically saved in the browser. This storage is only a recovery aid for the same browser.

For a permanent backup, export a `.prompter` file via "Save Project". You can load such a file later with "Import". When opening, the current draft will be replaced; the app will ask for confirmation beforehand.

Invalid files, files that are too large, and unsupported project versions are rejected. The current draft is then retained.

## Delete Data

"Reset" removes the saved draft from this browser and restores the example project. In addition, you can delete the website data in the browser settings.

## Supported Devices and Limits

Prompter is built for modern desktop and mobile browsers. The app uses `localStorage`, the browser's Fullscreen API, and a Service Worker for PWA functionality.

Project files are JSON files with the `.prompter` extension. The current import limit is 500 KB. Very long texts are limited to 100,000 characters.
