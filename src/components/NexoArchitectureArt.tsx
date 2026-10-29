import React,{useId} from 'react';
import {motion,useReducedMotion} from 'framer-motion';
import {project,polygon,planeMatrix,boxFaces,routePath,UI,NOTEBOOK,API,LOCAL,DATABASE,DB_ELLIPSE,PORTS,ROUTES} from './nexo-geometry.mjs';

type Box={x0:number;x1:number;y0:number;y1:number;top:number;bottom:number};
function Plate({box,fill,blue=false}:{box:Box;fill:string;blue?:boolean}){const faces=boxFaces(box);const edge=blue?'#a6beff':'#a2e872';return <g stroke={edge} strokeWidth=".9"><polygon points={faces.y} fill={blue?'#131d2c':'#102015'} strokeOpacity=".3"/><polygon points={faces.x} fill={blue?'#0d1420':'#0b160f'} strokeOpacity=".24"/><polygon points={faces.top} fill={fill} strokeOpacity=".4"/></g>;}
function frontArc(cx:number,cy:number,rx:number,ry:number){const k=.55228475;return `M${cx-rx} ${cy} C${cx-rx} ${cy+k*ry} ${cx-k*rx} ${cy+ry} ${cx} ${cy+ry} C${cx+k*rx} ${cy+ry} ${cx+rx} ${cy+k*ry} ${cx+rx} ${cy}`;}

export default function NexoArchitectureArt({initialLanguage='en'}:{initialLanguage?:'en'|'es'}){
 const uid='nexo-system-'+useId().replace(/:/g,'');const reduced=useReducedMotion();const es=initialLanguage==='es';
 const centerX=(box:Box)=>project([(box.x0+box.x1)/2,(box.y0+box.y1)/2,0]).x;
 const dbTop=project([DATABASE.x,DATABASE.y,DATABASE.top]),dbBase=project([DATABASE.x,DATABASE.y,DATABASE.bottom]);const {rx,ry}=DB_ELLIPSE;
 // The top front arc is drawn separately; the side's outline uses one shared ellipse.
 const sidePath=`M${dbTop.x-rx} ${dbTop.y} L${dbBase.x-rx} ${dbBase.y} ${frontArc(dbBase.x,dbBase.y,rx,ry).replace(/^M[^C]+/,'')} L${dbTop.x+rx} ${dbTop.y} A${rx} ${ry} 0 0 1 ${dbTop.x-rx} ${dbTop.y} Z`;
 return <svg viewBox="60 0 520 370" role="img" aria-labelledby={`${uid}-title ${uid}-desc`} className="w-full h-auto nexo-system-art" fill="none" data-projection="isometric">
  <title id={`${uid}-title`}>{es?'Arquitectura de Nexo: navegador, API y persistencia':'Nexo architecture: browser, API and persistence'}</title>
  <desc id={`${uid}-desc`}>{es?'La interfaz y los cambios pendientes viven en el navegador. La API valida identidad y roles y lee o escribe progreso y notas en D1/SQLite. La línea discontinua abre notebooks de Python/Colab, cuya ejecución es externa e independiente de la API.':'The interface and pending local changes belong to the browser. The API validates identity and roles and reads or writes progress and notes in D1/SQLite. The dashed connection opens Python/Colab notebooks, which execute separately from the API.'}</desc>
  <defs>
   <radialGradient id={`${uid}-glow`}><stop stopColor="#a2e872" stopOpacity=".11"/><stop offset="1" stopColor="#a2e872" stopOpacity="0"/></radialGradient>
   <linearGradient id={`${uid}-glass`} x2="1" y2="1"><stop stopColor="#293e28"/><stop offset=".65" stopColor="#142318"/><stop offset="1" stopColor="#0b160f"/></linearGradient>
   <linearGradient id={`${uid}-screen`} x2="1" y2="1"><stop stopColor="#182a1d"/><stop offset="1" stopColor="#09130c"/></linearGradient>
   <linearGradient id={`${uid}-blue`} x2="1" y2="1"><stop stopColor="#25364c"/><stop offset="1" stopColor="#111d2e"/></linearGradient>
   <linearGradient id={`${uid}-cylinder`}><stop stopColor="#1a263a"/><stop offset=".5" stopColor="#101a29"/><stop offset="1" stopColor="#24324a"/></linearGradient>
   <filter id={`${uid}-ground-shadow`} x="-40%" y="-60%" width="180%" height="240%"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>
  <ellipse cx="307" cy="190" rx="245" ry="175" fill={`url(#${uid}-glow)`}/>
  <motion.g className="nexo-floating-layer" initial={false} animate={{y:reduced?0:[0,-2,0]}} transition={{duration:7,repeat:reduced?0:Infinity,ease:'easeInOut'}}>
   <g stroke="#a2e872" strokeOpacity=".045" strokeWidth=".7">{[-160,-120,-80,-40,0,40,80,120,160].map(v=><g key={v}><path d={routePath([[v,-105,0],[v,140,0]])}/><path d={routePath([[-165,v,0],[175,v,0]])}/></g>)}</g>
   <g fill="#000" fillOpacity=".26" filter={`url(#${uid}-ground-shadow)`}>{[UI,NOTEBOOK,API,LOCAL].map((b,i)=><polygon key={i} points={polygon([[b.x0+8,b.y0+7,0],[b.x1+8,b.y0+7,0],[b.x1+8,b.y1+7,0],[b.x0+8,b.y1+7,0]])}/>)}<ellipse cx={dbTop.x} cy={project([DATABASE.x+5,DATABASE.y+5,0]).y} rx={rx*1.1} ry={ry*1.05}/></g>

   <g strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round">{ROUTES.map(r=><path key={r.id} d={routePath(r.points)} stroke={r.color} strokeOpacity={r.kind==='external-link'?.32:.45} strokeDasharray={r.kind==='external-link'?'3 5':undefined} data-route={r.id} data-source={r.from} data-target={r.to} data-kind={r.kind}/>)}</g>
   {!reduced&&ROUTES.filter(r=>r.kind==='data').map((r,i)=><g key={r.id} className="nexo-flow-pulse"><circle r="1.9" fill={r.color}><animateMotion path={routePath(r.points)} dur={`${4+i*.6}s`} begin={`${i*.5}s`} repeatCount="indefinite"/></circle><circle r="1.4" fill={r.color} fillOpacity=".45"><animateMotion path={routePath([...r.points].reverse())} dur={`${4.8+i*.6}s`} begin={`${1.6+i*.4}s`} repeatCount="indefinite"/></circle></g>)}

   <Plate box={UI} fill={`url(#${uid}-glass)`}/>
   <g transform={planeMatrix(UI.x0,UI.y0,UI.top)}>
    <rect x="8" y="7" width="164" height="96" rx="4" fill={`url(#${uid}-screen)`} stroke="#a2e872" strokeOpacity=".18"/>
    <path d="M8 22H172" stroke="#a2e872" strokeOpacity=".15"/>
    {[16,22,28].map((x,i)=><circle key={x} cx={x} cy="15" r="1.5" fill="#b8ef98" fillOpacity={i?.25:.7}/>)}
    <g stroke="#a2e872" strokeOpacity=".1" strokeWidth=".7">{[40,58,76,94].map(y=><path key={y} d={`M23 ${y}H158`}/>)}{[23,57,91,125,158].map(x=><path key={x} d={`M${x} 32V94`}/>)}</g>
    <path d="M28 88C56 82 64 69 88 65S125 47 154 39" stroke="#c5f7a7" strokeWidth="1.6"/>
    {[[34,83],[51,84],[69,68],[91,70],[110,54],[131,55],[150,40]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="2.1" fill="#afc6ff" fillOpacity=".8"/>)}
   </g>

   <Plate box={NOTEBOOK} fill={`url(#${uid}-blue)`} blue/>
   <g transform={planeMatrix(NOTEBOOK.x0,NOTEBOOK.y0,NOTEBOOK.top)} stroke="#bfd3ff" strokeOpacity=".65" strokeWidth="1.3"><path d="M0 12H59" strokeOpacity=".2"/><path d="M21 24L13 32L21 40M40 24L48 32L40 40M34 22L27 43"/><path d="M12 50H44M12 54H32" strokeOpacity=".24"/></g>

   <g stroke="#a2e872" strokeOpacity=".25" strokeWidth="1">{[38,48,58,68].map(x=><path key={x} d={routePath([[x,API.y1,API.bottom],[x,API.y1+7,API.bottom]])}/>)}{[27,38,49,60].map(y=><path key={y} d={routePath([[API.x1,y,API.bottom],[API.x1+7,y,API.bottom]])}/>)}</g>
   <Plate box={API} fill={`url(#${uid}-glass)`}/>
   <g transform={planeMatrix(API.x0,API.y0,API.top)}><path d="M20 23V18a7 7 0 0114 0v5" stroke="#d4f8bf" strokeWidth="1.7"/><rect x="16" y="23" width="22" height="18" rx="3" fill="#a2e872" fillOpacity=".1" stroke="#c2efa8" strokeWidth="1.5"/><path d="M27 29V34" stroke="#d4f8bf" strokeWidth="1.6"/></g>

   <Plate box={LOCAL} fill={`url(#${uid}-glass)`}/>
   <g transform={planeMatrix(LOCAL.x0,LOCAL.y0,LOCAL.top)} stroke="#b9eb9c" strokeWidth="1.3"><path d="M9 16a7 7 0 0112-5M21 11V6M21 11H16M23 17a7 7 0 01-12 5M11 22V27M11 22H16"/></g>

   <path d={sidePath} fill={`url(#${uid}-cylinder)`} stroke="#a6beff" strokeOpacity=".3" strokeWidth=".9"/>
   {[23,39].map(z=><path key={z} d={frontArc(dbTop.x,project([DATABASE.x,DATABASE.y,z]).y,rx,ry)} stroke="#a6beff" strokeOpacity=".22" strokeWidth=".8"/>)}
   <ellipse cx={dbTop.x} cy={dbTop.y} rx={rx} ry={ry} fill="#24334b" stroke="#b9ccff" strokeOpacity=".4" strokeWidth=".9"/>
   <ellipse cx={dbTop.x} cy={dbTop.y} rx={rx*.73} ry={ry*.73} stroke="#b9ccff" strokeOpacity=".15" strokeWidth=".8"/>

   <g>{Object.entries(PORTS).map(([name,point])=>{const p=project(point);return <circle key={name} cx={p.x} cy={p.y} r={name==='dbApi'?2.1:1.7} fill={name.toLowerCase().includes('notebook')||name==='dbApi'?'#a6beff':'#b9ed9b'} fillOpacity=".85"/>;})}</g>
   <g fontFamily="Inter,Arial,sans-serif" fontSize="12" textAnchor="middle" fill="#a9b8a6">
    <text x={centerX(UI)} y="17">{es?'Interfaz · navegador':'Interface · browser'}</text>
    <text x={centerX(NOTEBOOK)} y="279" fill="#b0c2e7">Python / Colab</text><text x={centerX(NOTEBOOK)} y="294" fontSize="9.5" fill="#6f809a">{es?'Ejecución externa':'External execution'}</text>
    <text x={centerX(API)} y="326">{es?'API autenticada':'Authenticated API'}</text>
    <text x={centerX(LOCAL)} y="339">{es?'Estado local':'Local state'}</text><text x={centerX(LOCAL)} y="353" fontSize="9.5" fill="#6f866a">{es?'En el navegador':'In the browser'}</text>
    <text x={dbTop.x} y="337" fill="#b0c2e7">D1 / SQLite</text><text x={dbTop.x} y="351" fontSize="9.5" fill="#6f809a">{es?'Progreso · notas':'Progress · notes'}</text>
   </g>
  </motion.g>
 </svg>;
}
