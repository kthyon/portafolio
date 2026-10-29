import sharp from 'sharp';
import {stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const input=process.argv[2];
if(!input)throw new Error('Pass the original portrait file as the first argument.');
for(const width of [960,1600]){
 const name=width===1600?'portrait-cris-grain.webp':'portrait-cris-grain-960.webp';
 const path=new URL('../public/'+name,import.meta.url);
 await sharp(input).rotate().resize({width,withoutEnlargement:true}).webp({quality:94,effort:6}).toFile(fileURLToPath(path));
 console.log(name,Math.round((await stat(path)).size/1024)+' KB');
}
// Read-only luminance samples at the portrait's approximate desktop display size.
const {data,info}=await sharp(input).rotate().resize({height:986}).greyscale().raw().toBuffer({resolveWithObject:true});
for(const [name,x,y] of [['upper-left',35,120],['upper-right',info.width-135,120],['left-edge',20,390]]){
 const values=[];let difference=0,count=0;
 for(let j=y;j<y+80;j++)for(let i=x;i<x+80;i++){
  const n=data[j*info.width+i];values.push(n);
  if(i>x){difference+=(n-data[j*info.width+i-1])**2;count++;}
 }
 const mean=values.reduce((a,b)=>a+b,0)/values.length;
 const sd=Math.sqrt(values.reduce((sum,n)=>sum+(n-mean)**2,0)/values.length);
 console.log(name,JSON.stringify({mean:+mean.toFixed(2),sd:+sd.toFixed(2),grainRms:+Math.sqrt(difference/count/2).toFixed(2)}));
}
