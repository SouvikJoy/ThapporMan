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
await page.click('#result-next');await page.click('#begin');
await page.evaluate(()=>{const {world}=window.testApp;world.hero.position.copy(world.target.position);world.hero.position.x-=1.5});await page.waitForSelector('#dialogue',{state:'visible'});await page.keyboard.press('Space');
for(let i=0;i<3;i++){await page.waitForFunction(()=>window.testApp.state.mode==='ready');await page.evaluate(()=>{window.testApp.state.phase=Math.PI/2;document.getElementById('slap').click()});}
await page.waitForSelector('#result-next');assert.match(await page.locator('#modal-content').textContent(),/ONE MORE TRY/);await page.click('#result-next');assert.equal(await page.evaluate(()=>window.testApp.state.lives),3);
// Construct every 3D scenario and verify every supplied preview/voice file loads.
await page.evaluate(async()=>{const {world,missions}=window.testApp;for(const m of missions){world.build(m);world.update(.016);for(const url of [m.image,m.audio]){const r=await fetch(url);if(!r.ok)throw Error(url)}}});
await page.evaluate(()=>{window.testApp.state.level=19;window.testApp.state.hits=2;window.testApp.state.score=1000;window.testApp.state.mode='ready';document.getElementById('slap').disabled=false;window.testApp.state.phase=0;document.getElementById('slap').click()});
await page.waitForSelector('#result-next');assert.match(await page.locator('#modal-content').textContent(),/ALL 20 MISSIONS COMPLETE/);await page.click('#result-next');
await page.reload();await page.waitForSelector('#loading',{state:'hidden'});assert.match(await page.locator('#start').textContent(),/CONTINUE/);
await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/mobile-home.png'});await page.click('#start');await page.click('#begin');
const before=await page.evaluate(()=>window.testApp.world.hero.position.x);const button=await page.locator('[data-key="d"]').boundingBox();await page.mouse.move(button.x+button.width/2,button.y+button.height/2);await page.mouse.down();await page.waitForFunction(x=>window.testApp.world.hero.position.x>x,before,{timeout:10000});await page.mouse.up();await page.screenshot({path:'test-results/mobile-game.png'});
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
console.log('PASS: WebGL render, movement, dialogue, scoring, pause, win/unlock, loss/retry, finale, persistence, all 20 scenes/assets, mobile controls.');
await browser.close();
