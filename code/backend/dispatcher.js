/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use strict";

define(["logger", "resource-loader", "MiscUtils"], function (logger, Loader, MiscUtils) {
  var dispatcher = {};
  dispatcher.areaBasePath = "data/areas/";
  // TODO: Move files to an index list and load that first
  dispatcher.dataFiles = [
    "data/newWorld.json",
    "data/blueprints/races.json",
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
      dispatcher.world._nextEntity = 1;
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

    // Is it a valid blueprint name and do we have data?
    if (dispatcher.data && dispatcher.data.blueprints[blueprintName]) {
      var blueprint = dispatcher.data.blueprints[blueprintName];
      var e = {};

      // See if there's race data and copy that over first
      var raceTemplate = dispatcher.data.blueprints[blueprint.race];
      if (raceTemplate)
        MiscUtils.deepMerge(e, raceTemplate);

      // Copy any more specific blueprint data over the top and assign the entity
      MiscUtils.deepMerge(e, blueprint);
      dispatcher.world.entities[dispatcher.world._nextEntity] = e;
      e.blueprint = blueprintName;
      e.entityID = dispatcher.world._nextEntity;
      ++dispatcher.world._nextEntity;

      return e.entityID;
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


  dispatcher.loadArea = function (name, callback) {
    if (!dispatcher.world) {
      logger.warn("dispatcher.loadArea(): Invalid world (please create or load one first)");
      return null;
    }

    // Determine URL
    var basePath = dispatcher.areaBasePath || "";
    var fn = basePath + name;
    if (!name.endsWith(".json"))
      fn += ".json";

    // Load!
    // TODO: Support loading a list of areas?
    var ld = new Loader();
    ld.add(fn).load(function (loader, resources) {
      dispatcher.world.areas = dispatcher.world.areas || {};
      for (var resName in resources) {
        var res = resources[resName];
        if (res.data && res.data.areas) {
          // Fill in additional area properties
          for (var areaTag in res.data.areas) {
            var area = res.data.areas[areaTag];
            area.tag = areaTag;
            area.map = area.map || [];

            // Convert entity locations list to actual entities and map data
            for (var blueprintName in area.entityLocations) {
              for (var i = 0; i < area.entityLocations[blueprintName].length; ++i) {
                var eID = dispatcher.createEntityFromBlueprint(blueprintName);
                if (eID) {
                  var entity = dispatcher.world.entities[eID];
                  var positionData = area.entityLocations[blueprintName][i];
                  entity.direction = positionData[0];
                  var x = positionData[1];
                  var y = positionData[2];

                  area.map[x] = area.map[x] || [];
                  area.map[x][y] = area.map[x][y] || [];
                  area.map[x][y].push(eID);
                }
              }
            }

            // Don't need the initial compacted location data anymore
            delete area.entityLocations;

            // Just keep the modified area objects instead of deepmerging
            dispatcher.world.areas[areaTag] = area;
            logger.debug("dispatcher.loadArea(): Area '" + areaTag + "' loaded.");

            // Feed each area to the callback
            if (typeof callback === "function")
              callback(area);
          }
        }
        else
          logger.warn("dispatcher.loadArea(): Failed to load / parse area file '" + resName + "'");
      }
    });
  };


  dispatcher.submitAction = function (category, action) {
    if (dispatcher.data) {
      
    }
    else
      dispatcher._loadDataFiles(dispatcher.submitAction, category, action);
  };

  return dispatcher;
});
