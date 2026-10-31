import { chromium } from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
fs.mkdirSync('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:5173');await page.waitForSelector('#loading',{state:'hidden'});
await page.waitForFunction(()=>!!window.testApp);
await page.screenshot({path:'test-results/home.png'});
await page.click('#missions');assert.equal(await page.locator('.mission-card:disabled').count(),19);await page.click('[data-level="0"]');await page.click('#begin');
// Move with actual controls into the interaction radius.
await page.keyboard.down('w');await page.keyboard.down('d');
await page.waitForFunction(()=>window.testApp.world.hero.position.x>-.2,{},{timeout:20000});
await page.keyboard.up('w');await page.keyboard.up('d');await page.keyboard.down('d');
await page.waitForFunction(()=>window.testApp.state.mode==='dialogue',{},{timeout:15000});await page.keyboard.up('d');
await page.keyboard.press('Space');await page.screenshot({path:'test-results/game.png'});
await page.click('#pause');const phase=await page.evaluate(()=>window.testApp.state.phase);await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>window.testApp.state.phase),phase);await page.click('#resume');
// Deterministic timing input exercises scoring, result transition, and persistence.
for(let i=0;i<3;i++){await page.waitForFunction(()=>window.testApp.state.mode==='ready');await page.evaluate(()=>{window.testApp.state.phase=0;document.getElementById('slap').click()});}
await page.waitForSelector('#result-next');assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('thappor-man-3d-v1')).unlocked),2);
assert.match(await page.locator('.newspaper').textContent(),/PALM PROFESSOR/);await page.screenshot({path:'test-results/newspaper.png'});
await page.click('#result-next');await page.click('#begin');
await page.evaluate(()=>{const {world}=window.testApp;world.hero.position.copy(world.target.position);world.hero.position.x-=1.5});await page.waitForSelector('#dialogue',{state:'visible'});await page.keyboard.press('Space');
for(let i=0;i<3;i++){await page.waitForFunction(()=>window.testApp.state.mode==='ready');await page.evaluate(()=>{window.testApp.state.phase=Math.PI/2;document.getElementById('slap').click()});}
await page.waitForSelector('#result-next');assert.match(await page.locator('#modal-content').textContent(),/ONE MORE TRY/);await page.click('#result-next');assert.equal(await page.evaluate(()=>window.testApp.state.lives),3);
// Badges award points once, and pause freezes ambient animation as well as combat.
await page.evaluate(()=>{const {world}=window.testApp;world.hero.position.set(-4,0,0)});
await page.waitForFunction(()=>window.testApp.state.badges===1);
assert.equal(await page.locator('#badge-count').textContent(),'◆ 1 / 3');
assert.equal(await page.evaluate(()=>window.testApp.state.score),100);
await page.click('#pause');const worldTime=await page.evaluate(()=>window.testApp.world.time);await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>window.testApp.world.time),worldTime);await page.click('#resume');
await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>window.testApp.state.score),100);
// Earn tea through exploration, activate with E, verify the actual timing speed and pause.
for(const index of [1,2]){await page.evaluate(i=>{const {world}=window.testApp;world.hero.position.set(world.badges[i].position.x,0,world.badges[i].position.z)},index);await page.waitForFunction(n=>window.testApp.state.badges===n,index+1);}
assert.equal(await page.evaluate(()=>window.testApp.state.charge),3);
await page.evaluate(()=>{const {world}=window.testApp;world.hero.position.copy(world.target.position);world.hero.position.x-=1.5});await page.waitForFunction(()=>window.testApp.state.mode==='dialogue');await page.keyboard.press('Space');await page.keyboard.press('e');
assert.equal(await page.evaluate(()=>window.testApp.state.chaUsed),true);
const teaStart=await page.evaluate(()=>({phase:window.testApp.state.phase,time:window.testApp.world.time}));await page.waitForTimeout(400);
const teaEnd=await page.evaluate(()=>({phase:window.testApp.state.phase,time:window.testApp.world.time}));assert.ok(Math.abs((teaEnd.phase-teaStart.phase)/(teaEnd.time-teaStart.time)-2.425*.45)<.08);
await page.screenshot({path:'test-results/cha-break.png'});
await page.click('#pause');const teaTime=await page.evaluate(()=>window.testApp.state.chaTime);await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>window.testApp.state.chaTime),teaTime);
// Reproduce a queued frame whose timestamp predates resume: timers must never run backwards.
const afterResume=await page.evaluate(()=>new Promise(resolve=>{const original=performance.now;try{performance.now=()=>original.call(performance)+1000;document.getElementById('resume').click();}finally{performance.now=original;}requestAnimationFrame(()=>resolve(window.testApp.state.chaTime));}));
assert.ok(afterResume<=teaTime,'Resuming must not add time to Cha Break');await page.keyboard.press('e');assert.ok(await page.evaluate(t=>window.testApp.state.chaTime<=t,teaTime),'A used power-up must not refill');
await page.click('#pause');await page.click('#restart');assert.deepEqual(await page.evaluate(()=>[window.testApp.state.charge,window.testApp.state.chaTime,window.testApp.state.chaUsed,window.testApp.state.perfects]),[0,0,false,0]);
// Real keyboard sprint input must move faster than walking and release cleanly.
await page.evaluate(()=>window.testApp.world.hero.position.set(-3,0,6.8));
await page.keyboard.down('Shift');await page.keyboard.down('d');await page.waitForFunction(()=>window.testApp.world.hero.position.x> -2.9);
const sprintStart=await page.evaluate(()=>({x:window.testApp.world.hero.position.x,time:window.testApp.world.time}));await page.waitForFunction(t=>window.testApp.world.time>t+.2,sprintStart.time);
const sprintEnd=await page.evaluate(()=>({x:window.testApp.world.hero.position.x,time:window.testApp.world.time}));await page.keyboard.up('d');await page.keyboard.up('Shift');assert.ok(Math.abs((sprintEnd.x-sprintStart.x)/(sprintEnd.time-sprintStart.time)-5.8)<.1);
// All locations must have a reachable confrontation and all three optional badges.
await page.evaluate(async()=>{const {world,missions,state}=window.testApp;const kinds=new Set();for(const m of missions){
 world.build(m);world.update(.016);kinds.add(world.environment.kind);
 const blocked=(x,z)=>world.obstacles.some(o=>Math.abs(x-o.x)<o.w/2+.35&&Math.abs(z-o.z)<o.d/2+.35);
 const seen=new Set(),queue=[[-3,3.8]],reachable=[];
 for(let n=0;n<queue.length;n++){const [x,z]=queue[n],key=`${x.toFixed(1)},${z.toFixed(1)}`;if(seen.has(key)||x< -5.5||x>6||z< -3.4||z>7||blocked(x,z))continue;seen.add(key);reachable.push([x,z]);for(const [dx,dz] of [[.2,0],[-.2,0],[0,.2],[0,-.2]])queue.push([x+dx,z+dz]);}
 if(!reachable.some(([x,z])=>Math.hypot(x-world.target.position.x,z-world.target.position.z)<1.85))throw Error(`Unreachable target ${m.id}`);
 for(const b of world.badges)if(!reachable.some(([x,z])=>Math.hypot(x-b.position.x,z-b.position.z)<.7))throw Error(`Unreachable badge ${m.id}`);
 // An off-center hit succeeds in normal modes, but misses the Precision zone.
 state.level=m.id-1;state.mode='ready';state.hits=0;state.lives=3;state.score=0;state.phase=Math.asin(.2);document.getElementById('slap').disabled=false;document.getElementById('slap').click();
 if(state.hits!==(m.location.rhythm==='precision'?0:1))throw Error(`Timing profile ${m.id}`);
 state.mode='approach';
 for(const url of [m.image,m.audio]){const r=await fetch(url);if(!r.ok)throw Error(url)}
 }if(kinds.size!==20)throw Error('Locations must be unique');state.paused=true;});
// Capture representative environments with a settled camera for visual review.
for(const index of [1,8,13,15,19]){
 await page.evaluate(i=>{const {world,missions}=window.testApp;world.build(missions[i]);world.setHome(false);world.update(1,{paused:true});document.getElementById('hud').hidden=true;},index);
 await page.screenshot({path:`test-results/location-${index+1}.png`});
}
await page.evaluate(()=>{window.testApp.state.paused=false;document.getElementById('hud').hidden=false;});
await page.evaluate(()=>{window.testApp.state.level=19;window.testApp.state.hits=2;window.testApp.state.score=1000;window.testApp.state.mode='ready';document.getElementById('slap').disabled=false;window.testApp.state.phase=0;document.getElementById('slap').click()});
await page.waitForSelector('#result-next');assert.match(await page.locator('#modal-content').textContent(),/ALL 20 MISSIONS COMPLETE/);await page.click('#result-next');
await page.reload();await page.waitForSelector('#loading',{state:'hidden'});assert.match(await page.locator('#start').textContent(),/CONTINUE/);
await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/mobile-home.png'});await page.click('#start');await page.click('#begin');
const before=await page.evaluate(()=>window.testApp.world.hero.position.x);const button=await page.locator('[data-key="d"]').boundingBox();await page.mouse.move(button.x+button.width/2,button.y+button.height/2);await page.mouse.down();await page.waitForFunction(x=>window.testApp.world.hero.position.x>x,before,{timeout:10000});await page.mouse.up();await page.screenshot({path:'test-results/mobile-game.png'});
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
console.log('PASS: WebGL, sprint, dialogue, scoring, pause, victory/newspaper, unlock, retry, finale, persistence, 20 reachable scenes/assets, badges, tea charge/slow-motion/pause/reset, timing profiles, mobile controls.');
await browser.close();
