---
name: design-engineering
description: "Use when: building UI, reviewing components, working on animations, designing interactions. Applies Emil Kowalski's taste-driven philosophy to create interfaces that feel intentional and polished."
---

# Design Engineering

When invoked without a specific question:

> I'm ready to help you build interfaces that feel right. My approach is based on taste, unseen details, and the compound effect of small decisions.

---

## Core Principles

### 1. Taste is trained, not innate
Good taste is **not** personal preference—it's a trained instinct. Study great work. Reverse engineer animations. Be curious about *why* things feel good, not just how they work.

### 2. Unseen details compound
Most details users never notice. That's the goal. When everything works exactly as assumed, users proceed without thought. Aggregate correctness = interfaces people love without knowing why.

### 3. Beauty is leverage
People choose tools based on overall experience, not just functionality. Good defaults, animations, and polish are real differentiators.

---

## Animation Decision Framework

**Before writing any animation, ask:**

### Should this animate at all?

| Frequency | Decision |
|-----------|----------|
| 100+ times/day (keyboard actions, toggles) | **No animation. Ever.** |
| Tens of times/day (hover, navigation) | Remove or drastically reduce |
| Occasional (modals, toasts, drawers) | Standard animation (150-300ms) |
| Rare/first-time (onboarding, celebrations) | Can add delight |

**Never animate keyboard-initiated actions.** These are repeated 100+ times daily—animation makes them feel slow.

### What's the purpose?

Every animation must have a clear "why":
- **Spatial consistency**: toast enters/exits from same direction
- **State indication**: button morphs to show loading state
- **Feedback**: scale(0.97) on press confirms the interface heard you
- **Explanation**: marketing animation showing feature in action

If the purpose is just "looks cool" and users see it often, don't animate.

### What easing?

| Scenario | Easing |
|----------|--------|
| Element entering, appearing | `ease-out` (starts fast, responsive) |
| Element moving on screen | `ease-in-out` (natural acceleration) |
| Hover, color change | `ease` (gentle) |
| Constant motion (marquee) | `linear` |

**Never use `ease-in` on UI.** It starts slow, making the interface feel sluggish. At 300ms, `ease-out` feels faster than `ease-in` at 300ms because `ease-in` delays the initial movement—exactly when the user is watching.

**Use custom curves instead of built-in easings:**
```css
/* Strong ease-out */
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);

/* Strong ease-in-out */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
```

Find curves at [easing.dev](https://easing.dev/) or [easings.co](https://easings.co/).

### How fast?

| Element | Duration |
|---------|----------|
| Button press feedback | 100-160ms |
| Tooltips, small popovers | 125-200ms |
| Dropdowns, selects | 150-250ms |
| Modals, drawers | 200-500ms |

**Rule: UI animations stay under 300ms.** A 180ms dropdown feels more responsive than 400ms.

---

## Component Patterns

### Buttons must feel responsive
Add `transform: scale(0.97)` on `:active`. Instant feedback makes the UI feel like it's listening.

```css
.button {
  transition: transform 160ms ease-out;
}
.button:active {
  transform: scale(0.97);
}
```

### Never `scale(0)` on entry
Nothing in reality disappears/reappears completely. Start from `scale(0.95)` + `opacity: 0`.

```css
/* Bad */
.toast { transform: scale(0); }

/* Good */
.toast { transform: scale(0.95); opacity: 0; }
```

### Popovers scale from trigger
Popovers should scale from their trigger point, not center. **Exception: modals stay centered.**

```css
.popover {
  transform-origin: var(--radix-popover-content-transform-origin);
  /* or for custom solutions: */
  transform-origin: var(--transform-origin);
}
```

### Skip tooltip animation on hover chain
First tooltip: delay 300ms, then animate in. Hovering adjacent tooltips? Open instantly with no animation. Feels faster without defeating the initial delay purpose.

### Use transitions for dynamic UI
CSS transitions can be interrupted and retargeted mid-animation. Keyframes restart from zero. For UI that triggers rapidly (adding toasts, toggles), transitions produce smoother results.

### Animate entries with `@starting-style`
Modern CSS for entry animations without JavaScript:

```css
.toast {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 400ms ease, transform 400ms ease;
  
  @starting-style {
    opacity: 0;
    transform: translateY(100%);
  }
}
```

---

## Performance Rules

### Only animate `transform` and `opacity`
These skip layout/paint and run on GPU. Animating `padding`, `margin`, `height`, `width` triggers all three rendering steps (expensive).

### CSS animations beat JS under load
CSS animations run off the main thread. When the browser loads content or runs scripts, Framer Motion (using `requestAnimationFrame`) drops frames. CSS stays smooth.

For **dynamic, interruptible** animations → JS/Framer.  
For **predetermined** animations → CSS/keyframes.

### Use WAAPI for programmatic CSS
Web Animations API gives JS control with CSS performance:

```js
element.animate([
  { clipPath: 'inset(0 0 100% 0)' },
  { clipPath: 'inset(0 0 0 0)' }
], {
  duration: 1000,
  fill: 'forwards',
  easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
});
```

---

## Accessibility

### Respect `prefers-reduced-motion`
Reduced motion means fewer/gentler animations, not zero. Keep opacity and color transitions. Remove movement.

```css
@media (prefers-reduced-motion: reduce) {
  .element {
    animation: fade 0.2s ease;
    /* No transform-based movement */
  }
}
```

### Gate hover animations on desktop
Touch devices trigger hover on tap (false positives). Add media query gate:

```css
@media (hover: hover) and (pointer: fine) {
  .element:hover {
    transform: scale(1.05);
  }
}
```

---

## Review Checklist

| Issue | Fix |
|-------|-----|
| `transition: all` | Specify properties: `transition: transform 200ms ease-out` |
| `scale(0)` entry | Start from `scale(0.95)` + `opacity: 0` |
| `ease-in` on UI | Switch to `ease-out` or custom curve |
| `transform-origin: center` on popover | Use trigger location or Radix CSS variable |
| Animation on keyboard action | Remove entirely |
| Duration > 300ms | Reduce to 150-250ms |
| Hover without media query | Add `@media (hover: hover) and (pointer: fine)` |
| Keyframes on fast-triggered element | Use CSS transitions |
| No `:active` state on button | Add `scale(0.97)` |
| All items appear at once | Stagger with 30-80ms delays between items |

---

## Taste Development

1. **Study great work.** Use dev tools to inspect animations on [Vercel](https://vercel.com), [Arc](https://arc.net), [Linear](https://linear.app).
2. **Slow it down.** Play animations at 0.25x speed in Chrome DevTools. Imperfections become obvious.
3. **Frame-by-frame inspection.** Chrome DevTools → Animations panel. Step through pixel by pixel.
4. **Sleep on it.** Review animations the next day with fresh eyes. You'll spot issues you missed during development.
5. **Be specific.** "This feels off" is a start. Narrow it down: timing? Easing? Origin point? Color transition?

---

## Further Study

- Interactive easing explorer: [easing.dev](https://easing.dev/)
- Emil Kowalski's full course: [animations.dev](https://animations.dev/)
- Real-world animation patterns: Study Sonner, Arc, Vercel, Linear UIs
