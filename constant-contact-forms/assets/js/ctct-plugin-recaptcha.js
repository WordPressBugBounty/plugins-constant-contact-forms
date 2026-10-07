/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 355:
/***/ (function() {

grecaptcha.ready(function () {
  var forms = document.querySelectorAll('.ctct-form-wrapper form');
  Array.from(forms).forEach(function (form) {
    // Do not attempt to process if form is submitting via ajax.
    var doingajax = form.getAttribute('data-doajax');
    if (doingajax && 'on' === doingajax) {
      return;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      try {
        grecaptcha.execute(recaptchav3.site_key, {
          action: 'constantcontactsubmit'
        }).then(function (token) {
          var recaptchaResponse = document.createElement('input');
          recaptchaResponse.setAttribute('type', 'hidden');
          recaptchaResponse.setAttribute('name', 'g-recaptcha-response');
          recaptchaResponse.setAttribute('value', token);
          form.append(recaptchaResponse.cloneNode(true));

          // Because of how we're ending up submitting at this point. we are losing
          // the original name attribute and "value" from the original submit button.
          // Here we are instead just creating a hidden element with the "ctct-submitted"
          // name attribute to met things proceed on the server.
          var origBtnVal = document.createElement('input');
          origBtnVal.setAttribute('type', 'hidden');
          origBtnVal.setAttribute('name', 'ctct-submitted');
          origBtnVal.setAttribute('value', 'true');
          form.append(origBtnVal);
          form.submit();
        });
      } catch (error) {
        console.log(error);
        return false;
      }
    });
  });
});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function() { return module['default']; } :
/******/ 			function() { return module; };
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = function(exports, definition) {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); };
/******/ 	
/************************************************************************/
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
!function() {
"use strict";
/* harmony import */ var _recaptcha__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(355);
/* harmony import */ var _recaptcha__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_recaptcha__WEBPACK_IMPORTED_MODULE_0__);
// This is the entry point for reCAPTCHA JS. Add JavaScript imports here.

}();
/******/ })()
;
//# sourceMappingURL=ctct-plugin-recaptcha.js.map