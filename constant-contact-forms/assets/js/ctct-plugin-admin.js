/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 108:
/***/ (function() {

window.CTCTAJAX = {};
(function (window, that) {
  /**
   * @constructor
   *
   * @author Constant Contact
   * @since 1.0.0
   */
  that.init = function () {
    // Trigger any field modifications we need to do.
    that.handleReviewAJAX();
    that.handleAPITest();
  };

  // Handle saving the decision regarding the review prompt admin notice.
  that.handleReviewAJAX = function () {
    var reviewRequest = document.querySelector('#ctct-admin-notice-review_request');
    if (reviewRequest) {
      reviewRequest.addEventListener('click', function (e) {
        e.preventDefault();
        var ctctAction;
        if (e.target.matches('button.notice-dismiss')) {
          ctctAction = 'dismissed';
        } else if (e.target.matches('.ctct-review')) {
          ctctAction = 'reviewed';
        }
        var data = new FormData();
        data.append('action', 'constant_contact_review_ajax_handler');
        data.append('ctct_review_action', ctctAction);
        if (reviewRequest.dataset.nonce) {
          data.append('ctct_nonce', reviewRequest.dataset.nonce);
        }
        fetch(window.ajaxurl, options = {
          method: 'POST',
          body: data
        }).then(function (response) {
          return response.json();
        }).then(function (response) {
          if (response.success) {
            reviewRequest.style.display = 'none';
          }
        }).catch(function (error) {
          console.log(error);
        });
      });
    }
  };
  that.handleAPITest = function () {
    var apitestlink = document.querySelector('#ctct-test-api');
    if (apitestlink) {
      apitestlink.addEventListener('click', function (e) {
        e.preventDefault();
        var data = new FormData();
        data.append('action', 'constant_contact_test_api_ajax_handler');
        var params = new URLSearchParams(e.target.href);
        if (params.get('ctct-test-connection')) {
          data.append('ctct-test-connection-nonce', params.get('ctct-test-connection'));
        }
        fetch(window.ajaxurl, options = {
          method: 'POST',
          body: data
        }).then(function (response) {
          return response.json();
        }).then(function (response) {
          var successDOM = document.querySelector('#ctct-test-api-result');
          successDOM.innerHTML = response.data.is_connected;
          successDOM.setAttribute('class', '');
          if (response.success) {
            successDOM.classList.add('success');
          } else {
            successDOM.classList.add('no-success');
          }
        }).catch(function (error) {
          console.log(error);
        });
      });
    }
  };
  that.init();
})(window, window.CTCTAJAX);

/***/ }),

/***/ 267:
/***/ (function() {

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
window.CTCTBuilder = {};
(function (window, $, that) {
  var required_items;

  /**
   * @constructor
   *
   * @author Constant Contact
   * @since 1.0.0
   */
  that.init = function () {
    // If we do actually have an email field set, then remove our error.
    var emailField = document.querySelectorAll('#cmb2-metabox-ctct_2_fields_metabox option[value="email"]');
    var selectedField = Array.from(emailField).filter(function (option) {
      return option.selected;
    });
    if (selectedField.length) {
      var noEmailError = document.querySelector('#ctct-no-email-error');
      if (noEmailError) {
        noEmailError.style.display = 'none';
      }
    }

    // Cache it all.
    that.cache();

    // Bind our events.
    that.bindEvents();

    // Bind our select dropdown events.
    that.selectBinds();

    // Trigger any field modifications we need to do.
    that.modifyFields();

    // Make description non-draggable, so we don't run into weird cmb2 issues.
    var cmb2handle = document.querySelectorAll('#ctct_0_description_metabox h2.hndle');
    if (cmb2handle) {
      Array.from(cmb2handle).forEach(function (hndle) {
        hndle.classList.remove('ui-sortable-handle', 'hndle');
      });
    }

    // Inject our new labels for the up/down CMB2 buttons, so they can be properly localized.
    // Because we're using :after, we can't use .css() to do this, we need to inject a style tag.
    var headTag = document.querySelector('head');
    var styleTag = document.createElement('style');
    styleTag.textContent = "#cmb2-metabox-ctct_2_fields_metabox a.move-up::after { content: \"" + window.ctctTexts.move_up + "\" }";
    styleTag.textContent += "#cmb2-metabox-ctct_2_fields_metabox a.move-down::after { content: \"" + window.ctctTexts.move_down + "\" }";
    headTag.appendChild(styleTag);
  };

  /**
   * Cache DOM elements.
   *
   * @author Constant Contact
   * @since 1.0.0
   */
  that.cache = function () {
    that.cache = {
      window: window,
      body: document.querySelector('body')
    };
    that.isLeaveWarningBound = false;
  };

  // Triggers our leave warning if we modify things in the form.
  that.bindLeaveWarning = function () {
    // Don't double-bind it.
    if (!that.isLeaveWarningBound) {
      // Bind our error that displays before leaving page.
      that.cache.window.addEventListener('beforeunload', that.bindMessage);

      // Save our state.
      that.isLeaveWarningBound = true;
    }
  };

  /**
   * Removes our binding of our leave warning.
   *
   * @author Constant Contact
   * @since 1.0.0
   */
  that.unbindLeaveWarning = function () {
    that.cache.window.removeEventListener('beforeunload', that.bindMessage);
  };

  /**
   * Handles the beforeunload callback and display.
   *
   * @param e beforeunload event.
   * @since 2.8.0
   */
  that.bindMessage = function (e) {
    e.preventDefault();
    e.returnValue = '';
  };

  /**
   * Attach callbacks to events.
   *
   * @author Constant Contact
   * @since 1.0.0
   */
  that.bindEvents = function () {
    var submitted = document.querySelector('#post');
    if (submitted) {
      document.addEventListener('submit', function () {
        var disabledEmails = document.querySelectorAll('.ctct-email-disabled');
        if (disabledEmails) {
          Array.from(disabledEmails).forEach(function (item) {
            item.classList.remove('disabled');
            item.removeAttribute('disabled');
          });
        }
        that.unbindLeaveWarning();
      });
    }
    var cmb2inputs = document.querySelectorAll('.cmb2-wrap input, .cmb2-wrap textarea');
    Array.from(cmb2inputs).forEach(function (input_item) {
      input_item.addEventListener('input', function () {
        if ('undefined' !== typeof tinyMCE) {
          that.bindLeaveWarning();
        }
      });
    });

    // Disable email options on row change trigger.
    // `cmb2_shift_rows_complete` is a custom jQuery based event, so we are leaving this selector.
    $(document).on('cmb2_shift_rows_complete', function () {
      that.modifyFields();
      that.bindLeaveWarning();
      that.removeDuplicateMappings();
    });
    var inlineForm = document.querySelector('#_ctct_inline_display');
    // If we get a row added, then do our stuff.
    // `cmb2_add_row` is a custom jQuery based event, so we are leaving this selector.
    $(document).on('cmb2_add_row', function (newRow) {
      // eslint-disable-line no-unused-vars
      var groupPostBoxes = document.querySelectorAll('#custom_fields_group_repeat .postbox');
      if (groupPostBoxes) {
        var lastBox = _toConsumableArray(groupPostBoxes).pop();
        var boxSelect = lastBox.querySelector('.map select');
        if (boxSelect) {
          boxSelect.value = 'none';
        }
      }
      if (groupPostBoxes.length > 1) {
        inlineForm.checked = false;
        inlineForm.setAttribute('disabled', true);
      }
      that.modifyFields();
      that.selectBinds();
      that.removeDuplicateMappings();
    });
    $(document).on('cmb2_remove_row', function () {
      // eslint-disable-line no-unused-vars
      // Maybe enable inline checkbox.
      var groupPostBoxes = document.querySelectorAll('#custom_fields_group_repeat .postbox');
      if (groupPostBoxes.length === 1) {
        inlineForm.removeAttribute('disabled');
      }
    });
    that.removeDuplicateMappings();
    var cssReset = document.querySelector('#ctct-reset-css');
    if (cssReset) {
      cssReset.addEventListener('click', function (e) {
        e.preventDefault();
        var selectFields = ['#_ctct_form_description_font_size', '#_ctct_form_submit_button_font_size', '#_ctct_form_label_placement'];
        selectFields.forEach(function (fieldSelector) {
          var field = document.querySelector(fieldSelector);
          if (field) {
            field.selectedIndex = 0;
          }
        });
        var textFields = ['#_ctct_form_padding_top', '#_ctct_form_padding_bottom', '#_ctct_form_padding_left', '#_ctct_form_padding_right', '#_ctct_input_custom_classes', '#_ctct_form_max_width'];
        textFields.forEach(function (textSelector) {
          var text = document.querySelector(textSelector);
          if (text) {
            text.value = '';
          }
        });

        // Clear out color pickers.
        var pickerClears = document.querySelectorAll('.wp-picker-clear');
        if (pickerClears) {
          Array.from(pickerClears).forEach(function (picker) {
            picker.click();
          });
        }
      });
    }
    window.addEventListener('load', function () {
      var addressBox = document.querySelector('#address_settings');
      if (addressBox) {
        var includeItems = addressBox.querySelectorAll('.cmb2-id--ctct-address-fields-include input[type="checkbox"]');
        var checkedItems = addressBox.querySelectorAll('.cmb2-id--ctct-address-fields-include input[type="checkbox"]:checked');
        required_items = addressBox.querySelectorAll('.cmb2-id--ctct-address-fields-require input[type="checkbox"]');
        if (checkedItems.length === 0) {
          Array.from(required_items).forEach(function (item) {
            item.setAttribute('disabled', true);
          });
        }
        Array.from(includeItems).forEach(function (item) {
          item.addEventListener('change', that.addressChange);
        });
      }
      var groupPostBoxes = document.querySelectorAll('#custom_fields_group_repeat .postbox');
      if (groupPostBoxes.length > 1) {
        inlineForm.checked = false;
        inlineForm.setAttribute('disabled', true);
      }
    });
  };

  /**
   * Handle the enabled/disabled state of rwquired items when address "include" options change.
   *
   * @param e Checkbox being checked.
   */
  that.addressChange = function (e) {
    var item = e.target;
    if (item.checked) {
      Array.from(required_items).forEach(function (required_item) {
        if (item.value === required_item.value) {
          required_item.removeAttribute('disabled');
        }
      });
    } else {
      Array.from(required_items).forEach(function (required_item) {
        if (item.value === required_item.value) {
          required_item.checked = false;
          required_item.setAttribute('disabled', true);
        }
      });
    }
  };

  /**
   * When .cmb2_select <selects> get changed, do some actions.
   *
   * @author Constant Contact
   * @since 1.0.0
   */
  that.selectBinds = function () {
    // For each fields select.
    var selects = document.querySelectorAll('#cmb2-metabox-ctct_2_fields_metabox .cmb2_select');
    if (selects) {
      Array.from(selects).forEach(function (select) {
        select.addEventListener('change', function () {
          // Modify our fields.
          that.modifyFields();

          // Don't allow duplicate mappings in form.
          that.removeDuplicateMappings();

          // Bind our leave warning.
          that.bindLeaveWarning();
          var customField = document.querySelectorAll('.form-field-is-custom-field');
          if (customField) {
            Array.from(customField).forEach(function (field) {
              field.addEventListener('keyup', that.noUniqueWarning);
            });
          }
        });
      });
    }
  };

  /**
   * Validates whether or not all of our custom field labels all have unique labels.
   */
  that.validateUniqueFieldLabels = function () {
    var cfValuesOrig = document.querySelectorAll('.form-field-is-custom-field');
    var cfValues; // Leaving as `let` since we are need some hoisting.
    if (cfValuesOrig) {
      cfValues = Array.from(cfValuesOrig).map(function (item) {
        return item.value;
      });
    }
    var cfValuesTotal = cfValues.length;
    var cfValuesFiltered = cfValues.filter(function (item, position) {
      return cfValues.indexOf(item) === position;
    });
    var cfValuesFilteredTotal = cfValuesFiltered.length;
    return cfValuesTotal === cfValuesFilteredTotal;
  };

  /**
   * Toggle inline warning that a given custom field label is not a unique value.
   * @param event
   */
  that.noUniqueWarning = function (event) {
    var ctctCustomField = event.currentTarget;
    var siblings = _toConsumableArray(ctctCustomField.parentElement.children);
    if (siblings.length === 0) {
      return;
    }
    if (that.validateUniqueFieldLabels()) {
      siblings.forEach(function (sibling) {
        if (sibling.classList.contains('ctct-warning')) {
          sibling.classList.remove('ctct-warning-no-unqiue');
        }
      });
    } else {
      siblings.forEach(function (sibling) {
        if (sibling.classList.contains('ctct-warning')) {
          sibling.classList.add('ctct-warning-no-unqiue');
        }
      });
    }
  };

  /**
   * We need to manipulate our form builder a bit. We do this here.
   *
   * @author Constant Contact
   * @since 1.0.0
   */
  that.modifyFields = function () {
    // Set that we haven't found an email.
    var foundEmail = false; // Leaving as let due to use as boolean flag.
    var cfnumber = 1; // Leaving as let due to incrementor usage.

    var cmb2GroupAddBtn = document.querySelector('.cmb-add-group-row.button-secondary');
    if (cmb2GroupAddBtn) {
      cmb2GroupAddBtn.classList.remove('button-secondary');
      cmb2GroupAddBtn.classList.add('button-primary');
    }
    var fieldgroups = document.querySelectorAll('#cmb2-metabox-ctct_2_fields_metabox #custom_fields_group_repeat .cmb-repeatable-grouping');
    if (fieldgroups) {
      Array.from(fieldgroups).forEach(function (field, key) {
        var fieldList = field.querySelector('.cmb-field-list');
        var removeButton = fieldList.querySelector('.cmb-remove-group-row');
        var requiredToggle = fieldList.querySelector('.required input[type=checkbox]');
        var requiredRow = requiredToggle.closest('.cmb-row');
        var map = fieldList.querySelector('.map select option:checked');
        var mapName = ''; // Leaving as `let` due to conditional assignment
        if (map && map.text) {
          mapName = map.text;
        }
        var fieldTitle = field.querySelector('h3');
        var fieldLabel = field.querySelector('input[name*="_ctct_field_label"]');
        var fieldDesc = field.querySelector('input[name*="_ctct_field_desc"]');
        if (mapName === 'Custom Text Field') {
          mapName += ' ' + cfnumber.toString();
          cfnumber++;
        }

        // Set our field row to be the name of the selected option.
        fieldTitle.innerText = mapName;
        // If we have a blank field label, then use the name of the field to fill it in.
        if (mapName && 0 === fieldLabel.value.length) {
          fieldLabel.value = mapName;
        }
        fieldLabel.classList.add('ctct-label-filled');
        var fieldDropdown = field.querySelector('select');
        // If we haven't yet found an email field, and this is our email field.
        if (!foundEmail && map !== null) {
          if ('email' === map.value) {
            // Set that we found an email field.
            foundEmail = true;

            // Make it required.
            requiredToggle.checked = true;
            if (fieldDropdown) {
              fieldDropdown.classList.add('disabled', 'ctct-email-disabled');
              fieldDropdown.disabled = true;
            }
            requiredRow.style.display = 'none';
            removeButton.style.display = 'none';
          }
        } else {
          if (fieldDropdown) {
            fieldDropdown.classList.remove('disabled', 'ctct-email-disabled');
            fieldDropdown.disabled = false;
          }
          requiredRow.style.display = 'block';
          removeButton.style.display = 'block';
          if (map !== null) {
            if ('custom' === map.value) {
              fieldLabel.classList.add('form-field-is-custom-field');
            } else {
              fieldLabel.classList.remove('form-field-is-custom-field');
            }
            if ('custom' === map.value || 'custom_text_area' === map.value) {
              fieldLabel.setAttribute('maxlength', '50');
            } else {
              fieldLabel.removeAttribute('maxlength');
            }
          }
        }
        if (ctct_admin_placeholders) {
          var placeholder = ctct_admin_placeholders[fieldDropdown.value];
          if (placeholder && placeholder.length && fieldDesc) {
            fieldDesc.setAttribute('placeholder', 'Example: ' + placeholder);
          } else if (ctct_admin_placeholders.default) {
            fieldDesc.setAttribute('placeholder', ctct_admin_placeholders.default);
          }
        }
      });
    }
  };

  /**
   * Go through all dropdowns, and remove used options.
   *
   * @author Constant Contact
   * @since 1.0.0
   */
  that.removeDuplicateMappings = function () {
    var usedMappings = []; // Leaving as `let` due to changing array indices.
    var dropdowns = document.querySelectorAll('#cmb2-metabox-ctct_2_fields_metabox #custom_fields_group_repeat .cmb-repeatable-grouping select');

    // For each dropdown, build up our array of used values.
    Array.from(dropdowns).forEach(function (dropdown, index) {
      usedMappings.push(dropdown.value);

      // Re-show all the children options we may have hidden.
      Array.from(dropdown.options).forEach(function (item) {
        item.style.display = 'inline';
      });
    });
    usedMappings.forEach(function (mapping) {
      // But only do it if the value isn't one of our custom ones.
      if ('custom' === mapping || 'custom_text_area' === mapping) {
        return;
      }

      // Remove all options from our dropdowns with the value.
      Array.from(dropdowns).forEach(function (dropdown) {
        Array.from(dropdown.options).forEach(function (item) {
          if (item.value === mapping && item.selected !== true) {
            item.style.display = 'none';
          }
        });
      });
    });
  };
  that.init();
})(window, jQuery, window.CTCTBuilder);

/***/ }),

/***/ 526:
/***/ (function() {

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
window.CTCTClipboard = {};
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
   * @since 1.11.0
   */
  app.cache = function () {
    app.cache = {
      window: window,
      copyshortcode: document.querySelectorAll('.ctct-shortcode-wrap')
    };
  };

  /**
   * Attach callbacks to events.
   *
   * @author Constant Contact
   * @since 1.11.0
   */
  app.bindEvents = function () {
    // Add click event for copy buttons.
    if (app.cache.copyshortcode) {
      Array.from(app.cache.copyshortcode).forEach(function (element) {
        var input = element.querySelector('input');
        var button = element.querySelector('button');
        if (input && button) {
          button.addEventListener('click', /*#__PURE__*/function () {
            var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(e) {
              var text, reset, _t;
              return _regenerator().w(function (_context) {
                while (1) switch (_context.p = _context.n) {
                  case 0:
                    if (!(!window.isSecureContext || !navigator.clipboard)) {
                      _context.n = 1;
                      break;
                    }
                    return _context.a(2);
                  case 1:
                    e.preventDefault();
                    // Select the input.
                    input.select();
                    input.setSelectionRange(0, 99999); // For mobile devices.
                    text = input.value;
                    _context.p = 2;
                    _context.n = 3;
                    return navigator.clipboard.writeText(text);
                  case 3:
                    // visual feedback that task is completed.
                    reset = button.innerHTML;
                    e.target.textContent = button.dataset.copied;

                    // Reset button text.
                    setTimeout(function () {
                      e.target.textContent = reset;
                    }, 700);
                    _context.n = 5;
                    break;
                  case 4:
                    _context.p = 4;
                    _t = _context.v;
                    console.error('Failed to copy!', _t);
                  case 5:
                    return _context.a(2);
                }
              }, _callee, null, [[2, 4]]);
            }));
            return function (_x) {
              return _ref.apply(this, arguments);
            };
          }());
        }
      });
    }
  };
  app.init();
})(window, window.CTCTClipboard);

/***/ }),

/***/ 679:
/***/ (function() {

window.CTCTForms = {};
(function (window, that) {
  /**
   * @constructor
   *
   * @author Constant Contact
   * @since 1.0.0
   */
  that.init = function () {
    that.cache();
    that.bindEvents();
  };

  /**
   * Cache DOM elements.
   *
   * @author Constant Contact
   * @since 1.0.0
   */
  that.cache = function () {
    that.cache = {
      window: window,
      disconnect: '.ctct-disconnect'
    };
  };

  /**
   * Attach callbacks to events.
   *
   * @author Constant Contact
   * @since 1.0.0
   */
  that.bindEvents = function () {
    var disconnect = document.querySelectorAll(that.cache.disconnect);
    if (disconnect) {
      Array.from(disconnect).forEach(function (item) {
        item.addEventListener('click', function () {
          return confirm(window.ctctTexts.disconnectconfirm);
        });
      });
    }
  };
  that.init();
})(window, window.CTCTForms);

/***/ }),

/***/ 965:
/***/ (function() {

window.CTCTModal = {};
(function (window, $, app) {
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
      window: window,
      notConnectedModalSelector: document.querySelector('#ctct-not-connected-modal'),
      notConnectedModalClose: document.querySelector('#ctct-not-connected-modal .ctct-modal-close'),
      deleteLogLink: document.querySelector('#deletelog')
    };
  };

  /**
   * Attach callbacks to events.
   *
   * @author Constant Contact
   * @since 1.0.0
   */
  app.bindEvents = function () {
    if (app.cache.notConnectedModalClose) {
      app.cache.notConnectedModalClose.addEventListener('click', function (e) {
        e.preventDefault();
        app.cache.notConnectedModalSelector.classList.remove('ctct-modal-open');
        var data = new FormData();
        data.append('action', 'ctct_dismiss_first_modal');
        data.append('ctct_is_dismissed', 'true');
        fetch(window.ajaxurl, options = {
          method: 'POST',
          body: data
        }).then(function (response) {
          return response.json();
        }).then(function (response) {
          if ('undefined' === typeof response.success) {
            return false;
          }
          console.log(response.data.message);
        });
      });
    }
    if (app.cache.deleteLogLink) {
      app.cache.deleteLogLink.addEventListener('click', function (event) {
        event.preventDefault();

        // Get the link that was clicked on so we can redirect to it if the user confirms.
        var deleteLogLinkHref = event.currentTarget.getAttribute('href');
        $('#confirmdelete').dialog({
          resizable: false,
          height: 'auto',
          width: 400,
          modal: true,
          buttons: {
            'Yes': function Yes() {
              // If the user confirms the action, redirect them to the deletion page.
              window.location.replace(deleteLogLinkHref);
            },
            'Cancel': function Cancel() {
              $('#confirmdelete').closest('.ui-dialog-content').dialog('close');
            }
          }
        });
      });
    }
  };
  app.init();
})(window, jQuery, window.CTCTModal);

/***/ }),

/***/ 201:
/***/ (function() {

window.CTCT_OptIns = {};
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
      optinNoConn: document.querySelectorAll('#cmb2-metabox-ctct_1_optin_metabox #_ctct_opt_in_not_connected'),
      list: document.querySelectorAll('#cmb2-metabox-ctct_0_list_metabox .attached-posts-wrap .retrieved li'),
      title: document.querySelectorAll('#cmb2-metabox-ctct_1_optin_metabox .cmb2-id-email-optin-title'),
      optin: document.querySelectorAll('#cmb2-metabox-ctct_1_optin_metabox .cmb2-id--ctct-opt-in'),
      instruct: document.querySelectorAll('#cmb2-metabox-ctct_1_optin_metabox .cmb2-id--ctct-opt-in-instructions')
    };
  };

  /**
   * Attach callbacks to events.
   *
   * @author Constant Contact
   * @since 1.0.0
   */
  app.bindEvents = function () {
    if (app.cache.optinNoConn.length) {
      app.toggleNoConnectionFields();

      // Bind to fire when needed.
      Array.from(app.cache.optinNoConn).forEach(function (item) {
        item.addEventListener('change', function () {
          app.toggleNoConnectionFields();
        });
      });
    } else {
      // Fire once to get our loaded state set up.
      app.toggleConnectionFields();

      // Bind to fire when needed.
      Array.from(app.cache.list).forEach(function (item) {
        item.addEventListener('change', function () {
          app.toggleConnectionFields();
        });
      });
    }
  };

  /**
   * Toggle unnecessary, unconnected optin fields if we're not showing the opt-in.
   *
   * @author Constant Contact
   * @since 1.0.0
   */
  app.toggleNoConnectionFields = function () {
    if (app.cache.optinNoConn.checked) {
      Array.from(app.cache.instruct).forEach(function (item) {
        item.style.display = 'block';
      });
    } else {
      Array.from(app.cache.instruct).forEach(function (item) {
        item.style.display = 'none';
      });
    }
  };

  /**
   *  Toggle unnecessary, *connected* optin fields if we're not showing the opt-in.
   *
   * @author Constant Contact
   * @since 1.0.0
   */
  app.toggleConnectionFields = function () {
    // If checked, show them, else hide it.
    if (0 < app.cache.list.length) {
      Array.from(app.cache.title).forEach(function (item) {
        item.style.display = 'block';
      });
      Array.from(app.cache.optin).forEach(function (item) {
        item.style.display = 'block';
      });
      Array.from(app.cache.instruct).forEach(function (item) {
        item.style.display = 'block';
      });
      //app.cache.instruct.slideDown();
    } else {
      Array.from(app.cache.title).forEach(function (item) {
        item.style.display = 'none';
      });
      Array.from(app.cache.optin).forEach(function (item) {
        item.style.display = 'none';
      });
      Array.from(app.cache.instruct).forEach(function (item) {
        item.style.display = 'none';
      });
    }
  };
  app.init();
})(window, window.CTCT_OptIns);

/***/ }),

/***/ 199:
/***/ (function() {

window.CTCTRequiredLists = {};
(function (window, app) {
  /**
   * @constructor
   */
  app.init = function () {
    app.cache();
    app.bindEvents();
  };

  /**
   * Cache DOM elements.
   *
   * @author Constant Contact
   * @since 2.12.0
   */
  app.cache = function () {
    var _document$querySelect;
    app.cache = {
      publishButton: (_document$querySelect = document.querySelector('#publish')) !== null && _document$querySelect !== void 0 ? _document$querySelect : '',
      status: ctct_admin_required_lists,
      noListMessage: ctctTexts.no_selected_list
    };
  };

  /**
   * Attach callbacks to events.
   *
   * @author Constant Contact
   * @since 2.12.0
   */
  app.bindEvents = function () {
    if (app.cache.publishButton) {
      app.cache.publishButton.addEventListener('click', function (event) {
        if (!app.maybeAlert()) {
          return;
        }
        event.preventDefault();
        alert(app.cache.noListMessage);
      });
    }
  };

  /**
   * Determine if we should show an alert.
   *
   * @since 2.12.0
   *
   * @returns {boolean}
   */
  app.maybeAlert = function () {
    var should_alert = false;

    // Let it act like a basic contact form.
    if (!app.cache.status.is_connected) {
      return should_alert;
    }

    // If the current form has emails disabled or
    // the setting is disabling
    if (app.currentFormEmailDisabled() || app.cache.status.settings_email_disabled) {
      // but only if we don't have a list already set.
      if (false === app.hasLists()) {
        should_alert = true;
      }
    }

    // We have a list, don't alert.
    if (true === app.hasLists()) {
      should_alert = false;
    }
    return should_alert;
  };

  /**
   * Check if our disable emails checkbox is checked.
   *
   * @since 2.12.0
   *
   * @returns bool
   */
  app.currentFormEmailDisabled = function () {
    return document.querySelector('#_ctct_disable_emails_for_form').checked;
  };

  /**
   * Check if we have one to many lists chosen.
   *
   * @since 2.12.0
   *
   * @returns {boolean}
   */
  app.hasLists = function () {
    var lists = document.querySelectorAll('#cmb2-metabox-ctct_0_list_metabox .attached-posts-wrap .attached li');
    return lists.length > 0;
  };

  /**
   * 3...2...1...Contact Constantly!
   */
  app.init();
})(window, window.CTCTRequiredLists);

/***/ }),

/***/ 611:
/***/ (function() {

window.ctctsettings = {};
(function (window, that) {
  /**
   * @constructor
   *
   * @author Constant Contact
   * @since 2.17.0
   */
  that.init = function () {
    that.cache();
    that.bindEvents();
  };

  /**
   * Cache DOM elements.
   *
   * @author Constant Contact
   * @since 2.17.0
   */
  that.cache = function () {
    that.cache = {
      window: window,
      service: '#_ctct_captcha_service',
      recaptcha: '#ctct-recaptcha',
      hcaptcha: '#ctct-hcaptcha',
      turnstile: '#ctct-turnstile'
    };
  };

  /**
   * Attach callbacks to events.
   *
   * @author Constant Contact
   * @since 2.17.0
   */
  that.bindEvents = function () {
    var service = document.querySelector(that.cache.service);
    if (null === service) {
      return;
    }
    var recaptcha = document.querySelector(that.cache.recaptcha);
    var hcaptcha = document.querySelector(that.cache.hcaptcha);
    var turnstile = document.querySelector(that.cache.turnstile);
    var sections = [recaptcha, hcaptcha, turnstile];
    if ('recaptcha' === service.value) {
      recaptcha.style.display = 'block';
      hcaptcha.style.display = 'none';
      turnstile.style.display = 'none';
    }
    if ('hcaptcha' === service.value) {
      recaptcha.style.display = 'none';
      hcaptcha.style.display = 'block';
      turnstile.style.display = 'none';
    }
    if ('turnstile' === service.value) {
      recaptcha.style.display = 'none';
      hcaptcha.style.display = 'none';
      turnstile.style.display = 'block';
    }
    if ('disabled' === service.value) {
      recaptcha.style.display = 'none';
      hcaptcha.style.display = 'none';
      turnstile.style.display = 'none';
    }
    service.addEventListener('change', function (e) {
      if ('recaptcha' === e.currentTarget.value) {
        recaptcha.style.display = 'block';
        hcaptcha.style.display = 'none';
        turnstile.style.display = 'none';
      }
      if ('hcaptcha' === e.currentTarget.value) {
        recaptcha.style.display = 'none';
        hcaptcha.style.display = 'block';
        turnstile.style.display = 'none';
      }
      if ('turnstile' === e.currentTarget.value) {
        recaptcha.style.display = 'none';
        hcaptcha.style.display = 'none';
        turnstile.style.display = 'block';
      }
      if ('disabled' === e.currentTarget.value) {
        sections.forEach(function (section) {
          section.style.display = 'none';
        });
      }
    });
  };
  that.init();
})(window, window.ctctsettings);

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
/* harmony import */ var _ajax__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(108);
/* harmony import */ var _ajax__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ajax__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _builder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(267);
/* harmony import */ var _builder__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_builder__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(679);
/* harmony import */ var _forms__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_forms__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(965);
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_modal__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _optins__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(201);
/* harmony import */ var _optins__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_optins__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _clipboard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(526);
/* harmony import */ var _clipboard__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_clipboard__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _required_lists__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(199);
/* harmony import */ var _required_lists__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_required_lists__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(611);
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_settings__WEBPACK_IMPORTED_MODULE_7__);








}();
/******/ })()
;
//# sourceMappingURL=ctct-plugin-admin.js.map