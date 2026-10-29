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
/** Vertical X/Z face, with local Y pointing down. @param {number} x @param {number} y @param {number} z */
export function verticalFaceMatrix(x,y,z){const p=project([x,y,z]);return `matrix(${ISO.cos} ${ISO.sin} 0 1 ${p.x} ${p.y})`;}
/** @param {Box} b */
export function boxFaces(b){return {
 top:polygon([[b.x0,b.y0,b.top],[b.x1,b.y0,b.top],[b.x1,b.y1,b.top],[b.x0,b.y1,b.top]]),
 x:polygon([[b.x1,b.y0,b.top],[b.x1,b.y1,b.top],[b.x1,b.y1,b.bottom],[b.x1,b.y0,b.bottom]]),
 y:polygon([[b.x0,b.y1,b.top],[b.x1,b.y1,b.top],[b.x1,b.y1,b.bottom],[b.x0,b.y1,b.bottom]])
};}
export const UI=Object.freeze({x0:-130,x1:26,y0:-87,y1:7,top:78,bottom:68});
export const NOTEBOOK=Object.freeze({x0:-178,x1:-112,y0:118,y1:178,top:14,bottom:7});
export const API=Object.freeze({x0:26,x1:90,y0:18,y1:82,top:32,bottom:16});
export const LOCK=Object.freeze({x0:44,x1:66,y0:42,y1:54,top:50,bottom:32});
export const LOCAL=Object.freeze({x0:-16,x1:28,y0:110,y1:154,top:12,bottom:5});
export const DATABASE=Object.freeze({x:201,y:-58,radius:27,top:64,bottom:10});
export const DB_ELLIPSE=Object.freeze({rx:DATABASE.radius*Math.sqrt(1.5),ry:DATABASE.radius/Math.sqrt(2)});
// Equal visible side margins around the solids, including the cylinder silhouette.
export const ART_FRAME=Object.freeze({x:-12,y:8,width:614,height:358});

/** Ports are defined on real component surfaces in world coordinates. */
export const PORTS=Object.freeze({
 uiApi:/** @type {Point3} */([26,-25,71]), apiUi:/** @type {Point3} */([44,82,23]),
 apiDb:/** @type {Point3} */([90,50,23]), dbApi:/** @type {Point3} */([201,-31,35]),
 uiNotebook:/** @type {Point3} */([-105,7,71]), notebookUi:/** @type {Point3} */([-112,156,10]),
 uiLocal:/** @type {Point3} */([-32,7,71]), localUi:/** @type {Point3} */([6,154,8])
});
// Each lead exits a visible face before descending. Risers stay outside device volumes.
export const ROUTES=Object.freeze([
 {id:'records',from:'browser',to:'api',kind:'data',color:'#D0D9DF',points:/** @type {Point3[]} */([PORTS.uiApi,[100,-25,71],[100,-25,3],[100,94,3],[44,94,3],[44,94,23],PORTS.apiUi])},
 {id:'persistence',from:'api',to:'database',kind:'data',color:'#A6BECE',points:/** @type {Point3[]} */([PORTS.apiDb,[120,50,23],[120,50,3],[120,-19,3],[201,-19,3],[201,-19,35],PORTS.dbApi])},
 {id:'notebooks',from:'browser',to:'notebook',kind:'external-link',color:'#A6BECE',points:/** @type {Point3[]} */([PORTS.uiNotebook,[-105,19,71],[-105,19,3],[-100,19,3],[-100,156,3],[-100,156,10],PORTS.notebookUi])},
 {id:'local-state',from:'browser',to:'local',kind:'data',color:'#D0D9DF',points:/** @type {Point3[]} */([PORTS.uiLocal,[-32,19,71],[-32,19,3],[-32,166,3],[6,166,3],[6,166,8],PORTS.localUi])}
]);
