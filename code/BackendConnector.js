/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use strict";

define(["logger"], function (logger) {

  function BackendConnector(params) {
    params = params || {};
    this.gameKey = params.gameKey || "game";
  };

  // Implementation overrides
  BackendConnector.prototype.fetchWorld = function (callback) {
    logger.debug("BackendConnector.fetchWorld(): not implemented (dummy parent class)");
    if (typeof callback === "function")
      callback({});
  };

  BackendConnector.prototype.submitAction = function (category, action, callback) {
    logger.debug("BackendConnector.submitAction(): not implemented (dummy parent class)");
    if (typeof callback === "function")
      callback({});
  };

  return BackendConnector;
});
