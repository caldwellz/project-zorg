/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use strict";

requirejs.config({
    paths: {
      'resource-loader': 'lib/resource-loader.min'
    },
    shim: {
      'resource-loader': {
        exports: 'Loader'
      }
    }
});

requirejs(["logger"], function (logger) {
  var detailsDiv = document.getElementById("details-container");

  document.body.appendChild(logger.logbox);
});
