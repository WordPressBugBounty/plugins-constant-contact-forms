!function(){"use strict";var t=window.wp.blocks;function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},e(t)}function n(t){var n=function(t,n){if("object"!==e(t)||null===t)return t;var o=t[Symbol.toPrimitive];if(void 0!==o){var r=o.call(t,"string");if("object"!==e(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"===e(n)?n:String(n)}var o=window.React,r=window.wp.i18n,c=window.wp.data,l=window.wp.blockEditor,a=window.wp.components;function i(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,o)}return n}var s=JSON.parse('{"u2":"constant-contact/single-contact-form"}');(0,t.registerBlockType)(s.u2,{edit:function(t){var e,s=t.attributes,u=s.selectedForm,m=s.displayTitle,f=t.setAttributes,p=(0,l.useBlockProps)({className:"ctct-block-container"}),b=(0,c.useSelect)((function(t){return t("core").getEntityRecords("postType","ctct_forms",{per_page:-1})}),[]);if(b){var d=(e=b.map((function(t){return{label:t.title.rendered,value:t.id}})))&&0===e.length;e.unshift({label:(0,r.__)("Select Form","constant-contact-forms"),value:0,disabled:d})}var v=e&&e.length>1?(0,r.__)("Choose the form to display with the dropdown below.","constant-contact-forms"):(0,r.__)("Please create a Constant Contact Form.","constant-contact-forms");return(0,o.createElement)("div",function(t){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{};e%2?i(Object(o),!0).forEach((function(e){var r,c,l;r=t,c=e,l=o[e],(c=n(c))in r?Object.defineProperty(r,c,{value:l,enumerable:!0,configurable:!0,writable:!0}):r[c]=l})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):i(Object(o)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}({},p),!e&&(0,o.createElement)(a.Spinner,null),e&&(0,o.createElement)("div",null,(0,o.createElement)("div",{className:"ctct-block-container--header"},(0,o.createElement)("img",{alt:(0,r.__)("Constant Contact Forms","constant-contact-forms"),src:"https://images.ctfassets.net/t21gix3kzulv/78gf1S3CjPrnl9rURf6Q8w/3c20fb510dd4d4653feddf86ece35e1a/ctct_ripple_logo_horizontal_white_orange.svg"})),(0,o.createElement)("div",{className:"ctct-block-container--selection"},(0,o.createElement)("small",null,(0,r.__)("Display Form Title","constant-contact-forms")),(0,o.createElement)("div",{className:"ctct-block-container--component"},(0,o.createElement)(a.SelectControl,{value:m,options:[{label:(0,r.__)("Display Title","constant-contact-forms"),value:"true"},{label:(0,r.__)("Hide Title","constant-contact-forms"),value:"false"}],onChange:function(t){return f({displayTitle:t})}}))),(0,o.createElement)("div",{className:"ctct-block-container--selection"},(0,o.createElement)("small",null,v),(0,o.createElement)("div",{className:"ctct-block-container--component"},(0,o.createElement)(a.SelectControl,{label:(0,r.__)("Chosen form","constant-contact-forms"),value:null!=u?u:"",options:e,onChange:function(t){return f({selectedForm:t})}})))))},save:function(){return null}})}();