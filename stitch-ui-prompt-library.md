# Yousef LMS — Stitch AI UI Prompt Library
# Based on PRD Version: v1.1
# Design System: #6D28D9 / Modern SaaS, premium education platform, clean and credible
# Total Screens: 24
# ─────────────────────────────────────────────────

## DESIGN SYSTEM REFERENCE
(Applied to all prompts below)

Primary Color      : #6D28D9
Secondary Color    : #0EA5E9
Background Main    : #0B1120
Background Surface : #111827
Text Primary       : #F9FAFB
Text Secondary     : #94A3B8
Success Color      : #22C55E
Error Color        : #EF4444
Warning Color      : #F59E0B
Border Color       : #1F2937
Primary Font       : Inter
Border Radius      : 8px cards and inputs, 12px modals, 6px buttons, 4px tags
Shadow Style       : Subtle, premium, low-noise elevation
Icon Style         : Lucide Icons
Spacing Base       : 16px
Mode               : Both dark and light

---

## SCREEN INVENTORY
(All screens in this document)

Authentication:
01. Login Screen
02. Register Screen
03. Forgot Password Screen // inferred from PRD feature
04. Reset Password Screen // inferred from PRD feature

Dashboard and Home:
05. Home Screen
06. Course Catalog Screen
07. Course Detail Screen
08. Lesson Player Screen

Payments and Orders:
09. Payment Instructions Screen
10. Proof Upload Screen
11. Student Dashboard Screen

Admin Operations:
12. Admin Dashboard Overview Screen // inferred from PRD feature
13. Admin Course List Screen
14. Admin Course Editor Screen
15. Admin Orders List Screen
16. Admin Order Detail Screen
17. Admin Students List Screen
18. Admin Student Detail Screen
19. Admin Comments Moderation Screen

Error and Utility:
20. 404 Not Found Screen
21. 403 Access Denied Screen
22. 500 Server Error Screen
23. Offline / No Connection Screen
24. Session Expired Screen

---

## Authentication Screens

## PROMPT 01 — Login Screen
**Screen Purpose:** Allow a student or the admin to sign in securely and quickly so they can access their dashboard or admin area.

**Stitch AI Prompt:**

Design a Login screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use a split-screen desktop layout with the login card on the right in RTL mode and a brand storytelling panel on the left. The overall page fills the viewport. The form card should be 440px wide, vertically centered, with a max-width mobile layout of 92%. Above the fold on a 1440px screen, the user sees the logo, welcome heading, the full form, and the primary sign-in button without scrolling.

HEADER / NAVIGATION:
No global navigation. Place the Yousef LMS logo at the top of the form card, aligned to the top-right. Add a theme toggle icon button in the top-left corner of the viewport. The left visual panel includes a short Arabic brand statement, one course preview thumbnail strip, and a trust line about free preview lessons.

MAIN CONTENT:
Inside the card, show a clear Arabic heading for sign in, a short supporting description, an email input, a password input with show and hide toggle icon, a remember me checkbox, a forgot password text link, and a full-width primary submit button. Under the button, add a divider and a link row leading to account creation. Include a small note that the first five lessons can be previewed before purchase.

COMPONENTS IN DETAIL:
Inputs have quiet filled surfaces, 1px borders, 48px height, right-aligned labels, and icon slots. Hover state brightens border color to #0EA5E9. Focus state uses a 2px ring based on #6D28D9. The password field includes an inline eye icon. The remember me row uses a compact checkbox and muted helper text.

FORMS AND INPUTS — if this screen has a form:
Email field, type email, Arabic label above, placeholder with a realistic address. Password field, type password, Arabic label, placeholder dots. Required fields show a subtle asterisk. Invalid state uses #EF4444 border and an error line below the field.

BUTTONS AND ACTIONS:
Primary button is full-width, medium-large height, filled #6D28D9 with white text. Hover darkens slightly. Active state compresses elevation. Disabled state lowers opacity. Secondary text actions are ghost links in #0EA5E9.

STATES:
Loading state shows a spinner inside the submit button. Error state shows an inline alert banner above the form and field-specific red messages. Success state immediately routes the user to dashboard. Filled state keeps values visible after failed submit.

VISUAL STYLE:
Background uses #0B1120 with subtle radial gradients. Card surface uses #111827. Primary text uses #F9FAFB. Secondary text uses #94A3B8. Borders use #1F2937. Use Inter 700 for the page heading, Inter 500 for labels, Inter 400 for body copy. Radius follows system values. Shadows are soft and restrained.

RESPONSIVE BEHAVIOR:
Desktop keeps split layout. Tablet collapses the left panel to a shorter hero band above the form. Mobile becomes a single-column centered card with full-width controls and the theme toggle pinned at top-left.

ACCESSIBILITY:
Ensure visible focus for every input and link, proper labels, accessible show-password toggle text, screen-reader label for theme toggle, and contrast-compliant error banners.

PRIMARY USER ACTION:
The primary user action on this screen is signing in with email and password. The design should visually guide the user toward this.

## PROMPT 02 — Register Screen
**Screen Purpose:** Help a new student create an account with minimal friction and enough trust to continue into the purchase and learning flow.

**Stitch AI Prompt:**

Design a Register screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use the same visual system as the login screen for consistency. On desktop, use a split-screen composition with a 480px registration card on the right and a branded value panel on the left. Keep the content vertically centered. The registration form should fit above the fold on large screens with minimal scrolling, but allow a natural page scroll on smaller laptop heights.

HEADER / NAVIGATION:
No full public navigation. Show the logo at the top-right of the form card and a theme toggle at the top-left of the page. The companion brand panel should show two to three course benefit points, a line about manual payment verification, and a visual block referencing Arabic-first learning.

MAIN CONTENT:
Inside the card, place a strong Arabic heading for account creation, a short one-line description, first name and last name fields arranged side by side in RTL desktop layout, an email field, a password field with a strength meter bar below, a confirm password field, a terms and conditions checkbox with inline link styling, a full-width primary create account button, and a bottom row linking back to sign in.

COMPONENTS IN DETAIL:
Form fields use 48px height, label above, internal icon when useful, and low-noise filled backgrounds. The password strength bar uses four thin segments with colors ranging from warning to success. Terms checkbox text wraps cleanly and remains readable. The card should feel premium rather than playful.

FORMS AND INPUTS — if this screen has a form:
First name text input, last name text input, email input, password input, confirm password input, and terms checkbox. Each required field shows clear validation. Duplicate email state displays an inline Arabic error. Password mismatch shows a red helper line below confirm field.

BUTTONS AND ACTIONS:
Primary action is a full-width create account button in #6D28D9. Secondary action is a text link to sign in. Loading state replaces button text with a spinner and keeps layout stable.

STATES:
Loading state uses a button spinner only. Error state highlights invalid fields and shows a small alert block above the form. Success state can either redirect or display a short success confirmation before redirecting to the dashboard. Empty state is the fresh form. Filled state preserves values if submission fails.

VISUAL STYLE:
Use #0B1120 background, #111827 surfaces, #F9FAFB primary text, #94A3B8 secondary text, #1F2937 borders, and #6D28D9 for primary actions. Use Inter 700 for headline, Inter 500 for labels, Inter 400 for helper text. Keep spacing comfortable with 16px field gaps and 24px section spacing.

RESPONSIVE BEHAVIOR:
Desktop keeps the split layout. Tablet stacks brand panel above form. Mobile uses a single full-width card with the name fields stacked vertically, larger tap targets, and persistent spacing.

ACCESSIBILITY:
Associate labels to inputs, announce strength meter textually, keep checkbox accessible, ensure keyboard order is logical in RTL, and maintain visible focus styles and contrast.

PRIMARY USER ACTION:
The primary user action on this screen is creating a new student account. The design should visually guide the user toward this.

## PROMPT 03 — Forgot Password Screen
**Screen Purpose:** Let a user request a password reset link quickly when they cannot access their account.

**Stitch AI Prompt:**

Design a Forgot Password screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use a minimal centered-card layout. The entire page sits on a calm full-viewport background with a single card around 420px wide. Keep the experience intentionally simple and task-focused. Above the fold on desktop, the user sees the heading, explanation, email field, submit button, and back-to-login link immediately.

HEADER / NAVIGATION:
No global navigation. Place the logo at the top-right inside the card and a theme toggle at the top-left of the viewport. Avoid extra distractions.

MAIN CONTENT:
Show an Arabic heading explaining password recovery, then a short instructional sentence telling the user to enter the email tied to their account. Under that, place a single email input, a full-width button labeled to send the reset link, and a subtle back-to-login link. Reserve space below for a success confirmation state that swaps the form for a confirmation block with an email icon, success message, resend link, and login link.

COMPONENTS IN DETAIL:
The card has generous padding, a clean hierarchy, and one main action. The email input includes a mail icon. Success confirmation uses a centered circular icon badge with #22C55E accent. Error state uses a compact inline alert with #EF4444 border and background tint.

FORMS AND INPUTS — if this screen has a form:
One email field with Arabic label and placeholder. Invalid email format shows a field-level error. Required state is explicit but visually calm.

BUTTONS AND ACTIONS:
Primary send-link button is full-width, medium-large, filled #6D28D9. Secondary actions are text links. Resend link appears only in success state and uses #0EA5E9.

STATES:
Loading state shows spinner inside the button. Empty state is the clean request form. Error state shows invalid or unrecognized-email messaging without exposing security-sensitive details. Success state replaces form content with a confirmation message and next actions.

VISUAL STYLE:
Use #0B1120 page background, #111827 card surface, #F9FAFB headings, #94A3B8 body copy, #1F2937 border, and low-noise shadows. Typography stays in Inter with bold heading and medium label weights.

RESPONSIVE BEHAVIOR:
Desktop and tablet remain centered. Mobile uses a near-full-width card with 24px side padding and enlarged tap targets.

ACCESSIBILITY:
Keep form semantics simple, ensure success and error messages are announced, preserve keyboard focus after submit, and provide explicit accessible names for icons and links.

PRIMARY USER ACTION:
The primary user action on this screen is requesting a password reset link. The design should visually guide the user toward this.

## PROMPT 04 — Reset Password Screen
**Screen Purpose:** Let a user securely set a new password after following a reset link.

**Stitch AI Prompt:**

Design a Reset Password screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use a minimal centered card similar to the forgot password screen for consistency. The card width should be 440px, centered in the viewport, with a clean single-task layout. Above the fold on desktop, show the heading, both password fields, and the reset button without requiring scrolling.

HEADER / NAVIGATION:
No full navigation. Keep the brand logo top-right inside the card and theme toggle top-left of the page. The rest of the interface should stay quiet.

MAIN CONTENT:
Start with a clear Arabic heading and one sentence about choosing a strong new password. Then present a new password field with a show and hide toggle, a password strength indicator below it, a confirm password field, and a full-width reset password button. Under the form add a small link back to login. Support an expired-link variant where the form is replaced by an error card with a clear explanation and a button to request a new link.

COMPONENTS IN DETAIL:
The password strength meter should use thin segmented bars plus text feedback. Inputs have right-aligned labels, smooth focus states, and inline visibility toggles. The expired-link state uses a warning icon and a secondary action panel.

FORMS AND INPUTS — if this screen has a form:
New password field and confirm new password field, both required. Show mismatch error below confirm field. Show a helper tip describing minimum password length.

BUTTONS AND ACTIONS:
Primary button is filled #6D28D9 and full-width. Secondary actions include back to login and request new link. Loading state uses a spinner in the primary button and disables both fields.

STATES:
Loading state appears during reset submission. Error state handles weak password, mismatched passwords, and expired token. Success state shows a confirmation panel with a success icon and a button to sign in. Filled state keeps user input intact on validation errors.

VISUAL STYLE:
Use #0B1120 background, #111827 card, #F9FAFB text, #94A3B8 supporting copy, #1F2937 borders, #22C55E for success accents, and #EF4444 for expired-link or invalid states. Use Inter consistently with strong visual hierarchy.

RESPONSIVE BEHAVIOR:
Desktop and tablet keep the centered card. Mobile stretches the card width and stacks helper elements below fields with clear spacing.

ACCESSIBILITY:
Ensure all controls are keyboard accessible, password toggles have labels, errors are announced, and focus moves to the confirmation heading on success.

PRIMARY USER ACTION:
The primary user action on this screen is setting a new password successfully. The design should visually guide the user toward this.

## Dashboard and Home Screens

## PROMPT 05 — Home Screen
**Screen Purpose:** Introduce the LMS, communicate trust, and drive visitors into the course catalog or a specific course detail page.

**Stitch AI Prompt:**

Design a Home screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use a full-width landing page with a max content width around 1280px. The structure should flow top to bottom: sticky top navigation, hero section, featured courses strip, free-preview explainer, social proof block, and footer. Above the fold on a 1440px desktop screen, the user should see the navigation, the hero headline, supporting copy, one primary CTA, one secondary CTA, and a hero visual based on course cards and lesson previews.

HEADER / NAVIGATION:
Use a top horizontal navigation bar with the logo on the top-right in RTL, links for home, courses, about the instructor, and login or dashboard, plus a theme toggle and a standout CTA button to browse courses. Active and hover states use #6D28D9 or #0EA5E9 accents with clear focus outlines.

MAIN CONTENT:
The hero includes a bold Arabic headline, a concise promise about programming and AI courses, a trust line about the first five lessons being free, and CTA buttons. Below it, show a featured courses row with 3 premium cards, then a process section explaining browse, pay manually, and start learning. Add a section spotlighting the instructor, then a student-trust area with key stats and testimonials.

COMPONENTS IN DETAIL:
Course cards include thumbnail, title, price, short description, lesson count, and a preview badge. Trust stats appear in compact metric tiles. The instructor block features a portrait, biography excerpt, and credibility tags. Use subtle gradients and structured spacing rather than decorative clutter.

BUTTONS AND ACTIONS:
Primary CTA is browse courses. Secondary CTA is watch free lessons. Use filled, secondary, and ghost button styles with clear hover and pressed states.

STATES:
Loading state can use skeleton course cards. Empty state for featured courses shows a clean message and a catalog CTA. Error state for course fetching shows an inline retry banner.

VISUAL STYLE:
Background uses #0B1120 with layered surface sections in #111827. Primary text is #F9FAFB and secondary text is #94A3B8. Buttons use #6D28D9 with #0EA5E9 accents. Borders are #1F2937. Use Inter with large confident headlines and clean body text.

RESPONSIVE BEHAVIOR:
Desktop uses two-column hero and three-column course rows. Tablet collapses to one-column hero and two-column cards. Mobile stacks all sections, keeps top nav compact, and turns CTA rows into full-width buttons.

ACCESSIBILITY:
Ensure landmark regions, alt text on images, clear CTA labels, sufficient text contrast, and keyboard navigability through cards and navigation.

PRIMARY USER ACTION:
The primary user action on this screen is navigating into the course catalog. The design should visually guide the user toward this.

## PROMPT 06 — Course Catalog Screen
**Screen Purpose:** Let visitors browse all published courses quickly, compare options, and choose a course to inspect or purchase.

**Stitch AI Prompt:**

Design a Course Catalog screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use a full-width page with a max-width centered container. Place a compact public top navigation at the top, then a page header, a search and filter bar, and a responsive course card grid. Above the fold on desktop, the user sees the page title, a short description, search field, category or price filters, results count, and the first row of course cards.

HEADER / NAVIGATION:
Reuse the public top navigation from the home screen with logo, home, courses, login or dashboard, theme toggle, and browse state active. The page header should include an Arabic title and a short line describing the catalog.

MAIN CONTENT:
Add a horizontal filter row with search input, sort dropdown, and maybe course-type chips. Under that, show a results count such as number of published courses. The main grid contains rich course cards with thumbnail image, title, one-line description, instructor name, lesson count, preview badge, and price. Each card should support hover elevation and a clean click target leading to course detail.

COMPONENTS IN DETAIL:
Cards use 12px radius, image top area, content body, and footer row for price and CTA. A free-preview pill appears on cards with strong visibility. Search field includes icon and clear button. Filters use outlined chip buttons or dropdowns.

BUTTONS AND ACTIONS:
Primary action per card is a view-course or start-preview button. Secondary interactions include filtering and sorting. Buttons use system colors and accessible hover states.

STATES:
Loading state uses skeleton course cards in the exact grid layout. Empty state shows an icon, Arabic headline saying there are no available courses, explanatory copy, and a back-to-home CTA. Error state shows a retry banner above the grid.

VISUAL STYLE:
Use #0B1120 background, #111827 cards and filter surfaces, #F9FAFB headings, #94A3B8 metadata, #6D28D9 primary actions, #0EA5E9 focus and accent states, and #1F2937 dividers. Keep typography premium and restrained.

RESPONSIVE BEHAVIOR:
Desktop uses a three-column grid. Tablet uses two columns. Mobile uses one column, stacks filters vertically, and keeps search sticky near the top after the header.

ACCESSIBILITY:
Use semantic search and filter controls, ensure cards are keyboard reachable, provide descriptive button labels, and maintain clear focus outlines and contrast ratios.

PRIMARY USER ACTION:
The primary user action on this screen is choosing a course to explore in detail. The design should visually guide the user toward this.

## PROMPT 07 — Course Detail Screen
**Screen Purpose:** Help a visitor understand the value of one course, inspect its lesson structure, and decide whether to preview or buy.

**Stitch AI Prompt:**

Design a Course Detail screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use a two-column desktop layout inside a max-width container. The main content column holds the course overview, learning outcomes, sections, and lessons. The left-side sticky purchase panel in RTL should show price, course meta, and the main CTA. Above the fold on desktop, show the title, value proposition, price card, and the first section of the lesson outline.

HEADER / NAVIGATION:
Use the public top navigation. Under it, add breadcrumbs and a compact page header with course title, instructor name, and a small published badge if needed.

MAIN CONTENT:
At the top show a hero summary block with title, description, instructor, level, and lesson count. Below it place learning outcomes in a two-column bullet layout, then the structured section list. Each section expands to reveal lesson rows. Lessons 1 to 5 should show a free badge and play icon. Locked lessons show a lock icon and muted styling. Include a comments preview snippet lower on the page if appropriate.

COMPONENTS IN DETAIL:
Section accordions use surface cards with clear hierarchy. Lesson rows show title, duration, free or locked state, and hover feedback. The sticky purchase card includes price, manual payment note, preview note, and a primary button to buy or continue.

BUTTONS AND ACTIONS:
Primary CTA is buy course. Secondary CTAs are watch free lesson and maybe sign in. Locked lesson clicks should open a purchase-required modal. All buttons should feel premium and decisive.

STATES:
Loading state uses skeleton header, sticky card, and accordion placeholders. Empty state for lessons shows a clean message that lessons will be added soon. Error state uses a retry banner. Filled state should feel content-rich and conversion-focused.

VISUAL STYLE:
Use #0B1120 page background, #111827 content cards, #F9FAFB primary text, #94A3B8 supporting copy, #6D28D9 purchase CTA, #0EA5E9 accent links, #F59E0B for pending or attention notes, and #1F2937 borders.

RESPONSIVE BEHAVIOR:
Desktop keeps sticky side purchase card. Tablet moves purchase card below the hero. Mobile places the purchase CTA in a sticky bottom action bar and stacks all lesson rows vertically.

ACCESSIBILITY:
Ensure accordion controls are accessible, icons have labels where needed, lesson lock state is not color-only, and sticky CTA remains keyboard reachable.

PRIMARY USER ACTION:
The primary user action on this screen is deciding to preview or purchase the course. The design should visually guide the user toward this.

## PROMPT 08 — Lesson Player Screen
**Screen Purpose:** Let visitors watch free lessons and let enrolled students watch any lesson while reading descriptions and comments.

**Stitch AI Prompt:**

Design a Lesson Player screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use a multi-column desktop layout with the video player and lesson content in the main area and a course lesson navigator in a side panel. In RTL, the lesson navigator sits on the left and the main player area sits on the right. Above the fold on desktop, show the video player, lesson title, and a visible portion of the lesson list.

HEADER / NAVIGATION:
Use a simplified top navigation with logo, current course title breadcrumb, theme toggle, and user menu when authenticated. Avoid heavy marketing nav on this screen.

MAIN CONTENT:
At the top of the main area place a wide 16:9 video player. Beneath it, show the lesson title, description section, and comments section. The side panel lists all sections and lessons, clearly distinguishing free lessons, locked lessons, current lesson, and completed lessons. For non-enrolled users trying to access locked content, use a strong inline purchase CTA or modal trigger.

COMPONENTS IN DETAIL:
The video area should include loading shimmer, error block with retry button, and a subtle meta row with section and lesson order. The lesson list uses compact interactive rows with icons, status tags, and current-state highlighting using #6D28D9.

BUTTONS AND ACTIONS:
Primary actions are play lesson, move to next lesson, and buy course if locked. Comment posting appears only for enrolled users. Buttons should be clear and not crowd the player.

STATES:
Loading state uses a player skeleton and side list skeletons. Error state shows a failed-video panel. Empty comments state invites the first comment. Success state after posting comment shows immediate insertion into the thread.

VISUAL STYLE:
Use #0B1120 background, #111827 player and panel surfaces, #F9FAFB headings, #94A3B8 text, #6D28D9 active lesson and CTA color, #22C55E completed status, #1F2937 borders.

RESPONSIVE BEHAVIOR:
Desktop keeps split layout. Tablet collapses side lesson list below the player. Mobile uses a single-column stack with a sticky next action area and an expandable lesson drawer.

ACCESSIBILITY:
Provide clear keyboard navigation through lesson list, captions support area in the player, comment field labeling, and non-color-only status communication.

PRIMARY USER ACTION:
The primary user action on this screen is watching the lesson and continuing through the course. The design should visually guide the user toward this.

## Payments and Orders

## PROMPT 09 — Payment Instructions Screen
**Screen Purpose:** Explain exactly how a student completes the manual payment process before uploading proof.

**Stitch AI Prompt:**

Design a Payment Instructions screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use a centered max-width layout with two main columns on desktop. The primary content area explains the payment steps. A compact summary card shows course title, price, and what access the student gets after approval. Above the fold on desktop, the user should see the course summary, payment destination details, and the next-step button.

HEADER / NAVIGATION:
Use the authenticated top navigation with logo, courses, dashboard, and user menu. Include a page breadcrumb leading from course detail to payment. Keep the screen serious and task-oriented.

MAIN CONTENT:
Start with an Arabic title and a short explanation about manual verification. Then show numbered payment steps in stacked cards: send payment, capture receipt screenshot, upload proof, wait for review. Below that, display bank account or mobile wallet details in a secure-looking information panel with copy buttons. Add a notes box explaining pending review timing and duplicate-order restrictions.

COMPONENTS IN DETAIL:
The course summary card includes thumbnail, title, price, and a small benefits list. Payment details panel uses strong visual grouping, monospace treatment for account numbers, and copy-to-clipboard buttons. Timeline step cards use numeric badges and icons.

BUTTONS AND ACTIONS:
Primary button is continue to proof upload. Secondary action is return to course. Copy buttons are small outlined actions. If there is already a pending order, disable the primary action and show a warning banner.

STATES:
Loading state uses summary-card and instruction skeletons. Error state shows a blocking banner if course or payment data fails to load. Success-adjacent state can show copied-to-clipboard confirmations. Pending-order state shows a warning panel in #F59E0B.

VISUAL STYLE:
Use #0B1120 background, #111827 surfaces, #F9FAFB text, #94A3B8 secondary text, #6D28D9 primary button, #0EA5E9 detail accents, #F59E0B warning markers, and #1F2937 borders.

RESPONSIVE BEHAVIOR:
Desktop uses two columns. Tablet collapses to stacked summary then steps. Mobile turns steps into a single-column sequence with full-width actions and easy copying controls.

ACCESSIBILITY:
Ensure copy buttons are announced, account values are selectable, numbered steps are semantic, and warning states are readable and not dependent on color alone.

PRIMARY USER ACTION:
The primary user action on this screen is moving forward to upload payment proof after paying. The design should visually guide the user toward this.

## PROMPT 10 — Proof Upload Screen
**Screen Purpose:** Let a logged-in student upload a payment receipt image or PDF confidently and track submission progress.

**Stitch AI Prompt:**

Design a Proof Upload screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use a focused single-column layout inside a centered container, around 760px max width. The top shows page heading and a compact course summary. The core area is a large upload card with file constraints, preview area, and submission action. Above the fold on desktop, the heading, upload zone, file rules, and submit button should all be visible.

HEADER / NAVIGATION:
Keep the authenticated top navigation minimal, with breadcrumb back to payment instructions and dashboard access in the main nav.

MAIN CONTENT:
Show a heading explaining that the student should upload a clear payment proof. Add a drag-and-drop upload zone supporting JPG, PNG, and PDF with a visible 5MB max note. Once a file is selected, replace the empty zone with a preview block or file tile showing filename, size, type icon, and remove action. Beneath it, include a progress bar for active uploads and a short note explaining manual review timing.

COMPONENTS IN DETAIL:
The upload dropzone uses dashed border styling, an upload icon, and clear instruction text. Preview state for images shows a cropped thumbnail; PDF shows a document card. Validation messages appear directly below the zone. The progress bar fills from right to left in RTL layout.

BUTTONS AND ACTIONS:
Primary button is submit order. Secondary buttons are choose another file and go back. During upload, the primary button shows spinner and percentage while secondary actions become disabled.

STATES:
Empty state shows dropzone instructions. Loading state shows upload progress. Error state handles invalid type, too-large file, and network failure while preserving the selected file if possible. Success state confirms that the order was submitted and links to dashboard.

VISUAL STYLE:
Use #0B1120 background, #111827 upload surface, #F9FAFB headings, #94A3B8 helper text, #6D28D9 submit action, #22C55E success toast, #EF4444 validation error, and #1F2937 borders.

RESPONSIVE BEHAVIOR:
Desktop uses one central upload card. Tablet is similar with tighter margins. Mobile expands the upload area to full width, simplifies preview layout, and keeps the submit action sticky near the bottom if needed.

ACCESSIBILITY:
Support keyboard-triggered file selection, clear error announcements, accessible progress updates, and meaningful labels for remove-file and replace-file actions.

PRIMARY USER ACTION:
The primary user action on this screen is uploading valid payment proof and submitting the order. The design should visually guide the user toward this.

## PROMPT 11 — Student Dashboard Screen
**Screen Purpose:** Give the student a clear overview of enrolled courses, order statuses, and the next learning step.

**Stitch AI Prompt:**

Design a Student Dashboard screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use a dashboard layout with a compact authenticated top bar and a two-section content body. The page should open with a title and a quick summary row, then split into enrolled courses and order history sections. Above the fold on desktop, the user should see the page title, one summary card row, and the top portion of both main sections.

HEADER / NAVIGATION:
Use authenticated navigation with logo, courses, dashboard active state, theme toggle, and user menu. Optionally include a small notification icon for order updates.

MAIN CONTENT:
Start with a personalized greeting and a short status summary. Show a row of compact cards such as enrolled courses count, pending orders count, and completed lessons count. Then render a "My Courses" section with course cards showing thumbnail, title, progress, and continue-learning CTA. Below or alongside it, render a "My Orders" section with order list items showing course name, submission date, status badge, and rejection reason if applicable.

COMPONENTS IN DETAIL:
Course cards use a strong visual thumbnail, progress line, and next lesson text. Order rows use status badges with clear color coding and a resubmit action on rejected orders. Empty states should feel instructive rather than blank.

BUTTONS AND ACTIONS:
Primary actions are continue learning and browse courses. Secondary actions include resubmit proof or view course. Buttons should remain clear in dense dashboard contexts.

STATES:
Loading state uses dashboard skeleton cards and list rows. Empty my-courses state offers a browse-courses CTA. Empty orders state explains there are no previous orders. Error state provides retry options. Success state may appear as a toast after order submission.

VISUAL STYLE:
Use #0B1120 dashboard background, #111827 cards, #F9FAFB headings, #94A3B8 metadata, #6D28D9 main actions, #22C55E approved badges, #F59E0B pending badges, #EF4444 rejected badges, and #1F2937 borders.

RESPONSIVE BEHAVIOR:
Desktop shows two-column sections where space allows. Tablet stacks sections. Mobile uses single-column cards and condensed order items with full-width actions.

ACCESSIBILITY:
Use semantic lists, keep badge text explicit, ensure progress indicators are accessible, and maintain logical focus order between sections and actions.

PRIMARY USER ACTION:
The primary user action on this screen is continuing learning or checking order status. The design should visually guide the user toward this.

## Admin Operations

## PROMPT 12 — Admin Dashboard Overview Screen
**Screen Purpose:** Give the instructor a fast operational overview of courses, orders, students, and moderation tasks.

**Stitch AI Prompt:**

Design an Admin Dashboard Overview screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use a full dashboard shell with a persistent left sidebar in desktop RTL, a top header, and a flexible main content canvas. Above the fold on desktop, the admin should see the page title, four summary metric cards, and the top of recent pending orders plus quick actions.

HEADER / NAVIGATION:
The sidebar contains the logo at top, navigation items for dashboard, courses, orders, students, comments, and logout at the bottom. Orders should show a pending-count badge. The top header includes page title, theme toggle, and the admin avatar menu.

MAIN CONTENT:
Show metric cards for published courses, pending orders, total students, and today’s approvals. Below them place a recent pending orders panel with student name, course name, timestamp, and quick review action. Next to it, add a quick actions panel with buttons for new course, review orders, and moderate comments. A lower section can show recent student activity or latest enrollments.

COMPONENTS IN DETAIL:
Metric cards use icon, label, large value, and trend or contextual subtext. Pending-order items should feel actionable and compact. Quick action cards should stand out without overpowering the operational data.

BUTTONS AND ACTIONS:
Primary actions are review pending orders and create a new course. Secondary actions are view all students and review comments. Use clear hierarchy and restrained color usage.

STATES:
Loading state uses metric and panel skeletons. Empty state for no pending orders uses a positive success illustration. Error state shows retry banners for each failed data region.

VISUAL STYLE:
Use #0B1120 shell background, #111827 panels, #F9FAFB headings, #94A3B8 metadata, #6D28D9 primary highlights, #0EA5E9 secondary accents, #22C55E positive indicators, #1F2937 borders.

RESPONSIVE BEHAVIOR:
Desktop keeps full sidebar. Tablet allows a collapsible sidebar. Mobile converts navigation into a slide-over menu with a bottom quick-nav bar for key admin sections.

ACCESSIBILITY:
Provide descriptive sidebar labels, accessible badge counts, visible focus styles, and semantic grouping for dashboard regions and quick actions.

PRIMARY USER ACTION:
The primary user action on this screen is jumping into the highest-priority admin task, especially pending orders. The design should visually guide the user toward this.

## PROMPT 13 — Admin Course List Screen
**Screen Purpose:** Let the admin review all courses, see their status quickly, and enter creation or editing flows.

**Stitch AI Prompt:**

Design an Admin Course List screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use the admin shell with sidebar and top header. The content area should begin with page title and actions, then a filter and search bar, followed by a structured data table or high-information card table. Above the fold on desktop, show the page title, a create-course button, filters, and the first several rows.

HEADER / NAVIGATION:
Keep the admin sidebar persistent with courses active. The page header includes title, subtitle, and a primary button for creating a new course.

MAIN CONTENT:
Add controls for searching by title and filtering by status draft or published. The main table contains columns for course thumbnail, title, status, lessons count, price, updated date, and actions. Each row should support edit, publish or unpublish, and delete. Include pagination at the bottom.

COMPONENTS IN DETAIL:
Status appears as compact badges. Action buttons can live in a right-aligned action cell or an overflow menu. Rows should have strong hover feedback and quick scanning support. Empty state should explain there are no courses yet and offer a create-first-course CTA.

BUTTONS AND ACTIONS:
Primary action is create new course. Row-level actions are edit, publish or unpublish, and delete. Delete must open a confirmation modal naming the course.

STATES:
Loading state uses skeleton rows matching the final table. Empty state shows icon, headline, explanatory copy, and CTA. Error state provides retry. Success state uses small toasts after publish or delete.

VISUAL STYLE:
Use #0B1120 shell, #111827 table container, #F9FAFB text, #94A3B8 metadata, #6D28D9 for primary create action, #22C55E for published status, #F59E0B for drafts if desired, and #1F2937 borders and separators.

RESPONSIVE BEHAVIOR:
Desktop uses table layout. Tablet may switch to stacked row cards. Mobile uses compact cards with visible title, status, and main actions, hiding secondary metadata under expandable areas.

ACCESSIBILITY:
Ensure table headers are semantic, overflow menus are keyboard accessible, modals trap focus, and status meaning is not conveyed by color alone.

PRIMARY USER ACTION:
The primary user action on this screen is selecting a course to create, edit, or publish. The design should visually guide the user toward this.

## PROMPT 14 — Admin Course Editor Screen
**Screen Purpose:** Allow the admin to create or edit a course, manage sections and lessons, and publish when ready.

**Stitch AI Prompt:**

Design an Admin Course Editor screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use the admin shell with a wide content area. Structure the editor into two columns on desktop: the main form and curriculum builder in the primary column, and a sticky summary or publish panel in the secondary column. Above the fold, show the title, save actions, and the beginning of the course form.

HEADER / NAVIGATION:
Sidebar remains visible with courses active. The editor header includes breadcrumb back to courses, the page title create or edit course, and action buttons for save draft, publish or unpublish, and delete if editing an existing course.

MAIN CONTENT:
The main form starts with title, description, thumbnail URL or upload field, and price. Below that, show a curriculum builder where sections are rendered as cards and lessons appear as nested rows. Each section has add lesson, edit, and delete controls. Lessons show title, order, preview state, and edit actions. The side panel shows course status, lesson count, and publish notes.

COMPONENTS IN DETAIL:
Form blocks are separated with clear dividers. Section cards are collapsible. Lesson rows are compact and drag-handle ready visually even if drag behavior is not implemented. Publish panel uses a concise checklist feel.

FORMS AND INPUTS — if this screen has a form:
Course title text field, description textarea or editor, thumbnail input, price number field, section title inputs, lesson title fields, video URL fields, and description fields. Required states must be prominent.

BUTTONS AND ACTIONS:
Primary action changes depending on state: save draft or publish course. Secondary actions include add section, add lesson, cancel, and delete. Long forms should have a sticky action bar.

STATES:
Loading state uses skeleton form sections. Empty curriculum state invites adding the first section. Error state preserves entered data and highlights invalid fields. Success state confirms save with toast and status update.

VISUAL STYLE:
Use #0B1120 background, #111827 form surfaces, #F9FAFB headings, #94A3B8 helper text, #6D28D9 primary action, #0EA5E9 interactive accents, #1F2937 borders, and subtle premium shadows.

RESPONSIVE BEHAVIOR:
Desktop keeps dual-column structure. Tablet moves publish panel below main form. Mobile stacks everything, turns nested lesson controls into accordion cards, and keeps save or publish actions sticky.

ACCESSIBILITY:
Use proper labels, grouped section headings, keyboard access for section controls, strong focus indicators, and clear association of errors with individual fields.

PRIMARY USER ACTION:
The primary user action on this screen is creating or updating a course and its lessons successfully. The design should visually guide the user toward this.

## PROMPT 15 — Admin Orders List Screen
**Screen Purpose:** Help the admin scan incoming purchase requests, filter by status, and move quickly into review.

**Stitch AI Prompt:**

Design an Admin Orders List screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use the admin shell with a content area centered around a high-information table. Start with page title and filter tabs, then show the order table with pagination. Above the fold on desktop, include the title, all or pending filter tabs, and the first several orders.

HEADER / NAVIGATION:
Sidebar shows orders active with a visible pending badge. Header includes theme toggle and user menu only; keep the page focused on operations.

MAIN CONTENT:
Place a row of filter tabs for all, pending, approved, and rejected. Under it add optional search. The table contains student name, course name, submission date, status badge, and a review action button. Pending orders should visually stand out slightly without looking alarming. Include a results count and pagination footer.

COMPONENTS IN DETAIL:
Status badges use clear text and consistent colors. Rows use hover state and clickable action cell. Pending badge in the sidebar should mirror the count seen in the page header for consistency.

BUTTONS AND ACTIONS:
Primary row action is review order. Secondary actions can include copy student email or open course. Filters act like segmented controls.

STATES:
Loading state uses skeleton rows. Empty pending state should feel positive, showing that there are no requests waiting. Error state offers retry and does not break the shell layout.

VISUAL STYLE:
Use #0B1120 shell, #111827 table container, #F9FAFB text, #94A3B8 metadata, #F59E0B pending status, #22C55E approved, #EF4444 rejected, #6D28D9 review action, and #1F2937 borders.

RESPONSIVE BEHAVIOR:
Desktop uses table layout. Tablet can reduce columns and rely more on badges. Mobile should transform rows into stacked order cards with status, student, course, date, and review button.

ACCESSIBILITY:
Use semantic tables or accessible card lists, ensure filter tabs are keyboard navigable, and make status text explicit for assistive technologies.

PRIMARY USER ACTION:
The primary user action on this screen is opening a specific order for review. The design should visually guide the user toward this.

## PROMPT 16 — Admin Order Detail Screen
**Screen Purpose:** Let the admin inspect payment proof, verify the request, and approve or reject with confidence and speed.

**Stitch AI Prompt:**

Design an Admin Order Detail screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use the admin shell with a two-column detail layout. The main column shows student and order information plus the payment proof preview. The secondary column can contain status, quick facts, and action buttons. Above the fold on desktop, the admin should see the order title, status badge, student info, proof image preview, and approve or reject actions.

HEADER / NAVIGATION:
Sidebar shows orders active. Page header includes breadcrumb back to orders and a clear title with the order reference or student name.

MAIN CONTENT:
Show a summary block with student name, email, course, submitted timestamp, and current status. The proof area should display a large preview image or document card with a dedicated "view large" action that opens a fullscreen modal. The side panel should present approve and reject actions, a short admin note area, and order history metadata.

COMPONENTS IN DETAIL:
The proof viewer should feel trustworthy and easy to inspect. Status badge remains visible near the top. Approval and rejection controls should be visually separated to avoid accidental action. Rejection flow should open a modal with an optional reason field.

BUTTONS AND ACTIONS:
Primary action is approve order. Secondary action is reject order. Both should require confirmation, with the destructive flow using danger styling in #EF4444 and the approve action using success-accented confirmation with #22C55E support.

STATES:
Loading state uses skeleton metadata and proof area. Error state handles missing proof or expired signed URL with retry. Success state after approval or rejection updates status immediately and shows toast confirmation. Already-approved state should disable the approval action.

VISUAL STYLE:
Use #0B1120 background, #111827 surfaces, #F9FAFB text, #94A3B8 labels, #6D28D9 for neutral primary controls, #22C55E approval cues, #EF4444 rejection cues, and #1F2937 borders.

RESPONSIVE BEHAVIOR:
Desktop uses split detail layout. Tablet stacks proof below summary. Mobile turns actions into sticky bottom buttons and opens proof preview in a full-screen sheet.

ACCESSIBILITY:
Ensure action confirmations trap focus, proof images have accessible labels, status updates are announced, and button intent is clearly worded, not icon-only.

PRIMARY USER ACTION:
The primary user action on this screen is approving or rejecting the payment order correctly. The design should visually guide the user toward this.

## PROMPT 17 — Admin Students List Screen
**Screen Purpose:** Give the admin a clear roster of students with enough data to inspect activity and enrollment footprint.

**Stitch AI Prompt:**

Design an Admin Students List screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use the admin shell with page title, optional search or filter row, and a clean table-based list. Above the fold on desktop, show the title, total students count, and the first rows of the list.

HEADER / NAVIGATION:
Sidebar shows students active. Header stays minimal with title and count emphasis.

MAIN CONTENT:
Display a table with columns for student name, email, enrollment count, join date, and a view-detail action. Consider adding a small avatar chip beside student names. Include search by name or email if space allows. Pagination sits at the bottom.

COMPONENTS IN DETAIL:
Each row should support quick scanning, with enrollment count shown in a compact neutral badge. Joined date is muted. Empty state should explain there are no registered students yet.

BUTTONS AND ACTIONS:
Primary row action is view student detail. Search and filter controls are secondary. Avoid unnecessary complexity or too many bulk actions.

STATES:
Loading state uses skeleton rows. Empty state shows a calm educational illustration or icon with explanatory text. Error state provides retry. Filled state feels precise and administrative.

VISUAL STYLE:
Use #0B1120 shell, #111827 table container, #F9FAFB text, #94A3B8 secondary text, #6D28D9 row action highlights, and #1F2937 borders. Keep shadows subtle and density comfortable.

RESPONSIVE BEHAVIOR:
Desktop uses full table. Tablet may collapse some metadata into secondary lines. Mobile turns rows into student cards with name, email, enrollment count, joined date, and a clear detail button.

ACCESSIBILITY:
Use semantic row structure, ensure action buttons have unique labels per student, and preserve high contrast and visible focus across table controls.

PRIMARY USER ACTION:
The primary user action on this screen is selecting a student to inspect in detail. The design should visually guide the user toward this.

## PROMPT 18 — Admin Student Detail Screen
**Screen Purpose:** Show the full profile of one student and all course enrollments in a concise, useful admin view.

**Stitch AI Prompt:**

Design an Admin Student Detail screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use the admin shell with a two-column desktop layout. The main column shows the student’s enrollment history and activity context. The secondary column shows profile summary details. Above the fold on desktop, the admin should see the student name, email, joined date, and the first enrolled course entries.

HEADER / NAVIGATION:
Sidebar shows students active. The page header includes a breadcrumb back to students, the student name as title, and possibly a small summary badge for total enrollments.

MAIN CONTENT:
The profile summary panel should show avatar placeholder, full name, email, join date, and total courses. The main panel should list enrolled courses with title, enrolled date, and lessons watched count. If the student has no enrollments, show an informative empty state instead of a blank list.

COMPONENTS IN DETAIL:
Enrollment rows can be rendered as cards with course thumbnail, title, date, progress metric, and a link to open the course in admin context. Keep the layout practical and information-dense but not crowded.

BUTTONS AND ACTIONS:
Primary action is return to list or inspect related course. Secondary actions can include contact via email if desired, but keep the screen mainly observational.

STATES:
Loading state uses profile-card and enrollment-card skeletons. Empty enrollments state explains that the student has not yet been approved into any course. Error state includes a retry banner.

VISUAL STYLE:
Use #0B1120 shell background, #111827 profile and enrollment cards, #F9FAFB headings, #94A3B8 metadata, #6D28D9 accent actions, #0EA5E9 secondary links, and #1F2937 borders.

RESPONSIVE BEHAVIOR:
Desktop keeps two-column detail layout. Tablet stacks summary above enrollment list. Mobile uses full-width cards and compact metadata rows.

ACCESSIBILITY:
Keep headings structured, ensure cards have readable contrast, and label each course action clearly for screen-reader users.

PRIMARY USER ACTION:
The primary user action on this screen is reviewing a student’s enrollment history and status. The design should visually guide the user toward this.

## PROMPT 19 — Admin Comments Moderation Screen
**Screen Purpose:** Help the admin review all lesson comments across the platform and remove inappropriate content efficiently.

**Stitch AI Prompt:**

Design an Admin Comments Moderation screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use the admin shell with a list-management content area. The top should include the page title and maybe filters. The main content is a table or stacked moderation list. Above the fold on desktop, the admin sees the page title, filter controls, and the first several comment rows.

HEADER / NAVIGATION:
Sidebar shows comments active. Keep the top header minimal so the content list remains the focus.

MAIN CONTENT:
Each comment row should show the student name, related course and lesson, comment excerpt, date, and a delete action. Consider optional filter chips for newest, flagged, or all comments even if initial implementation is simple. Clicking a row can expand to show the full comment text inline or in a panel.

COMPONENTS IN DETAIL:
Comment excerpts should preserve Arabic readability and bidirectional safety. Delete uses a danger ghost button or icon plus text, never icon alone. A delete confirmation modal should repeat the first line of the comment to confirm context.

BUTTONS AND ACTIONS:
Primary action is delete comment. Secondary actions are expand comment and maybe filter comments. Deletion should clearly signal that it affects the public lesson page immediately.

STATES:
Loading state uses comment-row skeletons. Empty state says there are no comments yet or no comments matching the selected filter. Error state provides retry. Success state after deletion removes the row and shows a toast.

VISUAL STYLE:
Use #0B1120 shell, #111827 content container, #F9FAFB text, #94A3B8 metadata, #EF4444 for delete actions, #6D28D9 for neutral controls, and #1F2937 borders. Keep the moderation UI serious and clean.

RESPONSIVE BEHAVIOR:
Desktop uses a structured table or list. Tablet can reduce columns. Mobile uses expandable comment cards with delete action pinned at the bottom of each card.

ACCESSIBILITY:
Ensure delete confirmations are explicit, expanded comment content is announced properly, and moderation controls are keyboard accessible and high contrast.

PRIMARY USER ACTION:
The primary user action on this screen is identifying and deleting inappropriate comments. The design should visually guide the user toward this.

## Error and Utility Screens

## PROMPT 20 — 404 Not Found Screen
**Screen Purpose:** Tell the user clearly that the requested page does not exist and route them back into the product.

**Stitch AI Prompt:**

Design a 404 Not Found screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use a fully centered layout, both vertically and horizontally, with a calm single-focus composition. Keep the content max-width around 520px. Above the fold, the user sees the large 404 number, explanation text, and two actions.

HEADER / NAVIGATION:
Keep a very light top bar with logo and theme toggle only, or remove navigation completely for stronger focus.

MAIN CONTENT:
Show a large bold 404 display, an Arabic heading equivalent to page not found, one short explanatory sentence, a primary button to go to the dashboard or home depending on auth state, and a secondary back action. Add a subtle abstract background pattern inspired by the brand colors.

COMPONENTS IN DETAIL:
The 404 number should feel premium, not playful. Buttons should be centered in a horizontal row on desktop and stacked on mobile. Include a soft illustration or grid texture.

BUTTONS AND ACTIONS:
Primary action is go home or go to dashboard. Secondary action is go back.

STATES:
Only the default filled state is needed. Keep the screen reassuring and low-stress.

VISUAL STYLE:
Use #0B1120 background, #111827 surface accents, #F9FAFB main text, #94A3B8 supporting text, #6D28D9 primary button, #1F2937 borders, and soft shadowing.

RESPONSIVE BEHAVIOR:
Desktop centers the content. Mobile reduces typography scale and stacks the buttons vertically.

ACCESSIBILITY:
Use a clear page heading, readable button labels, visible focus states, and enough contrast for large display text.

PRIMARY USER ACTION:
The primary user action on this screen is returning to a valid destination in the product. The design should visually guide the user toward this.

## PROMPT 21 — 403 Access Denied Screen
**Screen Purpose:** Inform the user that they do not have permission to access the requested page and redirect them safely.

**Stitch AI Prompt:**

Design a 403 Access Denied screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use a centered utility-page layout similar to the 404 screen for consistency. Keep one compact content card or soft surface region in the middle of the viewport. Above the fold, show the lock icon, title, description, and the primary action.

HEADER / NAVIGATION:
Use a minimal top strip with logo and theme toggle, or no navigation if that improves clarity. Do not clutter the page.

MAIN CONTENT:
Center a large lock or shield icon, an Arabic access-denied heading, a short explanation that the current role does not have permission, and a primary action button to return to the correct dashboard. Add a small secondary action to go back or contact support if applicable.

COMPONENTS IN DETAIL:
The icon sits inside a soft circular badge. The card uses generous spacing and a confident visual hierarchy. Avoid aggressive red error styling; this is an authorization state, not a system failure.

BUTTONS AND ACTIONS:
Primary action is return to dashboard. Secondary action is go back. Use clear contrast and calm emphasis.

STATES:
Default state only. Keep the tone professional and instructive.

VISUAL STYLE:
Use #0B1120 background, #111827 card surface, #F9FAFB heading, #94A3B8 body text, #6D28D9 primary button, #0EA5E9 subtle link accents, and #1F2937 borders.

RESPONSIVE BEHAVIOR:
Desktop centers the card. Mobile uses a full-width compact card with stacked actions.

ACCESSIBILITY:
Include descriptive heading text, keyboard reachable actions, visible focus rings, and a label for the icon if it conveys meaning.

PRIMARY USER ACTION:
The primary user action on this screen is returning to a page the user is allowed to access. The design should visually guide the user toward this.

## PROMPT 22 — 500 Server Error Screen
**Screen Purpose:** Explain that something went wrong on the system side and help the user recover or leave the broken state.

**Stitch AI Prompt:**

Design a 500 Server Error screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use the same utility-page family as 404 and 403 with centered content and a single main panel. Keep the content concise and action-oriented. Above the fold, the user sees the error icon, title, support text, and retry button.

HEADER / NAVIGATION:
Minimal top bar with logo and theme toggle only. Keep the error page free from distractions.

MAIN CONTENT:
Place a warning or broken-system icon in a soft badge, a clear Arabic heading that something went wrong, one reassurance line saying the issue is being worked on, a primary retry button, and a secondary action to go to home or dashboard. A small support note can sit underneath.

COMPONENTS IN DETAIL:
Keep the page calm and premium, not noisy. Buttons should be large enough for quick recovery. The content panel should not reveal technical details.

BUTTONS AND ACTIONS:
Primary action is try again. Secondary action is return home or dashboard.

STATES:
Default error state only. You may include a subtle loading transition after pressing retry.

VISUAL STYLE:
Use #0B1120 background, #111827 surface, #F9FAFB heading, #94A3B8 support text, #6D28D9 retry button, #F59E0B icon accent, and #1F2937 borders.

RESPONSIVE BEHAVIOR:
Desktop centers everything. Mobile stacks content and uses full-width buttons.

ACCESSIBILITY:
Use clear page title, descriptive buttons, visible focus, and do not rely on icon color alone to communicate the issue.

PRIMARY USER ACTION:
The primary user action on this screen is retrying the failed action or leaving to a safe page. The design should visually guide the user toward this.

## PROMPT 23 — Offline / No Connection Screen
**Screen Purpose:** Tell the user that the network is unavailable and encourage a simple retry once connectivity returns.

**Stitch AI Prompt:**

Design an Offline / No Connection screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use the same centered utility-screen pattern for consistency. Keep the composition simple with icon, title, message, and one primary action. Above the fold, the full message and retry control should be visible without scrolling.

HEADER / NAVIGATION:
Use only logo and theme toggle if any chrome remains. The main content should dominate.

MAIN CONTENT:
Center a no-wifi icon, an Arabic heading about missing internet connection, a short explanation telling the user to check their network and try again, and a primary retry button. Add a small note that already loaded content may still be available in some areas if that suits the product tone.

COMPONENTS IN DETAIL:
The icon sits in a soft circular badge. The action button is clear and centered. Use understated supporting text and enough empty space to keep the screen calm.

BUTTONS AND ACTIONS:
Primary action is retry. Secondary action can be go back if needed, but keep emphasis on reconnecting.

STATES:
Default offline state only. Retry may briefly show a loading spinner before either restoring or returning to offline view.

VISUAL STYLE:
Use #0B1120 background, #111827 surface accent, #F9FAFB heading, #94A3B8 body text, #6D28D9 retry button, #0EA5E9 icon accent, and #1F2937 border.

RESPONSIVE BEHAVIOR:
Desktop centers content. Mobile uses tighter spacing and full-width action button.

ACCESSIBILITY:
Keep the message concise, the retry action keyboard reachable, and use clear icon labeling and contrast.

PRIMARY USER ACTION:
The primary user action on this screen is retrying after connectivity returns. The design should visually guide the user toward this.

## PROMPT 24 — Session Expired Screen
**Screen Purpose:** Tell the user that authentication expired and direct them back to sign in without confusion.

**Stitch AI Prompt:**
    
Design a Session Expired screen for Yousef LMS, a premium Arabic-first learning management system for selling programming and AI courses directly to students.

LAYOUT:
Use a centered utility-page layout consistent with the other error screens. The content should be constrained to a readable central column with strong focus on one action. Above the fold, show icon, title, short message, and sign-in button.

HEADER / NAVIGATION:
Use minimal brand chrome only, with logo and optional theme toggle. No full navigation.

MAIN CONTENT:
Center a clock or lock icon, an Arabic heading that the session has expired, a short line explaining the user should sign in again to continue, and a primary sign-in button. Add a small secondary button for going back to home. If this screen appears after attempted protected access, include a tiny note that work or navigation state will be restored after sign-in when possible.

COMPONENTS IN DETAIL:
The icon badge should use premium neutral styling. The primary CTA should be visually dominant. Keep the copy calm and practical.

BUTTONS AND ACTIONS:
Primary action is sign in again. Secondary action is go home. Use system button styles and visible hover or focus feedback.

STATES:
Default expired-session state only. Optional mini-loading state appears if the user is automatically redirected to login.

VISUAL STYLE:
Use #0B1120 background, #111827 surface accent, #F9FAFB heading, #94A3B8 supporting text, #6D28D9 sign-in button, #1F2937 border, and soft premium shadows.

RESPONSIVE BEHAVIOR:
Desktop centers content. Mobile stacks buttons vertically and slightly reduces type scale while keeping strong hierarchy.

ACCESSIBILITY:
Ensure the primary sign-in action is first in the keyboard order, messages are announced clearly, and the icon or visual cue is supplemented by text.

PRIMARY USER ACTION:
The primary user action on this screen is signing in again to continue. The design should visually guide the user toward this.

Copy each prompt into Stitch AI separately to generate each screen.

