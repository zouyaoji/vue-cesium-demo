import{g as e,bt as t}from"./vendor-74282f26.js";import{l as r}from"./vendor-lodash-23577337.js";var n=r,o=t;const i=e((function(e){if("object"!=typeof e)throw new Error("An adapter must be provided, see https://github.com/typicode/lowdb/#usage");var t=n.runInContext(),r=t.chain({});function i(e){return r.__wrapped__=e,r}return t.prototype.write=t.wrap(t.prototype.value,(function(e){var t=e.apply(this);return r.write(t)})),r._=t,r.read=function(){var t=e.read();return o(t)?t.then(i):i(t)},r.write=function(t){var n=e.write(r.getState());return o(n)?n.then((function(){return t})):t},r.getState=function(){return r.__wrapped__},r.setState=function(e){return i(e)},r.read()}));var a=function(e){return JSON.stringify(e,null,2)},u=function e(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=r.defaultValue,o=void 0===n?{}:n,i=r.serialize,u=void 0===i?a:i,s=r.deserialize,c=void 0===s?JSON.parse:s;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.source=t,this.defaultValue=o,this.serialize=u,this.deserialize=c},s=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}();var c=u;const l=e(function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,c),s(t,[{key:"read",value:function(){var e=localStorage.getItem(this.source);return e?this.deserialize(e):(localStorage.setItem(this.source,this.serialize(this.defaultValue)),this.defaultValue)}},{key:"write",value:function(e){localStorage.setItem(this.source,this.serialize(e))}}]),t}());export{l as L,i as l};
