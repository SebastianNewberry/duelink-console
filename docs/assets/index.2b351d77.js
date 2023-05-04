import{C as e,c as t,w as s,n as a,a as o,o as i,b as n,v as l,d as r,e as c,r as d,m as u,u as h,f as p,g as f,h as m,i as g,j as w,k as v,l as y,p as b,q as k,s as x,t as C,x as L,y as z,z as M,V as E,A as B,B as _,D as P,F as q,E as R,G as $,H as D}from"./vendor.11579ef1.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const s of e)if("childList"===s.type)for(const e of s.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();class S{constructor(){this.port=null,this.reader=null,this.writer=null,this.encoder=new TextEncoder,this.decoder=new TextDecoder,this.queue=new e,this.readLoopActive=!1,this.readLoopPromise=null,this.errorLog=[],this.isBusy=!0,this.isConnected=!1,this.isEchoing=!0,this.isTalking=!1,this.mode=">",this.version=null,this.str="",this.output=[]}async connect(){var e,t;try{this.isBusy=!0,this.port=await navigator.serial.requestPort({usbVendorId:7071});try{await this.port.open({baudRate:115200,dataBits:8,parity:"none",stopBits:1,flowControl:"none"})}catch(s){return alert((null==s?void 0:s.message)||"Unable to connect."),void(this.isBusy=!1)}if(null==(null==(e=this.port)?void 0:e.writable))return void this.errorLog.push("This is not a writable port.");if(null==(null==(t=this.port)?void 0:t.readable))return void this.errorLog.push("This is not a readable port.");this.reader=this.port.readable.getReader(),this.writer=this.port.writable.getWriter(),this.startReadLoop(),await this.sleep(100),await this.synchronize(),this.isConnected=!0,this.port.addEventListener("disconnect",(()=>this.disconnect())),console.log("ready")}finally{this.isBusy=!1}}async disconnect(){await this.stopReadLoop(),await this.writer.releaseLock(),await this.reader.releaseLock(),await this.port.close(),this.isConnected=!1,this.version=null}async synchronize(){this.writer.write(this.encoder.encode("")),console.log("wrote escape"),await this.sleep(100);let e=await this.flush();console.log("escape result",e),1===e.length&&(e=e.pop(),">"!==e&&"$"!==e||(this.mode=e,console.log("mode set to",e))),this.isEchoing&&await this.turnOffEcho();let t=3;for(;t>0;){await this.sleep(100);const e=await this.getVersion();if("string"==typeof e){this.version=e;break}t--}}async getVersion(){const e=await this.write("version()");for(const t of e)if(console.log("line",t,(t.match(/\./g)||[]).length),t.startsWith("v")&&2===(t.match(/\./g)||[]).length)return t}async turnOffEcho(){this.isEchoing&&(await this.write("echo(0)"),this.isEchoing=!1)}sleep(e){return new Promise((t=>setTimeout(t,e)))}startReadLoop(){this.readLoopPromise=this.readLoop()}async stopReadLoop(){this.readLoopActive=!1,this.readLoopPromise&&(await this.reader.cancel(),await this.readLoopPromise,this.readLoopPromise=null)}async readLoop(){let e;for(this.readLoopActive=!0;this.readLoopActive;)try{const{value:t,done:s}=await this.reader.read();if(console.log("Reading..."),this.str+=this.decoder.decode(t).replace("\r",""),!this.str)continue;let a=this.str.indexOf("\n");for(a>-1?this.str.split("\n").forEach((e=>console.log("->",e))):console.log("->",this.str),this.isConnected&&(this.output.length&&this.str.startsWith(this.output[this.output.length-1])?this.output[this.output.length-1]=this.str:-1===a&&this.output.push(this.str));a>-1;)e=this.str.substring(0,a),e&&(console.log("queued:",e),this.queue.push(e),this.isConnected&&(this.output.length&&this.output[this.output.length-1].startsWith(e)?this.output[this.output.length-1]=e:this.output.push(e))),this.str=this.str.substring(a+1),a=this.str.indexOf("\n");">"!==this.str&&"$"!==this.str&&"&"!==this.str||(console.log("queued:",this.str),this.queue.push(this.str),this.str="",this.output.push("")),s&&(this.readLoopActive=!1)}catch(t){console.error(t);break}}readUntil(e=null){return e||(e=this.mode),new Promise((async t=>{const s=[];let a;do{if(a=await this.queue.pop().catch((()=>{console.log("read until","queue waiter terminated",s),t(s)})),a&&(s.push(a),a.startsWith("!"))){console.log("Error:",a);break}}while(a!==e);console.log("read until found",s),s.length>1&&s.pop(),t(s)}))}async flush(){const e=[];let t;do{t=await this.queue.tryPop(),t&&e.push(t)}while(t);return e.length||(this.str=""),console.log("flushed",e),e}async escape(){try{this.isBusy=!0,this.queue.cancelWait(new Error("Escape")),await this.write("","")}finally{this.isBusy=!1}}async write(e,t=null,s="\n"){let a=this.isTalking;try{console.log("----- write -----"),this.isTalking=!0,await this.flush(),this.writer.write(this.encoder.encode(e+s)),console.log("wrote",e),">"!==e&&"$"!==e||(this.mode=e),console.log("write is sleeping"),await this.sleep(50);let o=[];return a||(console.log("write is reading"),o=t?await this.readUntil(t):await this.readUntil(this.mode)),console.log("write result",o),o}finally{a||(this.isTalking=!1)}}async stream(e){let t=this.encoder.encode(e),s=t.length,a=0;for(;s>0;){const e=t.subarray(a,a+Math.min(64,s));await this.writer.write(e);const o=await this.queue.tryPop();if(o)return this.output.push(o),o;a+=64,s-=e.length,await this.sleep(1)}return null}}const T=["id"],A={props:{id:{type:String,required:!0},menuClass:String,open:Boolean},setup(e){const p=e;let f=null,m=null,g=null;const w=t((()=>({"aria-orientation":!!p.id&&"vertical","aria-labelledby":!!p.id&&`${p.id}-menu`})));return s((()=>p.open),(e=>{a((()=>{e&&(f&&(f.destroy(),f=null),f=o(g,m,{placement:"bottom-start",modifiers:[{name:"offset",options:{offset:[0,4]}},{name:"preventOverflow",options:{padding:16}}],strategy:"fixed"}))}))})),i((()=>{m=document.getElementById(`menu-${p.id}`),g=document.getElementById(`menu-${p.id}-btn`)})),(t,s)=>n((r(),c("div",u(h(w),{id:`menu-${e.id}`,class:"min-w-[100px] border rounded shadow-lg z-10\r\n        bg-slate-50 border-slate-300\r\n        dark:bg-zinc-700 dark:border-zinc-600",role:"menu"}),[d(t.$slots,"default")],16,T)),[[l,e.open]])}},U=["id"],W={props:{id:String},setup(e){const t=p(!1);function s(){t.value=!1}return(a,o)=>{const i=f("click-outside");return n((r(),c("div",null,[m("div",{id:`menu-${e.id}-btn`,class:"inline-flex p-2 rounded a",onClick:o[0]||(o[0]=e=>t.value=!t.value)},[d(a.$slots,"default")],8,U),g(A,{id:e.id,open:t.value},{default:w((()=>[d(a.$slots,"menu",v(y({close:s})))])),_:3},8,["id","open"])],512)),[[i,()=>t.value=!1]])}}},j={class:"h-full flex items-center space-x-1"},I=m("svg",{id:"logo",class:"h-6 w-auto mx-2",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 500 266",preserveAspectRatio:"xMidYMid meet","aria-hidden":"true"},[m("g",{transform:"translate(0, 266) scale(0.1, -0.1)",fill:"currentColor",stroke:"none"},[m("path",{d:"M494 2308 c-3 -13 -19 -50 -34 -83 -63 -135 -119 -309 -144 -440 -36 -198 -41 -247 -41 -440 1 -185 6 -247 36 -402 l10 -53 426 0 c468 0 493 3 606 62 115 61 222 210 258 358 8 30 14 105 14 165 0 105 -2 114 -33 177 -37 75 -72 110 -152 147 -50 24 -66 26 -179 26 l-124 0 -22 -110 c-12 -60 -39 -200 -59 -310 -21 -110 -39 -206 -42 -212 -2 -10 -44 -13 -164 -13 l-160 0 6 28 c3 15 10 43 14 62 5 19 21 100 35 180 47 253 73 392 94 499 12 57 21 105 21 106 0 2 18 6 40 10 22 4 52 9 68 11 15 3 113 8 217 11 170 5 201 3 295 -17 266 -56 421 -194 476 -426 23 -97 15 -310 -16 -414 -98 -330 -315 -519 -667 -579 -109 -19 -162 -21 -499 -21 -354 0 -376 -1 -369 -17 4 -10 15 -38 25 -63 10 -25 30 -71 45 -102 l26 -58 2025 0 2024 0 24 48 c69 136 147 377 172 532 9 52 19 113 22 135 9 53 9 449 0 500 -4 22 -12 77 -19 123 l-12 82 -549 0 c-515 0 -548 1 -548 18 0 9 11 69 23 132 l23 115 482 3 c265 1 482 4 482 6 0 11 -32 91 -65 164 l-38 82 -2023 0 -2023 0 -7 -22z m2115 -250 c0 -13 -6 -54 -14 -93 -7 -38 -25 -131 -39 -205 -14 -74 -28 -146 -31 -160 -23 -101 -68 -361 -77 -435 -13 -108 -2 -158 45 -212 41 -47 82 -63 157 -63 102 0 165 40 225 142 43 73 66 153 106 368 42 224 77 410 84 440 3 14 12 63 20 110 9 47 18 95 21 108 4 22 7 22 165 22 148 0 160 -1 156 -17 -3 -10 -9 -36 -13 -58 -4 -22 -8 -44 -9 -50 -2 -5 -14 -73 -29 -150 -14 -77 -28 -151 -31 -165 -3 -14 -17 -83 -30 -155 -77 -414 -106 -504 -211 -651 -62 -88 -145 -145 -267 -185 -89 -30 -298 -38 -387 -15 -188 48 -281 151 -316 351 -20 113 -15 152 76 625 17 91 42 228 56 305 14 77 27 146 29 153 3 9 44 12 160 12 154 0 155 0 154 -22z m1788 -565 c-3 -16 -13 -76 -23 -135 l-18 -108 -255 -2 -256 -3 -11 -60 c-7 -33 -19 -98 -28 -145 -9 -47 -19 -95 -21 -107 l-5 -23 285 0 c268 0 286 -1 281 -17 -3 -10 -12 -61 -21 -113 -8 -52 -18 -105 -20 -118 l-5 -22 -443 2 c-306 2 -441 6 -440 14 1 6 16 84 33 175 17 90 42 223 55 294 13 72 27 141 30 155 3 14 12 63 20 110 9 47 18 95 21 108 l4 22 411 0 412 0 -6 -27z"})])],-1),O=m("span",{class:"font-bold italic"},"BETA",-1),G={class:"pl-8 text-sm flex items-center space-x-2"},H=m("a",{href:"https://duelink.com",target:"_blank"},"Home",-1),V=k(" Demos "),N=["onClick"],K=["onClick"],F={emits:["demo-led","demo-count"],setup:e=>(e,t)=>(r(),c("div",j,[I,O,m("div",G,[H,g(W,{id:"demo"},{menu:w((({close:t})=>[m("div",{class:"px-4 py-1 hover:bg-slate-200 dark:hover:bg-zinc-600 cursor-pointer",onClick:b((s=>{e.$emit("demo-led"),t()}),["stop"])}," LED ",8,N),m("div",{class:"px-4 py-1 hover:bg-slate-200 dark:hover:bg-zinc-600 cursor-pointer",onClick:b((s=>{e.$emit("demo-count"),t()}),["stop"])}," Count ",8,K)])),default:w((()=>[V])),_:1})])]))},Y={},J={class:"btn"},Q={class:"pointer-events-none"};Y.render=function(e,t){return r(),c("button",J,[m("span",Q,[d(e.$slots,"default")])])};const X={class:"h-full mx-2 flex items-center space-x-1"},Z=m("i",{class:"fas fa-fw fa-plug"},null,-1),ee=m("i",{class:"fas fa-fw fa-circle"},null,-1),te=m("i",{class:"fas fa-fw fa-play"},null,-1),se=m("i",{class:"fas fa-fw fa-square"},null,-1),ae=m("i",{class:"fas fa-fw fa-list"},null,-1),oe=m("i",{class:"fas fa-fw fa-download"},null,-1),ie={props:{canDownload:Boolean,canList:Boolean,canPlay:Boolean,canRecord:Boolean,disabled:Boolean,isConnected:Boolean,theme:String},emits:["connect","disconnect","download","play","stop","record","list","update:theme","updateTippy"],setup(e,{emit:t}){const s=e;function a(e){s.isConnected?t("disconnect"):t("connect")}function o(e){"dark"===s.theme?(t("update:theme","light"),localStorage.theme="light",document.documentElement.style.colorScheme="light",document.documentElement.classList.remove("dark")):(t("update:theme","dark"),localStorage.theme="dark",document.documentElement.style.colorScheme="dark",document.documentElement.classList.add("dark")),t("updateTippy",e.target,!0)}return(s,i)=>(r(),c("div",X,[g(Y,{id:"plugBtn",class:x(e.isConnected?"connected":""),"data-tippy-content":e.isConnected?"Disconnect":"Connect",onClick:a},{default:w((()=>[Z])),_:1},8,["class","data-tippy-content"]),g(Y,{disabled:e.disabled||!e.canRecord,class:"record","data-tippy-content":"Record",onClick:i[0]||(i[0]=e=>t("record"))},{default:w((()=>[ee])),_:1},8,["disabled"]),g(Y,{disabled:e.disabled||!e.canPlay,class:"play","data-tippy-content":"Play",onClick:i[1]||(i[1]=e=>t("play"))},{default:w((()=>[te])),_:1},8,["disabled"]),g(Y,{disabled:!e.isConnected||!e.disabled,class:"stop","data-tippy-content":"Stop",onClick:i[2]||(i[2]=e=>t("stop"))},{default:w((()=>[se])),_:1},8,["disabled"]),g(Y,{disabled:e.disabled||!e.canList,"data-tippy-content":"List",onClick:i[3]||(i[3]=e=>t("list"))},{default:w((()=>[ae])),_:1},8,["disabled"]),g(Y,{disabled:!e.canDownload,"data-tippy-content":"Download",onClick:i[4]||(i[4]=e=>t("download"))},{default:w((()=>[oe])),_:1},8,["disabled"]),g(Y,{"data-tippy-content":("light"===e.theme?"Dark":"Light")+" Theme",onClick:o},{default:w((()=>[m("i",{class:x(["dark"===e.theme?"fa-sun":"fa-moon","fas fa-fw"])},null,2)])),_:1},8,["data-tippy-content"])]))}},ne={class:"bg-slate-200 dark:bg-zinc-800"},le={class:"flex-1 flex items-center justify-between"},re={class:"flex items-center space-x-2"},ce={class:"bg-white dark:bg-black border-4 border-t-0 border-slate-200 dark:border-zinc-800 max-h-[600px] overflow-y-auto"},de={props:{title:String},setup(e,{expose:t}){t({open:function(){s.value=!0}});const s=p(!0);return(t,a)=>(r(),c("div",ne,[m("div",{class:"flex items-center px-4 py-2 cursor-pointer select-none transition duration-150 ease-in-out",onClick:a[0]||(a[0]=e=>s.value=!s.value)},[m("div",le,[m("div",re,[m("i",{class:x(["fas",s.value?"fa-angle-down":"fa-angle-right"])},null,2),m("span",null,C(e.title),1)]),d(t.$slots,"buttons")])]),n(m("div",ce,[d(t.$slots,"default")],512),[[l,s.value]])]))}},ue={},he={class:"h-full p-4 flex flex-col items-center space-y-4 md:flex-row md:space-y-0"},pe=[L('<div><a href="https://ghielectronics.com" target="_blank"><svg class="h-10 w-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 706 297" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><g transform="translate(0, 297) scale(0.1, -0.1)" fill="currentColor" stroke="none"><path d="M850 2961 c-62 -7 -94 -22 -106 -48 -5 -10 -9 -90 -9 -178 l0 -160 -34 -70 c-44 -88 -154 -200 -238 -241 -57 -29 -61 -29 -213 -27 -177 3 -226 -6 -240 -43 -13 -34 -12 -360 1 -407 16 -57 48 -67 218 -67 108 0 153 -4 200 -19 122 -38 203 -107 262 -223 32 -62 33 -66 39 -238 6 -182 12 -210 53 -232 27 -15 399 -13 428 2 36 20 43 52 47 203 5 176 -2 228 -32 264 -23 27 -25 27 -192 34 -185 8 -204 12 -294 60 -228 121 -301 454 -152 685 45 70 115 134 180 166 41 20 69 23 221 30 96 4 187 12 203 19 47 19 59 57 65 198 7 161 -1 233 -32 269 -23 27 -23 27 -172 28 -81 1 -173 -1 -203 -5z"></path><path d="M1515 2961 c-40 -17 -43 -31 -47 -221 l-3 -185 -38 -72 c-48 -90 -125 -164 -213 -205 -63 -30 -74 -31 -247 -39 -175 -8 -182 -9 -207 -34 l-25 -25 0 -200 0 -199 28 -28 27 -28 153 -1 c90 0 170 -6 197 -13 184 -53 297 -191 330 -408 31 -197 -81 -399 -270 -490 -67 -33 -85 -37 -176 -41 -84 -4 -114 -1 -172 17 -132 40 -247 138 -306 261 -31 65 -31 66 -31 232 l0 167 -28 28 -27 28 -205 0 c-272 0 -250 22 -250 -250 l0 -205 25 -25 c34 -33 100 -41 206 -25 94 15 153 7 233 -32 60 -29 162 -127 216 -208 l45 -68 1 -158 c1 -266 0 -266 291 -262 174 3 199 5 215 21 16 16 18 39 18 200 0 182 0 182 30 242 40 81 152 193 230 230 59 29 64 29 231 30 187 1 214 8 235 63 6 15 9 103 7 214 -4 247 11 231 -221 239 -109 4 -189 12 -219 22 -158 50 -249 168 -284 369 -41 234 23 385 213 509 l67 44 116 3 c79 3 136 -1 183 -12 248 -58 394 -260 372 -515 -13 -152 -7 -171 62 -197 38 -15 68 -16 216 -10 186 7 211 14 224 64 4 15 8 101 8 192 0 259 -2 261 -247 257 l-163 -2 -60 30 c-69 35 -190 150 -232 222 -27 47 -28 52 -33 240 -7 257 14 237 -253 240 -111 1 -211 -2 -222 -6z"></path><path d="M3540 2879 c-177 -23 -317 -116 -390 -260 -65 -127 -65 -127 -65 -649 l0 -475 27 -80 c63 -184 173 -289 354 -335 72 -19 112 -20 626 -20 l548 0 -2 538 -3 537 -387 3 -388 2 0 -200 0 -200 195 0 195 0 0 -145 0 -145 -320 0 c-348 0 -361 2 -412 56 -15 16 -32 42 -37 57 -7 18 -11 164 -11 408 0 401 2 422 48 472 47 52 42 52 567 57 l490 5 0 190 0 190 -485 1 c-267 1 -514 -2 -550 -7z"></path><path d="M4787 2884 c-4 -4 -7 -416 -7 -916 l0 -908 225 0 225 0 0 390 0 390 385 0 385 0 0 -390 0 -390 220 0 220 0 -2 913 -3 912 -217 3 -218 2 0 -365 0 -365 -385 0 -385 0 -2 363 -3 362 -216 3 c-118 1 -218 -1 -222 -4z"></path><path d="M6610 2618 l0 -273 215 215 215 215 0 57 0 58 -215 0 -215 0 0 -272z"></path><path d="M6822 2427 l-212 -212 0 -578 0 -577 215 0 215 0 0 790 c0 435 -1 790 -3 790 -1 0 -98 -96 -215 -213z"></path><path d="M1560 2229 c-81 -16 -85 -25 -88 -223 -5 -264 0 -270 223 -281 168 -8 249 -28 325 -83 127 -91 212 -286 197 -450 -16 -164 -179 -359 -341 -407 -40 -12 -79 -14 -186 -9 -151 8 -192 -3 -210 -52 -6 -14 -10 -109 -10 -210 l0 -186 30 -29 30 -30 210 3 c202 3 210 4 232 26 21 21 22 29 18 110 -10 202 -6 243 28 315 38 82 112 162 210 228 l74 49 174 0 c182 0 223 8 238 45 11 30 7 392 -5 418 -18 39 -50 47 -194 47 -74 0 -158 5 -187 11 -114 24 -212 89 -266 178 -52 84 -63 133 -71 306 -8 182 -17 207 -80 225 -43 12 -288 11 -351 -1z"></path><path d="M6110 865 c0 -33 2 -35 35 -35 33 0 35 2 35 35 0 33 -2 35 -35 35 -33 0 -35 -2 -35 -35z"></path><path d="M3590 625 l0 -265 35 0 35 0 0 265 0 265 -35 0 -35 0 0 -265z"></path><path d="M4668 785 c-11 -40 -15 -45 -40 -45 -24 0 -28 -4 -28 -30 0 -25 4 -30 24 -30 l24 0 4 -141 c3 -140 3 -141 31 -165 45 -39 137 -31 137 12 0 21 -5 24 -35 24 -48 0 -55 19 -55 154 l0 116 45 0 c43 0 45 1 45 30 0 29 -2 30 -45 30 l-45 0 0 45 c0 41 -2 45 -25 45 -21 0 -27 -7 -37 -45z"></path><path d="M3227 726 c-80 -29 -111 -80 -111 -181 1 -104 38 -162 119 -184 85 -23 162 -6 215 47 l35 36 -35 7 c-28 6 -39 4 -57 -13 -16 -15 -40 -23 -77 -26 -51 -4 -57 -2 -86 26 -20 21 -30 40 -30 61 l0 31 145 0 c164 0 158 -3 134 83 -28 103 -139 153 -252 113z m136 -58 c28 -15 46 -38 47 -60 0 -16 -12 -18 -105 -18 -97 0 -105 2 -105 19 0 11 14 31 31 45 34 29 93 35 132 14z"></path><path d="M3867 726 c-80 -29 -111 -80 -111 -181 1 -104 38 -162 119 -184 85 -23 162 -6 215 47 l35 36 -35 7 c-28 6 -39 4 -57 -13 -16 -15 -40 -23 -77 -26 -51 -4 -57 -2 -86 26 -20 21 -30 40 -30 61 l0 31 145 0 c164 0 158 -3 134 83 -28 103 -139 153 -252 113z m136 -58 c28 -15 46 -38 47 -60 0 -16 -12 -18 -105 -18 -97 0 -105 2 -105 19 0 11 14 31 31 45 34 29 93 35 132 14z"></path><path d="M4305 725 c-84 -29 -127 -128 -104 -235 23 -108 124 -162 241 -130 48 14 93 52 107 90 10 30 9 30 -25 30 -27 0 -43 -8 -68 -35 -28 -29 -40 -35 -75 -35 -33 0 -49 6 -71 28 -53 53 -49 178 7 221 43 35 135 22 148 -21 5 -13 16 -18 46 -18 49 0 51 16 8 64 -47 54 -131 70 -214 41z"></path><path d="M4900 550 l0 -190 34 0 33 0 5 118 c7 158 30 202 107 202 28 0 31 3 31 31 0 31 0 32 -42 26 -41 -5 -55 -16 -85 -63 -10 -16 -12 -13 -12 24 -1 41 -2 42 -36 42 l-35 0 0 -190z"></path><path d="M5281 728 c-83 -23 -124 -84 -125 -183 0 -125 69 -190 200 -190 60 1 78 5 111 27 94 62 109 224 29 304 -49 49 -134 66 -215 42z m148 -76 c19 -18 30 -43 35 -73 7 -45 5 -55 -16 -112 -28 -74 -163 -75 -196 -2 -16 34 -15 134 2 164 18 33 53 50 104 51 35 0 49 -6 71 -28z"></path><path d="M5640 550 l0 -190 34 0 34 0 4 118 c5 129 18 170 63 190 62 28 118 5 135 -56 5 -20 10 -85 10 -144 l0 -108 36 0 35 0 -3 154 -3 155 -29 30 c-53 55 -154 53 -212 -6 l-34 -34 0 41 c0 39 -1 40 -35 40 l-35 0 0 -190z"></path><path d="M6110 550 l0 -190 35 0 35 0 0 190 0 190 -35 0 -35 0 0 -190z"></path><path d="M6385 725 c-84 -29 -127 -128 -104 -235 23 -108 124 -162 241 -130 48 14 93 52 107 90 10 30 9 30 -25 30 -27 0 -43 -8 -68 -35 -28 -29 -40 -35 -75 -35 -33 0 -49 6 -71 28 -53 53 -49 178 7 221 43 35 135 22 148 -21 5 -13 16 -18 46 -18 49 0 51 16 8 64 -47 54 -131 70 -214 41z"></path><path d="M6785 725 c-22 -8 -41 -15 -42 -15 -9 0 -33 -64 -33 -88 0 -53 46 -85 150 -104 66 -11 100 -31 100 -58 0 -60 -153 -70 -195 -13 -8 11 -19 12 -44 6 l-32 -8 23 -35 c36 -53 127 -73 224 -49 106 27 128 146 36 193 -15 8 -54 19 -87 26 -99 20 -130 51 -83 84 35 25 104 21 132 -7 18 -18 32 -23 55 -19 17 2 31 6 31 8 0 19 -30 59 -54 71 -43 22 -133 26 -181 8z"></path></g></svg></a></div><div class="flex-1 text-center"> © GHI Electronics </div><div class="text-4xl flex space-x-4"><a href="https://www.facebook.com/ghielectronics/" target="_blank"><i class="fab fa-facebook-square"></i></a><a href="https://www.twitter.com/GHIElectronics" target="_blank"><i class="fab fa-twitter-square"></i></a><a href="https://www.youtube.com/user/GHIElectronics" target="_blank"><i class="fab fa-youtube-square"></i></a><a href="https://www.linkedin.com/company/ghielectronics/" target="_blank"><i class="fab fa-linkedin"></i></a></div>',3)];ue.render=function(e,t){return r(),c("div",he,pe)};const fe={id:"menu-bar"},me={id:"tool-bar"},ge=m("div",{id:"tab-bar"},null,-1),we={id:"progress-bar"},ve={id:"editor"},ye={class:"h-full flex flex-col"},be={class:"px-4 py-2 pl-[42px]"},ke={id:"info-bar"},xe={key:0},Ce={id:"direct-panel"},Le=["onKeyup"],ze=m("i",{class:"fas fa-fw fa-arrow-right"},null,-1),Me={id:"side-panel",class:"space-y-2"},Ee=m("i",{class:"fas fa-fw fa-ban"},null,-1),Be={key:0,class:"p-2 whitespace-pre-wrap"},_e={id:"footer"},Pe={setup(e){const o={editor:null,input:null,progress:null},l=p(""),d=p(""),u=p(""),f=p(1),v=p(1),y=p("javascript"),k=z(new S),x=p("light"),L={animation:"fade",appendTo:document.body,interactive:!0,placement:"bottom",theme:"light"};let R=[];const $=t((()=>!k.isConnected||k.isBusy||k.isTalking)),D=t({get:()=>k.output.filter((e=>e&&["\n","$",">","&"].every((t=>!e.startsWith(t))))).join("\n"),set(e){k.output=e}});function T(){if(!l.value.length)return;const e=new Blob([l.value],{type:"text/csv"}),t=window.document.createElement("a");t.href=window.URL.createObjectURL(e),t.download="due-code.txt",document.body.appendChild(t),t.click(),document.body.removeChild(t)}async function A(){console.log("sendRecordMode"),u.value=l.value,o.progress.style.width="0",o.progress.classList.remove("opacity-0");const e=await k.write("pgmstream()","&");console.log(e);const t=l.value.replace(/\r/gm,"").replace(/\t/gm," ").split(/\n/);let s=0;for(let a of t)0===a.trim().length&&(a=" "),await k.stream(a+"\n"),o.progress.style.width=Math.trunc(++s/t.length*100)+"%";o.progress.style.width="100%",await k.stream("\0"),await k.readUntil(),o.progress.classList.add("opacity-0")}async function U(){console.log("sendDirectMode"),await k.write(">");const e=d.value.replace(/\t/gm," ");await k.write(e),d.value="",o.input.focus()}async function W(){console.log("sendRun"),await k.write("run")}async function j(){console.log("sendList");const e=(await k.write("list")).join("\n");l.value!==e&&(l.value=e,u.value=e)}async function I(){console.log("testPrint");l.value=["For i=0 to 10","  Print(i)","Next"].join("\n")}async function O(){console.log("demoLed");l.value=["@Loop","  DWrite(108,1) : Wait(250)","  DWrite(108,0) : Wait(250)","Goto Loop"].join("\n")}async function G(){console.log("sendEscape"),await k.escape()}function H(e){e.setShowPrintMargin(!1),e.setOptions({fontSize:"16px"}),e.session.selection.on("changeCursor",(()=>{const t=e.getCursorPosition();f.value=t.row+1,v.value=t.column+1}))}function V(e,t=!1){e&&a((()=>{e._tippy?(e._tippy.setContent(e.getAttribute("data-tippy-content")),t&&e._tippy.show()):(L.theme=x.value,M([e],L))}))}function N(){R.forEach((e=>e.setProps({theme:x.value})))}return s((()=>k.isConnected),(()=>{const e=document.getElementById("plugBtn");e&&V(e)})),("dark"===localStorage.theme||!("theme"in localStorage)&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(x.value="dark",L.theme="dark"),i((()=>R=M("[data-tippy-content]",L))),(e,t)=>(r(),c(q,null,[m("div",fe,[g(F,{onDemoLed:O,onDemoCount:I})]),m("div",me,[g(ie,{theme:x.value,"onUpdate:theme":[t[0]||(t[0]=e=>x.value=e),N],"can-download":l.value.length>0,"can-list":""===l.value,"can-play":""!==l.value&&l.value===u.value,"can-record":l.value.length>0&&l.value!==u.value,disabled:h($),"is-connected":h(k).isConnected,onConnect:t[1]||(t[1]=e=>h(k).connect()),onDisconnect:t[2]||(t[2]=e=>h(k).disconnect()),onDownload:T,onPlay:W,onStop:G,onRecord:A,onList:j,onUpdateTippy:V},null,8,["theme","can-download","can-list","can-play","can-record","disabled","is-connected"])]),ge,m("div",we,[m("div",{ref:e=>o.progress=e,class:"h-full bg-sky-400 dark:bg-lime-400 transition duration-1000 ease-linear opacity-0"},null,512)]),m("div",ve,[m("div",ye,[g(h(E),{value:l.value,"onUpdate:value":t[3]||(t[3]=e=>l.value=e),lang:y.value,ref:e=>o.editor=e,theme:"dark"===x.value?"tomorrow_night_bright":"crimson_editor",class:"w-full flex-1",onInit:H},null,8,["value","lang","theme"]),m("div",be,[m("div",ke,[h(k).version?(r(),c("div",xe,C(h(k).version),1)):B("",!0)])])])]),m("div",Ce,[n(m("input",{"onUpdate:modelValue":t[4]||(t[4]=e=>d.value=e),class:"flex-1 xl:max-w-[50%]",placeholder:"Code to run immediately...",type:"text",onKeyup:P(U,["enter"])},null,40,Le),[[_,d.value]]),g(Y,{disabled:h($),"data-tippy-content":"Execute",onClick:U},{default:w((()=>[ze])),_:1},8,["disabled"])]),m("div",Me,[g(de,{title:"Output"},{buttons:w((()=>[g(Y,{disabled:!h(D).length,onClick:t[5]||(t[5]=b((e=>D.value=[]),["stop"]))},{default:w((()=>[Ee])),_:1},8,["disabled"])])),default:w((()=>[h(D).length?(r(),c("div",Be,C(h(D)),1)):B("",!0)])),_:1})]),m("div",_e,[g(ue)])],64))}};window.ace=R;const qe=$(Pe);qe.use(D),qe.mount("#app");
