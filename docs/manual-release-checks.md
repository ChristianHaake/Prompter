# Manual Release Checks

These checks cover the parts that automated local tests cannot honestly sign
off.

For the 1.1.0 Stage sign-off, record the actual device, OS, browser, date,
result, and a short reproduction for every failure. Use at least one real phone
and one real tablet, covering Apple Safari and Android Chrome between them.
Do not mark a check passed from a browser emulator alone.

## Devices and Layout

- Check 320, 360, 390, 768, and 1440 CSS-pixel widths on the Stage build.
- Desktop Chrome/Firefox/Safari: editor, preview, presentation, import/export.
- Real phone and tablet: editor first, language menu, settings, preview controls,
  presentation footer, large font size, high-contrast mode, and 44px targets.
- Tablet landscape and portrait: no horizontal overflow, controls remain
  reachable.
- Browser zoom at 200%: editor controls, undo banner, analytics, and
  presentation controls stay usable.
- Open exported `.prompter` and CSV files and inspect content, encoding, scale,
  and clipping where applicable. Prompter has no image export. Re-import a
  pre-redesign project file.

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
- Operator reviews AGB, imprint, privacy, and all translations; update the
  notice date before production release. The contact address is `apps@haak3.de`.

## Stage Sign-off Record

| Area | Device / browser | Result and date | Evidence or defect |
| --- | --- | --- | --- |
| Phone layout, editing, preview, presentation, touch targets | Pending | Pending | |
| Tablet portrait and landscape, large fonts, contrast | Pending | Pending | |
| 200% zoom, keyboard, reduced motion | Pending | Pending | |
| Screen reader: editor, errors, undo, preview, presentation | Pending | Pending | |
| Safari PWA install and offline restart | Pending | Pending | |
| Android Chrome workflow and offline restart | Pending | Pending | |
| Exported `.prompter` and CSV opened; old project re-imported | Pending | Pending | |
| AGB, privacy, imprint, and translations approved by operator | Pending | Pending | |

Record each failure in a linked issue. Legal approval requires the operator's
explicit review; the current AGB text is marked as a draft.
