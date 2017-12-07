define([
    "app",

    "text!templates/logged-in-page.html",
    "text!templates/login-page.html",
    'managers/Manager.jquery',
    'core/ParameterStore',
    'reuters/ResultWidget',
    'reuters/TagcloudWidget',
    'reuters/CurrentSearchWidget.9',
    'reuters/AutocompleteWidget',
    'reuters/ServiceAreaWidget',
    'widgets/jquery/PagerWidget',
    "parsley",
    "jqueryui"
], function(app, LoggedInPageTpl, LoginPageTpl){

    var LoginView = Backbone.View.extend({

        initialize: function () {
            _.bindAll(this);

            // Listen for session logged_in state changes and re-render
            app.session.on("change:logged_in", this.render);
        },

        events: {
            'click #login-btn'                      : 'onLoginAttempt',
            'click #signup-btn'                     : 'onSignupAttempt',
            'keyup #login-password-input'           : 'onPasswordKeyup',
            'keyup #signup-password-confirm-input'  : 'onConfirmPasswordKeyup'
        },

        // Allow enter press to trigger login
        onPasswordKeyup: function(evt){
            var k = evt.keyCode || evt.which;

            if (k == 13 && $('#login-password-input').val() === ''){
                evt.preventDefault();    // prevent enter-press submit when input is empty
            } else if(k == 13){
                evt.preventDefault();
                this.onLoginAttempt();
                return false;
            }
        },

        // Allow enter press to trigger signup
        onConfirmPasswordKeyup: function(evt){
            var k = evt.keyCode || evt.which;

            if (k == 13 && $('#confirm-password-input').val() === ''){
                evt.preventDefault();   // prevent enter-press submit when input is empty
            } else if(k == 13){
                evt.preventDefault();
                this.onSignupAttempt();
                return false;
            }
        },

        onLoginAttempt: function(evt){
            if(evt) evt.preventDefault();

            if(this.$("#login-form").parsley('validate')){
                app.session.login({
                    username: this.$("#login-username-input").val(),
                    password: this.$("#login-password-input").val()
                }, {
                    success: function(mod, res){
                        if(DEBUG) console.log("SUCCESS", mod, res);

                    },
                    error: function(err){
                        if(DEBUG) console.log("ERROR", err);
                        app.showAlert('Bummer dude!', err.error, 'alert-danger'); 
                    }
                });
            } else {
                // Invalid clientside validations thru parsley
                if(DEBUG) console.log("Did not pass clientside validation");

            }
        },
        

        onSignupAttempt: function(evt){
            if(evt) evt.preventDefault();
            if(this.$("#signup-form").parsley('validate')){
                app.session.signup({
                    username: this.$("#signup-username-input").val(),
                    password: this.$("#signup-password-input").val(),
                    name: this.$("#signup-name-input").val()
                }, {
                    success: function(mod, res){
                        if(DEBUG) console.log("SUCCESS", mod, res);

                    },
                    error: function(err){
                        if(DEBUG) console.log("ERROR", err);
                        app.showAlert('Uh oh!', err.error, 'alert-danger'); 
                    }
                });
            } else {
                // Invalid clientside validations thru parsley
                if(DEBUG) console.log("Did not pass clientside validation");

            }
        },

        render:function () {
            if(app.session.get('logged_in')) {
                $('head').append('<link rel="stylesheet" type="text/css" href="/assets/lib/ajax-solr/examples/reuters-requirejs/css/reuters.css">')
                this.template = _.template(LoggedInPageTpl);
            }
            else {
                $('link[rel=stylesheet][href="/assets/lib/ajax-solr/examples/reuters-requirejs/css/reuters.css"]').remove();
                this.template = _.template(LoginPageTpl);
            }

            this.$el.html(this.template({ user: app.session.user.toJSON() }));


            //$(function () {
                var Manager = new AjaxSolr.Manager({
                    solrUrl: 'http://localhost:8983/solr/Documents/'
                    //solrUrl: 'http://user:KKbnqECIhU60@ec2-34-205-225-171.compute-1.amazonaws.com/solr/Proposals/'
                });

                Manager.addWidget(new AjaxSolr.ResultWidget({
                    id: 'result',
                    target: '#docs',
                    protocol: 'file'
                }));

                Manager.addWidget(new AjaxSolr.PagerWidget({
                    id: 'pager',
                    target: '#pager',
                    prevLabel: '&lt;',
                    nextLabel: '&gt;',
                    innerWindow: 1,
                    renderHeader: function (perPage, offset, total) {
                        $('#pager-header').html($('<span></span>').text('displaying ' + Math.min(total, offset + 1) + ' to ' + Math.min(total, offset + perPage) + ' of ' + total));
                    }
                }));

                var fields = [ 'keywords_exact', 'agencies', 'author' ];
                for (var i = 0, l = fields.length; i < l; i++) {
                    Manager.addWidget(new AjaxSolr.TagcloudWidget({
                        id: fields[i],
                        target: '#' + fields[i],
                        field: fields[i]
                    }));
                }

                Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
                    id: 'currentsearch',
                    target: '#selection'
                }));

                Manager.addWidget(new AjaxSolr.AutocompleteWidget({
                    id: 'text',
                    target: '#search',
                    fields: [ ]
                }));

                Manager.addWidget(new AjaxSolr.ServiceAreaWidget({
                    id: 'serviceareas',
                    target: '#service_areas',
                    field: 'service_area_descendent_path'
                }));

                Manager.init();
                Manager.store.addByValue('q', '*:*');
                var params = {
                    facet: true,
                    'facet.field': [ 'keywords_exact', 'service_area_descendent_path','author','date' ],
                    'facet.limit': 20,
                    'facet.mincount': 1,
                    'f.keywords.facet.limit': 50,
                    'f.countryCodes.facet.limit': -1,
                    'facet.date': 'date',
                    'facet.date.start': '2000-01-01T00:00:00.000Z/DAY',
                    'facet.date.end': '2017-01-01T00:00:00.000Z/DAY+1DAY',
                    'facet.date.gap': '+1DAY',
                    'json.nl': 'map'
                };

                for (var name in params) {
                    Manager.store.addByValue(name, params[name]);
                }

                Manager.doRequest();
            //});
            return this;
        }

    });

    return LoginView;
});

