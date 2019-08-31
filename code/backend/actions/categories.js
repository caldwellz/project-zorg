/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use strict";

define(["logger"], function (logger) {
  var categories = {};

  categories.test = {
    testMethod: function (backend, params) { console.log(params); return {}; }
  };

  return categories;
});
