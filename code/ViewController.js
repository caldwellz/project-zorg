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
      if (delta.impact.int)
        _updateElem("impact-stat-int", delta.impact.int);
      if (delta.impact.mag)
        _updateElem("impact-stat-mag", delta.impact.mag);
      if (delta.impact.per)
        _updateElem("impact-stat-per", delta.impact.per);
      if (delta.impact.agi)
        _updateElem("impact-stat-agi", delta.impact.agi);
      if (delta.impact.cha)
        _updateElem("impact-stat-cha", delta.impact.cha);
      if (delta.impact.tgh)
        _updateElem("impact-stat-tgh", delta.impact.tgh);
      if (delta.impact.pointsRemaining)
        _updateElem("impact-stat-pointsRemaining", delta.impact.pointsRemaining);
    }
  };

  return ViewController;
});
