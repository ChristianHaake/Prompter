# Manual Release Checks

These checks cover the parts that automated local tests cannot honestly sign
off.

## Devices and Layout

- Desktop Chrome/Firefox/Safari: editor, preview, presentation, import/export.
- Mobile browser at about 390px width: editor settings, preview controls,
  presentation footer, large font size, high-contrast mode.
- Tablet landscape and portrait: no horizontal overflow, controls remain
  reachable.
- Browser zoom at 200%: editor controls, undo banner, analytics, and
  presentation controls stay usable.

## Screen Reader

- Confirm the skip link reaches the main app content.
- Confirm settings groups announce their purpose, especially mirror mode, focus
  line, countdown, and timer presets.
- Confirm undo status is announced after "New" and pitch-history clear.
- Confirm preview controls announce labels and current values.
- Confirm presentation elapsed time, remaining time, progress, speed changes,
  and section controls are understandable.

## PWA and Offline

- Install prompt or browser install action is available on a supported target
  browser.
- Installed app opens to Prompter in standalone display mode.
- Reload the installed app once online, then disconnect network and confirm the
  app shell still opens.
- Confirm local draft and pitch history remain local and recover after reload.

## Privacy

- Confirm no script text or project file content is sent to an application
  backend during edit, preview, presentation, import, export, or CSV export.
- Confirm Cloudflare/Web Analytics wording is still accurate on the privacy
  page.
