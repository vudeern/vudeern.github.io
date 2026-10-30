(function(root){
 class HeatField {
  constructor(n=21){this.n=n;this.a=new Float64Array(n*n);this.b=new Float64Array(n*n);this.edges={left:100,right:0,top:0,bottom:0};this.time=0;this.reset();}
  boundaries(){const n=this.n,a=this.a,e=this.edges;for(let i=0;i<n;i++){a[i*n]=e.left;a[i*n+n-1]=e.right;a[i]=e.top;a[(n-1)*n+i]=e.bottom;}a[0]=(e.left+e.top)/2;a[n-1]=(e.right+e.top)/2;a[(n-1)*n]=(e.left+e.bottom)/2;a[n*n-1]=(e.right+e.bottom)/2;}
  reset(){this.a.fill(0);this.b.fill(0);this.time=0;this.boundaries();}
  pulse(x,y){const n=this.n;for(let j=1;j<n-1;j++)for(let i=1;i<n-1;i++){const r=(i-x)**2+(j-y)**2;if(r<10)this.a[j*n+i]=Math.min(100,this.a[j*n+i]+80*Math.exp(-r/3));}}
  step(){const n=this.n,a=this.a,b=this.b;b.set(a);for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++){const k=y*n+x;b[k]=a[k]+.24*(a[k-1]+a[k+1]+a[k-n]+a[k+n]-4*a[k]);}this.a=b;this.b=a;this.boundaries();this.time+=.24/(n-1)**2;}
  mean(){return this.a.reduce((sum,x)=>sum+x,0)/this.a.length;}
 }
 if(typeof module!=='undefined'&&module.exports)module.exports=HeatField;else root.HeatField=HeatField;
})(typeof globalThis!=='undefined'?globalThis:this);
