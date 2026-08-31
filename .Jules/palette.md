## 2025-07-28 - Missing ARIA Labels in Form Controls and Icon Buttons
**Learning:** Found that multiple input components like `<select>` dropdowns and the `<input>` search field inside `ExploreFilters` lacked associated labels or `aria-label` properties, which makes them inaccessible for screen readers. Additionally, an icon-only button used for toggling filters lacked both `aria-label` and `aria-expanded` attributes.
**Action:** Always ensure that form inputs (`<input>`, `<select>`, `<textarea>`) either have an explicit associated `<label>` element or carry an `aria-label` attribute if a visual label is omitted by design. Icon-only buttons must have an `aria-label` and properly represent their state with `aria-expanded` if they toggle the visibility of other content.## 2026-07-30 - Added search clear button

**Learning:** Adding a visible clear button for search inputs significantly improves micro-UX and search usability.
**Action:** When working with search inputs, add a clear (X) button conditionally if the user has entered text, and ensure the button is accessible via keyboard and screen readers.

## 2025-08-01 - Confirmations and Accessible Delete Actions
**Learning:** Found that destructive actions like deleting comments lacked a confirmation step, which could lead to accidental deletions and poor UX. The button also lacked an explicit aria-label for context when read by screen readers among multiple comments, and missing focus-visible styling for keyboard users.
**Action:** Always add a confirmation step (e.g. `window.confirm` or a modal) before executing a destructive action. Add explicit `aria-label`s to action buttons when the visual text alone (e.g., "Delete") might lack context, and ensure interactive elements have clear focus states (e.g., `focus-visible:ring-2`) for keyboard navigability.
