## 2025-07-28 - Missing ARIA Labels in Form Controls and Icon Buttons
**Learning:** Found that multiple input components like `<select>` dropdowns and the `<input>` search field inside `ExploreFilters` lacked associated labels or `aria-label` properties, which makes them inaccessible for screen readers. Additionally, an icon-only button used for toggling filters lacked both `aria-label` and `aria-expanded` attributes.
**Action:** Always ensure that form inputs (`<input>`, `<select>`, `<textarea>`) either have an explicit associated `<label>` element or carry an `aria-label` attribute if a visual label is omitted by design. Icon-only buttons must have an `aria-label` and properly represent their state with `aria-expanded` if they toggle the visibility of other content.## 2026-07-30 - Added search clear button

**Learning:** Adding a visible clear button for search inputs significantly improves micro-UX and search usability.
**Action:** When working with search inputs, add a clear (X) button conditionally if the user has entered text, and ensure the button is accessible via keyboard and screen readers.
## 2026-09-03 - Accessibility Improvements for Destructive Actions
**Learning:** Interactive icon buttons for destructive actions like deleting comments must require confirmation (e.g. window.confirm) and have explicit aria-label and focus-visible states to ensure users do not trigger them accidentally, especially via screen readers or keyboard navigation.
**Action:** Add confirmation dialogs and proper aria/focus attributes to icon-only action buttons.
