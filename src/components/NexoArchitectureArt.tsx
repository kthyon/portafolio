import React,{useId} from 'react';
import {motion,useReducedMotion} from 'framer-motion';
import {project,polygon,planeMatrix,verticalFaceMatrix,boxFaces,routePath,UI,NOTEBOOK,API,LOCK,LOCAL,DATABASE,DB_ELLIPSE,ART_FRAME,PORTS,ROUTES} from './nexo-geometry.mjs';

type Box={x0:number;x1:number;y0:number;y1:number;top:number;bottom:number};
function Plate({box,fill,blue=false}:{box:Box;fill:string;blue?:boolean}){const faces=boxFaces(box);const edge=blue?'#B1C2D5':'#D8DEE2';return <g stroke={edge} strokeWidth="1.2"><polygon points={faces.y} fill={blue?'#41566B':'#3B474F'} strokeOpacity=".65"/><polygon points={faces.x} fill={blue?'#2D4257':'#26343D'} strokeOpacity=".55"/><polygon points={faces.top} fill={fill} strokeOpacity=".8"/></g>;}
function frontArc(cx:number,cy:number,rx:number,ry:number){const k=.55228475;return `M${cx-rx} ${cy} C${cx-rx} ${cy+k*ry} ${cx-k*rx} ${cy+ry} ${cx} ${cy+ry} C${cx+k*rx} ${cy+ry} ${cx+rx} ${cy+k*ry} ${cx+rx} ${cy}`;}
const leadPaths=(points:readonly (readonly [number,number,number])[])=>[routePath(points.slice(0,2)),routePath(points.slice(-2))];
function FlowPulses({id,index,color,points,mask}:{id:string;index:number;color:string;points:readonly (readonly [number,number,number])[];mask?:string}){return <g className="nexo-flow-pulse" mask={mask} data-flow={id}><circle r="1.9" fill={color}><animateMotion path={routePath(points)} dur={`${4+index*.6}s`} begin={`${index*.5}s`} repeatCount="indefinite"/></circle><circle r="1.4" fill={color} fillOpacity=".45"><animateMotion path={routePath([...points].reverse())} dur={`${4.8+index*.6}s`} begin={`${1.6+index*.4}s`} repeatCount="indefinite"/></circle></g>;}

export default function NexoArchitectureArt({initialLanguage='en'}:{initialLanguage?:'en'|'es'}){
 const uid='nexo-system-'+useId().replace(/:/g,'');const reduced=useReducedMotion();const es=initialLanguage==='es';
 const centerX=(box:Box)=>project([(box.x0+box.x1)/2,(box.y0+box.y1)/2,0]).x;
 const dbTop=project([DATABASE.x,DATABASE.y,DATABASE.top]),dbBase=project([DATABASE.x,DATABASE.y,DATABASE.bottom]);const {rx,ry}=DB_ELLIPSE;
 // The top front arc is drawn separately; the side's outline uses one shared ellipse.
 const sidePath=`M${dbTop.x-rx} ${dbTop.y} L${dbBase.x-rx} ${dbBase.y} ${frontArc(dbBase.x,dbBase.y,rx,ry).replace(/^M[^C]+/,'')} L${dbTop.x+rx} ${dbTop.y} A${rx} ${ry} 0 0 1 ${dbTop.x-rx} ${dbTop.y} Z`;
 return <svg viewBox={`${ART_FRAME.x} ${ART_FRAME.y} ${ART_FRAME.width} ${ART_FRAME.height}`} role="img" aria-labelledby={`${uid}-title ${uid}-desc`} className="w-full h-auto nexo-system-art" fill="none" data-projection="isometric">
  <title id={`${uid}-title`}>{es?'Arquitectura de Nexo: navegador, API y persistencia':'Nexo architecture: browser, API and persistence'}</title>
  <desc id={`${uid}-desc`}>{es?'La interfaz y los cambios pendientes viven en el navegador. La API valida identidad y roles y lee o escribe progreso y notas en D1/SQLite. La línea discontinua abre notebooks de Python/Colab, cuya ejecución es externa e independiente de la API.':'The interface and pending local changes belong to the browser. The API validates identity and roles and reads or writes progress and notes in D1/SQLite. The dashed connection opens Python/Colab notebooks, which execute separately from the API.'}</desc>
  <defs>
   <radialGradient id={`${uid}-glow`}><stop stopColor="#A5B3BE" stopOpacity=".11"/><stop offset="1" stopColor="#A5B3BE" stopOpacity="0"/></radialGradient>
   <linearGradient id={`${uid}-glass`} x2="1" y2="1"><stop stopColor="#71818B"/><stop offset=".65" stopColor="#465863"/><stop offset="1" stopColor="#2D3D48"/></linearGradient>
   <linearGradient id={`${uid}-screen`} x2="1" y2="1"><stop stopColor="#2C3E49"/><stop offset="1" stopColor="#1D2D36"/></linearGradient>
   <linearGradient id={`${uid}-blue`} x2="1" y2="1"><stop stopColor="#71899A"/><stop offset="1" stopColor="#465D6E"/></linearGradient>
   <linearGradient id={`${uid}-cylinder`}><stop stopColor="#304457"/><stop offset=".23" stopColor="#7890A5"/><stop offset=".6" stopColor="#526D84"/><stop offset="1" stopColor="#354D65"/></linearGradient>
   <filter id={`${uid}-ground-shadow`} x="-40%" y="-60%" width="180%" height="240%"><feGaussianBlur stdDeviation="6"/></filter>
   {ROUTES.map(r=><mask key={r.id} id={`${uid}-${r.id}-leads`} maskUnits="userSpaceOnUse" x={ART_FRAME.x} y="0" width={ART_FRAME.width} height="370">{leadPaths(r.points).map((d,i)=><path key={i} d={d} stroke="white" strokeWidth="6" strokeLinecap="round"/>)}</mask>)}
  </defs>
  <ellipse cx="307" cy="190" rx="245" ry="175" fill={`url(#${uid}-glow)`}/>
  <motion.g className="nexo-floating-layer" initial={false} animate={{y:reduced?0:[0,-2,0]}} transition={{duration:7,repeat:reduced?0:Infinity,ease:'easeInOut'}}>
   <g stroke="#A5B3BE" strokeOpacity=".045" strokeWidth=".7">{[-160,-120,-80,-40,0,40,80,120,160].map(v=><g key={v}><path d={routePath([[v,-105,0],[v,140,0]])}/><path d={routePath([[-165,v,0],[175,v,0]])}/></g>)}</g>
   <g fill="#000" fillOpacity=".26" filter={`url(#${uid}-ground-shadow)`}>{[UI,NOTEBOOK,API,LOCAL].map((b,i)=><polygon key={i} points={polygon([[b.x0+8,b.y0+7,0],[b.x1+8,b.y0+7,0],[b.x1+8,b.y1+7,0],[b.x0+8,b.y1+7,0]])}/>)}<ellipse cx={dbTop.x} cy={project([DATABASE.x+5,DATABASE.y+5,0]).y} rx={rx*1.1} ry={ry*1.05}/></g>

   <g strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">{ROUTES.map(r=><g key={r.id}><path d={routePath(r.points)} stroke="#1B211D" strokeWidth="4"/><path d={routePath(r.points)} stroke={r.color} strokeOpacity={r.kind==='external-link'?.7:.9} strokeDasharray={r.kind==='external-link'?'3 5':undefined} data-route={r.id} data-source={r.from} data-target={r.to} data-kind={r.kind}/></g>)}</g>
   {!reduced&&ROUTES.filter(r=>r.kind==='data').map((r,i)=><FlowPulses key={r.id} {...r} index={i}/>)}

   <Plate box={UI} fill={`url(#${uid}-glass)`}/>
   <g transform={planeMatrix(UI.x0,UI.y0,UI.top)}><g transform={`scale(${(UI.x1-UI.x0)/180} ${(UI.y1-UI.y0)/110})`}>
    <rect x="8" y="7" width="164" height="96" rx="4" fill={`url(#${uid}-screen)`} stroke="#D8DEE2" strokeOpacity=".45"/>
    <path d="M8 22H172" stroke="#D8DEE2" strokeOpacity=".4"/>
    {[16,22,28].map((x,i)=><circle key={x} cx={x} cy="15" r="1.5" fill="#DCE3E8" fillOpacity={i?.25:.7}/>)}
    <g stroke="#D8DEE2" strokeOpacity=".23" strokeWidth=".7">{[40,58,76,94].map(y=><path key={y} d={`M23 ${y}H158`}/>)}{[23,57,91,125,158].map(x=><path key={x} d={`M${x} 32V94`}/>)}</g>
    <path d="M28 88C56 82 64 69 88 65S125 47 154 39" stroke="#F2F1EF" strokeWidth="1.6"/>
    {[[34,83],[51,84],[69,68],[91,70],[110,54],[131,55],[150,40]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="2.1" fill="#B1C2D5" fillOpacity=".8"/>)}
   </g></g>

   <Plate box={NOTEBOOK} fill={`url(#${uid}-blue)`} blue/>
   <g transform={planeMatrix(NOTEBOOK.x0,NOTEBOOK.y0,NOTEBOOK.top)} stroke="#E3E9ED" strokeOpacity=".95" strokeWidth="1.5"><path d="M0 12H66" strokeOpacity=".4"/><path d="M24 24L16 32L24 40M43 24L51 32L43 40M37 22L30 43"/><path d="M15 50H47M15 54H35" strokeOpacity=".45"/></g>

   <g stroke="#A5B3BE" strokeOpacity=".25" strokeWidth="1">{[38,48,58,68].map(x=><path key={x} d={routePath([[x,API.y1,API.bottom],[x,API.y1+7,API.bottom]])}/>)}{[27,38,49,60].map(y=><path key={y} d={routePath([[API.x1,y,API.bottom],[API.x1+7,y,API.bottom]])}/>)}</g>
   <Plate box={API} fill={`url(#${uid}-glass)`}/>
   <g transform={verticalFaceMatrix(LOCK.x0,48,68)}><path d="M3 18V9a8 8 0 0116 0V18" stroke="#F2F1EF" strokeWidth="1.8"/></g>
   <Plate box={LOCK} fill="#AEBCC4"/>
   <g transform={verticalFaceMatrix(LOCK.x0,LOCK.y1,LOCK.top)} stroke="#F2F1EF" strokeWidth="1.4"><circle cx="11" cy="7" r="1.5" fill="#F2F1EF"/><path d="M11 8.5V12"/></g>

   <Plate box={LOCAL} fill={`url(#${uid}-glass)`}/>
   <g transform={planeMatrix(LOCAL.x0,LOCAL.y0,LOCAL.top)} stroke="#E1E7EA" strokeWidth="1.3"><path d="M14 21a8 8 0 0114-6M28 15V9M28 15H22M30 23a8 8 0 01-14 6M16 29V35M16 29H22"/></g>

   <path d={sidePath} fill={`url(#${uid}-cylinder)`} stroke="#B1C2D5" strokeOpacity=".7" strokeWidth="1.2"/>
   {[23,39].map(z=><path key={z} d={frontArc(dbTop.x,project([DATABASE.x,DATABASE.y,z]).y,rx,ry)} stroke="#B1C2D5" strokeOpacity=".45" strokeWidth="1"/>)}
   <ellipse cx={dbTop.x} cy={dbTop.y} rx={rx} ry={ry} fill="#738B9F" stroke="#D0DBE2" strokeOpacity=".8" strokeWidth="1.2"/>
   <ellipse cx={dbTop.x} cy={dbTop.y} rx={rx*.73} ry={ry*.73} stroke="#D0DBE2" strokeOpacity=".4" strokeWidth=".9"/>

   {/* Leads on visible faces are in front of their solids; ground trunks remain behind. */}
   <g strokeWidth="1.5" strokeLinecap="round">{ROUTES.map(r=><g key={r.id}>{leadPaths(r.points).map((d,i)=><path key={i} d={d} stroke={r.color} strokeOpacity={r.kind==='external-link'?.7:.9} strokeDasharray={r.kind==='external-link'?'3 5':undefined}/>)}</g>)}</g>
   {!reduced&&ROUTES.filter(r=>r.kind==='data').map((r,i)=><FlowPulses key={r.id} {...r} index={i} mask={`url(#${uid}-${r.id}-leads)`}/>)}
   <g>{Object.entries(PORTS).map(([name,point])=>{const p=project(point);return <circle key={name} cx={p.x} cy={p.y} r={name==='dbApi'?2.1:1.7} fill={name.toLowerCase().includes('notebook')||name==='dbApi'?'#B1C2D5':'#F2F1EF'} fillOpacity=".85"/>;})}</g>
   <g className="nexo-diagram-labels" fontFamily="Inter,Arial,sans-serif" fontSize="12" textAnchor="middle" fill="#E4E8EB">
    <text x={centerX(UI)} y="25">{es?'Navegador':'Browser'}</text>
    <text x={centerX(NOTEBOOK)} y="281" fill="#CCD7DF">Python</text>
    <text x={centerX(API)} y="348">API</text>
    <text x={centerX(LOCAL)} y="344">Local</text>
    <text x={dbTop.x} y="337" fill="#CCD7DF">D1</text>
   </g>
  </motion.g>
 </svg>;
}
