# TODO - Website Preview Device View Fix

## Plan:
1. Clean up duplicate inline scripts in index.html (keep only one clean implementation)
2. Fix CSS for consistent device view classes (.mobile-view, .tablet-view, .desktop-view)
3. Ensure script.js is properly loaded after the DOM elements

## Issues Identified:
- Multiple duplicate script blocks in index.html for load-preview, mobile-btn, tablet-btn, desktop-btn
- CSS has conflicting styles for device view classes at different places
- Need to consolidate to single implementation

## Steps:
1. [x] Edit index.html - Remove duplicate inline scripts, keep clean implementation
2. [x] Edit styles.css - Fix device view class styles for consistency
3. [x] Edit script.js - Add device view button handlers
4. [x] Test the functionality

## Completed Changes:
- Removed 5 duplicate inline `<script>` blocks from index.html
- Consolidated device view CSS to single definition with proper widths/heights
- Added device button handlers in script.js to switch iframe class between mobile-view, tablet-view, and desktop-view

