import{r as e,o as r,c as t,a as o,b as s,d as n,e as a}from"./vendor.e9e69801.js";!function(e=".",r="__import__"){try{self[r]=new Function("u","return import(u)")}catch(t){const o=new URL(e,location),s=e=>{URL.revokeObjectURL(e.src),e.remove()};self[r]=e=>new Promise(((t,n)=>{const a=new URL(e,o);if(self[r].moduleMap[a])return t(self[r].moduleMap[a]);const c=new Blob([`import * as m from '${a}';`,`${r}.moduleMap['${a}']=m;`],{type:"text/javascript"}),l=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(c),onerror(){n(new Error(`Failed to import: ${e}`)),s(l)},onload(){t(self[r].moduleMap[a]),s(l)}});document.head.appendChild(l)})),self[r].moduleMap={}}}("assets/");var c="./assets/logo.5d628fba.jpg",l="./assets/refer1.3f2e1869.png";const i={components:{logo:c,refer:l},setup:()=>({logo:c,refer:l})},p={id:"app"};let d;i.render=function(s,n,a,c,l,i){const d=e("router-view");return r(),t("div",p,[o(d),o("img",{class:"refer1",src:c.refer,alt:""},null,8,["src"])])};const m={},u=function(e,r){if(!r)return e();if(void 0===d){const e=document.createElement("link").relList;d=e&&e.supports&&e.supports("modulepreload")?"modulepreload":"preload"}return Promise.all(r.map((e=>{if(e in m)return;m[e]=!0;const r=e.endsWith(".css"),t=r?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${t}`))return;const o=document.createElement("link");return o.rel=r?"stylesheet":d,r||(o.as="script",o.crossOrigin=""),o.href=e,document.head.appendChild(o),r?new Promise(((e,r)=>{o.addEventListener("load",e),o.addEventListener("error",r)})):void 0}))).then((()=>e()))},f=s({history:n(),routes:[{path:"/",component:()=>u((()=>__import__("./main.f4f0945c.js")),["./assets/main.f4f0945c.js","./assets/main.991fcbc5.css","./assets/SelectMenu.3c578821.js","./assets/SelectMenu.4864f6e8.css","./assets/vendor.e9e69801.js"])},{path:"/s",component:()=>u((()=>__import__("./SelectMenu.3c578821.js")),void 0)}]});a(i).use(f).mount("#app");