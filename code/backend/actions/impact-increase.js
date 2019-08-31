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

      // Increase health / endurance values on a toughness bump
      if (params.method === "tgh") {
        var newHealth = params.entity.healthMultiplier + (params.entity.health || (impact.tgh * params.entity.healthMultiplier));
        if ((typeof newHealth === "number") && (newHealth !== NaN)) {
          params.entity.health = newHealth;
          changes.entities[params.entity.entityID].health = newHealth;
        }

        var newEndurance = params.entity.enduranceMultiplier + (params.entity.endurance || (impact.tgh * params.entity.enduranceMultiplier));
        if ((typeof newEndurance === "number") && (newEndurance !== NaN)) {
          params.entity.endurance = newEndurance;
          changes.entities[params.entity.entityID].endurance = newEndurance;
        }
      }

      // Increase kron value on a magic bump
      else if (params.method === "mag") {
        var newKron = params.entity.kronMultiplier + (params.entity.kron || (impact.mag * params.entity.kronMultiplier));
        if ((typeof newKron === "number") && (newKron !== NaN)) {
          params.entity.kron = newKron;
          changes.entities[params.entity.entityID].kron = newKron;
        }
      }
    }

    return changes;
  }

  return impactIncrease;
});
