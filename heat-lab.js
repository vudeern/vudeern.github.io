(()=>{
 const canvas=document.getElementById('heat-canvas');if(!canvas)return;
 const ctx=canvas.getContext('2d');if(!ctx){canvas.replaceWith(document.createTextNode('This browser cannot display the interactive grid. Read the method below.'));return;}
 const model=new HeatField(),n=model.n,size=canvas.width,cell=size/n;
 let paused=matchMedia('(prefers-reduced-motion: reduce)').matches,drag=false,last=0,elapsed=0;
 const pause=document.getElementById('pause-heat');
 function pauseLabel(){pause.textContent=paused?'Run':'Pause';pause.setAttribute('aria-pressed',String(paused));}
 function draw(){
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){const v=model.a[y*n+x]/100;ctx.fillStyle=`rgb(${Math.round(15+167*v)},${Math.round(21+172*v)},${Math.round(12+91*v)})`;ctx.fillRect(x*cell,y*cell,cell+.5,cell+.5);}
  ctx.strokeStyle='rgba(180,196,130,.1)';ctx.lineWidth=1;
  ctx.beginPath();for(let i=0;i<=n;i++){ctx.moveTo(i*cell,0);ctx.lineTo(i*cell,size);ctx.moveTo(0,i*cell);ctx.lineTo(size,i*cell);}ctx.stroke();
  ctx.strokeStyle='rgba(227,236,199,.4)';ctx.lineWidth=1.1;
  for(let level=20;level<100;level+=20){ctx.beginPath();for(let y=0;y<n-1;y++)for(let x=0;x<n-1;x++){
   const values=[model.a[y*n+x],model.a[y*n+x+1],model.a[(y+1)*n+x+1],model.a[(y+1)*n+x]];
   const corners=[[x+.5,y+.5],[x+1.5,y+.5],[x+1.5,y+1.5],[x+.5,y+1.5]],hits=[];
   for(let i=0;i<4;i++){const j=(i+1)%4;if((values[i]<level)!==(values[j]<level)){const t=(level-values[i])/(values[j]-values[i]);hits.push([(corners[i][0]+t*(corners[j][0]-corners[i][0]))*cell,(corners[i][1]+t*(corners[j][1]-corners[i][1]))*cell]);}}
   for(let i=0;i+1<hits.length;i+=2){ctx.moveTo(...hits[i]);ctx.lineTo(...hits[i+1]);}
  }ctx.stroke();}
  document.getElementById('sim-time').textContent=model.time.toFixed(3);
  document.getElementById('sim-mean').textContent=model.mean().toFixed(1);
 }
 function paint(e){const r=canvas.getBoundingClientRect();model.pulse(Math.max(1,Math.min(n-2,(e.clientX-r.left)/r.width*n-.5)),Math.max(1,Math.min(n-2,(e.clientY-r.top)/r.height*n-.5)));draw();}
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag=true;canvas.setPointerCapture(e.pointerId);paint(e);});
 canvas.addEventListener('pointermove',e=>{if(drag)paint(e);});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>drag=false);
 canvas.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();model.pulse(10,10);draw();}});
 for(const edge of ['left','right','top','bottom'])document.getElementById('edge-'+edge).addEventListener('input',e=>{model.edges[edge]=Number(e.target.value);document.getElementById(edge+'-value').textContent=e.target.value;model.boundaries();draw();});
 pause.addEventListener('click',()=>{paused=!paused;pauseLabel();});
 document.getElementById('reset-heat').addEventListener('click',()=>{model.reset();draw();});
 document.getElementById('pulse-heat').addEventListener('click',()=>{model.pulse(10,10);draw();});
 function frame(t){const dt=Math.min(100,t-last);last=t;if(!paused&&!document.hidden){elapsed+=dt;while(elapsed>=35){model.step();elapsed-=35;}draw();}requestAnimationFrame(frame);}
 model.pulse(10,10);pauseLabel();draw();requestAnimationFrame(frame);
})();
