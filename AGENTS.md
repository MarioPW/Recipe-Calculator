# Development Directives, Component Inventory & Token Optimization

## 1. General Architecture & Performance Rules
- **Custom Hooks:** All state management, service calls, and side effects must always be extracted into a Custom Hook (e.g., `useMyComponent`), keeping the component strictly focused on the UI.
- **Internationalization:** Always use `useTranslation()` from `react-i18next` for user-facing strings.
- **Formatting:** Use the `formatNumber` helper function to format prices or costs.
- **Memoization:** Wrap heavy table mappings (`tableData`) and expensive computations in `useMemo`. Wrap callbacks passed as props in `useCallback`.
- **Conditional Rendering:** Always manage explicit `isLoading` booleans instead of relying solely on array lengths (`list.length === 0`) to prevent UI flickering.

## 2. Standard Component Reuse (MANDATORY)
Whenever designing or refactoring views for lists, tables, or secondary navigation bars, you **MUST** reuse existing components instead of writing custom HTML or new styles:

- **Data Tables:** 
  - Use `CustomTable` located at `src/components/common/CustomTable`.
  - Pass the formatted structure using `tableData` objects.
- **Navigation / Secondary Toolbar:** 
  - Use `SecondaryNavbar` located at `src/components/common/SecondaryNavbar`.
  - Pass `buttons`, `links`, and `searchInput` as props.
- **Loading Indicators:** 
  - Use `<Spinner />` located at `src/components/common/Spinner`.
- **Data Exporting:** 
  - Use `<ExportDropdown />` located at `src/components/common/ExportDropdown`.
- **Buttons:** 
  - Always use `<CustomButton />` located at `src/components/common/CustomButton`.
- **Styles & Icons:** 
  - If no custom component exists, exclusively use **Bootstrap v5.3.x** utility classes and **Bootstrap Icons** (`bi bi-*`).

## 3. Response & Token Efficiency Rules (CRITICAL)
To maximize efficiency and minimize token consumption, follow these output constraints:

- **Code-First Responses:** Output only the necessary modified code, functions, or unified diffs.
- **No Conversational Filler:** Omit introductory text, greetings, summaries, or polite closing remarks (e.g., "Here is your code", "Let me know if you need anything else").
- **Concise Explanations:** Do not explain unchanged code or standard syntax. Provide brief bullet points only when explaining critical logic shifts or bug fixes.
- **Partial Updates:** For large files, output only the updated function, hook, or section using `// ... rest of the code remains unchanged` comments for the untouched portions.
- **No Duplicate Imports:** Do not re-list all project imports unless new imports are explicitly added or changed.

## 4. Expected Component Structure Example

```javascript
import { SecondaryNavbar } from '../../common/SecondaryNavbar';
import { CustomTable } from '../../common/CustomTable';
import { Spinner } from '../../common/Spinner';
import { useMyFeature } from '../../../hooks/useMyFeature';

export const MyFeatureView = () => {
  const { tableData, isLoading, navbarProps } = useMyFeature();

  if (isLoading) return <Spinner/>;

  return (
    <>
      <SecondaryNavbar {...navbarProps}/>
      <div className="container p-0">
        <div className="table-responsive">
          <CustomTable className="table table-light table-striped text-nowrap" {...tableData}/>
        </div>
      </div>
    </>
  );
};