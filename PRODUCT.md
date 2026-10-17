# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Players and curious visitors who heard of a Qaymaq game (store page, social link, word of mouth) and want to see what else the studio makes and what is coming next.
- Business contacts: publishers, partners, platforms and press who need to understand the studio fast and write to it.

## Product Purpose

The studio website of Qaymaq Games, MChJ, an independent game studio in the Samarkand Region, Uzbekistan. It exists so that visitors (1) learn about the studio's games and upcoming releases, (2) write to the studio, and (3) remember the studio. Success is a visitor who leaves knowing the games, knowing how to reach the team, and able to describe the site an hour later.

## Positioning

A small Uzbek indie studio whose identity is a one-eyed ninja cat in a sumi-e ink world: "Small ideas, big worlds." The site itself should feel like a piece of the studio's craft (interactive, playable), not a business card.

## Operating Context

- Static site (HTML/CSS/JS, no build step) deployed on Vercel from the `develop` branch; legal pages (/privacy, /terms, /knight-hamster/privacy-policy) and app-ads.txt must keep working.
- New design is prototyped first as a standalone artifact, then moved into the repo.

## Capabilities and Constraints

- Languages: English and Russian, switchable.
- Games to show (three):
  - **The Knight and the Hamster**: action roguelite deckbuilder, Android, released on Google Play (`com.knighthamster.game`), offline single-player; own page at /knight-hamster with trailer and screenshots.
  - **Doom's Day**: pixel-art adventure, in active development, release TBA, PC & consoles.
  - **Secret project**: must be presented as a secret that builds intrigue. Its working name must not be revealed on the site. Confirmed by the owner (2026-10-17): it is a mech game, release Q4 2026 (around December). On the site these two facts are revealed only when a visitor scores 25 points in the mini-game, which breaks the seal; platform and name stay classified.
- A small interactive mini-game featuring the cat mascot replaces the old Pac-Man game.
- Contacts: contact@qaymaqgames.com (business, partnerships, publishing), support@qaymaqgames.com (player support and data requests), +998 50 015 39 29.
- Undecided: social links, team/hiring content, store links beyond Google Play.

## Brand Commitments

- Name: Qaymaq Games (wordmark "QAY MAQ", with "GAMES"); legal name Qaymaq Games, MChJ.
- Logo: black cat head with a white eyepatch and a diagonal X strap, wrapped by a red ink swirl; heavy condensed wordmark.
- Logo motion (reference video `qaymaq_splash_v1_dark_action.mp4`): an eye appears, a red crosshair locks on, a red katana slash reveals the head, a red swirl spirals in with sparks, QAY MAQ slams in, GAMES fades in red.
- Key art (reference splash): sumi-e ink landscape on paper: ink mountains and mist, large red brush sun, a black cat with a red scarf on a cliff, pagoda and banner with the cat mark, pine branch, falling red leaves, a red seal with 猫, tagline "SMALL IDEAS BIG WORLDS", subline "INDIE GAMES FOR MOBILE & PC".
- The user explicitly pinned the splash image and the logo animation as the basis of the new design.

## Evidence on Hand

- Logo animation video (user's Downloads) and splash key art (1280x511, low resolution).
- Knight & Hamster: icon, 7 screenshots, feature graphics (EN/RU), floppy art, trailer.mp4 in `assets/knight-hamster/`.
- Doom's Day: cartridge art `assets/cartridge-doomsday.png`, diskette art.
- No testimonials, download counts, ratings, press quotes, team photos or founding date are on hand; do not invent them.

## Product Principles

1. The site is a playable piece of the studio's world, not a brochure.
2. Every game gets an honest status: released, in development, or sealed secret.
3. Contact is always one step away and readable as plain text.
4. Intrigue over exposition: show the world, tease what is coming, never over-explain.

## Accessibility & Inclusion

Motion-heavy by intent, so honor `prefers-reduced-motion` with a calm static version, keep the intro skippable, and keep all text and contacts readable without interaction.
