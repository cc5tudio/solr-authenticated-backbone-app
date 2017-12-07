/**
 * @desc        configure aliases and dependencies
 */

if (typeof DEBUG === 'undefined') DEBUG = false;

require.config({

    baseUrl: '/',

    paths: {
        'jquery'                : 'assets/lib/jquery',
        'jqueryui'              : 'assets/lib/jquery-ui.min',
        'underscore'            : 'assets/lib/underscore',         // load lodash instead of underscore (faster + bugfixes)
        'backbone'              : 'assets/lib/backbone',
        'bootstrap'             : 'assets/vendor/bootstrap/js/bootstrap',
        'text'                  : 'assets/lib/text',
        'parsley'               : 'assets/lib/parsley',
        'core'                  : 'assets/lib/ajax-solr/core',
        'managers'              : 'assets/lib/ajax-solr/managers',
        'widgets'               : 'assets/lib/ajax-solr/widgets',
        'reuters'               : 'assets/lib/ajax-solr/examples/reuters-requirejs/widgets'
    },

    // non-AMD lib
    shim: {
        'underscore'            : { exports  : '_' },
        'backbone'              : { deps : ['underscore', 'jquery'], exports : 'Backbone' },
        'bootstrap'             : { deps : ['jquery'], exports : 'Bootstrap' },
        'parsley'               : { deps: ['jquery'] }
    }

});

require(['main']);           // Initialize the application with the main application file.
