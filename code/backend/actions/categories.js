/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use strict";

// The main list of action categories (which should also match their respective JS filenames)
var actionCategories = [
  "impact-increase"
];

var depends = [];
for (var i = 0; i < actionCategories.length; ++i) {
  depends[i] = "./" + actionCategories[i];
}

define(depends, function () {
  var categories = {};

  for (var i = 0; i < arguments.length; ++i) {
    if (actionCategories[i])
      categories[actionCategories[i]] = arguments[i];
  }

  return categories;
});
