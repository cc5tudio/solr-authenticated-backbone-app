var Manager;

requirejs.config({
  paths: {
    core: '../lib/ajax-solr/core',
    managers: '../lib/ajax-solr/managers',
    widgets: '../lib/ajax-solr/widgets',
    reuters: '../lib/ajax-solr/examples/reuters-requirejs/widgets'
  },
 // urlArgs: "bust=" +  (new Date()).getTime()
});

(function ($) {

define([
  'managers/Manager.jquery',
  'core/ParameterStore',
  'reuters/ResultWidget',
  'reuters/TagcloudWidget',
  'reuters/CurrentSearchWidget.9',
  'reuters/AutocompleteWidget',
  'reuters/CountryCodeWidget',
  'reuters/CalendarWidget',
  'reuters/ServiceAreaWidget',
  'widgets/jquery/PagerWidget'
], function () {
  $(function () {
    Manager = new AjaxSolr.Manager({
      solrUrl: 'http://localhost:8983/solr/Documents/'
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

    Manager.addWidget(new AjaxSolr.CountryCodeWidget({
      id: 'countries',
      target: '#countries',
      field: 'countryCodes'
    }));

    Manager.addWidget(new AjaxSolr.CalendarWidget({
      id: 'calendar',
      target: '#calendar',
      field: 'date'
    }));

    Manager.addWidget(new AjaxSolr.ServiceAreaWidget({
        id: 'serviceareas',
        target: '#service_areas',
        field: 'service_areas_descendent_path'
    }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      'facet.field': [ 'keywords_exact', 'service_areas_descendent_path','author','date' ],
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
  });

  $.fn.showIf = function (condition) {
    if (condition) {
      return this.show();
    }
    else {
      return this.hide();
    }
  }
});

})(jQuery);
