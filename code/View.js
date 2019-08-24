/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use strict";

define(["logger"], function (logger) {

  function View() {
    this._viewElem = document.createElement("div");
    document._nextMenuID = document._nextMenuID || 1;
  };


  View.prototype.getElement = function () {
    return this._viewElem;
  };


  View.prototype.isMenu = function (menu) {
    if (menu && (menu.tagName === "DIV") && (menu.classList.contains("tree-menu")))
      return true;
    else
      return false;
  };


  View.prototype.createMenu = function (label) {
    if (typeof label === "string") {
      var menu = document.createElement("div");
      menu.className = "tree-menu";

      var labelID = "menu" + document._nextMenuID.toString();
      menu.innerHTML = '<input type="checkbox" id="' + labelID + '"/><label for="' + labelID + '">' + label + '</label><ul />';
      document._nextMenuID++;

      return menu;
    }
    else {
      logger.error("View.prototype.createMenu(): Label not a string");
      logger.debug(label);
    }
  };


  View.prototype.removeMenu = function (menu) {
    if (this.isMenu(menu))
      menu.parentNode.removeChild(menu);
    else {
      logger.error("View.prototype.removeMenu(): menu is not valid");
      logger.debug(menu);
    }
    return this;
  };


  View.prototype.addTopLevelMenu = function (menu) {
    if (this.isMenu(menu))
      this._viewElem.appendChild(menu);
    else {
      logger.error("View.prototype.addTopLevelMenu(): menu is not valid");
      logger.debug(menu);
    }
    return this;
  };


  View.prototype.createAndAddMenu = function (label) {
    var menu = this.createMenu(label);
    this.addTopLevelMenu(menu);
    return menu;
  };


  View.prototype.addItem = function (menu, item) {
    if (this.isMenu(menu)) {
      var listItem = document.createElement("li");
      if (typeof item === "string")
        listItem.innerHTML = item;
      else if (item.tagName)
        listItem.appendChild(item);
      else {
        logger.error("View.prototype.addItem(): Invalid menu item");
        logger.debug(item);
        return;
      }
      menu.getElementsByTagName("ul")[0].appendChild(listItem);
    }
    else {
      logger.error("View.prototype.addTopLevelMenu(): menu is not valid");
      logger.debug(menu);
    }
    return this;
  };

  return View;
});
