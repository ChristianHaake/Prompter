# Help

## What does Prompter do?

Prompter is a local browser teleprompter. You write or open a script, adjust the target duration and readability, and start the presentation mode.

## Quick Start

1. Paste text into the text field.
2. Set target duration directly or with a timer preset, font size, line height, font family, colors, mirror mode, focus line, and countdown.
3. Check "Preview" or start "Present".
4. In presentation mode, use the spacebar to pause or resume.
5. Use the up and down arrow keys to change the speed.
6. Use left/right arrow or Page Up/Page Down to jump between headings and section markers.
7. Use `R` to reset and Escape to return to the editor. Completed and cancelled runs appear in the pitch history.

## Preview and Formatting

Preview uses the same display as presentation mode, but it does not start a run and does not write pitch history. Font size, line height, mirror mode, and focus-line changes update immediately.

The editor supports Markdown in the script. Headings, **bold**, and *italic* text are rendered in preview and presentation. Horizontal rules (`---`) can be used as section markers.

## Save and Open Projects

The current draft is automatically saved in the browser. This storage is only a recovery aid for the same browser.

For a permanent backup, save a `.prompter` file via "Save Project". You can load such a file later with "Open Project". When opening, the current draft will be replaced; the app will ask for confirmation beforehand.

You can also import `.txt` and `.md` files directly as script text. These files are not treated as complete projects.

Invalid files, files that are too large, and unsupported project versions are rejected. The current draft is then retained.

## Delete Data

"New" removes the saved draft from this browser and restores the example project. The pitch history has its own clear button and can be exported as CSV. After "New" and "Clear", an undo action is available until you continue editing or close the tab. You can also delete the website data in the browser settings.

## Supported Devices and Limits

Prompter is built for modern desktop and mobile browsers. The app uses `localStorage`, the browser's Fullscreen API, Web Audio for the end signal, optional Wake Lock during presentation, and a Service Worker for PWA functionality.

Project files are JSON files with the `.prompter` extension. The current import limit is 500 KB. Very long texts are limited to 100,000 characters.
