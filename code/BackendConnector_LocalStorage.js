/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use strict";

define(["logger", "BackendConnector"], function (logger, BackendConnector) {

  function BackendConnector_LocalStorage(params) {
    BackendConnector.call(this, params);
    return true;
  };
  BackendConnector_LocalStorage.prototype = Object.create(BackendConnector.prototype);
  BackendConnector_LocalStorage.prototype.constructor = BackendConnector_LocalStorage;


  BackendConnector_LocalStorage.prototype.getEntities = function () {
    return [];
  };

  BackendConnector_LocalStorage.prototype.playerAction = function (category, action, callback) {
    if (typeof callback === "function")
      callback([]);
  };

  return BackendConnector_LocalStorage;
});
