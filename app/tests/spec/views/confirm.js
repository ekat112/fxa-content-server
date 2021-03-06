/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';


define([
  'chai',
  'p-promise',
  'lib/auth-errors',
  'views/confirm',
  '../../mocks/router'
],
function (chai, p, authErrors, View, RouterMock) {
  /*global describe, beforeEach, afterEach, it*/
  var assert = chai.assert;

  describe('views/confirm', function () {
    var view, router;

    beforeEach(function () {
      router = new RouterMock();
      view = new View({
        router: router
      });
      return view.render()
          .then(function () {
            $('#container').html(view.el);
          });
    });

    afterEach(function () {
      view.remove();
      view.destroy();
    });

    describe('constructor creates it', function () {
      it('is drawn', function () {
        assert.ok($('#fxa-confirm-header').length);
      });
    });

    describe('submit', function () {
      it('resends the confirmation email, shows success message', function () {
        var email = 'user' + Math.random() + '@testuser.com';

        return view.fxaClient.signUp(email, 'password')
              .then(function () {
                return view.submit();
              })
              .then(function () {
                assert.isTrue(view.$('.success').is(':visible'));
              });

      });

      it('redirects to `/signup` if the resend token is invalid', function () {
        view.fxaClient.signUpResend = function () {
          return p().then(function () {
            throw authErrors.toError('INVALID_TOKEN', 'Invalid token');
          });
        };

        return view.submit()
              .then(function () {
                assert.equal(router.page, 'signup');
              });
      });

      it('displays other error messages if there is a problem', function () {
        view.fxaClient.signUpResend = function () {
          return p().then(function () {
            throw new Error('synthesized error from auth server');
          });
        };

        return view.submit()
              .then(function () {
                assert(false, 'unexpected success');
              }, function (err) {
                assert.equal(err.message, 'synthesized error from auth server');
              });
      });
    });

    describe('validateAndSubmit', function () {
      it('only called after click on #resend', function () {
        var email = 'user' + Math.random() + '@testuser.com';

        return view.fxaClient.signUp(email, 'password')
               .then(function () {
                 var count = 0;
                 view.validateAndSubmit = function() {
                   count++;
                 };

                 view.$('section').click();
                 assert.equal(count, 0);

                 view.$('#resend').click();
                 assert.equal(count, 1);
               });

      });
    });

  });
});


