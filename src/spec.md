# Specification

## Summary
**Goal:** Add a soil type filter on the main plant entries list so users can quickly narrow the displayed entries by soil type.

**Planned changes:**
- Add a soil type filter control to the main entries list view (where “Your Seeds” and the entry card grid are shown).
- Populate filter options from the currently loaded entries’ unique, non-empty `soilType` values, plus an “All soil types” option.
- Apply client-side filtering to the already-fetched entries and update the displayed grid accordingly.
- Update the entries count text to reflect the number of entries currently shown when a filter is active.
- Keep the existing empty state behavior; if there are no entries, do not show the filter (or disable it in a sensible way).

**User-visible outcome:** Users can select “All soil types” or a specific soil type to filter the entries shown in the list, and the on-screen entry count updates to match the filtered results.
