!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("react")):"function"==typeof define&&define.amd?define(["react"],t):"object"==typeof exports?exports.reactSyncStateHook=t(require("react")):e.reactSyncStateHook=t(e.react)}(this,(e=>(()=>{var t={284:e=>{self,e.exports=(()=>{"use strict";var e={d:(t,r)=>{for(var o in r)e.o(r,o)&&!e.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:r[o]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};function r(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function o(e,t,r){return(t=function(e){var t=function(e,t){if("object"!==a(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,"string");if("object"!==a(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"===a(t)?t:String(t)}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,o=new Array(t);r<t;r++)o[r]=e[r];return o}function a(e){return a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a(e)}e.r(t),e.d(t,{createImmutable:()=>i,getImmutableBase:()=>s,getImmutableCopy:()=>l,getImmutableParent:()=>f,getImmutableTarget:()=>y,setHandler:()=>b});var u=Symbol("target");function c(e){var t,a=Object.prototype.toString.call(e).slice(8,-1).toLowerCase();return"array"===a?function(e){if(Array.isArray(e))return n(e)}(t=e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(t)||function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}():"object"===a?function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},e):"date"===a?new Date(e):"regExp"===a?new RegExp(e):e}var i=function(e){var t,r,o,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{set:function(){},get:function(){}},l=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{receiver:null,prop:null};if(r=[void 0,"boolean","number","bigint","string","symbol","function"],o=a(t=e),null===t||y(t)||r.includes(o)||!["object"].includes(o))return e;var p=function(e){var t=Proxy.revocable(e,{get:function(e,t,r){if(e.hasOwnProperty(t)&&!y(e[t])){var o={receiver:r,prop:t},n=e.handler;e[t]=i(e[t],n,o)}return Reflect.get(e,t,r)},set:function(e,t,r,o){return Reflect.set(e,t,r,o)}});return{proxy:t.proxy,revoke:t.revoke}}(c(e)),s={isImmutable:!0,base:e,copy:e,parent:l.receiver,prop:l.prop,proxy:p.proxy,revoke:p.revoke,handler:n,setLog:l.receiver?y(l.receiver).setLog:[]},f=Proxy.revocable(s,{get:function(e,t,r){if(t===u)return e;var o=e.handler;return o&&o.get&&o.get(e,t,r),Reflect.get(e.proxy,t,r)},set:function(e,t,r,o){e.setLog.push({receiver:o,prop:t,newValue:r});var n=e.handler;return n&&n.set&&n.set(e,t,r,o),Reflect.set(e.proxy,t,r,e.proxy)}}),b=f.proxy;return f.revoke,b};function l(e){var t=y(e);return t?(0===t.setLog.length||(t.setLog.forEach((function(e){var t=e.receiver,r=e.prop,o=e.newValue,n=y(p(t)),a=y(o);n.copy[r]=o&&a?a.copy:o})),t.setLog.length=0),t.copy):e}function p(e){var t=y(e),r=y(t.parent);return!t||!t.parent&&t.copy!==t.base?e:t.copy!==t.base&&r&&r.copy!==r.base?(r.copy[t.prop]=t.copy,e):(t.copy===t.base&&(t.copy=c(t.copy)),r&&(r.copy=c(r.copy),r.copy[t.prop]=t.copy),p(t.parent),e)}function y(e){return!(!e||!e[u])&&e[u]}function s(e){var t=y(e);return t?t.base:e}function f(e){var t=y(e);return t?t.parent:e}function b(e,t){var r=y(e);r&&(r.handler.get=t&&t.get||r.handler.get,r.handler.set=t&&t.set||r.handler.set)}return t})()},156:t=>{"use strict";t.exports=e}},r={};function o(e){var n=r[e];if(void 0!==n)return n.exports;var a=r[e]={exports:{}};return t[e](a,a.exports,o),a.exports}o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var n={};return(()=>{"use strict";o.r(n),o.d(n,{_getImmutableCopy_:()=>i,useSyncMemo:()=>c,useSyncState:()=>u});var e=o(156),t=o(284);let r=!1,a=[];const u=o=>{const[n,u]=(0,e.useState)(o);let c=(0,t.createImmutable)({current:n},{get(e,o,n){if(r){let e=n,r=(0,t.getImmutableParent)(e);for(;r;)e=r,r=(0,t.getImmutableParent)(e);a.push(e)}}});return[n,(0,e.useCallback)((e=>{const r="function"==typeof e?e(c.current):e;c.current=r,u((0,t.getImmutableCopy)(r))}),[]),c]},c=(o,n)=>{let u,c=!1,i=[];if(n)u=o(),n?.forEach((e=>{i.push((0,t.getImmutableBase)(e).current),(0,t.setHandler)(e,{set(){c=!0}})}));else{r=!0,a=[],u=o();const e=[...new Set(a)];a=[],r=!1,e.forEach((e=>{i.push((0,t.getImmutableBase)(e).current),(0,t.setHandler)(e,{set(){c=!0}})}))}const l=(0,e.useMemo)((()=>(0,t.getImmutableCopy)(u)),i);let p=(0,t.createImmutable)({current:l},{get(){c&&(u=o(),c=!1,p.current=u)}});return[l,p]},i=t.getImmutableCopy})(),n})()));