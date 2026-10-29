import assert from 'node:assert/strict';
import {project,planeMatrix,UI,NOTEBOOK,API,LOCAL,DATABASE,DB_ELLIPSE,PORTS,ROUTES} from '../src/components/nexo-geometry.mjs';
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
const onBox=([x,y,z],b)=>{assert.ok(x>=b.x0&&x<=b.x1&&y>=b.y0&&y<=b.y1&&z>=b.bottom&&z<=b.top);assert.ok(x===b.x0||x===b.x1||y===b.y0||y===b.y1||z===b.top||z===b.bottom);};
for(const name of ['uiApi','uiNotebook','uiLocal'])onBox(PORTS[name],UI);
for(const name of ['apiUi','apiDb'])onBox(PORTS[name],API);
onBox(PORTS.notebookUi,NOTEBOOK);onBox(PORTS.localUi,LOCAL);
close(Math.hypot(PORTS.dbApi[0]-DATABASE.x,PORTS.dbApi[1]-DATABASE.y),DATABASE.radius);
assert.ok(PORTS.dbApi[2]>=DATABASE.bottom&&PORTS.dbApi[2]<=DATABASE.top);
assert.deepEqual(ROUTES.map(r=>`${r.from}:${r.to}`).sort(),['api:database','browser:api','browser:local','browser:notebook']);
assert.equal(ROUTES.find(r=>r.to==='notebook').kind,'external-link');
for(const route of ROUTES)for(let i=1;i<route.points.length;i++){
 const a=route.points[i-1],b=route.points[i];
 assert.equal(a.filter((n,j)=>Math.abs(n-b[j])>1e-8).length,1,route.id+': route segments follow a single world axis');
}
console.log('Passed: one isometric camera, shared surface matrices, correct cylinder projection, surface-anchored ports, orthogonal routing and browser/API/database/Colab boundaries.');
