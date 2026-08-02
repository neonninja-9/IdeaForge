## 2025-07-28 - Missing ARIA Labels in Form Controls and Icon Buttons
**Learning:** Found that multiple input components like `<select>` dropdowns and the `<input>` search field inside `ExploreFilters` lacked associated labels or `aria-label` properties, which makes them inaccessible for screen readers. Additionally, an icon-only button used for toggling filters lacked both `aria-label` and `aria-expanded` attributes.
**Action:** Always ensure that form inputs (`<input>`, `<select>`, `<textarea>`) either have an explicit associated `<label>` element or carry an `aria-label` attribute if a visual label is omitted by design. Icon-only buttons must have an `aria-label` and properly represent their state with `aria-expanded` if they toggle the visibility of other content.

## 2025-08-02 - Form submission with Enter key
**Learning:** The newsletter input and button in the Footer component were wrapped in a `div` rather than a `form`. This meant that pressing Enter in the email input wouldn't submit the form, and screen readers lacked the context of an email input with required validation.
**Action:** Use `<form>` for logical groupings of inputs and submit buttons to natively enable keyboard accessibility like pressing Enter to submit. Add `aria-label`, `autoComplete="email"`, and `required` to email inputs.
