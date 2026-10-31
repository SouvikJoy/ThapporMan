// Each stop has its own silhouette, ground plan, light and timing rhythm.
export const locations = [
 ['Bijoy Sarani junction','Morning rush','junction',0xa9ced0,0x617479,0xefc879,'steady'],
 ['Sadarghat fruit landing','River sunrise','river',0xeabda0,0xbda17b,0xe88e42,'steady'],
 ['Airport Road overpass','Blue-hour commute','overpass',0x667aab,0x424f69,0x67b7de,'pulse'],
 ['Dhanmondi lakeside','Golden-hour walk','lake',0xedc5a0,0xd5bb93,0xd58985,'steady'],
 ['Civic service hall','Paperwork & ceiling fans','office',0xb9c8c3,0xd2ccba,0x567e70,'precision'],
 ['Old Dhaka bazar','Lantern-lit evening','bazaar',0x423950,0x886b69,0xe1a544,'pulse'],
 ['Farmgate bottleneck','Monsoon traffic','rain',0x788b9e,0x475d6b,0xd5c35c,'pulse'],
 ['Railway warehouse lane','Catch the runner','rail',0xc8b4a5,0x958b80,0xc16c48,'quick'],
 ['Ramna picnic garden','A greener afternoon','park',0xb1d6c5,0x8dba78,0xe3ae49,'steady'],
 ['University promenade','Campus crossing','campus',0xb3cbdc,0xc4b491,0xb9564a,'quick'],
 ['Kamalapur ticket hall','The departure queue','station',0x9bb8c8,0xbfc3bd,0x487b97,'precision'],
 ['Karwan Bazar wholesale','Under the canvas roofs','wholesale',0xd8c7a3,0xab9d7b,0x698f53,'precision'],
 ['Neighborhood grocery','After-hours shopping','grocery',0x8b9fb2,0xd8d7c4,0x589d9b,'precision'],
 ['Festival food courtyard','Steam & fairy lights','foodcourt',0x4a4569,0x9c807b,0xe78052,'pulse'],
 ['Buriganga ferry terminal','Last boat at sunset','ferry',0xe3a192,0xc3ad96,0x538d92,'quick'],
 ['Dhaka local bus','Inside the moving bus','bus',0x8ea6bb,0x6e8590,0x4c879c,'precision'],
 ['City hospital entrance','Emergency night shift','hospital',0x283f62,0x4c6178,0x57a6b1,'quick'],
 ['Shankhari Bazar alley','Brickwork & balconies','alley',0xd6b7a4,0xae8d79,0xa85f4b,'precision'],
 ['Rickshaw repair yard','Colorful canopies','yard',0xdac3a1,0xb8a17d,0x3f9a8b,'pulse'],
 ['New Market arcade','Give the walkway back','arcade',0x8c9ab1,0xc2afa0,0xc77991,'quick'],
].map(([name,atmosphere,kind,sky,ground,accent,rhythm])=>({name,atmosphere,kind,sky,ground,accent,rhythm}));

export const rhythms = {
 steady:{label:'CLASSIC',speed:2.4,width:.22,help:'A steady rhythm. Aim for the center.'},
 pulse:{label:'PULSE',speed:2.6,width:.22,help:'The marker speeds up and slows down. Watch its rhythm.'},
 precision:{label:'PRECISION',speed:2.2,width:.17,help:'A narrower green zone. Make each hit count.'},
 quick:{label:'QUICK',speed:3.3,width:.22,help:'A faster marker. Anticipate the next pass.'},
};

export function buildEnvironment(w, env) {
 const {kind,ground,accent}=env, r=w.root;
 const box=(x,y,z,a,b,c,color=accent)=>w.box(r,x,y,z,a,b,c,color);
 const sign=(text,x,y,z,width=4)=>w.sign(r,text,x,y,z,width,.6);
 const water=(z)=>{box(0,-.035,z,60,.2,18,0x4c97a7);for(let i=0;i<18;i++){const wave=box(-24+i*3,.08,z+(i%4)*2-3,1.8,.025,.07,0xafd3cf);w.ambient.push({mesh:wave,type:'wave',base:wave.position.x,seed:i});}};
 const bench=(x,z)=>{box(x,.65,z,2,.18,.7,0x8c684a);box(x,1.1,z-.3,2,.8,.12,0x8c684a);for(const s of [-.7,.7])box(x+s,.3,z,.12,.6,.6,0x42545b);};
 const lamp=(x,z)=>{w.cylinder(r,x,2.5,z,.065,5,0x354c59);w.glow(r,x,5,z,.23,0xffdc88);};
 const facade=(x,z,width,height,color=accent)=>w.building(x,z,width,height,color,Math.abs(Math.round(x)));
 const shelves=(x,z)=>{box(x,1.5,z,2.4,3,.4,0x527773);for(let j=0;j<3;j++){box(x,.5+j*.85,z+.35,2.4,.08,.8,0xe5d3ae);for(let i=0;i<5;i++)box(x-1+i*.48,.8+j*.85,z+.35,.3,.5,.3,[accent,0xe5b454,0xdbcdb4][(i+j)%3]);}};
 const bunting=(z)=>{for(let i=0;i<17;i++){const flag=box(-10+i*1.25,4.8-Math.sin(i/16*Math.PI)*.8,z,.48,.5,.035,[accent,0xf5ce76,0x70b6ac][i%3]);flag.rotation.z=.2;}};
 const road=()=>{box(0,-.025,1,11,.08,34,ground);for(let z=-13;z<18;z+=4)box(0,.025,z,.13,.02,1.8,0xf1dec0);for(const x of [-6.5,6.5])box(x,.02,1,1.7,.22,34,0xb9b8aa);};
 box(0,-.22,0,65,.3,75,ground);
 switch(kind){
  case 'junction':
   road();box(0,-.02,-5,45,.08,7,ground);for(let i=0;i<7;i++)box(-4+i*1.35,.04,-2,.7,.03,2,0xf1e4ca);
   for(let i=0;i<5;i++)facade(-13+i*6,-16,5.5,7+i%3*3,[0xd0b591,0x7b9da2,0xb7bc9b][i%3]);
   for(const x of [-6,6]){lamp(x,-3);box(x,3.4,-3,.5,1.2,.4,0x263d42);w.sphere(r,x,3.7,-2.76,.14,0xef674a);}
   w.car(-3,-8,0xd6ab53,'bus');w.car(4,10,0x4f9381,'rickshaw');break;
  case 'river':
   water(-16);box(0,.05,-6.5,26,.3,1,0x786450);for(let x=-12;x<=12;x+=3)box(x,.6,-6.5,.16,1.2,.16,0x594b41);
   for(let i=0;i<3;i++){const boat=w.group(-9+i*9,0,-14);w.box(boat,0,.3,0,5,.8,2,0x694d3c);w.box(boat,0,1.1,0,2.5,1,1.7,accent);w.ambient.push({mesh:boat,type:'bob',base:0,seed:i});}
   w.stall(-7,-3,'fruit');sign('SADARGHAT FRUIT LANDING',0,4,-7,7);break;
  case 'overpass':
   road();for(const x of [-12,12])for(let z=-14;z<12;z+=7)box(x,3,z,1,6,1,0x687c92);
   box(-12,6.2,0,5,.5,40,0x8f9aa9);box(12,6.2,0,5,.5,40,0x8f9aa9);w.car(-3,-9,0xc89568,'bus');w.car(3,9,0x799bb9);break;
  case 'lake':
   water(-15);box(0,.25,-5,30,.16,.15,0xf0d9b3);for(let x=-14;x<15;x+=2)box(x,.65,-5,.08,1.3,.08,0xf0d9b3);
   for(const x of [-8,8]){w.tree(x,-2);w.tree(x,6);bench(x,-3);lamp(x,3);}box(0,.01,1,11,.06,15,0xe2c9a8);break;
  case 'office':
   shelves(-5,-3.8);shelves(5,-3.8);sign('SERVICE DESK  /  04',0,3,-4.25);for(let i=0;i<3;i++)bench(-4,1+i*2);
   {const fan=w.group(0,4.5,0);for(let i=0;i<3;i++){const blade=w.box(fan,0,0,0,3,.08,.23,0x627a73);blade.rotation.y=i*Math.PI/3;}w.ambient.push({mesh:fan,type:'spin'});}break;
  case 'bazaar':
   for(const x of [-9,9])for(let z=-9;z<9;z+=6)if(x<0||z<0)facade(x,z,4,6, x<0?0x9d6b79:0xbf946e);bunting(-3);bunting(5);w.stall(-5,-5,'cloth');for(let x=-6;x<=6;x+=3){w.glow(r,x,4,-3,.27,0xffbf70);}break;
  case 'rain':
   road();for(let i=0;i<4;i++)w.car(-3,-8+i*6,[0xcbb05b,0x8b6474,0x528b95,0xa4b3a5][i],i===0?'bus':'car');
   facade(-10,-12,8,11,0x748c9d);facade(7,-13,8,8,0x899b9d);
   for(let i=0;i<80;i++){const drop=box((i*7.13)%28-14,(i*.63)%10,(i*3.7)%28-14,.025,.35,.025,0xb5d2df);w.ambient.push({mesh:drop,type:'rain',seed:i});}break;
  case 'rail':
   for(const z of [-7,-9])box(0,.05,z,50,.1,.12,0x414d55);for(let x=-24;x<25;x+=1.2)box(x,0,-8,.25,.12,3,0x725c4b);
   for(const x of [-10,-3,4,11]){box(x,1.8,-13,6,3.5,3,accent);for(let i=0;i<8;i++)box(x-2.6+i*.7,1.8,-11.45,.055,3.2,.06,0xe0b692);}sign('KAMALAPUR FREIGHT',0,4.3,-11,7);break;
  case 'park':
   box(0,-.02,1,10,.1,22,0xd7c39a);for(const x of [-9,-6,8,12])for(const z of [-9,0,8])w.tree(x,z);bench(-4,-3);bench(5,-4);
   w.cylinder(r,0,.2,-8,2.5,.4,0xd4d7ba);w.cylinder(r,0,.43,-8,2.2,.1,0x72b9bf);w.cylinder(r,0,1,-8,.3,1.4,0xe1dcc1);sign('RAMNA GARDEN',0,3.5,-11,5);break;
  case 'campus':
   facade(0,-12,18,7,0xa85545);for(const x of [-6,-3,0,3,6])box(x,2.1,-8.9,.4,4.2,.6,0xe2c9a4);sign('UNIVERSITY OF DHAKA',0,5.5,-9.7,8);
   box(-7,.1,0,3,.3,18,0x83a572);w.tree(-8,-5);w.tree(9,-4);bench(-5,-3);for(let i=0;i<6;i++)box(3,.01,-4+i*2.2,4,.025,.12,0xf4d9a0);break;
  case 'station':
   for(const x of [-6,6])for(const z of [-4,3,8]){box(x,2.4,z,.35,4.8,.35,0x668799);box(0,4.8,z,13,.25,.4,0x8da8af);}sign('DEPARTURES   08:45   CHITTAGONG',0,4,-3.8,6);bench(-4,4);bench(4,4);break;
  case 'wholesale':
   for(const x of [-8,8])for(let z=-7;z<6;z+=5){w.stall(x,z,'scale');for(let i=0;i<3;i++)w.sphere(r,x-1+i,.6,z+1.5,.55,0xc6b583,[.8,1.2,.8]);}box(0,4.4,-4,19,.12,5,0xb7b177);bunting(0);sign('KARWAN BAZAR  /  WHOLESALE',0,3.7,-6,7);break;
  case 'grocery':
   box(0,.02,0,16,.12,18,0xd5d8cb);box(0,2.3,-5,17,4.6,.25,0xb6d7cc);for(const x of [-6,-3,0,3,6])shelves(x,-4.7);box(-7,2,0,.25,4,10,0x72a39a);sign('NEIGHBORHOOD GROCERY',0,4,-4.7,7);break;
  case 'foodcourt':
   for(const x of [-8,8]){w.stall(x,-5,'food');for(const z of [1,6]){w.cylinder(r,x,.8,z,1,.15,0xd8ae78);w.cylinder(r,x,.4,z,.1,.8,0x574553);bench(x,z+1);}}
   bunting(-5);bunting(3);for(let x=-10;x<=10;x+=2)w.glow(r,x,4.5,3,.12,0xffdc8a);sign('DHAKA FOOD FESTIVAL',0,4,-8,7);break;
  case 'ferry':
   water(-16);box(0,.1,-7,8,.4,9,0x927b64);for(let i=0;i<12;i++)box(0,.32,-11+i*.7,8,.025,.04,0xdbc3a3);
   box(-8,1,-16,12,2,5,0xe8dfcb);box(-8,2.8,-16,8,2,4,accent);for(let i=0;i<6;i++)box(-11+i*1.2,3,-13.95,.7,.8,.04,0x3c5b6e);sign('FERRY TERMINAL  /  GHAT 03',0,4,-7,7);break;
  case 'bus':
   box(-6,2,1,.2,4,13,0xa9b7b5);box(6,.35,1,.2,.7,13,0xa9b7b5);for(const x of [-5.85,5.85])for(let z=-2;z<7;z+=2.5){if(x<0)box(x,2.6,z,.04,1.5,1.8,0x668fa8);const strap=w.group(x*.4,3.5,z);w.cylinder(strap,0,0,0,.025,.65,0xe1d7b5);w.ambient.push({mesh:strap,type:'sway',seed:z});}sign('NEXT STOP: FARMGATE',0,3.7,-4.25,5);break;
  case 'hospital':
   road();facade(-2,-13,20,8,0x9cbec5);sign('CITY HOSPITAL  +  EMERGENCY',0,4.5,-10.65,10);box(0,3.1,-7,12,.25,5,0xe7e1d5);for(const x of [-5.5,5.5])box(x,1.5,-5,.2,3,.2,0xa1bbc1);for(const x of [-8,8])lamp(x,2);break;
  case 'alley':
   for(const x of [-9,9])for(let z=-9;z<8;z+=5)if(x<0||z<0)facade(x,z,4.8,8+(z%3),x<0?0xb87860:0xc99c77);for(let z=-7;z<8;z+=2)for(let x=-5;x<6;x+=2)box(x,.0,z,1.9,.04,.06,0x806e64);bunting(-3);sign('SHANKHARI BAZAR',0,5,-8,6);break;
  case 'yard':
   box(0,1.2,-7,22,2.4,.4,0xc49c77);for(let i=0;i<5;i++){w.car(-9+i*4.5,-5,[0x45998b,0xb75766,0xe0ac4d][i%3],'rickshaw');}for(const x of [-8,8]){box(x,2.8,1,4,.2,7,0xcba359);box(x,1.4,4,.15,2.8,.15,0x5a6655);}sign('RICKSHAW REPAIR & REST',0,3.6,-7,7);break;
  case 'arcade':
   for(const x of [-8,8])for(let z=-9;z<8;z+=5){if(x<0||z<0)facade(x,z,4.5,5,accent);box(x*.7,2.3,z,.35,4.6,.35,0xdbc4b0);}for(const z of [-7,-1])box(0,4.8,z,18,.25,.5,0xd8b9a4);box(0,.01,0,10,.08,22,0xe0cbb7);sign('NEW MARKET ARCADE',0,4,-7,7);break;
 }
 // A few local residents, rather than the same seven people in every street.
 for(let i=0;i<4;i++){const p=w.person(i%2?-5:5,-3+i*2.7,[accent,0xc5a56f,0x688b9a][i%3]);p.scale.setScalar(.85);p.rotation.y=i*1.3;}
}
