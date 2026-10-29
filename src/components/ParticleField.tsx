import React,{useEffect,useRef} from 'react';

export default function ParticleField({initialLanguage='en'}:{initialLanguage?:'en'|'es'}){
 const container=useRef<HTMLDivElement>(null);const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const host=container.current,element=canvas.current;if(!host||!element)return;
  const ctx=element.getContext('2d');if(!ctx)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const points=Array.from({length:145},(_,i)=>{const y=1-2*(i+.5)/145;const r=Math.sqrt(1-y*y);const t=i*Math.PI*(3-Math.sqrt(5));const warp=1+.12*Math.sin(t*3+y*4);return {x:Math.cos(t)*r*warp,y:y*warp,z:Math.sin(t)*r*warp};});
  const edges:number[][]=[];for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){const a=points[i],b=points[j];if(Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)<.43)edges.push([i,j]);}
  let width=0,height=0,frame=0,visible=true,phase=0,last=0,px=0,py=0;
  function draw(){
   if(!ctx)return;ctx.clearRect(0,0,width,height);const radius=Math.min(width,height)*.34;
   const glow=ctx.createRadialGradient(width*.5,height*.5,0,width*.5,height*.5,radius*1.7);glow.addColorStop(0,'rgba(162,232,114,.11)');glow.addColorStop(1,'rgba(162,232,114,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
   const angle=phase*.00015+px*.18,tilt=-.23+py*.12;const c=Math.cos(angle),s=Math.sin(angle),ct=Math.cos(tilt),st=Math.sin(tilt);
   const projected=points.map(p=>{const x=p.x*c-p.z*s,z=p.x*s+p.z*c,y=p.y*ct-z*st,depth=p.y*st+z*ct,scale=3/(3+depth);return {x:width*.5+x*radius*scale,y:height*.49+y*radius*scale,z:depth,scale};});
   ctx.lineWidth=.65;
   for(const [i,j] of edges){const a=projected[i],b=projected[j];const depth=(a.z+b.z)*.5;ctx.strokeStyle=`rgba(162,232,114,${.05+(1.5-depth)*.075})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
   projected.sort((a,b)=>b.z-a.z).forEach((p,i)=>{const bright=i%13===0;ctx.beginPath();ctx.arc(p.x,p.y,(bright?2.2:1.25)*p.scale,0,Math.PI*2);ctx.fillStyle=bright?'rgba(226,255,206,.95)':`rgba(162,232,114,${.28+(1.4-p.z)*.22})`;ctx.fill();if(bright){ctx.beginPath();ctx.arc(p.x,p.y,5.5*p.scale,0,Math.PI*2);ctx.fillStyle='rgba(162,232,114,.045)';ctx.fill();}});
  }
  function tick(time:number){frame=0;if(!visible||document.hidden||reduced.matches)return;if(last)phase+=Math.min(time-last,50);last=time;draw();frame=requestAnimationFrame(tick);}
  function resume(){cancelAnimationFrame(frame);frame=0;last=0;draw();if(visible&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick);}
  const resize=new ResizeObserver(()=>{if(!host||!element||!ctx)return;const box=host.getBoundingClientRect();width=box.width;height=box.height;const ratio=Math.min(devicePixelRatio||1,2);element.width=Math.round(width*ratio);element.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);draw();});resize.observe(host);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;resume();});observer.observe(host);
  const pointer=(event:PointerEvent)=>{const box=host.getBoundingClientRect();px=(event.clientX-box.left)/box.width-.5;py=(event.clientY-box.top)/box.height-.5;if(reduced.matches)draw();};
  host.addEventListener('pointermove',pointer);document.addEventListener('visibilitychange',resume);reduced.addEventListener('change',resume);resume();
  return()=>{cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();host.removeEventListener('pointermove',pointer);document.removeEventListener('visibilitychange',resume);reduced.removeEventListener('change',resume);};
 },[]);
 return <div className="relative min-w-0" aria-hidden="true">
   <div className="relative pt-3 text-center"><span className="font-mono text-[10px] text-neon/60 tracking-[.18em]">AI / SOFTWARE / LEARNING</span></div>
   <div ref={container} className="relative h-[310px] sm:h-[350px]">
    <svg viewBox="0 0 360 350" className="absolute inset-0 w-full h-full opacity-25" fill="none"><ellipse cx="180" cy="170" rx="126" ry="111" stroke="#a2e872" strokeOpacity=".12" transform="rotate(-27 180 170)"/><ellipse cx="180" cy="170" rx="137" ry="72" stroke="#a2e872" strokeOpacity=".12" transform="rotate(35 180 170)"/>{Array.from({length:23},(_,i)=>{const t=i*2.39996,r=22+Math.sqrt(i)*23;return <circle key={i} cx={180+Math.cos(t)*r} cy={170+Math.sin(t)*r*.75} r={i%6===0?2:1} fill="#a2e872" fillOpacity=".5"/>;})}</svg>
    <canvas ref={canvas} className="relative block w-full h-full"/>
   </div>
   <div className="relative pb-3 text-center text-xs text-gray-400">{initialLanguage==='es'?'IA aplicada · Herramientas para desarrolladores':'Applied AI · Developer tools'}</div>
 </div>;
}
