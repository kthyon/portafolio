import assert from 'node:assert/strict';
import {project,planeMatrix,verticalFaceMatrix,UI,NOTEBOOK,API,LOCK,LOCAL,DATABASE,DB_ELLIPSE,ART_FRAME,PORTS,ROUTES} from '../src/components/nexo-geometry.mjs';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const origin=project([0,0,0]);
const basis=[[1,0,0],[0,1,0],[0,0,1]].map(p=>{const q=project(p);return [q.x-origin.x,q.y-origin.y];});
for(const v of basis)close(Math.hypot(...v),1);
for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)close(basis[i][0]*basis[j][0]+basis[i][1]*basis[j][1],-.5);
for(const box of [UI,NOTEBOOK,API,LOCAL]){
 const matrix=planeMatrix(box.x0,box.y0,box.top).slice(7,-1).split(' ').map(Number);
 for(const [u,v] of [[0,0],[box.x1-box.x0,0],[0,box.y1-box.y0],[17,23]]){
  const expected=project([box.x0+u,box.y0+v,box.top]);
  close(matrix[0]*u+matrix[2]*v+matrix[4],expected.x);close(matrix[1]*u+matrix[3]*v+matrix[5],expected.y);
 }
}
close(DB_ELLIPSE.ry/DB_ELLIPSE.rx,1/Math.sqrt(3));
const solidEdges=[UI,NOTEBOOK,API,LOCAL].flatMap(b=>[project([b.x0,b.y1,0]).x,project([b.x1,b.y0,0]).x]);
const dbCenter=project([DATABASE.x,DATABASE.y,0]).x;
solidEdges.push(dbCenter-DB_ELLIPSE.rx,dbCenter+DB_ELLIPSE.rx);
const leftMargin=Math.min(...solidEdges)-ART_FRAME.x,rightMargin=ART_FRAME.x+ART_FRAME.width-Math.max(...solidEdges);
assert.ok(Math.abs(leftMargin-rightMargin)<2,'Visible solids must have balanced side margins');
assert.ok(Math.min(leftMargin,rightMargin)>=20,'Solids require breathing room inside the frame');
const lockMatrix=verticalFaceMatrix(LOCK.x0,LOCK.y1,LOCK.top).slice(7,-1).split(' ').map(Number);
for(const [u,v] of [[0,0],[22,0],[0,18],[11,7]]){
 const p=project([LOCK.x0+u,LOCK.y1,LOCK.top-v]);
 close(lockMatrix[0]*u+lockMatrix[2]*v+lockMatrix[4],p.x);close(lockMatrix[1]*u+lockMatrix[3]*v+lockMatrix[5],p.y);
}
assert.equal(LOCK.bottom,API.top,'Lock rests on the API surface');
const onBox=([x,y,z],b)=>{assert.ok(x>=b.x0&&x<=b.x1&&y>=b.y0&&y<=b.y1&&z>=b.bottom&&z<=b.top);assert.ok(x===b.x0||x===b.x1||y===b.y0||y===b.y1||z===b.top||z===b.bottom);};
for(const name of ['uiApi','uiNotebook','uiLocal'])onBox(PORTS[name],UI);
for(const name of ['apiUi','apiDb'])onBox(PORTS[name],API);
onBox(PORTS.notebookUi,NOTEBOOK);onBox(PORTS.localUi,LOCAL);
close(Math.hypot(PORTS.dbApi[0]-DATABASE.x,PORTS.dbApi[1]-DATABASE.y),DATABASE.radius);
assert.ok(PORTS.dbApi[2]>=DATABASE.bottom&&PORTS.dbApi[2]<=DATABASE.top);
assert.deepEqual(ROUTES.map(r=>`${r.from}:${r.to}`).sort(),['api:database','browser:api','browser:local','browser:notebook']);
assert.equal(ROUTES.find(r=>r.to==='notebook').kind,'external-link');
const visibleLead=(point,lead,box)=>{
 onBox(point,box);
 assert.ok(point[0]===box.x1||point[1]===box.y1,'Port must be on a visible side face');
 assert.equal(point[2],lead[2],'Port lead remains level before its riser');
 assert.ok((point[0]===box.x1&&lead[0]>point[0]&&lead[1]===point[1])||(point[1]===box.y1&&lead[1]>point[1]&&lead[0]===point[0]),'Lead exits the visible face rather than passing through the solid');
};
const components={browser:UI,api:API,notebook:NOTEBOOK,local:LOCAL};
for(const route of ROUTES){
 visibleLead(route.points[0],route.points[1],components[route.from]);
 const last=route.points.length-1;
 if(route.to!=='database')visibleLead(route.points[last],route.points[last-1],components[route.to]);
 else {assert.ok(route.points[last-1][1]>DATABASE.y+DATABASE.radius);close(route.points[last][0],DATABASE.x);close(route.points[last][1],DATABASE.y+DATABASE.radius);}
 // Every vertical riser is outside every device footprint; it cannot emerge through a face.
 for(let i=1;i<route.points.length;i++)if(route.points[i][2]!==route.points[i-1][2]){
  const [x,y]=route.points[i];
  for(const box of Object.values(components))assert.ok(x<box.x0||x>box.x1||y<box.y0||y>box.y1,route.id+': riser intersects a component footprint');
  assert.ok(Math.hypot(x-DATABASE.x,y-DATABASE.y)>DATABASE.radius,route.id+': riser intersects database');
 }
}
for(const route of ROUTES)for(let i=1;i<route.points.length;i++){
 const a=route.points[i-1],b=route.points[i];
 assert.equal(a.filter((n,j)=>Math.abs(n-b[j])>1e-8).length,1,route.id+': route segments follow a single world axis');
}
console.log('Passed: shared isometric/vertical faces, cylinder projection, supported lock, visible face ports, outward leads, unobstructed risers, orthogonal routing and browser/API/database/Colab boundaries.');
