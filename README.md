# Thappor Man 3D

A stylized, real-time Three.js browser game with 20 missions based on the supplied PDF. Built with HTML, CSS and JavaScript. All characters and scenery are 3D geometry; PDF images appear only in mission briefings.

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
- Escape / pause button: pause, restart, or return home.
- Completed levels, best scores, stars, and mute preference are stored locally in your browser.

## Assets and development

- `src/missions.js`: all scenario text, dialogue, scene types, and asset mappings.
- `src/world.js`: procedural 3D city, characters, scene props and animations.
- `src/main.js`: gameplay, timing, audio, input, persistence and menus.
- `public/assets`: cropped PDF previews and 20 audio clips.
- `tools/extract.mjs` and `tools/audio.mjs`: regenerate previews and audio from the supplied originals. Audio boundaries were selected from detected silent gaps, retaining pauses within sentences. The ordering assumes the merged audio follows the PDF; voice content has not been independently transcribed.

The sample video was used as a reference for the striped-shirt hero and confrontation/slap sequence. Visuals are stylized procedural 3D, not photorealistic recreations of the video. Fonts use Google Fonts with system fallbacks; gameplay assets and Three.js are served locally.
