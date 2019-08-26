/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use strict";

define(["logger"], function (logger) {

  function BackendConnector(params) {
    logger.debug("BackendConnector(): Creating an instance of dummy parent class");
    return true;
  };

  // Implementation overrides
  BackendConnector.prototype.getEntities = function () {
    logger.debug("BackendConnector.getEntities(): not implemented (dummy parent class)");
    return [];
  };

  BackendConnector.prototype.playerAction = function (category, action, callback) {
    logger.debug("BackendConnector.playerAction(): not implemented (dummy parent class)");
    if (typeof callback === "function")
      callback([]);
  };

  return BackendConnector;
});
