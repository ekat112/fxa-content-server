/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// blanket_mocha does code coverage analysis on front end code

module.exports = function (grunt) {
  'use strict';

  grunt.config('blanket_mocha', {
    dist: {
      options: {
        urls: ['http://localhost:3030/tests/index.html?coverage'],
        threshold: 50,
        globalThreshold: 65,
        log: true,
        logErrors: true
      }
    }
  });
};

