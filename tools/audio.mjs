import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import ffmpeg from 'ffmpeg-static';
// Dialogue boundaries from silence detection; short pauses within lines are retained.
const cuts = [0,6.62,12.34,18.76,25.77,31.35,38.55,45.58,52.45,59.15,64.38,70.72,77.55,84.18,90.67,99.07,104.60,111.50,117.56,125.01,131.09];
fs.mkdirSync('public/assets/audio', { recursive:true });
for (let i=0;i<20;i++) execFileSync(ffmpeg,['-v','error','-y','-ss',String(cuts[i]),'-i','thappor.mp3','-t',String(cuts[i+1]-cuts[i]),'-map_metadata','-1','-b:a','128k',`public/assets/audio/${String(i+1).padStart(2,'0')}.mp3`]);
fs.mkdirSync('public/assets/scenes',{recursive:true});
for (const f of fs.readdirSync('assets/scenes')) fs.copyFileSync(`assets/scenes/${f}`,`public/assets/scenes/${f}`);
