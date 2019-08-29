/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use strict";

define(["logger"], function (logger) {
  var ViewController = {};


  ViewController.initialize = function (world, backend) {
    ViewController.backend = backend;
    ViewController.world = world;

    // Create and/or link the character object
    var playerID = world.characterID || backend.newCharacter();
    ViewController.character = world.entities[playerID];

    // Perform an initial update of everything
    ViewController.update(world);
  };


  ViewController.update = function (updates) {
    // Determine which parts of the view need updating and call the respective functions
    var charUpdates = updates.entities[ViewController.world.characterID];
    if (charUpdates)
      ViewController._updateCharacter(charUpdates);
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
      _updateElem("impact-stat-pointsRemaining", ViewController.character.impact.pointsRemaining);
    }

    // Current stats
    if (typeof delta.health === "number")
      _updateElem("char-stat-health", delta.health);
  };

  return ViewController;
});
