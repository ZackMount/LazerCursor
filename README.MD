# lazercursor 🎯

A smooth, physics-driven custom cursor inspired by osu!lazer.
Framework-agnostic core + React adapter.

---

## 🚀 Installation

```bash
npm install lazercursor
```

---

## ⚛️ Usage in React

```tsx
import { LazerCursorProvider } from "lazercursor/react"
import "lazercursor/styles/cursor.css"

function App() {
  return (
    <LazerCursorProvider>
      <YourApp />
    </LazerCursorProvider>
  )
}
```

---

## 🌐 Usage in Vanilla JS / Other Frameworks

```ts
import { LazerCursorEngine } from "lazercursor"
import "lazercursor/styles/cursor.css"

const el = document.createElement("div")
el.className = "starcursor-cursor"
document.body.appendChild(el)

new LazerCursorEngine(el, { useDamping: true, followerTauMs: 80 })
```

---

## ⚙️ Options

When creating the engine, you can pass an **options object**:

* `useDamping: boolean`
  Enable smooth cursor damping (default: `true`).
  If set to `false`, the custom cursor will instantly follow the system cursor with no smoothing.

* `followerTauMs: number`
  Damping strength in milliseconds (default: `60`).
  Larger values → more “laggy” and elastic movement.
  Smaller values → cursor catches up faster.

Example:

```ts
new LazerCursorEngine(el, {
  useDamping: true,     // enable smooth damping
  followerTauMs: 100    // stronger "lag"
})
```

---

## ⚠️ Limitations / Known Issues

This library is designed for **visual experiments, games, and demos** — not for production websites.
By default, it **intercepts some browser behaviors** in order to achieve a smooth cursor effect:

* Disables **right-click context menu** (`contextmenu` event is prevented).
* Disables **dragging** (`dragstart` is prevented).
* Disables **Edge browser hold-to-preview menu** (touch/long-press menu).

Because of these restrictions, **this cursor is not suitable for content-heavy or production apps** where users rely on right-click menus, drag & drop, or accessibility features.

✅ Suitable for:

* Interactive art projects
* Game-like UIs
* Landing pages with “wow effect”

🚫 Not suitable for:

* Standard business apps
* Forms / productivity tools
* Sites where accessibility and standard mouse interactions are critical

---

## 📜 License

MIT © [ZackMount](https://github.com/ZackMount)