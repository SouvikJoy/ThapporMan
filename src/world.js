import * as THREE from 'three';
import { buildEnvironment, locations } from './environments.js';
import { dressScene } from './art.js';

const palette = { asphalt:0x53615e, pavement:0xb5ac90, cream:0xe9dfbb, teal:0x2a7769, orange:0xf47642, skin:0xb77d52, hair:0x202a28, pants:0x344741 };
export class World {
 constructor(container) {
  this.scene=new THREE.Scene(); this.scene.background=new THREE.Color(0x9ab7a4);this.scene.fog=new THREE.Fog(0x9ab7a4,28,75);
  this.camera=new THREE.PerspectiveCamera(40,innerWidth/innerHeight,.1,100);
  this.renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));this.renderer.setSize(innerWidth,innerHeight);
   this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.NeutralToneMapping;this.renderer.toneMappingExposure=1.05;
  container.append(this.renderer.domElement);
   this.fill=new THREE.HemisphereLight(0xdcead5,0x687d65,2.3);this.scene.add(this.fill);
  const sun=new THREE.DirectionalLight(0xffe1a1,3.6);sun.position.set(-8,18,10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:.5,far:65});sun.shadow.normalBias=.04;this.scene.add(sun);
   this.sun=sun;this.root=new THREE.Group();this.scene.add(this.root);this.materials=new Map();this.actors=[];this.obstacles=[];this.particles=[];this.time=0;this.home=true;this.hitTime=-10;
   this.look=new THREE.Vector3();this.camPos=new THREE.Vector3();
   this.toonRamp=new THREE.DataTexture(new Uint8Array([75,145,215,255]),4,1,THREE.RedFormat);this.toonRamp.minFilter=this.toonRamp.magFilter=THREE.NearestFilter;this.toonRamp.needsUpdate=true;
   const rim=new THREE.DirectionalLight(0xa6ddff,.75);rim.position.set(8,7,-10);this.scene.add(rim);
  this.build({id:1,setting:'road',action:'bike'});
  addEventListener('resize',()=>{this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();this.renderer.setSize(innerWidth,innerHeight)});
 }
  mat(color){if(!this.materials.has(color)){const vivid=new THREE.Color(color),hsl={};vivid.getHSL(hsl);if(hsl.s>.12&&hsl.l>.2&&hsl.l<.8)vivid.offsetHSL(0,.14,.035);this.materials.set(color,new THREE.MeshToonMaterial({color:vivid,gradientMap:this.toonRamp}));}return this.materials.get(color)}
 box(parent,x,y,z,w,h,d,color){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),this.mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
  sphere(parent,x,y,z,r,color,scale=[1,1,1]){const m=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),this.mat(color));m.position.set(x,y,z);m.scale.set(...scale);m.castShadow=true;parent.add(m);return m}
  glow(parent,x,y,z,r,color){const m=this.sphere(parent,x,y,z,r,color);m.material=new THREE.MeshBasicMaterial({color});m.castShadow=false;return m;}
 cylinder(parent,x,y,z,r,h,color,r2=r){const m=new THREE.Mesh(new THREE.CylinderGeometry(r2,r,h,12),this.mat(color));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m}
 group(x=0,y=0,z=0,parent=this.root){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g}
 sign(parent,text,x,y,z,w=2,h=.5,bg='#204b40',fg='#f7e7af'){
  const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,512,128);ctx.strokeStyle=fg;ctx.lineWidth=4;ctx.strokeRect(10,10,492,108);ctx.fillStyle=fg;ctx.font='bold 48px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,67,470);
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex}));mesh.position.set(x,y,z);parent.add(mesh);return mesh;
 }
 person(x,z,color=0x497b6c,hero=false){
  const g=this.group(x,0,z);const body=this.group(0,0,0,g);g.userData.body=body;
  this.box(body,0,1.49,0,hero?.84:.68,.86,.43,color);this.box(body,0,1.04,0,.61,.23,.39,palette.pants);
  const legs=[];for(const s of [-1,1]){const leg=this.group(s*.19,1,0,body);this.box(leg,0,-.41,0,.25,.82,.29,palette.pants);this.box(leg,0,-.9,.09,.29,.19,.5,0x26312c);legs.push(leg)}
  this.cylinder(body,0,2.03,0,.13,.22,palette.skin);const head=this.group(0,2.3,0,body);this.sphere(head,0,0,0,.32,palette.skin,[.85,1.15,.85]);this.sphere(head,0,.21,-.04,.3,palette.hair,[.95,.64,.95]);
  this.box(head,0,-.14,.15,.44,.18,.22,hero?0x26302a:0x593f2c);this.box(head,0,-.06,.285,.12,.15,.11,palette.skin);
  for(const s of [-1,1]){this.box(head,s*.12,.065,.251,.095,.04,.025,0xf3edce);this.box(head,s*.12,.065,.269,.038,.043,.02,0x172923);const brow=this.box(head,s*.12,.125,.26,.14,.044,.035,palette.hair);brow.rotation.z=s*.19;this.sphere(head,s*.285,-.015,0,.07,palette.skin)}
  const arms=[];for(const s of [-1,1]){const arm=this.group(s*(hero?.49:.4),1.85,0,body);this.box(arm,0,-.14,0,.28,.35,.34,color);this.cylinder(arm,0,-.46,0,.12,.43,palette.skin);this.sphere(arm,0,-.72,0,.13,palette.skin,[.9,1.25,.6]);arms.push(arm)}
  if(hero){for(let i=-3;i<=3;i++)this.box(body,i*.105,1.49,.222,.019,.8,.008,0x587269);this.box(body,0,1.46,.232,.025,.77,.015,0xece8ce);this.box(arms[1],0,-.57,0,.26,.1,.25,0x252c28);}
  g.userData={...g.userData,arms,legs,head,hero,baseX:x,baseZ:z};this.actors.push(g);return g;
 }
 car(x,z,color=0xd0b36b,type='car'){
  const g=this.group(x,0,z);const bus=type==='bus',amb=type==='ambulance',rick=type==='rickshaw';const width=rick?1.3:1.9,length=bus?5.5:rick?2.4:3.5;
  this.box(g,0,.72,0,width,.65,length,color);this.box(g,0,bus?1.9:1.42,-.2,width*.9,bus?1.8:1.05,bus?length*.94:2,color);this.box(g,0,bus?2.15:1.58,bus?length*.48:.83,width*.78,bus?.8:.64,.04,0x456e70);
  for(const s of [-1,1]){for(const zz of [-length*.32,length*.32]){const wheel=this.cylinder(g,s*width*.52,.43,zz,.4,.23,0x263730);wheel.rotation.z=Math.PI/2;const hub=this.cylinder(g,s*width*.59,.43,zz,.19,.025,0xb1b8a7);hub.rotation.z=Math.PI/2;}this.box(g,s*width*.35,.76,length*.51,.32,.2,.05,0xffe8a3);this.box(g,s*width*.46,1.65,-.2,.025,.55,1.5,0x456e70)}
  this.box(g,0,.5,length*.52,width,.15,.12,0xbac1af);this.sign(g,rick?'CNG':bus?'DHAKA LOCAL':'DHAKA',0,.67,length*.525,.6,.15);
  if(bus){for(let i=-2;i<=2;i++)for(const s of [-1,1])this.box(g,s*.97,2.2,i*.83,.03,.75,.65,0x456e70);this.box(g,0,1.12,0,1.95,.22,length+.02,0xe5d8ad)}
  if(amb){this.box(g,0,2.05,-.2,1.4,.2,.4,0xdce8d8);this.box(g,-.45,2.2,-.2,.42,.18,.32,0xf34e39);this.box(g,.45,2.2,-.2,.42,.18,.32,0x3886e9);this.sign(g,'+',0,1.55,.87,.55,.55,'#f0eee0','#d83b32');this.ambulance=g}
  return g;
 }
 bike(x,z){const g=this.group(x,0,z);for(const zz of [-.7,.7]){const wheel=this.cylinder(g,0,.42,zz,.39,.19,0x243831);wheel.rotation.z=Math.PI/2;const hub=this.cylinder(g,.105,.42,zz,.23,.025,0xaab7a4);hub.rotation.z=Math.PI/2;}this.box(g,0,.76,0,.35,.3,1.25,0xb54830);this.box(g,0,1.04,-.25,.45,.15,.65,0x26332e);this.box(g,0,1.35,.6,.9,.07,.07,0x293d33);this.cylinder(g,0,.95,.63,.055,.8,0xaeb8a5);this.sphere(g,0,1.2,.77,.16,0xffeac0);return g}
 tree(x,z){const g=this.group(x,0,z);this.cylinder(g,0,1.6,0,.19,3.2,0x796b49,.13);for(let i=0;i<4;i++)this.sphere(g,Math.sin(i*2)*.65,3.4+i*.27,Math.cos(i*2)*.5,1.05,[0x56794a,0x6c8d53,0x79975a,0x456e4b][i]);this.box(g,0,.18,0,1.4,.35,1.4,0x8b9072)}
 building(x,z,w,h,color,index){const g=this.group(x,0,z);this.box(g,0,h/2,0,w,h,4.5,color);this.box(g,0,h+.12,0,w+.25,.24,4.8,0xc3bfa2);for(let floor=1;floor<h/2;floor++){for(let xx=-w/2+.7;xx<w/2;xx+=1.25){this.box(g,xx,floor*1.7+.3,2.27,.69,.95,.05,0x456963);this.box(g,xx,floor*1.7-.22,2.4,.85,.1,.35,0xd4c6a4)}}this.box(g,0,1,2.29,w-.3,1.8,.06,0x3b5c51);this.sign(g,['DHAKA STORES','CHA & ADDA','FRESH BAZAR','NEW MARKET','TEA CORNER'][index%5],0,2.4,2.34,w-.25,.55,index%2?'#b25a38':'#245b4e');const awning=this.box(g,0,1.95,2.85,w+.15,.12,1.15,index%2?0xb96b43:0x4e8b71);awning.rotation.x=.12;for(let i=0;i<w;i+=.42)this.box(g,-w/2+i,1.86,3.38,.21,.22,.08,0xe2c994);this.cylinder(g,w*.27,h+.5,0,.55,.9,0x667b67);return g}
  stall(x,z,action){const g=this.group(x,0,z);const accent=this.environment?.accent||0xb85838;this.box(g,0,.62,0,3.3,1.23,1.3,0x9b7750);this.box(g,0,1.28,0,3.5,.15,1.45,0xc2a06c);if(action!=='expiry'){for(const s of [-1,1])this.cylinder(g,s*1.55,1.9,-.45,.05,3.8,0x7c6a4b);const roof=this.box(g,0,3.23,0,3.8,.13,2.3,accent);roof.rotation.x=.1;for(let j=0;j<8;j++)this.box(g,-1.65+j*.47,3.2,0,.22,.14,2.3,0xe9d5a3);}this.sign(g,({food:'DESHI KITCHEN',scale:'FAIR WEIGHT',expiry:'CHECK THE DATE',extort:'CHA & ADDA',boxes:'HARDWARE & HOME',cloth:'TEXTILES'})[action]||'FRESH BAZAR',0,action==='expiry'?1.05:2.85,action==='expiry'?.76:1.1,2.8,.38);
   if(['fruit','spray'].includes(action))for(let i=0;i<15;i++){const xx=(i%5)*.55-1.1,zz=Math.floor(i/5)*.34-.3;this.sphere(g,xx,1.5,zz,.19,[0xe9b54a,0xa6ad4d,0xc76c3d][i%3]);}
   if(['cloth','boxes','extort'].includes(action))for(let i=0;i<6;i++)this.box(g,(i%3)*.85-.85,1.45+Math.floor(i/3)*.24,0,.7,.22,.75,[accent,0xe5c277,0x78a8a1][i%3]);
   if(action==='scale')for(let i=0;i<3;i++)this.sphere(g,-1+i*.55,1.52,-.3,.25,0xc9b98d,[1,.8,1]);
  if(action==='scale'){this.cylinder(g,.4,1.8,.2,.045,1.1,0x344e44);this.box(g,.4,2.3,.2,1.2,.05,.05,0x344e44);for(const s of [-1,1]){this.cylinder(g,.4+s*.5,2,.2,.018,.6,0x344e44);this.cylinder(g,.4+s*.5,1.7,.2,.29,.06,0xb8b89d)}}
  if(action==='food'){this.cylinder(g,0,1.6,.2,.65,.3,0xb3b5a0);this.cylinder(g,0,1.77,.2,.59,.02,0xe9be42)}
  if(action==='expiry'){for(let i=0;i<4;i++){this.box(g,i*.5-.8,1.65,.5,.35,.6,.3,0xcb9a45);this.sign(g,'EXPIRED',i*.5-.8,1.65,.66,.32,.13,'#f0e6c6','#b4442e')}}
  this.obstacles.push({x,z,w:3.5,d:1.5});return g;
 }
 build(mission){
  // Dispose per-scene geometry and label textures; shared materials are reused.
    this.root.traverse(o=>{if(o.isInstancedMesh)o.dispose();if(o.geometry)o.geometry.dispose();if(o.material?.map){o.material.map.dispose();o.material.dispose()}else if(o.material&&!Array.from(this.materials.values()).includes(o.material))o.material.dispose();});this.root.clear();this.actors=[];this.obstacles=[];this.particles=[];this.ambient=[];this.badges=[];this.ambulance=null;this.prop=null;this.mission=mission;this.resolved=false;
   const env=mission.location||locations[mission.id-1];this.environment=env;
    this.skyTexture?.dispose();this.scene.background=new THREE.Color(env.sky);this.scene.fog.color.setHex(env.sky);this.fill.color.setHex(0xcce8ff);this.fill.groundColor.setHex(0x777b9d);this.celebrationBurst=0;
   const night=['bazaar','foodcourt','hospital','arcade','overpass'].includes(env.kind);
    this.fill.intensity=night?.8:1.1;this.sun.intensity=night?1.1:1.8;this.sun.color.setHex(night?0xc7cbff:0xffe6ba);this.sun.position.set(mission.id%2?-8:8,18,10);
   buildEnvironment(this,env);
  const market=mission.setting==='market';const indoor=['office','counter','bus'].includes(mission.setting);
  this.hero=this.person(-3,3.8,0xe7e2cd,true);this.hero.rotation.y=.9;
  this.target=this.person(2,0,mission.action==='bribe'?0xc6aa75:mission.action==='harass'||mission.action==='extort'?0x323e36:0x9d624a);this.target.rotation.y=-.8;
   if(market){this.stall(3,-1.8,mission.action);this.person(4.5,1.8,0x54857d);}
  if(['bike'].includes(mission.action)){this.prop=this.bike(2,.4);this.prop.rotation.y=-.5;this.target.position.set(2,0,-.1);this.target.userData.arms.forEach(a=>a.rotation.x=-.8);}
  if(mission.setting==='bridge'){this.box(this.root,0,3.6,-5,17,.4,2);for(const x of [-7,7]){this.box(this.root,x,1.7,-5,.5,3.5,.5);for(let i=0;i<10;i++)this.box(this.root,x,.17*i,-2-i*.4,1.7,.35,.5)}for(let x=-8;x<9;x+=.7)this.box(this.root,x,4.2,-4,.05,1,.05);this.box(this.root,0,4.7,-4,17,.06,.06);this.sign(this.root,'USE FOOTBRIDGE',0,3.7,-3.98,3.5,.4);this.box(this.root,3,.9,.8,3,.08,.07,0x748e72);this.target.userData.legs[0].rotation.x=-.8;}
  if(['horn','ambulance','parking'].includes(mission.action)){this.prop=this.car(3,-.3,0x354c46);this.target.position.set(1.45,0,1.2);if(mission.action==='parking')this.prop.rotation.y=Math.PI/2;if(mission.action==='ambulance')this.car(3,5.2,0xe4e4cb,'ambulance');}
  if(['fare','bully'].includes(mission.action)){this.prop=this.car(4,1,0x458b68,'rickshaw');const victim=this.person(3.3,-1,0xc4ad87);victim.userData.arms[0].rotation.x=-1;this.sign(this.root,mission.action==='fare'?'100 → 150 TK':'RESPECT EVERYONE',3,3,-1,2,.45);}
  if(mission.action==='litter'){this.cylinder(this.root,3.7,.65,0,.45,1.3,0x3c795f);this.sign(this.root,'BIN',3.7,.8,.46,.45,.35);this.prop=this.box(this.root,1.9,.06,1.3,.4,.1,.55,0xe2ac36);this.prop.rotation.y=.6;}
  if(mission.action==='harass'||mission.action==='bag'){const victim=this.person(4.1,1.8,0xb8747b);this.box(victim,0,1.15,.05,.76,.9,.5,0xc18585);victim.rotation.y=1.8;this.target.userData.arms[1].rotation.x=-1;}
  if(mission.action==='bag'||mission.action==='wallet'){this.prop=this.box(this.target,.5,.75,.2,mission.action==='bag'?.5:.23,mission.action==='bag'?.5:.15,.25,0x6d4c32);}
  if(mission.action==='spray'||mission.action==='food'){this.prop=this.cylinder(this.target,.5,1.2,.35,.09,.34,mission.action==='spray'?0xd4e3cb:0x9f3c89);this.box(this.target,.5,1.4,.39,.2,.06,.1,0xf07842);}
  if(mission.action==='boxes'){for(let i=0;i<10;i++)this.box(this.root,4+(i%3)*.8,.35+Math.floor(i/3)*.65,1.8,.75,.65,.7,0xb58d58);this.prop=this.box(this.target,0,1.1,.55,.8,.65,.6,0xc49d65);}
  if(mission.action==='extort'){this.person(3,-3,0xd5b98a);this.box(this.root,3,1.5,-1.8,.7,.2,.5,0x293b32);}
  if(indoor){
   this.box(this.root,0,-.015,0,14,.16,13,mission.setting==='bus'?0x7c897c:0xc9c2a3);this.box(this.root,0,2.1,-4.5,14,4.3,.25,0xbec6a7);
   for(let x=-5;x<=5;x+=2.5){this.box(this.root,x,2.5,-4.34,1.8,1.6,.04,0x6f9d96);this.box(this.root,x,2.5,-4.29,.06,1.7,.06,0xe5dec3)}
   this.sign(this.root,mission.setting==='bus'?'DHAKA LOCAL':mission.setting==='office'?'PUBLIC SERVICE OFFICE':'TICKET COUNTER',0,3.8,-4.3,5,.45);
   if(mission.setting==='bus'){for(const x of [-4,4])for(let z=-2;z<=4;z+=2){this.box(this.root,x,.65,z,1.3,.25,1,0x3b736e);this.box(this.root,x,1.3,z-.4,1.3,1.4,.2,0x3b736e);this.cylinder(this.root,x*.7,2,z,.035,4,0xc3c6ad);}this.person(2.8,-.5,0x7e9eb0);for(let i=0;i<3;i++)this.person(-1+i*1.5,-2,0xa68d62);}
   else{this.box(this.root,2,.9,-1.8,3.5,1.7,1.2,0x8c714d);this.box(this.root,2,1.82,-1.8,3.7,.15,1.4,0xb19a6e);this.obstacles.push({x:2,z:-1.8,w:3.7,d:1.4});for(let i=0;i<5;i++)this.box(this.root,2.8,1.95+i*.065,-1.8,.65,.045,.8,i%2?0xc6ba8a:0x819677);if(mission.setting==='counter')for(let i=0;i<5;i++)this.person(-.5-i*.85,-1.1,0x6e8d77);else{this.sign(this.root,'NO BRIBES',-3,2.5,-4.3,2,.65,'#e4d9b4','#983b2a');this.prop=this.box(this.target,.48,1.2,.3,.32,.07,.17,0x7f9d54);}}
  }
   for(const [x,z] of [[mission.setting==='bus'?-2.5:-4,0],[0,5.8],[5,5.5]]){const badge=this.group(x,.8,z);const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.26),this.mat(0xffd563));badge.add(gem);const halo=new THREE.Mesh(new THREE.RingGeometry(.32,.37,24),this.mat(0xffd563));halo.rotation.x=-Math.PI/2;halo.position.y=-.63;badge.add(halo);this.badges.push(badge);}
   const ring=new THREE.Mesh(new THREE.RingGeometry(.57,.66,40),new THREE.MeshBasicMaterial({color:0xff7947,side:THREE.DoubleSide,transparent:true,opacity:.9}));ring.rotation.x=-Math.PI/2;ring.position.y=.15;this.root.add(ring);this.ring=ring;
  const marker=new THREE.Mesh(new THREE.ConeGeometry(.19,.38,4),new THREE.MeshBasicMaterial({color:0xff7947}));marker.rotation.z=Math.PI;this.root.add(marker);this.marker=marker;
   dressScene(this,env);
   this.dizzy=this.group();for(let i=0;i<5;i++){const star=new THREE.Mesh(new THREE.OctahedronGeometry(.12),this.mat(0xffdc69));this.dizzy.add(star);}this.dizzy.visible=false;this.comic=null;this.hitGood=false;
   this.camera.position.set(11,8,14);this.camera.lookAt(0,1,0);this.hitTime=-10;
 }
 setHome(value){this.home=value;if(value){this.hero.position.set(0,0,3);this.target.position.set(3,0,0);}}
  distance(){return Math.hypot(this.hero.position.x-this.target.position.x,this.hero.position.z-this.target.position.z)}
  collect(){let count=0;for(const badge of this.badges)if(badge.visible&&Math.hypot(badge.position.x-this.hero.position.x,badge.position.z-this.hero.position.z)<.7){badge.visible=false;count++;}return count;}
  move(dx,dz,dt,sprinting=false){if(!dx&&!dz)return false;const len=Math.hypot(dx,dz);dx/=len;dz/=len;const speed=sprinting?5.8:3.5;const x=this.hero.position.x+dx*dt*speed,z=this.hero.position.z+dz*dt*speed;const blocked=this.obstacles.some(o=>Math.abs(x-o.x)<o.w/2+.35&&Math.abs(z-o.z)<o.d/2+.35);if(!blocked){this.hero.position.x=THREE.MathUtils.clamp(x,-5.5,6);this.hero.position.z=THREE.MathUtils.clamp(z,-3.4,7)}this.hero.rotation.y=Math.atan2(dx,dz);return !blocked;}
  slap(good=true,perfect=false){this.hitTime=this.time;this.hitGood=good;this.hero.rotation.y=Math.atan2(this.target.position.x-this.hero.position.x,this.target.position.z-this.hero.position.z);if(this.comic){this.comic.geometry.dispose();this.comic.material.map.dispose();this.comic.material.dispose();this.root.remove(this.comic);}this.comic=this.sign(this.root,good?(perfect?'PALM PERFECT!':'THAPPOR!'):'WHOOSH!',this.target.position.x,3.5,this.target.position.z,good?2.5:2,.65,good?'#ff693a':'#396779');}
 resolve(){this.resolved=true;if(this.prop&&['litter','bag','wallet','spray','food','bribe'].includes(this.mission.action))this.prop.visible=false;}
  burst(){for(let i=0;i<18;i++){const p=this.box(this.root,this.target.position.x,2,this.target.position.z,.06,.06,.06,i%2?0xffb54b:0xffedb7);p.userData.velocity=new THREE.Vector3((Math.random()-.5)*5,Math.random()*4+1,(Math.random()-.5)*5);p.userData.life=.8;this.particles.push(p)}}
  confetti(){for(let i=0;i<18;i++){const p=this.box(this.root,this.hero.position.x+(Math.random()-.5)*4,4+Math.random()*2,this.hero.position.z+(Math.random()-.5)*3,.09,.025,.18,[0xffcf4e,0xff6684,0x52d9da,0xb695ff][i%4]);p.userData.velocity=new THREE.Vector3((Math.random()-.5)*2,1+Math.random(),(Math.random()-.5)*2);p.userData.life=1.6;p.userData.confetti=true;this.particles.push(p);}}
   update(dt,{moving=false,paused=false,approaching=false,celebrating=false}={}){
  if(!paused)this.time+=dt;const t=this.time;const hit=t-this.hitTime;
   if(!paused){
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    for(const badge of this.badges){badge.children[0].rotation.y=reduced?0:t*1.5;badge.children[0].position.y=reduced?0:Math.sin(t*2+badge.position.x)*.12;}
    if(!reduced)for(const a of this.ambient){if(a.type==='spin')a.mesh.rotation.y+=dt*2;if(a.type==='sway')a.mesh.rotation.z=Math.sin(t*2+a.seed)*.08;if(a.type==='bob')a.mesh.position.y=a.base+Math.sin(t+a.seed)*.12;if(a.type==='wave')a.mesh.position.x=a.base+Math.sin(t*.6+a.seed)*.8;if(a.type==='rain'){a.mesh.position.y-=dt*7;if(a.mesh.position.y<0)a.mesh.position.y=10;}}
    if(approaching&&this.mission.action==='bag'){this.target.position.x=2+Math.sin(t*1.1)*1.4;this.target.position.z=Math.sin(t*.8)*1.2;this.target.rotation.y=Math.cos(t*1.1)>0?1.5:-1.5;}
   for(const a of this.actors){const d=a.userData;d.body.position.y=Math.sin(t*2+a.id)*.018;const walking=a===this.hero&&moving;d.legs.forEach((leg,i)=>leg.rotation.x=walking?Math.sin(t*11+i*Math.PI)*.48:0);if(a!==this.target)d.arms.forEach((arm,i)=>{arm.rotation.x=walking?Math.sin(t*11+i*Math.PI)*.35:Math.sin(t*1.5+i)*.035;arm.rotation.z=(i?-.1:.1)})}
   if(!this.resolved){this.target.userData.arms[1].rotation.x=-.7+Math.sin(t*3)*.2;this.target.userData.head.rotation.y=Math.sin(t*.8)*.15;}
    if(hit>=0&&hit<.65){const swing=Math.sin(Math.min(hit/.32,1)*Math.PI);this.hero.userData.body.position.z=swing*.5;this.hero.userData.arms[1].rotation.x=-swing*1.8;this.hero.userData.arms[1].rotation.z=-swing*.9;this.target.userData.body.rotation.z=this.hitGood?(hit>.2?Math.sin((hit-.2)/.45*Math.PI)*-.3:0):Math.sin(hit/.65*Math.PI)*.5;}else{this.target.userData.body.rotation.z=0;this.hero.userData.body.position.z=0;}
    this.dizzy.visible=this.hitGood&&hit>.2&&hit<1.5&&!this.resolved;this.dizzy.position.copy(this.target.position);this.dizzy.position.y=2.9;this.dizzy.children.forEach((star,i)=>{const angle=i*Math.PI*2/5+(reduced?0:t*4);star.position.set(Math.cos(angle)*.55,Math.sin(angle*2)*.1,Math.sin(angle)*.55);});
    if(this.comic){this.comic.visible=hit<.9;this.comic.quaternion.copy(this.camera.quaternion);this.comic.position.y=3.3+(reduced?0:Math.min(hit,1)*.6);}
    this.hero.userData.body.rotation.z=0;
    if(celebrating&&!reduced){this.celebrationBurst-=dt;if(this.celebrationBurst<=0){this.confetti();this.celebrationBurst=.4;}}
    if(celebrating){for(const a of this.actors){if(a===this.target)continue;const d=a.userData;d.arms.forEach((arm,i)=>{arm.rotation.x=-2.3;arm.rotation.z=(i?1:-1)*(.35+(reduced?0:Math.sin(t*9)*.25));});if(!reduced){d.body.position.y=Math.abs(Math.sin(t*7+a.id))*.18;if(a===this.hero)d.body.rotation.z=Math.sin(t*7)*.12;}}}
   if(this.resolved){this.target.userData.head.rotation.x=.3;this.target.userData.arms.forEach(a=>a.rotation.x=-1.3);if(this.prop&&['bike','parking','horn','ambulance','fare'].includes(this.mission.action))this.prop.position.z-=dt*1.8;if(this.ambulance)this.ambulance.position.z-=dt*1.5;}
    this.particles=this.particles.filter(p=>{p.userData.life-=dt;if(p.userData.life<0){p.geometry.dispose();this.root.remove(p);return false}p.position.addScaledVector(p.userData.velocity,dt);p.userData.velocity.y-=dt*(p.userData.confetti?2:9);if(p.userData.confetti){p.rotation.x+=dt*3;p.rotation.z+=dt*2;}return true});
  }
  this.ring.position.x=this.target.position.x;this.ring.position.z=this.target.position.z;this.ring.visible=!this.home&&!this.resolved;this.marker.position.set(this.target.position.x,3.15+Math.sin(t*3)*.13,this.target.position.z);this.marker.visible=!this.home&&!this.resolved;
  if(this.home){this.camPos.set(10+Math.sin(t*.1)*1.2,6.3,13);this.look.set(-2,1.4,0);if(innerWidth<700){this.camPos.set(12,9,19);this.look.set(0,1,0)}}else{const p=this.hero.position;this.camPos.set(p.x*.3+9,7.8,p.z*.3+12);this.look.set(p.x*.35+.2,1,p.z*.35-.2);if(innerWidth<700){this.camPos.set(p.x*.3+13,13,p.z*.3+23);this.look.set((p.x+this.target.position.x)*.5,1,(p.z+this.target.position.z)*.5)}}
  this.camera.position.lerp(this.camPos,1-Math.exp(-dt*4));this.camera.lookAt(this.look);if(hit>.2&&hit<.4&&!matchMedia('(prefers-reduced-motion: reduce)').matches)this.camera.position.x+=Math.sin(hit*130)*.08;
  this.renderer.render(this.scene,this.camera);
 }
}
