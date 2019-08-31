/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use strict";

define(["logger", "MiscUtils", "./actions/categories"], function (logger, MiscUtils, actionCategories) {
  var actionDispatcher = {};

  actionDispatcher.submitAction = function (backend, params) {
    if (backend && backend.world && backend.data) {
      if (params.entity)
        params.entityID = params.entity.entityID;
      else {
        params.entityID = params.entityID || 0;
        params.entity = backend.world.entities[params.entityID];
      }

      if (params.category && actionCategories[params.category]) {
        var category = actionCategories[params.category];
        if (typeof category === "function")
          return category(backend, params);
        else if (params.method && (typeof category === "object") && (typeof category[params.method] === "function"))
          return category[params.method](backend, params);
        else {
          logger.warn("actionDispatcher.submitAction(): Action method not found");
          logger.debug(params);
        }
      }
      else {
        logger.warn("actionDispatcher.submitAction(): Action category not found");
        logger.debug(params);
      }
    }
    else
      logger.warn("actionDispatcher.submitAction(): Invalid or incomplete backend");

    return {};
  };

  return actionDispatcher;
});
