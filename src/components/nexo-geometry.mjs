/** @typedef {readonly [number,number,number]} Point3 */
/** @typedef {{x0:number,x1:number,y0:number,y1:number,top:number,bottom:number}} Box */

export const ISO=Object.freeze({cos:Math.sqrt(3)/2,sin:.5,x:320,y:235});
/** One orthographic isometric camera for every surface, icon, grid line and port.
 * @param {Point3} point */
export function project([x,y,z]){return {x:ISO.x+(x-y)*ISO.cos,y:ISO.y+(x+y)*ISO.sin-z};}
/** @param {readonly Point3[]} points */
export function polygon(points){return points.map(p=>{const q=project(p);return `${q.x.toFixed(3)},${q.y.toFixed(3)}`;}).join(' ');}
/** @param {readonly Point3[]} points */
export function routePath(points){return points.map((p,i)=>{const q=project(p);return `${i?'L':'M'}${q.x.toFixed(3)} ${q.y.toFixed(3)}`;}).join(' ');}
/** @param {number} x @param {number} y @param {number} z */
export function planeMatrix(x,y,z){const p=project([x,y,z]);return `matrix(${ISO.cos} ${ISO.sin} ${-ISO.cos} ${ISO.sin} ${p.x} ${p.y})`;}
/** @param {Box} b */
export function boxFaces(b){return {
 top:polygon([[b.x0,b.y0,b.top],[b.x1,b.y0,b.top],[b.x1,b.y1,b.top],[b.x0,b.y1,b.top]]),
 x:polygon([[b.x1,b.y0,b.top],[b.x1,b.y1,b.top],[b.x1,b.y1,b.bottom],[b.x1,b.y0,b.bottom]]),
 y:polygon([[b.x0,b.y1,b.top],[b.x1,b.y1,b.top],[b.x1,b.y1,b.bottom],[b.x0,b.y1,b.bottom]])
};}
export const UI=Object.freeze({x0:-145,x1:35,y0:-95,y1:15,top:74,bottom:65});
export const NOTEBOOK=Object.freeze({x0:-128,x1:-69,y0:72,y1:132,top:14,bottom:7});
export const API=Object.freeze({x0:28,x1:82,y0:16,y1:70,top:25,bottom:8});
export const LOCAL=Object.freeze({x0:-10,x1:22,y0:104,y1:136,top:12,bottom:5});
export const DATABASE=Object.freeze({x:145,y:-10,radius:25,top:55,bottom:8});
export const DB_ELLIPSE=Object.freeze({rx:DATABASE.radius*Math.sqrt(1.5),ry:DATABASE.radius/Math.sqrt(2)});

/** Ports are defined on real component surfaces in world coordinates. */
export const PORTS=Object.freeze({
 uiApi:/** @type {Point3} */([28,15,66]), apiUi:/** @type {Point3} */([28,43,25]),
 apiDb:/** @type {Point3} */([82,43,17]), dbApi:/** @type {Point3} */([145-25/Math.sqrt(2),-10+25/Math.sqrt(2),28]),
 uiNotebook:/** @type {Point3} */([-110,15,66]), notebookUi:/** @type {Point3} */([-69,96,10]),
 uiLocal:/** @type {Point3} */([-30,15,66]), localUi:/** @type {Point3} */([6,104,12])
});
const dbPort=PORTS.dbApi;
export const ROUTES=Object.freeze([
 {id:'records',from:'browser',to:'api',kind:'data',color:'#b6ef8d',points:/** @type {Point3[]} */([PORTS.uiApi,[28,15,3],[28,43,3],PORTS.apiUi])},
 {id:'persistence',from:'api',to:'database',kind:'data',color:'#a6beff',points:/** @type {Point3[]} */([PORTS.apiDb,[82,43,3],[dbPort[0],43,3],[dbPort[0],dbPort[1],3],dbPort])},
 {id:'notebooks',from:'browser',to:'notebook',kind:'external-link',color:'#a6beff',points:/** @type {Point3[]} */([PORTS.uiNotebook,[-110,15,3],[-110,96,3],[-69,96,3],PORTS.notebookUi])},
 {id:'local-state',from:'browser',to:'local',kind:'data',color:'#b6ef8d',points:/** @type {Point3[]} */([PORTS.uiLocal,[-30,15,3],[-30,104,3],[6,104,3],PORTS.localUi])}
]);
