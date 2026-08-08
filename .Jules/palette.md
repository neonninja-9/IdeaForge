## 2025-07-28 - Missing ARIA Labels in Form Controls and Icon Buttons
**Learning:** Found that multiple input components like `<select>` dropdowns and the `<input>` search field inside `ExploreFilters` lacked associated labels or `aria-label` properties, which makes them inaccessible for screen readers. Additionally, an icon-only button used for toggling filters lacked both `aria-label` and `aria-expanded` attributes.
**Action:** Always ensure that form inputs (`<input>`, `<select>`, `<textarea>`) either have an explicit associated `<label>` element or carry an `aria-label` attribute if a visual label is omitted by design. Icon-only buttons must have an `aria-label` and properly represent their state with `aria-expanded` if they toggle the visibility of other content.

## 2024-08-08 - Accessible filtering components
**Learning:** Standalone inputs and selects used for searching/filtering (without visible `<label>` elements) often lack `aria-label` attributes in this application, making them inaccessible to screen readers.
**Action:** When adding or modifying search, filtering, or inline form inputs, ensure they have explicit `aria-label` attributes if there is no visible associated `<label>` element.
