---
name: Qaymaq Games
description: Studio site as a sumi-e ink scroll, cut open with the cat's katana.
colors:
  paper: "#f1ede5"
  paper-deep: "#e4ddd0"
  ink: "#141312"
  ink-soft: "#46423d"
  mist: "#c8c1b5"
  shu: "#cf1f28"
  shu-lit: "#ff5d63"
  shu-deep: "#9e1219"
  night: "#0b0c10"
  bone: "#ede7db"
  bone-dim: "#a9a397"
  paint-a: "#18c4d6"
  paint-b: "#ffc83a"
typography:
  wordmark:
    fontFamily: "Anton, Sofia Sans Extra Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(64px, 8.6vw, 136px)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "0.015em"
  display:
    fontFamily: "Sofia Sans Extra Condensed, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "clamp(44px, 6.6vw, 96px)"
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Sofia Sans Extra Condensed, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "clamp(42px, 5.4vw, 84px)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Sofia Sans Extra Condensed, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "clamp(30px, 2.8vw, 42px)"
    fontWeight: 900
    lineHeight: 1
  body:
    fontFamily: "Golos Text, Segoe UI, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  lead:
    fontFamily: "Golos Text, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(17px, 1.35vw, 20px)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Sofia Sans Extra Condensed, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "14px"
    fontWeight: 800
    letterSpacing: "0.14em"
  seal-kanji:
    fontFamily: "Yuji Boku, Yu Mincho, MS Mincho, serif"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1
rounded:
  cut: "2px"
  seal: "3px 5px 4px 6px"
  stamp: "4px 7px 5px 8px"
  big-seal: "6px 10px 7px 12px"
spacing:
  gutter: "20px"
  cluster: "12px"
  stack: "26px"
  column: "40px"
  section-sm: "96px"
  section: "120px"
  section-lg: "140px"
  container: "1320px"
components:
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.cut}"
    padding: "15px 26px 14px"
  button-ink-hover:
    backgroundColor: "{colors.shu}"
    textColor: "{colors.paper}"
  button-shu:
    backgroundColor: "{colors.shu}"
    textColor: "{colors.paper}"
    rounded: "{rounded.cut}"
    padding: "15px 26px 14px"
  button-shu-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.cut}"
    padding: "15px 26px 14px"
  button-copy:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.cut}"
    padding: "11px 16px 10px"
  button-copy-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  seal:
    backgroundColor: "{colors.shu}"
    textColor: "{colors.paper}"
    typography: "{typography.seal-kanji}"
    rounded: "{rounded.seal}"
    size: "44px"
  stamp:
    backgroundColor: "transparent"
    textColor: "{colors.shu}"
    rounded: "{rounded.stamp}"
    padding: "9px 12px 7px"
  stamp-on:
    backgroundColor: "{colors.shu}"
    textColor: "{colors.paper}"
  lang-toggle:
    backgroundColor: "transparent"
    rounded: "{rounded.cut}"
    padding: "3px"
---

# Design System: Qaymaq Games

## Overview

**Creative North Star: "The Cut Ink Scroll"**

The site is one long sumi-e scroll of rice paper. Ink lives on it in washes from soot to mist; a single vermilion, shu, marks the sun, the seals, the slashes and the call to act. Where the games hang, the paper tears into a night-ink band (the dark of the logo video), and the sheets that hang there are hanging scrolls, not cards. The scroll returns to paper for play and craft and closes on a solid shu band for contact, then night again for the footer.

Everything is cut, stamped or brushed. Edges are torn (SVG tear strips between bands, jittered polygon masks on sheets), marks are pressed through a turbulence filter so they read hand-made, and motion follows one grammar: the katana slash. The intro gate splits along a diagonal, the sealed project breaks along a diagonal on a held slash, and the mini-game is slashing falling leaves. Type is heavy, condensed and uppercase for anything that is shouted; a calm Cyrillic-ready grotesque carries reading. Kanji appears only inside red hanko seals.

The page is bilingual (EN/RU) and motion-heavy by intent, so every animation collapses under `prefers-reduced-motion`, the intro is skippable, and all content (contacts included) is plain readable text without interaction.

**Key Characteristics:**
- Rice paper ground under a fixed multiply grain; ink washes, not grey UI tints.
- One accent, shu vermilion, carrying sun, seals, slashes and action.
- A night-ink band for the games, entered and left through torn paper edges.
- Heavy extra-condensed uppercase display; Golos Text for reading; Yuji Boku kanji only inside seals.
- Near-square, cut corners; organic irregular radii only on stamped marks.
- The katana slash as the single signature motion.

## Colors

Ink on paper with one red, plus a night-ink register for the games band.

### Primary
- **Shu Vermilion** (`shu`): the only accent. Sun, hanko seals, stamps, the brush underline under section headings, nav underline, focus ring, selection, button hover wipe, lives in the game, the full contact band.
- **Lantern Shu** (`shu-lit`): shu raised for legibility on the dark sheets; used for stamps on the night-band panels only.
- **Dried Shu** (`shu-deep`): small labels on paper sheets (game meta terms) and the cap rims of scroll rods.

### Neutral
- **Rice Paper** (`paper`): page ground, text on shu and ink buttons, the light game sheet.
- **Aged Paper** (`paper-deep`): the studio section ground, scrollbar track; the one quiet tonal step on paper.
- **Sumi Ink** (`ink`): text, ink buttons, plates, the cat mark.
- **Diluted Ink** (`ink-soft`): leads, secondary copy, sublines, scroll cue.
- **Mist** (`mist`): spent states only (lost lives, sound switch off).
- **Night Ink** (`night`): games band, marquee, footer, mobile menu, intro gate.
- **Bone** (`bone`): text and marks on night.
- **Dim Bone** (`bone-dim`): secondary text on night and on dark sheets.

### Tertiary (scoped)
- **Tease Cyan / Tease Yellow** (`paint-a`, `paint-b`): paint splatters revealed only around the sealed project's hanko. A deliberate leak from another world; they never appear anywhere else.

### Named Rules
**The One Red Rule.** Shu is the only chromatic accent on paper and on night. If a new element wants a second color, it takes ink, paper or bone instead.

**The Red Band Rule.** A full shu surface is reserved for the closing contact band. On it, ink replaces red as the accent (underline, button, nav underline).

## Typography

**Display Font:** Sofia Sans Extra Condensed 700/800/900 (with Arial Narrow, Roboto Condensed)
**Wordmark Font:** Anton (with Sofia Sans Extra Condensed, Arial Narrow)
**Body Font:** Golos Text 400/500/600 (with Segoe UI, system-ui)
**Seal Font:** Yuji Boku, subset to the seal kanji only (with Yu Mincho, MS Mincho)

**Character:** A poster-weight condensed shout over a quiet, readable grotesque; both cover Cyrillic so RU sets as strongly as EN.

### Hierarchy
- **Wordmark** (Anton 400, clamp 64 to 136px, 0.9): the QAY MAQ hero wordmark, gate word and header brand only.
- **Display** (900 uppercase, clamp 44 to 96px, 0.92, -0.01em): section headings, always with the brush underline.
- **Headline** (900 uppercase, clamp 42 to 84px, 0.9): game names on hanging sheets and the redacted title.
- **Title** (900 uppercase, clamp 30 to 42px, 1): process steps, game-over heading, contact addresses run larger (to 70px).
- **Body** (Golos 400, 17px, 1.6; 16px under 760px): reading copy, measures held to 26 to 46ch.
- **Lead** (Golos 400, clamp 17 to 20px, `ink-soft`, max 46ch): the paragraph beside a section heading.
- **Label** (800 uppercase, 13 to 19px, 0.08 to 0.16em tracking): buttons, nav, meta terms, scoreboard and address captions, stamps.

### Named Rules
**The Seal-Only Kanji Rule.** Yuji Boku sets kanji inside red hanko seals (and the marquee kanji in shu). It never sets Latin or Cyrillic text.

**The Wordmark Rule.** Anton is the logotype face. Headings use Sofia Sans Extra Condensed, never Anton.

## Layout

One centered column (max 1320px) with safe-area-aware gutters of at least 20px. Sections are full-bleed bands of paper, night, aged paper and shu, stacked vertically with generous padding (96 to 140px block). Headings sit in a two-column head with the lead pushed to the end column, collapsing to one column at 980px. The games are a stack of sticky hanging sheets that pile up as the visitor scrolls (offset 26px per sheet); under 760px they unpin and flow. The process steps stagger vertically along a hand-drawn ink path at desktop, then fall to 2 columns at 980px and 1 at 760px. The hero is a full-viewport layered ink scene with depth parallax; side ornaments (vertical seal, vertical tagline) drop to a single inline line on mobile. Breakpoints: 980px and 760px.

## Elevation & Depth

Paper is flat. Depth comes from layering ink plates with multiply blending, drifting mist, and the band changes between paper and night. Shadows exist only on physical objects that sit on the scroll: phones, the app icon, the cartridge, scroll rods. Interface elements (buttons, stamps, header) carry no drop shadow; the scrolled header uses a translucent band of its section's color with a 6px blur and a 1px hairline.

### Shadow Vocabulary
- **Device lift** (`box-shadow: 0 0 0 5px var(--ink), 0 26px 40px -18px rgba(20,19,18,.6)`): phone mockups; the 5px ring is the bezel.
- **Icon lift** (`box-shadow: 0 10px 20px -8px rgba(20,19,18,.45)`): app icon on the paper sheet.
- **Rod drop** (`box-shadow: 0 6px 10px -4px rgba(0,0,0,.55)`): wooden scroll rods.
- **Cartridge drop** (`filter: drop-shadow(0 30px 40px rgba(0,0,0,.55))`): the cartridge on the forge sheet.
- **Dark sheet vignette** (`box-shadow: inset 0 0 0 1.5px rgba(237,231,219,.14), inset 0 0 70px rgba(0,0,0,.45)`): the two dark sheets.

### Named Rules
**The Objects-Only Shadow Rule.** A shadow means a thing is physically on the paper. UI never casts one.

## Shapes

Corners are cut, not rounded: 2px on buttons, toggles and the copy button. Anything stamped (seals, stamps, the big seal, lives) uses deliberately unequal radii and the `#rough` turbulence filter so it reads as pressed ink. Sheets have torn, jittered edges via a polygon mask; bands meet through torn paper strips. Diagonals are structural: the gate split, the seal break and the button hover wipe all cut on a slant. Circles appear only for the pulse ring and the sound switch thumb; larger radii only on device mockups (22px phone, 15px app icon), because they depict real hardware.

## Components

### Buttons
Cut, loud and uppercase; hover is a slash of the other color.
- **Shape:** near-square (2px).
- **Ink (primary):** ink ground, paper label, 15px 26px 14px padding, 19px label type at 0.08em, optional 18px arrow.
- **Hover / Active:** a shu wedge wipes in diagonally from the left over .5s on the out-ease; press nudges down 1px and scales to .985. Focus is a 2px shu outline offset 3px.
- **Shu:** shu ground; the wipe is ink.
- **Ghost:** transparent with a 1.5px inset currentColor rule; wipe fills shu and the label turns paper.
- **Copy:** compact ink button beside each contact address; hover inverts to paper on ink.

### Seals (hanko)
- **Style:** shu square (44px default; 26, 40 and 64px variants), one paper kanji in Yuji Boku, unequal radii, faint inner paper rim, roughened edge.
- **Behavior:** in the process steps they stamp in (overshoot scale and rotation, then a shu ripple ring).

### Stamps (status)
- **Style:** shu outline 3px, shu uppercase label, rotated -7deg, roughened. "On" variant fills shu with paper text (released); outline means in development; on dark sheets the color is Lantern Shu.

### Hanging Sheets (game panels)
- **Corner Style:** torn vertical edges via mask; wooden rods with ink end caps top and bottom.
- **Background:** paper for the released game; dark forge and sealed gradients for the others.
- **Shadow Strategy:** none on the sheet itself on paper; inset vignette on dark sheets (see Elevation).
- **Border:** a 1.5px shu ring revealed only near the cursor.
- **Internal Padding:** clamp(28px, 4vw, 64px), two columns collapsing to one at 980px.

### Navigation
- **Style:** fixed 64px bar, transparent over the hero, translucent band when scrolled. Tone follows the section beneath (paper, night or shu).
- **Links:** 17px uppercase label type; a 2px shu underline scales in from the left on hover and for the current section (ink on the shu band).
- **Language:** EN/RU segmented toggle with a 1.5px inset rule; the pressed segment fills currentColor.
- **Mobile:** under 980px a two-line burger opens a night drop-down with 30px links.

### Brush Underline
Section headings carry a shu brush stroke (0.14em, uneven radii, roughened) that draws in from the left when the heading enters view; ink on the shu band. The heading text itself is always visible.

### Katana Slash (signature motion)
The one motion grammar, on the cut ease (`cubic-bezier(.7, 0, .2, 1)`). Intro gate: night halves split along a diagonal and fly apart after a glowing red slash line. Sealed project: holding a button fills a shu progress ring, the big seal rattles, then breaks into two halves along a diagonal. Mini-game: pointer slashes leave a brush-ink trail across falling leaves. Under reduced motion, all of it resolves to its end state.

## Do's and Don'ts

### Do:
- **Do** keep shu as the only chromatic accent; use `shu-lit` for red marks on dark sheets.
- **Do** set shouted text in Sofia Sans Extra Condensed uppercase at 700 to 900, and reading text in Golos Text at 16 to 20px.
- **Do** join bands of different grounds with a torn paper edge.
- **Do** mark status with a stamp and identity with a seal, both through the `#rough` filter.
- **Do** make every new motion either a slash, a stamp, a brush stroke or ambient drift, and give it a reduced-motion end state.
- **Do** keep text over the scene and contacts readable as plain text without interaction.

### Don't:
- **Don't** use rounded content cards; panels are hanging sheets with torn edges and rods.
- **Don't** cast drop shadows from UI elements; shadows belong to physical objects only.
- **Don't** introduce a second accent hue on paper or night; tease cyan and yellow stay inside the sealed project.
- **Don't** set Latin or Cyrillic text in Yuji Boku, or headings in Anton.
- **Don't** add small uppercase lines above headings; a heading stands on its own with its brush underline.

<!-- Out of scope: /css/style.css is the older system still used by the legal pages (/privacy, /terms) and /knight-hamster. It is a separate legacy surface and is not described here. -->
