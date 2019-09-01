/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use strict";

define(["logger", "MiscUtils"], function (logger, MiscUtils) {
  var getDetails = {};

  getDetails.location = function (backend, params) {
    var changes = {};

    var e = params.entity;
    if (e && (typeof e.name === "string") && backend.world.areas[e.areaTag] && (typeof backend.world.areas[e.areaTag].name === "string") && (e.x >= 0) && (e.y >= 0) && (e.direction >= 0)) {
      changes.description = e.name + " location: " + backend.world.areas[e.areaTag].name + " [" + e.x.toString() + ", " + e.y.toString() + "] facing " + MiscUtils.directionIntToName(e.direction);
    }

    return changes;
  }

  return getDetails;
});
