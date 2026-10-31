import * as THREE from 'three';

const nightKinds=['bazaar','foodcourt','hospital','arcade','overpass'];
export function dressScene(w,env){
 const night=nightKinds.includes(env.kind),indoor=['office','station','grocery','bus'].includes(env.kind);
 // An illustrated sky, instead of a flat-color horizon. One texture per scene.
 const sky=document.createElement('canvas');sky.width=1024;sky.height=512;
 const ctx=sky.getContext('2d'),gradient=ctx.createLinearGradient(0,0,0,512);
 const sunset=['river','lake','ferry','yard'].includes(env.kind);
 gradient.addColorStop(0,night?'#182550':sunset?'#718cd5':'#439fd2');
 gradient.addColorStop(.62,night?'#615789':sunset?'#f5b597':'#b9e7e2');
 gradient.addColorStop(1,night?'#e29a8c':'#fff0c7');ctx.fillStyle=gradient;ctx.fillRect(0,0,1024,512);
 ctx.fillStyle=night?'#fff2b7':'#fff3cc';ctx.beginPath();ctx.arc(780,110,night?22:37,0,Math.PI*2);ctx.fill();
 if(night){for(let i=0;i<55;i++){ctx.globalAlpha=.35+(i%4)*.15;ctx.fillRect((i*173)%1024,(i*67)%240,2,2);}}else{
  ctx.fillStyle='#ffffff';ctx.globalAlpha=.38;for(let i=0;i<9;i++){const x=(i*173)%1050,y=40+(i%3)*52;ctx.beginPath();ctx.ellipse(x,y,70,12,0,0,Math.PI*2);ctx.ellipse(x+22,y-8,30,17,0,0,Math.PI*2);ctx.fill();}
 }
 ctx.globalAlpha=1;const skyTexture=new THREE.CanvasTexture(sky);skyTexture.colorSpace=THREE.SRGBColorSpace;w.scene.background=skyTexture;w.skyTexture=skyTexture;
 w.scene.fog.color.set(night?0x726487:0xc8dcd5);
 // Tile / brick / asphalt detail is generated locally; no asset downloads.
 const surfaces=[];w.root.traverse(o=>{const p=o.geometry?.parameters;if(o.isMesh&&p?.width>3&&p?.depth>4&&p?.height<.5&&o.position.y<.15&&o.material!==w.mat(0x4c97a7))surfaces.push(o);});
 for(const surface of surfaces){
  const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;const c=canvas.getContext('2d');
  c.fillStyle='#'+surface.material.color.getHexString();c.fillRect(0,0,128,128);
  const road=['junction','overpass','rain','hospital'].includes(env.kind);
  c.strokeStyle=road?'#ffffff13':'#25355328';c.lineWidth=2;
  if(!road){for(let y=0;y<=128;y+=32){c.beginPath();c.moveTo(0,y);c.lineTo(128,y);c.stroke();for(let x=(y/32%2)*32;x<128;x+=64){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+32);c.stroke();}}}
  let seed=8471;for(let i=0;i<140;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%128;seed=(Math.imul(seed,1664525)+1013904223)>>>0;c.fillStyle=i%2?'#ffffff15':'#17263d10';c.fillRect(x,(seed>>>12)%128,1,1);}
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(surface.geometry.parameters.width/3,surface.geometry.parameters.depth/3);texture.anisotropy=Math.min(4,w.renderer.capabilities.getMaxAnisotropy());
  surface.material=surface.material.clone();surface.material.color.setHex(0xffffff);surface.material.map=texture;
 }
 if(!indoor){
  // A layered city silhouette closes the empty stage without hiding gameplay.
  const windows=[];for(let i=0;i<15;i++){
   const x=(i-7)*4.5,h=4+(i*7%9),z=-29-(i%3)*2,color=night?0x45567c:[0x739eaf,0x8eafb2,0x829daf][i%3];
   const tower=w.box(w.root,x,h/2,z,4,h,3,color);tower.castShadow=false;
   for(let y=2;y<h;y+=2)for(let xx=-1;xx<=1;xx+=1)windows.push([x+xx,y,z+1.52]);
  }
  const lights=new THREE.InstancedMesh(new THREE.BoxGeometry(.45,.7,.025),new THREE.MeshBasicMaterial({color:night?0xffd889:0xb4d7da}),windows.length),matrix=new THREE.Matrix4();windows.forEach((p,i)=>lights.setMatrixAt(i,matrix.makeTranslation(...p)));w.root.add(lights);
  // Illustrated posters on the left edge add local character at human scale.
  const board=w.group(-6.5,0,-3.8);w.box(board,0,1.2,0,.12,2.4,.12,0x293b59);
  w.sign(board,['CHA FIRST!','NO VIP EXCUSES','KEEP DHAKA KIND','HERO ON DUTY'][w.mission.id%4],0,2.3,.08,2.3,.7,'#ffca50','#25334f');
  if(!['river','lake','ferry'].includes(env.kind))for(const x of [-10,10]){const planter=w.group(x,0,6);w.box(planter,0,.25,0,1.7,.5,1.7,0x4e8491);for(let i=0;i<6;i++)w.sphere(planter,Math.sin(i*2)*.55,.65,Math.cos(i*2)*.55,.25,[0xf9798b,0xffc45a,0x68b998][i%3]);}
 }
 // Grounding shadows make the small figures read clearly at mobile scale.
 for(const actor of w.actors){const shadow=new THREE.Mesh(new THREE.CircleGeometry(.46,24),new THREE.MeshBasicMaterial({color:0x182541,transparent:true,opacity:.16,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.16;actor.add(shadow);}
}
