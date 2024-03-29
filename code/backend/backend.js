/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use strict";

define(["logger", "resource-loader", "MiscUtils", "./actionDispatcher"], function (logger, Loader, MiscUtils, actionDispatcher) {
  var backend = {};
  backend.areaBasePath = "data/areas/";
  // TODO: Move files to an index list and load that first
  backend.dataFiles = [
    "data/newWorld.json",
    "data/blueprints/races.json",
    "data/blueprints/creatures.json",
    "data/blueprints/placeables.json",
    "data/blueprints/environment.json"
  ];


  backend._loadDataFiles = function (callback, params) {
    var ld = new Loader();
    ld.add(backend.dataFiles).load(function (loader, resources) {
      backend.data = backend.data || {};
      for (var resName in resources) {
        var res = resources[resName];
        if (res.data && (res.xhrType === "json"))
          MiscUtils.deepMerge(backend.data, res.data);
        else
          logger.warn("backend: Failed to load / parse data file '" + resName + "'");
      }
      if (typeof callback === "function")
        callback(params);
    });
  };


  backend.newWorld = function (callback) {
    if (backend.data) {
      backend.world = {};
      backend.world.entities = [];
      backend.world._nextEntity = 1;
      if (typeof callback === "function")
        callback(backend.world);
    }
    else
      backend._loadDataFiles(backend.newWorld, callback);
  };


  backend.createEntityFromBlueprint = function (blueprintName) {
    if (!backend.world) {
      logger.warn("backend.createEntityFromBlueprint(): Invalid world (please create or load one first)");
      return null;
    }

    // Is it a valid blueprint name and do we have data?
    if (backend.data && backend.data.blueprints[blueprintName]) {
      var blueprint = backend.data.blueprints[blueprintName];
      var e = {};

      // See if there's race data and copy that over first
      var raceTemplate = backend.data.blueprints[blueprint.race];
      if (raceTemplate)
        MiscUtils.deepMerge(e, raceTemplate);

      // Override with any more specific blueprint data
      MiscUtils.deepMerge(e, blueprint);

      // Figure out the health / kron / endurance values
      if (e.impact) {
        e.health = e.health || (e.impact.tgh * e.healthMultiplier) || 0;
        e.kron = e.kron || (e.impact.mag * e.kronMultiplier) || 0;
        e.endurance = e.endurance || (e.impact.tgh * e.enduranceMultiplier) || 0;
      }

      // Assign the entity
      backend.world.entities[backend.world._nextEntity] = e;
      e.blueprint = blueprintName;
      e.entityID = backend.world._nextEntity;
      ++backend.world._nextEntity;

      return e.entityID;
    }
    else {
      console.log(backend.world);
      console.log(backend.data);
      var logMsg = "backend.createEntityFromBlueprint(): Could not locate blueprint";
      if (typeof blueprintName === "string")
        logger.warn(logMsg + " '" + blueprintName + "'");
      else {
        logger.warn(logMsg);
        logger.debug(blueprintName);
      }
      return null;
    }
  };


  backend.loadArea = function (name, callback) {
    if (!backend.world) {
      logger.warn("backend.loadArea(): Invalid world (please create or load one first)");
      return null;
    }

    // Determine URL
    var basePath = backend.areaBasePath || "";
    var fn = basePath + name;
    if (!name.endsWith(".json"))
      fn += ".json";

    // Load!
    // TODO: Support loading a list of areas?
    var ld = new Loader();
    ld.add(fn).load(function (loader, resources) {
      backend.world.areas = backend.world.areas || {};
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
                // Make sure we don't create a duplicate player object if there is one
                if (blueprintName === "character") {
                  // Only emplace it at one map coordinate (map should only ever list one player character, but just to be safe)
                  if (i >= 1)
                    break;

                  if (!(backend.world.characterID >= 0))
                    backend.world.characterID = backend.createEntityFromBlueprint(blueprintName);
                  var eID = backend.world.characterID;
                }
                else
                  var eID = backend.createEntityFromBlueprint(blueprintName);

                // Fill in the entity's location details
                if (eID) {
                  var entity = backend.world.entities[eID];
                  var positionData = area.entityLocations[blueprintName][i];
                  var x = positionData[1];
                  var y = positionData[2];

                  entity.direction = positionData[0];
                  entity.x = x;
                  entity.y = y;
                  entity.areaTag = areaTag;

                  area.map[x] = area.map[x] || [];
                  area.map[x][y] = area.map[x][y] || [];
                  area.map[x][y].push(eID);
                }
              }
            }

            // Don't need the initial compacted location data anymore
            delete area.entityLocations;

            // Just keep the modified area objects instead of deepmerging
            backend.world.areas[areaTag] = area;
            logger.debug("backend.loadArea(): Area '" + areaTag + "' loaded.");

            // Feed each area to the callback
            if (typeof callback === "function")
              callback(area);
          }
        }
        else
          logger.warn("backend.loadArea(): Failed to load / parse area file '" + resName + "'");
      }
    });
  };


  backend.submitAction = function (params) {
    if (backend.world) {
      if (backend.data)
        return actionDispatcher.submitAction(backend, params);
      else
        backend._loadDataFiles(backend.submitAction, params);
    }
    else {
      backend.newWorld(backend.submitAction, params);
    }
  };

  return backend;
});
