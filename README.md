# **Trade It – Token Discovery Dashboard**

A fully interactive **token discovery and analytics dashboard** inspired by **Axiom Trade (pump.fun style UI)**.  
Built with **Next.js 16 (App Router)**, **Tailwind v4**, **Redux Toolkit**, **React Query**, and **MSW** mock APIs.

This project features real-time UI updates, dynamic sorting, accessibility-first components, sparkline charts, a pixel-perfect navbar & sticky footer, and a rich token table with live animations.

---

## 🚀 **Features**

### **Token Table**

- Real-time price updates (mock WebSocket stream)
- Stable sorting (asc/desc)
- Keyboard accessibility + ARIA live announcements
- Category tabs: `All`, `New Pairs`, `Final Stretch`, `Migrated`
- Token info panel inside each row
- Animated sparks & flash-diff on price change
- Action dropdown (`Buy`, `Sell`, `View`)

### **Dashboard Overview**

- Total Market Cap
- 24h Volume
- Active TXNs
- Sparkline charts for each metric

### **UI/UX**

- Axiom-inspired **Navbar** (pixel-perfect)
- Fully interactive **Sticky Footer**
- Smooth hover animations
- Dark theme with Tailwind v4 custom CSS variables
- Responsive & mobile-friendly

### **Mock Data Engine**

- MSW v2 HTTP mocking
- Automatically randomized token dataset
- 20+ generated tokens for realistic table density
- Custom sparkline generation

---

## 🏗️ **Tech Stack**

| Layer            | Tech                           |
| ---------------- | ------------------------------ |
| Framework        | **Next.js 16 (App Router)**    |
| Styling          | **Tailwind v4**, CSS variables |
| State Management | **Redux Toolkit**              |
| Data Fetching    | **React Query (TanStack)**     |
| Mock API         | **MSW (Mock Service Worker)**  |
| Charts           | SVG **Sparkline** component    |
| Accessibility    | ARIA live announcements        |

---

## 📁 **Project Structure**

```
src/
 ├── app/
 │    ├── globals.css
 │    ├── layout.tsx
 │    ├── providers.tsx
 │    └── page.tsx
 ├── components/
 │    ├── ui/
 │    │    ├── Navbar.tsx
 │    │    ├── StickyFooter.tsx
 │    │    └── Sparkline.tsx
 │    └── organisms/
 │         └── TokenTable/
 │              ├── TokenTable.tsx
 │              ├── TokenRow.tsx
 │              ├── ColumnHeader.tsx
 │              ├── CategoryTabs.tsx
 │              └── TokenInfo.tsx
 ├── features/
 │    ├── store.ts
 │    ├── table/
 │    └── websocket/
 ├── mocks/
 │    ├── handlers.ts
 │    └── ClientWorker.tsx
 ├── services/
 │    ├── api.ts
 │    └── msw/
 └── utils/
      ├── sort.ts
      └── announce.ts
```

---

## ⚙️ **Installation & Setup**

### **1. Install dependencies**

```bash
yarn
```

### **2. Run Development Server**

```bash
yarn dev
```

### **3. MSW Worker Setup**

MSW initializes automatically via:

```tsx
<ClientWorker />
```

No manual service worker setup required.

---

## 🧪 **Scripts**

| Script       | Description                     |
| ------------ | ------------------------------- |
| `yarn dev`   | Start development server        |
| `yarn build` | Production build                |
| `yarn start` | Run production build            |
| `yarn test`  | Run Playwright tests (optional) |

---

## 🌗 **Tailwind v4 Notes**

TailwindCSS is imported in `globals.css`:

```css
@import "tailwindcss/preflight";
@import "tailwindcss/utilities";
```

No `tailwind.config.js` is required unless you want custom theme extensions.

---

## 🖼️ **Favicon and Metadata**

Modify favicon & metadata here:

`src/app/layout.tsx`

```ts
export const metadata = {
  title: "Trade It",
  description: "Token Discovery",
  icons: { icon: "/favicon.ico" },
};
```

Place favicon assets inside:

```
public/
  favicon.ico
  icon.png
  apple-touch-icon.png
```

---

## 🎯 **Future Enhancements**

- Wallet connection + signing
- Real-time blockchain price streams
- Watchlist, alerts, notifications
- Token detail modal + chart overlays
- Multi-chain switching
- Filters, advanced search & trending tab

---

## 🤝 **Contributing**

Pull requests are welcome!  
Please follow the existing architecture and folder structure.

---

## 📄 **License**

MIT — free to use, modify and distribute.
