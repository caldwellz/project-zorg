/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use strict";

define(["logger", "resource-loader", "MiscUtils"], function (logger, Loader, MiscUtils) {
  var dispatcher = {};
  // TODO: Move files to an index list and load that first
  dispatcher.dataFiles = [
    "data/newWorld.json",
    "data/areas/start.json",
    "data/blueprints/creatures.json",
    "data/blueprints/placeables.json",
    "data/blueprints/environment.json"
  ];


  dispatcher._loadDataFiles = function (callback, cbparam1, cbparam2) {
    var ld = new Loader();
    ld.add(dispatcher.dataFiles).load(function (loader, resources) {
      dispatcher.data = dispatcher.data || {};
      for (var resName in resources) {
        var res = resources[resName];
        if (res.data && (res.xhrType === "json"))
          MiscUtils.deepMerge(dispatcher.data, res.data);
        else
          logger.warn("dispatcher: Failed to load / parse data file '" + resName + "'");
      }
      if (typeof callback === "function")
        callback(cbparam1, cbparam2);
    });
  };


  dispatcher.newWorld = function (callback) {
    if (dispatcher.data) {
      dispatcher.world = {};
      dispatcher.world.entities = [];
      dispatcher.world.nextEntity = 1;

      if (typeof callback === "function")
          callback(dispatcher.world);
    }
    else
      dispatcher._loadDataFiles(dispatcher.newWorld, callback);
  };


  dispatcher.createEntityFromBlueprint = function (blueprintName) {
    if (!dispatcher.world) {
      logger.warn("dispatcher.createEntityFromBlueprint(): Invalid world (please create or load one first)");
      return null;
    }

    if (dispatcher.data && dispatcher.data.blueprints[blueprintName]) {
      var e = {};
      MiscUtils.deepMerge(e, dispatcher.data.blueprints[blueprintName]);
      dispatcher.world.entities[dispatcher.world.nextEntity] = e;
      e.blueprint = blueprintName;
      e.entity = dispatcher.world.nextEntity;
      ++dispatcher.world.nextEntity;

      return e.entity;
    }
    else {
      console.log(dispatcher.world);
      console.log(dispatcher.data);
      var logMsg = "dispatcher.createEntityFromBlueprint(): Could not locate blueprint";
      if (typeof blueprintName === "string")
        logger.warn(logMsg + " '" + blueprintName + "'");
      else {
        logger.warn(logMsg);
        logger.debug(blueprintName);
      }
      return null;
    }
  };


  dispatcher.submitAction = function (category, action) {
    if (dispatcher.data) {
      
    }
    else
      dispatcher._loadDataFiles(dispatcher.submitAction, category, action);
  };

  return dispatcher;
});
