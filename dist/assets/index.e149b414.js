import{r as e,o,c as t,a as r,b as n,d as s,e as l}from"./vendor.42433f01.js";!function(e=".",o="__import__"){try{self[o]=new Function("u","return import(u)")}catch(t){const r=new URL(e,location),n=e=>{URL.revokeObjectURL(e.src),e.remove()};self[o]=e=>new Promise(((t,s)=>{const l=new URL(e,r);if(self[o].moduleMap[l])return t(self[o].moduleMap[l]);const a=new Blob([`import * as m from '${l}';`,`${o}.moduleMap['${l}']=m;`],{type:"text/javascript"}),i=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(a),onerror(){s(new Error(`Failed to import: ${e}`)),n(i)},onload(){t(self[o].moduleMap[l]),n(i)}});document.head.appendChild(i)})),self[o].moduleMap={}}}("/assets/");var a="/assets/logo.5d628fba.jpg";const i={components:{logo:a},setup:()=>({logo:a})},c={id:"app"};let d;i.render=function(n,s,l,a,i,d){const p=e("router-view");return o(),t("div",c,[r("img",{src:a.logo,alt:""},null,8,["src"]),r(p)])};const p={},u=n({history:s(),routes:[{path:"/",component:()=>function(e,o){if(!o)return e();if(void 0===d){const e=document.createElement("link").relList;d=e&&e.supports&&e.supports("modulepreload")?"modulepreload":"preload"}return Promise.all(o.map((e=>{if(e in p)return;p[e]=!0;const o=e.endsWith(".css"),t=o?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${t}`))return;const r=document.createElement("link");return r.rel=o?"stylesheet":d,o||(r.as="script",r.crossOrigin=""),r.href=e,document.head.appendChild(r),o?new Promise(((e,o)=>{r.addEventListener("load",e),r.addEventListener("error",o)})):void 0}))).then((()=>e()))}((()=>__import__("./HelloWorld.657bffe2.js")),["/assets/HelloWorld.657bffe2.js","/assets/HelloWorld.c867557d.css","/assets/vendor.42433f01.js"])}]});l(i).use(u).mount("#app");
