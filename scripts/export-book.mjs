import {readFile,writeFile,mkdir} from 'node:fs/promises';
const html=await readFile('dist/index.html','utf8');
const script=html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/)[1];
const stylesheet=html.match(/<link[^>]+href="([^"]+\.css)"[^>]*>/)[1];
let js=await readFile(`dist${script}`,'utf8');
let css=await readFile(`dist${stylesheet}`,'utf8');
const font=(await readFile('public/fonts/Manrope-Variable.ttf')).toString('base64');
css=css.replace(/\/fonts\/Manrope-Variable\.ttf/g,`data:font/ttf;base64,${font}`);
let result=html.replace(/<script[^>]+src="[^"]+"[^>]*><\/script>/,()=>`<script type="module">${js.replace(/<\/script/gi,'<\\/script')}</script>`)
 .replace(/<link[^>]+href="[^"]+\.css"[^>]*>/,()=>`<style>${css}</style>`);
await mkdir('output',{recursive:true});
await writeFile('output/感知之书.html',result);
console.log(`Exported output/感知之书.html (${Math.round(Buffer.byteLength(result)/1024)} KiB), including local font.`);
