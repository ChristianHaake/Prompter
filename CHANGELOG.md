# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Example Pitch**: The default project is now pre-filled with an introductory example pitch, allowing users to test features (speed, scroll, mirror mode) instantly without typing placeholder text.
- **haak3 UI Integration**: Added the standard haak3 web app header including language toggles, privacy badge, and teacher links.
- **Education Notice**: Added the yellow educational purpose warning banner for simulation compliance.
- **Hero Section**: Integrated a polished hero introduction (`.intro` block) for the main editor view.
- **E2E Testing**: Added automated smoke tests via Playwright verifying the DOM structure and interactive capabilities.
- **Security Validation**: Imported `DOMPurify` to ensure all loaded markdown content is heavily sanitized against XSS vulnerabilities.
- **Accessibility Enhancements**: Included explicit ARIA labels on speed controls and auto-focused presentation actions for screen readers.

### Changed
- **Naming Consistency**: Standardized the visible product name as `Prompter`.
- **CSS Improvements**: Optimized animations with `will-change: transform` and improved layout structure with modern `100dvh` units.
- **Import Robustness**: Updated the project import logic in `store.ts` to strictly validate schema properties and properly coerce undefined inputs.
- **App Shell Routing**: View state management now dynamically mounts and unmounts the global UI headers depending on the active presentation state.
