# Thappor Man 3D

A stylized, real-time Three.js browser game with 20 missions based on the supplied PDF. Built with HTML, CSS and JavaScript. All characters and scenery are 3D geometry; PDF images appear only in mission briefings.

**Play online:** https://thappor-man-3d.vercel.app

## Run

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Use the Network URL on a phone connected to the same Wi-Fi. For production: `npm run build`, then host the `dist` folder. Use a web server rather than double-clicking the HTML file.

## Play

- WASD / arrow keys or the on-screen direction buttons: move toward the orange marker.
- Listen to the Bengali dialogue. Space / slap button also skips to the timing challenge.
- Space / slap button: strike when the white marker is in the green zone.
- Land 3 hits to complete a mission. Three misses lose the mission.
- Green hits earn 300 points; center hits earn 500. Remaining chances determine stars.
- Each mission visits a distinct Dhaka location with its own scenery, lighting and atmosphere.
- Explore before the confrontation to collect 3 gold community badges (+100 each, up to 1,800 points per mission).
- Classic, Pulse, Precision and Quick timing challenges vary the rhythm. Consecutive hits build a streak; the bag snatcher moves during your approach.
- Hold Shift (or the Sprint button) while moving to sprint. Gold badges and perfect hits each add one Cha Break charge: at 3 charges, press E or tap Cha Break during combat for 6 seconds of slower timing. One cup per mission; its timer only runs while the timing meter is active.
- Every culprit has a silly Bengali excuse, the crowd has a comeback, and each victory gets a satirical newspaper headline and performance title. Cartoon hit signs, dizzy stars, musical cues and a neighborhood victory dance celebrate your success.
- Escape / pause button: pause, restart, or return home.
- Completed levels, best scores, stars, and mute preference are stored locally in your browser.

## Assets and development

- `src/missions.js`: all scenario text, dialogue, scene types, and asset mappings.
- `src/world.js`: procedural 3D city, characters, scene props and animations.
- `src/environments.js`: 20 location layouts, palettes, animated scenery and timing profiles.
- `src/art.js`: illustrated skies, batched skyline windows, procedural ground textures and scene dressing.
- `src/arcade.css`: comic-arcade visual theme and mobile HUD panels.
- `src/main.js`: gameplay, timing, audio, input, persistence and menus.
- `public/assets`: cropped PDF previews and 20 audio clips.
- `tools/extract.mjs` and `tools/audio.mjs`: regenerate previews and audio from the supplied originals. Audio boundaries were selected from detected silent gaps, retaining pauses within sentences. The ordering assumes the merged audio follows the PDF; voice content has not been independently transcribed.

The sample video was used as a reference for the striped-shirt hero and confrontation/slap sequence. Visuals are stylized procedural 3D, not photorealistic recreations of the video. Fonts use Google Fonts with system fallbacks; gameplay assets and Three.js are served locally.
