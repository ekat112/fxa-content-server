/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

define([
  'underscore',
  'views/base',
  'views/form',
  'stache!templates/delete_account',
  'lib/session',
  'lib/password-mixin'
],
function (_, BaseView, FormView, Template, Session, PasswordMixin) {
  var t = BaseView.t;

  var View = FormView.extend({
    // user must be authenticated to delete their account
    mustAuth: true,

    template: Template,
    className: 'delete-account',

    events: {
      'click #back': 'back',
      'keyup #back': 'backOnEnter',
      'change .show-password': 'onPasswordVisibilityChange'
    },

    context: function () {
      return {
        isSync: Session.isSync(),
        email: Session.email
      };
    },

    submit: function () {
      var email = this.context().email;
      var password = this.$('.password').val();
      var self = this;
      return this.fxaClient.deleteAccount(email, password)
                .then(function () {
                  self.navigate('signup', {
                    success: t('Account deleted successfully')
                  });
                });
    }
  });

  _.extend(View.prototype, PasswordMixin);

  return View;
});

