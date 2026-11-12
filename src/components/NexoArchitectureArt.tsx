import React,{useId} from 'react';
import {motion,useReducedMotion} from 'framer-motion';
import {project,polygon,planeMatrix,verticalFaceMatrix,boxFaces,routePath,UI,NOTEBOOK,API,LOCK,LOCAL,DATABASE,DB_ELLIPSE,ART_FRAME,PORTS,ROUTES} from './nexo-geometry.mjs';

type Box={x0:number;x1:number;y0:number;y1:number;top:number;bottom:number};
type P3=readonly [number,number,number];
const LIVE='#8CC8FF';

// A lit solid: graded faces, a bright rim where the top meets the visible sides and a bevel inset.
function Plate({box,uid,tone='steel',inset=3}:{box:Box;uid:string;tone?:'steel'|'blue'|'light';inset?:number}){
 const f=boxFaces(box);const {x0,x1,y0,y1,top}=box;
 return <g strokeLinejoin="round">
  <polygon points={f.y} fill={`url(#${uid}-${tone}-y)`}/>
  <polygon points={f.x} fill={`url(#${uid}-${tone}-x)`}/>
  <polygon points={f.top} fill={`url(#${uid}-${tone}-top)`}/>
  <path d={routePath([[x1,y1,box.top],[x1,y1,box.bottom]])} stroke="#000" strokeOpacity=".35" strokeWidth="1"/>
  {inset>0&&<polygon points={polygon([[x0+inset,y0+inset,top],[x1-inset,y0+inset,top],[x1-inset,y1-inset,top],[x0+inset,y1-inset,top]])} stroke="#fff" strokeOpacity=".1" strokeWidth=".8"/>}
  <path d={routePath([[x0,y1,top],[x0,y0,top],[x1,y0,top]])} stroke="#fff" strokeOpacity=".16" strokeWidth=".8"/>
  <path d={routePath([[x0,y1,top],[x1,y1,top],[x1,y0,top]])} stroke="#F4F7F9" strokeOpacity=".78" strokeWidth="1.1" strokeLinecap="round"/>
 </g>;
}
function frontArc(cx:number,cy:number,rx:number,ry:number){const k=.55228475;return `M${cx-rx} ${cy} C${cx-rx} ${cy+k*ry} ${cx-k*rx} ${cy+ry} ${cx} ${cy+ry} C${cx+k*rx} ${cy+ry} ${cx+rx} ${cy+k*ry} ${cx+rx} ${cy}`;}
const leadPaths=(points:readonly P3[])=>[routePath(points.slice(0,2)),routePath(points.slice(-2))];

// A comet travelling the route: soft tail plus a bright head, both driven by one dash offset.
function Comet({d,dur,begin,reverse=false,blur}:{d:string;dur:number;begin:number;reverse?:boolean;blur:string}){
 const run=(from:number,to:number)=><animate attributeName="stroke-dashoffset" from={reverse?to:from} to={reverse?from:to} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite"/>;
 return <g strokeLinecap="round" strokeLinejoin="round">
  <path d={d} pathLength={100} stroke={LIVE} strokeOpacity=".5" strokeWidth="3.2" strokeDasharray="9 91" strokeDashoffset="100" filter={blur}>{run(100,0)}</path>
  <path d={d} pathLength={100} stroke={LIVE} strokeOpacity=".75" strokeWidth="1.4" strokeDasharray="9 91" strokeDashoffset="100">{run(100,0)}</path>
  <path d={d} pathLength={100} stroke="#fff" strokeWidth="1.7" strokeDasharray={reverse?'2 98':'2 98'} strokeDashoffset={reverse?100:93}>{reverse?run(100,0):run(93,-7)}</path>
 </g>;
}
function Flow({id,index,points,mask,blur}:{id:string;index:number;points:readonly P3[];mask?:string;blur:string}){
 const d=routePath(points);
 return <g className="nexo-flow-pulse" mask={mask} data-flow={id}><Comet d={d} dur={4.4+index*.7} begin={index*.6} blur={blur}/><Comet d={d} dur={5.6+index*.7} begin={2.1+index*.5} reverse blur={blur}/></g>;
}

export default function NexoArchitectureArt({initialLanguage='en'}:{initialLanguage?:'en'|'es'}){
 const uid='nexo-system-'+useId().replace(/:/g,'');const reduced=useReducedMotion();const es=initialLanguage==='es';
 const centerX=(box:Box)=>project([(box.x0+box.x1)/2,(box.y0+box.y1)/2,0]).x;
 const dbTop=project([DATABASE.x,DATABASE.y,DATABASE.top]),dbBase=project([DATABASE.x,DATABASE.y,DATABASE.bottom]);const {rx,ry}=DB_ELLIPSE;
 const sidePath=`M${dbTop.x-rx} ${dbTop.y} L${dbBase.x-rx} ${dbBase.y} ${frontArc(dbBase.x,dbBase.y,rx,ry).replace(/^M[^C]+/,'')} L${dbTop.x+rx} ${dbTop.y} A${rx} ${ry} 0 0 1 ${dbTop.x-rx} ${dbTop.y} Z`;
 const blur=`url(#${uid}-soft)`;const grid=[-200,-160,-120,-80,-40,0,40,80,120,160,200];
 const stops=(a:string,b:string,c?:string)=>c?<><stop stopColor={a}/><stop offset=".55" stopColor={b}/><stop offset="1" stopColor={c}/></>:<><stop stopColor={a}/><stop offset="1" stopColor={b}/></>;
 return <svg viewBox={`${ART_FRAME.x} ${ART_FRAME.y} ${ART_FRAME.width} ${ART_FRAME.height}`} role="img" aria-labelledby={`${uid}-title ${uid}-desc`} className="w-full h-auto nexo-system-art" fill="none" data-projection="isometric">
  <title id={`${uid}-title`}>{es?'Arquitectura de Nexo: navegador, API y persistencia':'Nexo architecture: browser, API and persistence'}</title>
  <desc id={`${uid}-desc`}>{es?'La interfaz y los cambios pendientes viven en el navegador. La API valida identidad y roles y lee o escribe progreso y notas en D1/SQLite. La línea discontinua abre notebooks de Python/Colab, cuya ejecución es externa e independiente de la API.':'The interface and pending local changes belong to the browser. The API validates identity and roles and reads or writes progress and notes in D1/SQLite. The dashed connection opens Python/Colab notebooks, which execute separately from the API.'}</desc>
  <defs>
   <radialGradient id={`${uid}-glow`}><stop stopColor="#B9C6D0" stopOpacity=".16"/><stop offset=".55" stopColor="#8FA2B2" stopOpacity=".05"/><stop offset="1" stopColor="#8FA2B2" stopOpacity="0"/></radialGradient>
   <radialGradient id={`${uid}-fade`} cx=".5" cy=".55" r=".5"><stop stopColor="#fff"/><stop offset=".55" stopColor="#fff" stopOpacity=".55"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient>
   <mask id={`${uid}-floor`} maskUnits="userSpaceOnUse" x={ART_FRAME.x} y={ART_FRAME.y} width={ART_FRAME.width} height={ART_FRAME.height}><rect x={ART_FRAME.x} y={ART_FRAME.y} width={ART_FRAME.width} height={ART_FRAME.height} fill={`url(#${uid}-fade)`}/></mask>
   <linearGradient id={`${uid}-steel-top`} x2="1" y2="1">{stops('#8B9AA4','#5A6B76','#35444E')}</linearGradient>
   <linearGradient id={`${uid}-steel-y`} x2="0" y2="1">{stops('#4C5A63','#252F36')}</linearGradient>
   <linearGradient id={`${uid}-steel-x`} x2="0" y2="1">{stops('#2E3A42','#151C21')}</linearGradient>
   <linearGradient id={`${uid}-blue-top`} x2="1" y2="1">{stops('#8FA6B8','#617A8E','#3F5567')}</linearGradient>
   <linearGradient id={`${uid}-blue-y`} x2="0" y2="1">{stops('#4A6076','#28384A')}</linearGradient>
   <linearGradient id={`${uid}-blue-x`} x2="0" y2="1">{stops('#324559','#18232F')}</linearGradient>
   <linearGradient id={`${uid}-light-top`} x2="1" y2="1">{stops('#DCE4E9','#AEBCC4','#8797A1')}</linearGradient>
   <linearGradient id={`${uid}-light-y`} x2="0" y2="1">{stops('#8E9DA7','#56646D')}</linearGradient>
   <linearGradient id={`${uid}-light-x`} x2="0" y2="1">{stops('#62717B','#39454D')}</linearGradient>
   <linearGradient id={`${uid}-screen`} x2="1" y2="1">{stops('#22313B','#131E25','#0D151A')}</linearGradient>
   <linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="1" y2=".6"><stop stopColor="#fff" stopOpacity=".16"/><stop offset=".42" stopColor="#fff" stopOpacity=".02"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
   <linearGradient id={`${uid}-area`} x2="0" y2="1"><stop stopColor={LIVE} stopOpacity=".3"/><stop offset="1" stopColor={LIVE} stopOpacity="0"/></linearGradient>
   <linearGradient id={`${uid}-cylinder`}><stop stopColor="#22303E"/><stop offset=".2" stopColor="#8298AC"/><stop offset=".34" stopColor="#B7C7D4"/><stop offset=".5" stopColor="#5E778D"/><stop offset=".82" stopColor="#2F4358"/><stop offset="1" stopColor="#1B2835"/></linearGradient>
   <radialGradient id={`${uid}-disk`} cx=".38" cy=".35" r=".8">{stops('#B4C4D0','#7A91A5','#52697E')}</radialGradient>
   <filter id={`${uid}-ground-shadow`} x="-40%" y="-60%" width="180%" height="240%"><feGaussianBlur stdDeviation="7"/></filter>
   <filter id={`${uid}-contact`} x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="2.2"/></filter>
   <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.4"/></filter>
   {ROUTES.map(r=><mask key={r.id} id={`${uid}-${r.id}-leads`} maskUnits="userSpaceOnUse" x={ART_FRAME.x} y="0" width={ART_FRAME.width} height="370">{leadPaths(r.points).map((d,i)=><path key={i} d={d} stroke="white" strokeWidth="6" strokeLinecap="round"/>)}</mask>)}
  </defs>
  <ellipse cx="307" cy="200" rx="290" ry="185" fill={`url(#${uid}-glow)`}/>
  <motion.g className="nexo-floating-layer" initial={false} animate={{y:reduced?0:[0,-2,0]}} transition={{duration:7,repeat:reduced?0:Infinity,ease:'easeInOut'}}>
   {/* Floor: an isometric grid that dissolves toward the frame, with nodes at the crossings. */}
   <g mask={`url(#${uid}-floor)`}>
    <g stroke="#B5C2CC" strokeOpacity=".12" strokeWidth=".7">{grid.map(v=><g key={v}><path d={routePath([[v,-210,0],[v,210,0]])}/><path d={routePath([[-210,v,0],[210,v,0]])}/></g>)}</g>
    <g fill="#D5DEE4" fillOpacity=".22">{grid.filter((_,i)=>i%2===1).flatMap(x=>grid.filter((_,i)=>i%2===1).map(y=>{const p=project([x,y,0]);return <circle key={`${x}:${y}`} cx={p.x} cy={p.y} r=".9"/>;}))}</g>
   </g>
   <g fill="#000" fillOpacity=".34" filter={`url(#${uid}-ground-shadow)`}>{[UI,NOTEBOOK,API,LOCAL].map((b,i)=><polygon key={i} points={polygon([[b.x0+10,b.y0+9,0],[b.x1+10,b.y0+9,0],[b.x1+10,b.y1+9,0],[b.x0+10,b.y1+9,0]])}/>)}<ellipse cx={dbTop.x} cy={project([DATABASE.x+6,DATABASE.y+6,0]).y} rx={rx*1.15} ry={ry*1.1}/></g>
   <g fill="#000" fillOpacity=".5" filter={`url(#${uid}-contact)`}>{[NOTEBOOK,API,LOCAL].map((b,i)=><polygon key={i} points={polygon([[b.x0+2,b.y0+2,0],[b.x1+3,b.y0+2,0],[b.x1+3,b.y1+3,0],[b.x0+2,b.y1+3,0]])}/>)}<ellipse cx={dbBase.x} cy={dbBase.y+3} rx={rx*1.02} ry={ry}/></g>

   <g strokeLinejoin="round" strokeLinecap="round">{ROUTES.map(r=>{const d=routePath(r.points);const ext=r.kind==='external-link';return <g key={r.id}>
    {!ext&&<path d={d} stroke={r.color} strokeOpacity=".28" strokeWidth="4.5" filter={blur}/>}
    <path d={d} stroke="#0B0F12" strokeWidth={ext?2.4:4} strokeOpacity={ext?.6:1}/>
    <path d={d} stroke={r.color} strokeWidth="1.4" strokeOpacity={ext?.6:.85} strokeDasharray={ext?'2 5':undefined} data-route={r.id} data-source={r.from} data-target={r.to} data-kind={r.kind}/>
   </g>;})}</g>
   {!reduced&&ROUTES.filter(r=>r.kind==='data').map((r,i)=><Flow key={r.id} id={r.id} points={r.points} index={i} blur={blur}/>)}

   <Plate box={UI} uid={uid} inset={0}/>
   <g transform={planeMatrix(UI.x0,UI.y0,UI.top)}><g transform={`scale(${(UI.x1-UI.x0)/180} ${(UI.y1-UI.y0)/110})`}>
    <rect x="6" y="6" width="168" height="98" rx="5" fill={`url(#${uid}-screen)`} stroke="#E4EAEE" strokeOpacity=".5" strokeWidth=".9"/>
    <path d="M6 21H174" stroke="#D8DEE2" strokeOpacity=".28" strokeWidth=".8"/>
    {[14,20,26].map((x,i)=><circle key={x} cx={x} cy="13.5" r="1.6" fill="#DCE3E8" fillOpacity={i?.28:.75}/>)}
    <rect x="62" y="10" width="62" height="7" rx="3.5" fill="#fff" fillOpacity=".07"/>
    <path d="M44 21V104" stroke="#D8DEE2" strokeOpacity=".18" strokeWidth=".8"/>
    <rect x="12" y="28" width="26" height="6" rx="2" fill={LIVE} fillOpacity=".34"/>
    {[40,50,60,70].map((y,i)=><rect key={y} x="12" y={y} width={[22,26,18,24][i]} height="4" rx="2" fill="#fff" fillOpacity=".12"/>)}
    <g stroke="#D8DEE2" strokeOpacity=".13" strokeWidth=".6">{[44,58,72,86].map(y=><path key={y} d={`M52 ${y}H166`}/>)}{[80,109,138].map(x=><path key={x} d={`M${x} 32V96`}/>)}</g>
    <path d="M54 90C76 85 84 72 104 68S134 50 164 40V96H54Z" fill={`url(#${uid}-area)`}/>
    <path d="M54 90C76 85 84 72 104 68S134 50 164 40" stroke="#F4F7F9" strokeWidth="1.5" strokeLinecap="round"/>
    {[[60,84],[74,87],[88,70],[106,73],[121,57],[139,58]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="1.9" fill="#C3D3E0" fillOpacity=".85"/>)}
    <circle cx="152" cy="46" r="6" fill={LIVE} fillOpacity=".18"/><circle cx="152" cy="46" r="2.6" fill="#fff"/>
    <rect x="52" y="27" width="34" height="11" rx="2.5" fill="#fff" fillOpacity=".06" stroke="#fff" strokeOpacity=".14" strokeWidth=".6"/><rect x="56" y="31" width="18" height="3" rx="1.5" fill="#fff" fillOpacity=".5"/>
    <rect x="6" y="6" width="168" height="98" rx="5" fill={`url(#${uid}-sheen)`}/>
   </g></g>

   <Plate box={NOTEBOOK} uid={uid} tone="blue"/>
   <g transform={planeMatrix(NOTEBOOK.x0,NOTEBOOK.y0,NOTEBOOK.top)} stroke="#EEF3F6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 13H58" strokeOpacity=".3" strokeWidth="1"/><path d="M24 24L16 32L24 40M43 24L51 32L43 40M37 22L30 43"/><path d="M15 50H47M15 54H35" strokeOpacity=".4" strokeWidth="1.2"/></g>

   <g stroke="#C5D0D8" strokeOpacity=".38" strokeWidth="1.1" strokeLinecap="round">{[38,48,58,68].map(x=><path key={x} d={routePath([[x,API.y1,API.bottom],[x,API.y1+7,API.bottom]])}/>)}{[27,38,49,60].map(y=><path key={y} d={routePath([[API.x1,y,API.bottom],[API.x1+7,y,API.bottom]])}/>)}</g>
   <Plate box={API} uid={uid} inset={5}/>
   <g fill="#fff" fillOpacity=".2">{[[34,26],[34,74],[82,26],[82,74]].map(([x,y])=>{const p=project([x,y,API.top]);return <circle key={`${x}${y}`} cx={p.x} cy={p.y} r="1"/>;})}</g>
   {(()=>{const p=project([84,82,26]);return <g><circle cx={p.x} cy={p.y} r="4" fill={LIVE} fillOpacity=".25" filter={blur}/><circle cx={p.x} cy={p.y} r="1.3" fill={LIVE}/></g>;})()}
   <g transform={verticalFaceMatrix(LOCK.x0,48,68)}><path d="M3 18V9a8 8 0 0116 0V18" stroke="#F4F7F9" strokeWidth="2" strokeLinecap="round"/></g>
   <Plate box={LOCK} uid={uid} tone="light" inset={0}/>
   <g transform={verticalFaceMatrix(LOCK.x0,LOCK.y1,LOCK.top)} stroke="#1B242B" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="7" r="1.6" fill="#1B242B"/><path d="M11 8.5V12"/></g>

   <Plate box={LOCAL} uid={uid}/>
   <g transform={planeMatrix(LOCAL.x0,LOCAL.y0,LOCAL.top)} stroke="#EEF3F6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 21a8 8 0 0114-6M28 15V9M28 15H22M30 23a8 8 0 01-14 6M16 29V35M16 29H22"/></g>

   <path d={sidePath} fill={`url(#${uid}-cylinder)`}/>
   {[23,39].map(z=>{const y=project([DATABASE.x,DATABASE.y,z]).y;return <g key={z}><path d={frontArc(dbTop.x,y,rx,ry)} stroke="#0E161D" strokeOpacity=".7" strokeWidth="1.6"/><path d={frontArc(dbTop.x,y+1.4,rx,ry)} stroke="#DCE6EC" strokeOpacity=".3" strokeWidth=".8"/></g>;})}
   <path d={frontArc(dbTop.x,dbTop.y,rx,ry)} stroke="#F4F7F9" strokeOpacity=".8" strokeWidth="1.1"/>
   <ellipse cx={dbTop.x} cy={dbTop.y} rx={rx} ry={ry} fill={`url(#${uid}-disk)`} stroke="#fff" strokeOpacity=".3" strokeWidth=".8"/>
   <ellipse cx={dbTop.x} cy={dbTop.y} rx={rx*.7} ry={ry*.7} stroke="#fff" strokeOpacity=".28" strokeWidth=".8"/>
   <ellipse cx={dbTop.x} cy={dbTop.y} rx={rx*.34} ry={ry*.34} fill="#23323F" fillOpacity=".55"/>
   {[30,46].map(z=>{const p=project([DATABASE.x,DATABASE.y,z]);return <circle key={z} cx={p.x-rx*.62} cy={p.y+ry*.72} r="1.2" fill={LIVE} fillOpacity={z===46?.95:.45}/>;})}

   {/* Leads on visible faces are in front of their solids; ground trunks remain behind. */}
   <g strokeWidth="1.4" strokeLinecap="round">{ROUTES.map(r=><g key={r.id}>{leadPaths(r.points).map((d,i)=><path key={i} d={d} stroke={r.color} strokeOpacity={r.kind==='external-link'?.6:.85} strokeDasharray={r.kind==='external-link'?'2 5':undefined}/>)}</g>)}</g>
   {!reduced&&ROUTES.filter(r=>r.kind==='data').map((r,i)=><Flow key={r.id} id={r.id} points={r.points} index={i} mask={`url(#${uid}-${r.id}-leads)`} blur={blur}/>)}
   <g>{Object.entries(PORTS).map(([name,point])=>{const p=project(point);return <g key={name}><circle cx={p.x} cy={p.y} r="3.4" fill="#0B0F12" stroke="#E6ECF0" strokeOpacity=".7" strokeWidth=".8"/><circle cx={p.x} cy={p.y} r="1.3" fill="#F4F7F9"/></g>;})}</g>
   <g className="nexo-diagram-labels" fontFamily="'JetBrains Mono',ui-monospace,monospace" fontSize="10.5" letterSpacing=".04em" textAnchor="middle" fill="#D9E0E5">
    <text x={centerX(UI)} y="25">{es?'Navegador':'Browser'}</text>
    <text x={centerX(NOTEBOOK)} y="281" fill="#BFCBD4">Python</text>
    <text x={centerX(API)} y="348">API</text>
    <text x={centerX(LOCAL)} y="344">Local</text>
    <text x={dbTop.x} y="337" fill="#BFCBD4">D1</text>
   </g>
  </motion.g>
 </svg>;
}
