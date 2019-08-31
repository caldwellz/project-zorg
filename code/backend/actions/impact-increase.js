/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use strict";


define(["logger"], function (logger) {

  function impactIncrease(backend, params) {
    var changes = {};
    var impact = params.entity.impact;
    if ((typeof impact.pointsRemaining === "number") && (impact.pointsRemaining > 0) && impact[params.method]) {
      ++impact[params.method];
      --impact.pointsRemaining;
      changes.entities = [];
      changes.entities[params.entity.entityID] = {};
      changes.entities[params.entity.entityID].impact = impact;
    }

    return changes;
  }

  return impactIncrease;
});
