# UI Mapping: Stitch Exports to Product Features

## Stitch Page Inventory

| Stitch Page | Stitch HTML | Screenshot | Probable Route | Role | PRD Features | User Flow |
|---|---|---|---|---|---|---|
| Login Screen | `stitch/yousef_lms_login_screen/code.html` | `stitch/yousef_lms_login_screen/screen.png` | `/login` | Visitor, student, admin | `P0-F001` | Student registers and logs in |
| Register Screen | `stitch/yousef_lms_register_screen/code.html` | `stitch/yousef_lms_register_screen/screen.png` | `/register` | Visitor | `P0-F001` | Student registers and logs in |
| Forgot Password Screen | `stitch/yousef_lms_forgot_password/code.html` | `stitch/yousef_lms_forgot_password/screen.png` | `/forgot-password` | Visitor | `P0-F001` inferred support | Auth recovery |
| Reset Password Screen | `stitch/yousef_lms_reset_password_screen/code.html` | `stitch/yousef_lms_reset_password_screen/screen.png` | `/reset-password` | Visitor | `P0-F001` inferred support | Auth recovery |
| Home Screen | `stitch/yousef_lms_home_screen/code.html` | `stitch/yousef_lms_home_screen/screen.png` | `/` | Visitor | `P0-F002`, `P0-F009`, `P0-F010`, `P0-F011` | Visitor browses and starts discovery |
| Course Catalog Screen | `stitch/yousef_lms_course_catalog/code.html` | `stitch/yousef_lms_course_catalog/screen.png` | `/courses` | Visitor | `P0-F002`, `P1-F001`, `P0-F009`, `P0-F010`, `P0-F011` | Visitor browses courses |
| Course Detail Screen | `stitch/yousef_lms_course_detail_screen/code.html` | `stitch/yousef_lms_course_detail_screen/screen.png` | `/courses/:slug` | Visitor, student | `P0-F002`, `P0-F003`, `P0-F006` | Visitor previews and purchase intent |
| Lesson Player Screen | `stitch/yousef_lms_lesson_player/code.html` | `stitch/yousef_lms_lesson_player/screen.png` | `/courses/:slug/lessons/:id` | Visitor, student | `P0-F003`, `P0-F004`, `P0-F005`, `P1-F004` | Preview and learning flow |
| Payment Instructions Screen | `stitch/yousef_lms_payment_instructions/code.html` | `stitch/yousef_lms_payment_instructions/screen.png` | `/payment/:courseId` | Student | `P0-F006` | Student purchase flow |
| Proof Upload Screen | `stitch/proof_upload_screen_10/code.html` | `stitch/proof_upload_screen_10/screen.png` | `/payment/:courseId/proof` or step 2 of `/payment/:courseId` | Student | `P0-F006` | Student purchase flow |
| Student Dashboard Screen | `stitch/student_dashboard/code.html` | `stitch/student_dashboard/screen.png` | `/dashboard` | Student | `P0-F007`, `P1-F002`, `P1-F004` | Student tracks orders and learning |
| Admin Dashboard Overview | `stitch/admin_dashboard_overview/code.html` | `stitch/admin_dashboard_overview/screen.png` | `/admin` | Admin | `P0-F008` | Admin landing and triage |
| Admin Course List Screen | `stitch/admin_course_list_screen/code.html` | `stitch/admin_course_list_screen/screen.png` | `/admin/courses` | Admin | `P0-F008` | Admin manages course inventory |
| Admin Course Editor Screen | `stitch/admin_course_editor/code.html` | `stitch/admin_course_editor/screen.png` | `/admin/courses/new`, `/admin/courses/:id/edit` | Admin | `P0-F008`, `P0-F003` | Admin creates and edits courses, sections, lessons |
| Admin Orders List Screen | `stitch/admin_orders_list_screen/code.html` | `stitch/admin_orders_list_screen/screen.png` | `/admin/orders` | Admin | `P0-F006`, `P0-F008` | Admin reviews incoming orders |
| Admin Order Detail Screen | `stitch/admin_order_detail_16/code.html` | `stitch/admin_order_detail_16/screen.png` | `/admin/orders/:id` | Admin | `P0-F006`, `P0-F008` | Admin approves or rejects order |
| Admin Students List Screen | `stitch/admin_students_list_17/code.html` | `stitch/admin_students_list_17/screen.png` | `/admin/students` | Admin | `P0-F008` | Admin reviews registered students |
| Admin Student Detail Screen | `stitch/admin_student_detail_screen/code.html` | `stitch/admin_student_detail_screen/screen.png` | `/admin/students/:id` | Admin | `P0-F008` | Admin reviews one student |
| Admin Comments Moderation Screen | `stitch/admin_comments_moderation_screen/code.html` | `stitch/admin_comments_moderation_screen/screen.png` | `/admin/comments` | Admin | `P0-F005`, `P0-F008` | Admin moderates lesson comments |
| 403 Access Denied Screen | `stitch/403_access_denied/code.html` | `stitch/403_access_denied/screen.png` | `/403` | Any authenticated user | `P0-F001`, `P0-F008` | Forbidden access handling |
| 404 Not Found Screen | `stitch/404_not_found_screen/code.html` | `stitch/404_not_found_screen/screen.png` | `/404` or catch-all | Any | Cross-cutting support | Not-found handling |
| 500 Server Error Screen | `stitch/500_server_error_screen/code.html` | `stitch/500_server_error_screen/screen.png` | Error fallback route | Any | Cross-cutting support | Runtime error fallback |
| Offline Screen | `stitch/offline_no_connection/code.html` | `stitch/offline_no_connection/screen.png` | Offline fallback overlay/route | Any | Cross-cutting support | Network failure handling |
| Session Expired Screen | `stitch/session_expired_screen/code.html` | `stitch/session_expired_screen/screen.png` | `/session-expired` or auth-expired redirect | Student, admin | `P0-F001` | Session timeout handling |

## UI -> Feature -> API -> Data Mapping

| Stitch Page | APIs | Data Entities | Phase | Existing / Needed Tasks |
|---|---|---|---|---|
| Login Screen | `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh` | `User`, `RefreshToken` | Phase 5 | `T048`, `T049`, `T051`, `T052`, `T053`, `T054` |
| Register Screen | `POST /api/v1/auth/register` | `User`, `RefreshToken` | Phase 5 | `T048`, `T050`, `T052`, `T054` |
| Forgot Password Screen | Missing in contracts | likely token + `User` | Added support work | `T123` needed |
| Reset Password Screen | Missing in contracts | likely token + `User` | Added support work | `T123` needed |
| Home Screen | `GET /api/v1/courses` or featured subset | `Course` | Phase 3 | `T031`, `T034`, `T037`, `T038` |
| Course Catalog Screen | `GET /api/v1/courses` | `Course` | Phase 3 | `T033` to `T038` |
| Course Detail Screen | `GET /api/v1/courses/:slug` | `Course`, `Section`, `Lesson`, `Enrollment` | Phase 4 | `T039`, `T041` to `T044`, `T047` |
| Lesson Player Screen | `GET /api/v1/courses/:slug/lessons/:id`, `GET/POST /api/v1/lessons/:id/comments`, `POST /api/v1/lessons/:id/progress` | `Lesson`, `Enrollment`, `Comment`, `LessonProgress` | Phases 4, 8, 9 | `T040`, `T045`, `T046`, `T071` to `T082` |
| Payment Instructions Screen | `GET /api/v1/courses/:slug` or course summary endpoint, `POST /api/v1/orders` | `Course`, `Order` | Phase 6 | `T055`, `T058`, `T060`, `T061`, `T063` |
| Proof Upload Screen | `POST /api/v1/orders` | `Order` | Phase 6 | `T055` to `T061`, `T063` |
| Student Dashboard Screen | `GET /api/v1/enrollments/my`, `GET /api/v1/orders/my` | `Enrollment`, `Order`, `Course`, `LessonProgress` | Phase 7 | `T062`, `T064` to `T070` |
| Admin Dashboard Overview | Aggregated admin overview endpoints needed | `Course`, `Order`, `User`, `Comment` | Added admin phase work | `T122` needed |
| Admin Course List Screen | `POST/PUT/DELETE /api/v1/admin/courses*`, list endpoint needed | `Course`, `Section`, `Lesson` | Phase 10 | `T083`, `T084`, `T085`, `T086`, `T090` |
| Admin Course Editor Screen | `POST/PUT/DELETE /api/v1/admin/courses*`, sections and lessons endpoints | `Course`, `Section`, `Lesson` | Phase 10 | `T083`, `T084`, `T087`, `T088`, `T089`, `T090` |
| Admin Orders List Screen | `GET /api/v1/admin/orders` | `Order`, `User`, `Course` | Phase 11 | `T091`, `T093`, `T094`, `T096` |
| Admin Order Detail Screen | `GET /api/v1/admin/orders/:id`, `POST /approve`, `POST /reject`, signed proof endpoint | `Order`, `Enrollment`, `AuditLog` | Phase 11 | `T091`, `T092`, `T093`, `T095`, `T096` |
| Admin Students List Screen | `GET /api/v1/admin/students` | `User`, `Enrollment` | Phase 12 | `T097`, `T099`, `T102`, `T103` |
| Admin Student Detail Screen | `GET /api/v1/admin/students/:id` | `User`, `Enrollment`, `LessonProgress` | Phase 12 | `T097`, `T100`, `T102`, `T103` |
| Admin Comments Moderation Screen | `GET /api/v1/admin/comments`, `DELETE /api/v1/admin/comments/:id` | `Comment`, `Lesson`, `Course`, `AuditLog` | Phase 12 | `T076`, `T098`, `T101`, `T102`, `T103` |
| 403 Access Denied Screen | none or route state | auth context only | Phase 13 | `T114` updated |
| 404 Not Found Screen | none | none | Phase 13 | `T114` updated |
| 500 Server Error Screen | error boundary / retry hooks | none | Phase 13 | `T113`, `T123` needed |
| Offline Screen | network detection + retry hooks | none | Phase 13 | `T123` needed |
| Session Expired Screen | auth refresh, logout, expired redirect | `RefreshToken` | Phase 13 | `T052`, `T054`, `T123` needed |

## Style System Source of Truth

- Primary structural reference: each Stitch `code.html`
- Primary visual verification reference: each Stitch `screen.png`
- Global design language reference: `stitch/obsidian_logic/DESIGN.md`

Mandatory implementation rules:

- Use the Stitch exports as the visual source of truth.
- Preserve exported Stitch style exactly where feasible: spacing, layout, hierarchy, surfaces, cards, tables, forms, modals, navigation, and dashboard composition.
- Do not redesign pages while converting them into React components.
- If additional dynamic states are needed, extend the same design language from the exports and `DESIGN.md`.
- If any HTML and screenshot mismatch is discovered during implementation, preserve the screenshot's visual result, keep the HTML structure where possible, and record the mismatch in the task or PR note.
