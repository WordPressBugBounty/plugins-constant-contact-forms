/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 30:
/***/ (function() {

/**
 * Front-end form validation.
 *
 * @since 1.0.0
 */

window.CTCTSupport = {};
(function (window, app) {
  /**
   * @constructor
   *
   * @author Constant Contact
   * @since 1.0.0
   */
  app.init = function () {
    app.cache();
    app.bindEvents();
  };

  /**
   * Cache DOM elements.
   *
   * @author Constant Contact
   * @since 1.0.0
   */
  app.cache = function () {
    app.cache = {
      forms: []
    };
    var wrapper = document.querySelectorAll('.ctct-form-wrapper');
    if (wrapper.length) {
      wrapper.forEach(function (formWrapper) {
        var found = formWrapper.querySelector('form');
        if (found) {
          app.cache.forms.push(found);
        }
      });
    }
    app.cache.forms.forEach(function (form, index) {
      app.cache.forms[index].honeypot = form.querySelector('.ctct_usage_field');
      app.cache.forms[index].submitButton = form.querySelector('input[type=submit]');
      app.cache.forms[index].recaptcha = form.querySelector('.g-recaptcha');
    });
    app.timeout = null;
  };

  /**
   * Remove the ctct-invalid class from elements that have it.
   *
   * @author Constant Contact
   * @since 1.0.0
   */
  app.setAllInputsValid = function () {
    app.cache.forms.forEach(function (form) {
      var invalid = form.querySelectorAll('.ctct-invalid');
      Array.from(invalid).forEach(function (field) {
        field.classList.remove('ctct-invalid');
      });
    });
  };

  /**
   * Adds .ctct-invalid HTML class to inputs whose values are invalid.
   *
   * @author Constant Contact
   * @since 1.0.0
   *
   * @param {object} error AJAX response error object.
   */
  app.processError = function (error) {
    // If we have an id property set.
    if ('undefined' !== typeof error.id) {
      var invalid = document.querySelectorAll('#' + error.id);
      Array.from(invalid).forEach(function (theInvalid) {
        theInvalid.classList.add('ctct-invalid');
      });
    }
  };

  /**
   * Check the value of the hidden honeypot field; disable form submission button if anything in it.
   *
   * @author Constant Contact
   * @since 1.0.0
   *
   * @param {object} event The change or keyup event triggering this callback.
   * @param {object} honeyPot The object for the actual input field being checked.
   * @param {object} submitButton The object for the submit button in the same form as the honeypot field.
   */
  app.checkHoneypot = function (event, honeyPot, submitButton) {
    // If there is text in the honeypot, disable the submit button.

    // Leaving this disabling in place because it should not be getting used by screen readers in the first place, and I feel it's going to help more than hurt to keep.
    if (0 < honeyPot.value.length) {
      submitButton.setAttribute('disabled', 'disabled');
    } else {
      submitButton.removeAttribute('disabled');
    }
  };

  /**
   * Ensures that we should use AJAX to process the specified form, and that all required fields are not empty.
   *
   * @author Constant Contact
   * @since 1.0.0
   *
   * @param {object} form object for the form being validated.
   * @return {boolean} False if AJAX processing is disabled for this form or if a required field is empty.
   */
  app.validateSubmission = function (form) {
    if ('on' !== form.getAttribute('data-doajax')) {
      return false;
    }
    var fields = form.querySelectorAll('[required]');
    Array.from(fields).forEach(function (field) {
      if (false === field.checkValidity()) {
        return false;
      }
    });
    return true;
  };

  /**
   * Prepends form with a message that fades out in 5 seconds.
   *
   * @author Constant Contact
   * @since 1.0.0
   *
   * @param {object} form object for the form a message is being displayed for.
   * @param {string} message The message content.
   * @param {string} classes Optional. HTML classes to add to the message wrapper.
   * @param {string} role Role attribute for accessibility.
   */
  app.showMessage = function (form, message) {
    var classes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var role = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'log';
    var wrapper = form.parentElement;
    if (wrapper.querySelector('p.ctct-message')) {
      wrapper.querySelector('p.ctct-message').remove();
    }
    var message_tag = document.createElement('p');
    message_tag.setAttribute('class', 'ctct-message ' + classes);
    message_tag.setAttribute('role', role);
    message_tag.innerHTML = message;
    var dismiss_btn = document.createElement('button');
    dismiss_btn.setAttribute('class', 'button button-secondary ctct-dismiss ctct-dismiss-ajax-notice');
    dismiss_btn.setAttribute('aria-label', 'Dismiss notification');
    dismiss_btn.innerHTML = '&#10005;';
    message_tag.prepend(dismiss_btn);
    form.parentElement.prepend(message_tag);
    wrapper.querySelector('.ctct-dismiss-ajax-notice').addEventListener('click', function () {
      this.parentElement.remove();
    });
  };

  /**
   * Submits the actual form via AJAX.
   *
   * @author Constant Contact
   * @since 1.0.0
   *
   * @param {object} form object for the form being submitted.
   */
  app.submitForm = function (form) {
    var data = new FormData();
    var formData = new FormData(form);
    var formParams = new URLSearchParams(formData);
    data.append('action', 'ctct_process_form');
    data.append('data', formParams);
    var options = {
      method: 'POST',
      body: data
    };
    fetch(window.ajaxurl, options).then(function (response) {
      return response.json();
    }).then(function (response) {
      if ('undefined' === typeof response.status) {
        return false;
      }
      if ('success' !== response.status) {
        if ('undefined' !== typeof response.errors) {
          app.setAllInputsValid();
          response.errors.forEach(app.processError);
        } else {
          app.showMessage(form, response.message, 'ctct-error', 'alert');
        }
        return false;
      }
      form.style.display = 'none';
      // If we're here, the submission was a success; show message and reset form fields.
      app.showMessage(form, response.message, 'ctct-success', 'status');
      form.reset();
    });
  };

  /**
   * Handle the form submission.
   *
   * @author Constant Contact
   * @since 1.0.0
   *
   * @param {object} event The submit event.
   * @param {object} form object for the current form being handled.
   * @return {boolean} False if unable to validate the form.
   */
  app.handleSubmission = function (event, form) {
    if (!app.validateSubmission(form)) {
      return false;
    }
    clearTimeout(app.timeout);
    if (form.checkValidity()) {
      app.timeout = setTimeout(app.submitForm, 500, form);
    }
  };

  /**
   * Set up event bindings and callbacks.
   *
   * @author Constant Contact
   * @since 1.0.0
   */
  app.bindEvents = function () {
    app.cache.forms.forEach(function (form) {
      var thesubmit = form.querySelector('[type=submit]');
      thesubmit.addEventListener('click', function (event) {
        var doingajax = form.getAttribute('data-doajax');
        if (doingajax && 'on' === doingajax) {
          event.preventDefault();
          app.handlerecaptcha(form);
        }
        if (form.classList.contains('ctct-submitted')) {
          return;
        }
        form.classList.add('ctct-submitted');
        app.handleSubmission(event, form);
        form.classList.remove('ctct-submitted');
      });
      form.honeypot.addEventListener('change', function (event) {
        app.checkHoneypot(event, form.honeypot, form.submitButton);
      });
      form.honeypot.addEventListener('keyup', function (event) {
        app.checkHoneypot(event, form.honeypot, form.submitButton);
      });
    });
  };

  /**
   * Custom handling within our validation file, for cases of reCAPTCHA v3 + AJAX submit.
   *
   * @param form Form being submitted.
   */
  app.handlerecaptcha = function (form) {
    if ('undefined' === typeof recaptchav3) {
      return;
    }
    if ('undefined' === typeof recaptchav3.site_key) {
      return;
    }
    if ('undefined' === typeof grecaptcha) {
      return;
    }
    grecaptcha.ready(function () {
      try {
        grecaptcha.execute(recaptchav3.site_key, {
          action: 'constantcontactsubmit'
        }).then(function (token) {
          var recaptchaResponse = document.createElement('input');
          recaptchaResponse.setAttribute('type', 'hidden');
          recaptchaResponse.setAttribute('name', 'g-recaptcha-response');
          recaptchaResponse.setAttribute('value', token);
          form.append(recaptchaResponse.cloneNode(true));
        });
      } catch (error) {
        console.log(error);
      }
    });
  };
  app.init();
})(window, window.CTCTSupport);

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
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(30);
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_validation__WEBPACK_IMPORTED_MODULE_0__);

}();
/******/ })()
;
//# sourceMappingURL=ctct-plugin-frontend.js.map