/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use strict";

define(["logger", "BackendConnector", "backend/dispatcher"], function (logger, BackendConnector, dispatcher) {

  function BackendConnector_LocalStorage(params) {
    BackendConnector.call(this, params);

    // TODO: MDN has a handy LocalStorage API polyfill which could go here... But we may never target browsers old enough to need it anyway.
    // However, stick to the storage API (setItem, getItem, etc.) instead of assignment operators just in case, and per MDN recommendation.

    // Make sure storage API is usable
    try {
      var test = "_test";
      window.localStorage.setItem(test, test);
      window.localStorage.getItem(test);
      window.localStorage.removeItem(test);
      this.storage = window.localStorage;
    }
    catch (e) {
      logger.error("BackendConnector_LocalStorage(): Storage API not usable");
      logger.debug(e);
      this.storage = null;
    }
  };
  BackendConnector_LocalStorage.prototype = Object.create(BackendConnector.prototype);
  BackendConnector_LocalStorage.prototype.constructor = BackendConnector_LocalStorage;


  BackendConnector_LocalStorage.prototype.fetchWorld = function (callback) {
    try {
      this.world = this.world || JSON.parse(this.storage.getItem(this.gameKey));
    }
    catch (e) {
      this.world = null;
    }

    if (this.world) {
      dispatcher.world = this.world; // This connector just shares the world state with the backend, rather than having to synchronize
      dispatcher._loadDataFiles(function () {
        if (typeof callback === "function")
          callback(dispatcher.world);
      });
    }
    else {
      var backend = this;
      dispatcher.newWorld(function (w) {
        backend.world = dispatcher.world; // Should be the same as the w arg, but just to be safe...
        backend.storage.setItem(backend.gameKey, JSON.stringify(backend.world));
        logger.debug("BackendConnector_LocalStorage.fetchWorld(): Created and saved new world to localStorage key '" + backend.gameKey + "'");
        if (typeof callback === "function")
          callback(backend.world);
      });
    }
  };


  BackendConnector_LocalStorage.prototype.newCharacter = function () {
    var id = dispatcher.createEntityFromBlueprint("character");
    if (id) {
      this.world.characterID = id;
      this.storage.setItem(this.gameKey, JSON.stringify(this.world));
    }

    return id;
  };


  BackendConnector_LocalStorage.prototype.submitAction = function (category, action, callback) {
    if (this.world) {
      var updates = dispatcher.submitAction(category, action);
      // Don't need to merge changes first, because of the shared world
      this.storage.setItem(this.gameKey, JSON.stringify(this.world));

      if (typeof callback === "function")
        callback(updates);
    }
    else {
      var ctx = this;
      this.fetchWorld(function () {
        if (ctx.world)
          ctx.submitAction(category, action, callback);
        else
          logger.error("BackendConnector_LocalStorage.submitAction(): World could not be found or fetched");
      });
    }
  };

  return BackendConnector_LocalStorage;
});
