# Design System Strategy: The Luminescent Void

## 1. Overview & Creative North Star
This design system is built upon the Creative North Star of **"The Luminescent Void."** In the context of a premium Arabic-first AI and programming platform, we treat the interface not as a collection of boxes, but as a deep, intelligent space where knowledge emerges from the darkness.

To achieve a high-end editorial feel, we move away from standard "dashboard" templates. We utilize **intentional asymmetry**, where large typographic displays anchor the right side of the screen (respecting RTL flow), and UI elements float with a sense of "gravity" and "depth." This system prioritizes tonal transitions over structural lines, creating an environment that feels as sophisticated as the code and AI models being studied.

---

## 2. Colors & Surface Philosophy

### The Surface Hierarchy
We reject the flat UI. Depth is achieved through a "nested" approach using our surface tokens. 
*   **Surface (Base):** `#0d1322` — The infinite canvas.
*   **Surface-Container-Low:** Use for large structural sections.
*   **Surface-Container-High:** Use for interactive cards and floating panels.
*   **Surface-Container-Highest:** Use for "active" states or nested highlights.

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders are prohibited for sectioning. To define boundaries, use background color shifts. A `surface-container-low` section sitting on a `surface` background creates a sophisticated, modern boundary that is felt rather than seen.

### The "Glass & Gradient" Rule
To elevate the platform from a "tool" to an "experience":
*   **Signature Textures:** Main CTAs must use a subtle linear gradient from `primary` (#6D28D9) to `primary_container` (#6D28D9 at 80% opacity) at a 135-degree angle.
*   **Glassmorphism:** Floating elements (like navigation bars or code-completion tooltips) must use `surface_variant` with a 12px backdrop-blur and 60% opacity. This allows the "glow" of primary-colored content to bleed through from beneath.

---

## 3. Typography
Our typography is the "Voice of Authority." We use the **Inter** family to bridge the gap between technical precision and editorial elegance.

*   **Display (lg/md):** Reserved for hero titles and major milestones. Use `display-lg` (3.5rem) with a weight of 700 to create high-contrast entry points.
*   **Headline (sm/md):** Used for section headers. In RTL contexts, ensure these have generous leading to accommodate Arabic script ascenders and descenders.
*   **Labels (md/sm):** These are our "Technical Metadata." Use `label-md` (500 weight) for code parameters, AI confidence scores, and tags.
*   **Body (lg/md):** Set at 400 weight. Use `body-lg` for lesson content to ensure maximum readability during long study sessions.

---

## 4. Elevation & Depth

### The Layering Principle
Forget traditional drop shadows. We use **Tonal Layering**. 
1.  **Level 0:** `surface_dim` (The background).
2.  **Level 1:** `surface_container_low` (Sidebar or secondary panels).
3.  **Level 2:** `surface_container_highest` (Cards or lesson modules).

### Ambient Shadows
When an element must "float" (e.g., a modal or a floating action button), use an **Ambient Shadow**:
*   **Blur:** 32px to 64px.
*   **Opacity:** 8%.
*   **Color:** Use a tinted version of `primary` or `on_surface`. Never use pure black `#000000` for shadows; it "muddies" the premium dark background.

### The "Ghost Border" Fallback
If accessibility requirements demand a border (e.g., in high-contrast mode), use a **Ghost Border**: The `outline_variant` token at **15% opacity**. It should be a suggestion of a boundary, not a cage.

---

## 5. Components

### Buttons
*   **Primary:** 6px radius. Gradient fill. Label is `on_primary`. No border.
*   **Secondary:** 6px radius. Surface is `secondary_container`. Text is `on_secondary_container`.
*   **Tertiary (Editorial):** No background. Underline using `primary` at 2px height, but only on hover.

### Input Fields
*   **Visual Style:** Forbid the 1px outline. Use `surface_container_high` as the background fill.
*   **Focus State:** Transition the background to `surface_container_highest` and add a subtle 2px bottom-glow using the `secondary` (#0EA5E9) color.
*   **Radius:** 8px.

### Cards & Lists
*   **Rule:** No dividers. Use **Vertical White Space** (Scaling tokens 6, 8, or 10) to separate list items.
*   **The Progress Card:** A custom component for LMS. Use an asymmetrical layout where the lesson title is `title-lg` and the "Progress %" is a large, low-opacity `display-sm` numeral sitting behind the text.

### Tooltips & AI Annotations
*   **Style:** Glassmorphic (`surface_variant` + blur).
*   **Edge:** Use a "Ghost Border" on the top and right edges only to simulate a light source hitting the glass.

---

## 6. Do’s and Don’ts

### Do
*   **Do** prioritize the RTL flow. The eye should land on the Headline (Right) and move toward the interactive elements (Left).
*   **Do** use "Breathing Room." If you think there is enough margin, add one more step from the Spacing Scale. 
*   **Do** use Lucide icons with a "Regular" (2px) stroke weight for a clean, technical look.

### Don’t
*   **Don’t** use 100% opaque borders. It breaks the "Luminescent Void" aesthetic and looks like a generic template.
*   **Don’t** use high-saturation Success/Error colors for backgrounds. Use them only for text or small indicators (dots/lines) to maintain the dark, premium atmosphere.
*   **Don’t** use standard "Drop Shadows" with 0 blur. Shadows must be ambient and expansive.