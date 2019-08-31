/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use strict";

define(["logger", "MiscUtils"], function (logger, MiscUtils) {
  var ViewController = {};


  ViewController.initialize = function (world, connector) {
    ViewController.connector = connector;
    ViewController.world = world;

    // Create and/or link the character object
    var playerID = world.characterID || connector.newCharacter();
    ViewController.character = world.entities[playerID];

    // Perform an initial update of everything
    ViewController.update(world);
  };


  ViewController.submitCharacterAction = function (category, method) {
    if (ViewController.connector && ViewController.world && ViewController.character) {
      var params = {
        "category": category,
        "method": method,
        "entity": ViewController.character
      };

      ViewController.connector.submitAction(params, function (updates) {
        ViewController.update(updates);
      });
    }
    else
      logger.warn("ViewController.submitCharacterAction(): Please initialize ViewController first");
  };


  ViewController.update = function (updates) {
    if (typeof updates === "object") {
      // Determine which parts of the view need updating and call the respective functions
      if (updates.entities) {
        var charUpdates = updates.entities[ViewController.world.characterID];
        if (charUpdates)
          ViewController._updateCharacter(charUpdates);
      }
    }
  };


  function _updateElem(id, value) {
    var elem = document.getElementById(id);
    if (elem)
      elem.innerHTML = value.toString();
    else {
      logger.warn("ViewController:_updateElem(): Could not find element with the given ID");
      logger.debug(id);
    }
  };


  ViewController._updateCharacter = function (delta) {
    // Character name
    if (delta.name)
      _updateElem("char-name", delta.name);

    // IMPACT stats
    if (delta.impact) {
      _updateElem("impact-stat-int", ViewController.character.impact.int);
      _updateElem("impact-stat-mag", ViewController.character.impact.mag);
      _updateElem("impact-stat-per", ViewController.character.impact.per);
      _updateElem("impact-stat-agi", ViewController.character.impact.agi);
      _updateElem("impact-stat-cha", ViewController.character.impact.cha);
      _updateElem("impact-stat-tgh", ViewController.character.impact.tgh);
      var healthMult = ViewController.character.healthMultiplier || 1;
      _updateElem("char-stat-totalhealth", ViewController.character.impact.tgh * healthMult);
      var kronMult = ViewController.character.kronMultiplier || 1;
      _updateElem("char-stat-totalkron", ViewController.character.impact.mag * kronMult);
      var enduranceMult = ViewController.character.enduranceMultiplier || 1;
      _updateElem("char-stat-totalendurance", ViewController.character.impact.tgh * enduranceMult);
      _updateElem("impact-stat-pointsRemaining", ViewController.character.impact.pointsRemaining);

      // IMPACT points distribution
      if (ViewController.character.impact.pointsRemaining) {
        document.getElementById("impact-stat-pointsRemaining").style.color = "#118811";
        MiscUtils.toggleSelectorClass('[data-action-game-category="impact-increase"]', "hidden", false);
      }
      else {
        document.getElementById("impact-stat-pointsRemaining").style.color = "red";
        MiscUtils.toggleSelectorClass('[data-action-game-category="impact-increase"]', "hidden", true);
      }
    }

    // Current stats
    if (typeof delta.health === "number")
      _updateElem("char-stat-health", delta.health);
    if (typeof delta.kron === "number")
      _updateElem("char-stat-kron", delta.kron);
    if (typeof delta.endurance === "number")
      _updateElem("char-stat-endurance", delta.endurance);
  };

  return ViewController;
});
