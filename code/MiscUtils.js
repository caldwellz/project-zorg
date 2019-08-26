/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use strict";

define([], function () {
  var MiscUtils = {};

  // classList.contains polyfill for older browsers, courtesy of SO
  // https://stackoverflow.com/questions/5898656/check-if-an-element-contains-a-class-in-javascript
  MiscUtils.hasClass = function (element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
  };


  // classList.toggle polyfill for older browsers
  MiscUtils.toggleClass = function (element, className) {
    var index = (' ' + element.className + ' ').indexOf(' ' + className+ ' ');
    if (index > -1) {
      // Remove the class
      var endIndex = index + className.length;
      var newList = "";
      if (index > 0)
        newList += element.className.slice(0, index);
      newList += element.className.slice(endIndex);
      element.className = newList.replace(/\s+/g, ' ').trim();
    }
    else {
      // Add the class
      if (element.className.length > 0)
        element.className += ' ';
      element.className += className;
    }
  };


  MiscUtils.toggleSelectorClass = function (selector, className) {
    if ((typeof selector === "string") && (typeof className === "string")) {
      var query = document.querySelectorAll(selector);
      if (query.length <= 0) {
        console.debug("MiscUtils.toggleSelectorClass(): selector query returned nothing");
        console.debug(selector);
      }
      for (var i = 0; i < query.length; ++i)
        MiscUtils.toggleClass(query[i], className);
    }
    else {
      console.warn("MiscUtils.toggleSelectorClass(): selector or className not a string");
      console.debug(selector);
      console.debug(className);
    }
  };


  MiscUtils.setClickActions = function () {
    //action-toggle-class
    var query = document.querySelectorAll('[data-action-toggle-class]');
    for (var i = 0; i < query.length; ++i) {
      query[i].onclick = function () {
        MiscUtils.toggleClass(this, this.getAttribute("data-action-toggle-class"));

        // TODO: Use a data attrib or something else to flag whether to follow the link
        if (this.nodeName === 'A')
          return false;
      };
    }

    //action-toggle-selector-class
    var query = document.querySelectorAll('[data-action-toggle-selector-class]');
    for (var i = 0; i < query.length; ++i) {
      query[i].onclick = function () {
        // TODO: Support other nodes besides anchors
        if (this.nodeName === 'A') {
          MiscUtils.toggleSelectorClass(this.getAttribute("href"), this.getAttribute("data-action-toggle-selector-class"));
          
          // TODO: Use a data attrib or something else to flag whether to follow the link
          return false;
        }
      };
    }
  };


  MiscUtils.deepMerge = function (obj, mergeObj) {
    // Make sure we're not trying to copy from an obj to a string or array, or other crazy things
    if ((typeof obj === typeof mergeObj) && (obj instanceof Array === mergeObj instanceof Array)) {
      for (var propName in mergeObj) {
        if (mergeObj.hasOwnProperty(propName)) {
          var prop = mergeObj[propName];

          // Recurse for nested objects
          if (typeof prop === "object") {
            var subObj;
            if (typeof obj[propName] === "object")
              subObj = obj[propName];
            else {
              subObj = {}; // BUG/TODO: See if it would be better to create a full Object instead
              obj[propName] = subObj;
            }
            deepMerge(subObj, prop);
          }
          else
            obj[propName] = prop;
        }
      }
    }
    else {
      logger.error("MiscUtils.deepMerge(): Parameter types mismatch");
      logger.debug(obj);
      logger.debug(mergeObj);
    }
  }

  return MiscUtils;
});
