/** Neutral art direction informed by Temper Studio (Framer Best Visual Design 2025),
 * bohdan.design and basement.studio. Shared by the site, canvas and social preview. */
export const palette=Object.freeze({
 background:'#111111',deep:'#0B0B0B',surface:'#1C1C1C',raised:'#2A2A2A',
 ink:'#F2F1EF',accent:'#D3D7DA',accentLight:'#F2F1EF',slate:'#909AA4',
 slateLight:'#C4CDD4',sage:'#AAB5BB',rose:'#B29B9D',
 gray:Object.freeze({50:'#F8F8F7',100:'#F2F1EF',200:'#E6E6E6',300:'#C4C4C4',400:'#ADADAD',500:'#949494',600:'#787878',700:'#555555',800:'#303030',900:'#202020',950:'#151515'}),
});
/** @param {string} hex */
export const rgbChannels=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)).join(',');
/** @param {string} hex @param {number} alpha */
export const rgba=(hex,alpha)=>`rgba(${rgbChannels(hex)},${alpha})`;
