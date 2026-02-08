# Feature Specification: Store & Social Media Graphics Update

**Branch**: `019-store-fb-graphics`  
**Created**: 2026-02-08  
**Status**: Ready  
**Input**: User description: "Prepare graphics for Google Play (phone + tablet screenshots, feature graphic, promo video) and my FB profile. Take screenshots using MCP Chrome."

## Context

The app "Kalkulator wynagrodzeń" has undergone significant UI changes (dark mode, unified module layout, new modules like IKZE/IKE). The current Google Play screenshots show the **old UI** (orange theme, 2024 data) and no longer represent the actual app experience. Additionally, the developer's Facebook profile needs updated graphics to promote the app.

### Current State (Google Play)

- 8 phone screenshots in `graphics/Google Play/` showing old orange-themed UI with 2024 data
- Screenshots show: main menu, umowa o pracę, porównywarka B2B, samozatrudnienie, faktura VAT, odsetki, rozliczenie z małżonkiem, działalność niezarejestrowana
- All use a red background with phone mockup frame
- **No tablet screenshots** uploaded (7-inch and 10-inch slots are empty)
- **Feature Graphic** ("Grafika"): current image is a cartoon-style illustration (1024×500 px) with text "Kalkulator dla przedsiębiorcy" — outdated style, does not match new app branding
- **Video**: no promotional video linked (YouTube URL field is empty)
- Store listing: "Kalkulator wynagrodzeń", 4.1 rating, 10k+ downloads, category: Finanse

### Current State (Facebook)

- Personal profile of the developer (Łukasz Socha)
- No dedicated app-related cover photo or profile branding visible

## User Scenarios _(required)_

### Scenario 1 - Update Google Play Screenshots (Priority: P1) 🎯 MVP

A potential user browses Google Play and sees the app listing. The screenshots should accurately reflect the current app UI (2026 version with dark/light mode, unified layout) to set correct expectations and increase install conversion.

**Priority Justification**: Screenshots are the primary visual element driving install decisions on Google Play. Outdated screenshots misrepresent the app and may lead to negative reviews.

**Independent Test**: Compare each new screenshot against the live app to verify visual accuracy.

**Acceptance Criteria**:

1. **Given** the app has a new UI (dark mode, unified layout), **When** a user views the Google Play listing, **Then** the screenshots reflect the current 2026 UI
2. **Given** the existing 8 screenshot slots, **When** new screenshots are prepared, **Then** they cover the most important modules (main menu, UoP, B2B comparator, samozatrudnienie, faktura VAT, and at least 2-3 new/updated modules)
3. **Given** Google Play screenshot requirements, **When** screenshots are uploaded, **Then** they meet the required dimensions (min 320px, max 3840px, 16:9 or 9:16 aspect ratio)

---

### Scenario 2 - Add Tablet Screenshots (Priority: P1) 🎯 MVP

Google Play Console requires tablet screenshots for both 7-inch and 10-inch tablets. Currently both slots are empty. Tablet screenshots improve store listing completeness and are required for featuring eligibility.

**Priority Justification**: Google Play requires tablet screenshots. Missing tablet graphics reduce store listing quality score and prevent featuring.

**Independent Test**: Upload tablet screenshots to Google Play Console and verify they display correctly in both tablet slots.

**Acceptance Criteria**:

1. **Given** the app supports tablet layouts, **When** tablet screenshots are prepared, **Then** at least 2-8 screenshots are created for 7-inch tablets and 2-8 for 10-inch tablets
2. **Given** Google Play tablet screenshot requirements (PNG/JPEG, 16:9 or 9:16, 320-3840px), **When** screenshots are uploaded, **Then** they meet all dimension and format requirements
3. **Given** the app is responsive, **When** tablet screenshots are captured, **Then** they show the app in a tablet-appropriate viewport demonstrating the layout at larger screen sizes

---

### Scenario 3 - Update Feature Graphic (Priority: P1) 🎯 MVP

The current feature graphic ("Grafika") uses an old cartoon-style illustration that no longer matches the app's modern branding. A new feature graphic is needed at 1024×500 px.

**Priority Justification**: The feature graphic is prominently displayed in Google Play search results and the store listing header. It's a key visual for first impressions.

**Independent Test**: Upload the new feature graphic to Google Play Console and verify it displays correctly at 1024×500 px.

**Acceptance Criteria**:

1. **Given** the current feature graphic is outdated, **When** a new graphic is created, **Then** it reflects the current app branding (icon, colors, modern style)
2. **Given** Google Play requirements (PNG/JPEG, 1024×500 px, max 15 MB), **When** the graphic is uploaded, **Then** it meets all requirements
3. **Given** the feature graphic is shown in search results, **When** a user sees it, **Then** it clearly communicates the app's purpose (financial calculator for Polish market)

---

### Scenario 4 - Create Promotional Video (Priority: P2)

Google Play allows linking a YouTube video to the store listing. A short promotional video showcasing the app's key features would increase engagement and install conversion.

**Priority Justification**: Video content significantly increases store listing engagement but requires more effort to produce.

**Acceptance Criteria**:

1. **Given** the video field accepts a YouTube URL, **When** a promotional video is created, **Then** it is uploaded to YouTube as public or unlisted with ads disabled
2. **Given** the video should showcase the app, **When** a user watches it, **Then** they see the key modules in action (UoP, B2B, comparator) with realistic data
3. **Given** Google Play best practices, **When** the video is created, **Then** it is 30-120 seconds long, shows actual app UI, and has no age restrictions

---

### Scenario 5 - Create Facebook Profile/Cover Graphics (Priority: P2)

The developer wants to promote the app on their Facebook profile. A professional cover photo and/or profile-related graphic should showcase the app, its key features, and drive traffic to the Google Play listing.

**Priority Justification**: Facebook is a secondary promotion channel but important for personal branding and organic reach.

**Acceptance Criteria**:

1. **Given** the developer's Facebook profile, **When** a visitor views the profile, **Then** they see a professional cover photo that promotes the Kalkulator wynagrodzeń app
2. **Given** Facebook cover photo dimensions (820×312 px displayed, 851×315 px recommended), **When** the graphic is created, **Then** it meets Facebook's size requirements and looks good on both desktop and mobile
3. **Given** the app's visual identity (red/white icon with PIT/VAT/+/%), **When** the cover photo is designed, **Then** it uses consistent branding elements

---

### Scenario 6 - Screenshot Capture Process (Priority: P1) 🎯 MVP

Screenshots need to be taken from the running app using Chrome DevTools (MCP) to ensure they show real, up-to-date UI with realistic data.

**Priority Justification**: Authentic screenshots build trust. Using the actual running app ensures pixel-perfect accuracy.

**Acceptance Criteria**:

1. **Given** the app is running locally, **When** screenshots are captured via MCP Chrome, **Then** they show the app in mobile viewport (e.g., 390×844) and tablet viewports (e.g., 800×1280 for 7-inch, 1200×1920 for 10-inch)
2. **Given** the screenshots are raw captures, **When** they are processed, **Then** they are placed into a phone mockup frame with a branded background (consistent with existing style or updated)
3. **Given** each module has a form and results view, **When** screenshots are taken, **Then** they show the most informative view (preferably with sample results visible)

---

### Edge Cases

- Dark mode vs light mode: which theme to showcase? (Recommend: show both or pick the default)
- Different screen sizes: ensure screenshots look good at Google Play's display sizes
- Data in screenshots: use realistic but not real personal data
- Facebook mobile vs desktop: cover photo crops differently on mobile
- Tablet layout: the app may not have a dedicated tablet layout — screenshots should still look good at tablet viewport sizes
- Video content: screen recording vs animated presentation — screen recording of actual app usage is more authentic
- Video audio: background music and/or voiceover narration in Polish

## Requirements _(required)_

### Functional Requirements

- **FR-001**: New Google Play screenshots MUST show the current 2026 app UI
- **FR-002**: Screenshots MUST be taken from the actual running app (not mocked)
- **FR-003**: Phone screenshots MUST cover at minimum: main menu, UoP calculator, B2B comparator, samozatrudnienie, faktura VAT
- **FR-004**: Screenshots SHOULD include new modules: IKZE, IKE, obligacje
- **FR-005**: Tablet screenshots MUST be prepared for both 7-inch and 10-inch tablet sizes (at least 2 per size)
- **FR-006**: Tablet screenshots MUST show the app in tablet-appropriate viewports demonstrating responsive layout
- **FR-007**: Feature graphic ("Grafika") MUST be updated to a modern design at exactly 1024×500 px
- **FR-008**: Feature graphic MUST clearly communicate the app's purpose and use current branding
- **FR-009**: A promotional video SHOULD be created (30-120 seconds) showcasing key app modules
- **FR-010**: Video MUST be uploaded to YouTube (public or unlisted, no ads, no age restrictions)
- **FR-011**: Facebook cover photo MUST use the app's brand colors and icon
- **FR-012**: All text in screenshots and graphics MUST be in Polish language
- **FR-013**: Screenshots MUST use realistic sample data (e.g., salary 7000 zł brutto, revenue 15000 zł for B2B)
- **FR-014**: All graphic files MUST be saved to `graphics/Google Play/` directory

### Design Requirements

- **DR-001**: Phone screenshots MUST meet minimum 320px, maximum 3840px, 16:9 or 9:16 aspect ratio
- **DR-002**: Tablet screenshots (7-inch) MUST meet same dimension constraints as phone (PNG/JPEG, 16:9 or 9:16, 320-3840px, max 8 MB each)
- **DR-003**: Tablet screenshots (10-inch) MUST meet same dimension constraints (PNG/JPEG, 16:9 or 9:16, 320-3840px, max 8 MB each)
- **DR-004**: Feature graphic MUST be exactly 1024×500 px, PNG or JPEG, max 15 MB
- **DR-005**: Facebook cover photo MUST be 851×315 px (recommended) or 820×312 px (minimum)
- **DR-006**: Graphics MUST maintain consistent branding (app icon, color scheme)
- **DR-007**: Phone mockup frames SHOULD be modern (flat, minimal bezels) to match current design trends
- **DR-008**: Tablet mockup frames SHOULD use appropriate tablet device frames
- **DR-009**: Background color/gradient SHOULD be updated from the current solid red to match the new app theme
- **DR-010**: Promotional video SHOULD be 1080p or higher, landscape orientation

### Key Entities

- **Google Play Phone Screenshot**: PNG image, 1080×1920 px (9:16 portrait), phone mockup with branded background
- **Google Play Tablet Screenshot (7-inch)**: PNG image, ~800×1280 px or similar 16:9/9:16 ratio, tablet mockup with branded background
- **Google Play Tablet Screenshot (10-inch)**: PNG image, ~1200×1920 px or similar 16:9/9:16 ratio, tablet mockup with branded background
- **Google Play Feature Graphic**: PNG/JPEG image, exactly 1024×500 px, modern branded design
- **Promotional Video**: YouTube video, 30-120 seconds, showcasing app UI and key features
- **Facebook Cover Photo**: PNG/JPG image, 851×315 px, app branding with key features highlighted
- **Phone Mockup Frame**: Device frame overlay for phone screenshots
- **Tablet Mockup Frame**: Device frame overlay for tablet screenshots
- **Brand Assets**: App icon (PIT/VAT/+/%), color palette (red primary, white, dark mode colors)

## Success Criteria _(required)_

### Measurable Outcomes

- **SC-001**: All Google Play phone screenshots reflect the current 2026 app UI (visual verification)
- **SC-002**: At least 8 phone screenshots are prepared covering the main app modules
- **SC-003**: At least 2 tablet screenshots are prepared for 7-inch tablets
- **SC-004**: At least 2 tablet screenshots are prepared for 10-inch tablets
- **SC-005**: Feature graphic is updated at 1024×500 px with modern branding
- **SC-006**: Promotional video is uploaded to YouTube and linked in Google Play Console
- **SC-007**: Facebook cover photo is created at correct dimensions (851×315 px)
- **SC-008**: All graphics use consistent branding (icon, colors, typography)
- **SC-009**: Screenshots show realistic sample data in Polish language
- **SC-010**: All graphic files are saved in the correct directories and formats

## Assumptions

- The app will be running locally for screenshot capture via MCP Chrome DevTools
- The current app icon (PIT/VAT/+/%) remains unchanged
- Dark mode is the default/preferred theme to showcase (as it's a newer feature)
- Phone mockup frames will be created programmatically or using a simple template
- No external design tools (Figma, Photoshop) are required — graphics can be composed using HTML/CSS rendered to image or simple overlays
