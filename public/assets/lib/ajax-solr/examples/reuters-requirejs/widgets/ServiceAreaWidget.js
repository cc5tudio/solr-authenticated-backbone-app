(function (callback) {
    if (typeof define === 'function' && define.amd) {
        define(['core/AbstractFacetWidget'], callback);
    }
    else {
        callback();
    }
}(function () {

    (function ($) {

        AjaxSolr.ServiceAreaWidget = AjaxSolr.AbstractFacetWidget.extend({
            beforeRequest: function(){
              console.log("before");
            },
            init: function(){
                console.log("init");
            },
            afterRequest: function () {
                console.log(this.manager.response);
                if (this.manager.response.facet_counts.facet_fields[this.field] === undefined) {
                    $(this.target).html('no items found in current selection');
                    return;
                }

                var maxCount = 0;
                var objectedItems = [];
                for (var facet in this.manager.response.facet_counts.facet_fields[this.field]) {
                    var count = parseInt(this.manager.response.facet_counts.facet_fields[this.field][facet]);
                    if (count > maxCount) {
                        maxCount = count;
                    }

                    objectedItems.push({ facet: facet, count: count });
                }

                objectedItems.sort(function (a, b) {
                    return a.facet < b.facet ? -1 : 1;
                });

                $(this.target).empty();
                for (var i = 0, l = objectedItems.length; i < l; i++) {
                    var facet = objectedItems[i].facet;
                    var count = objectedItems[i].count;

                    $(this.target).append(
                        $('<a href="#" class="path_item"></a><br/>')
                            .text(facet+' ('+count+')')

                            .click(this.clickHandler(facet))
                    );
                }
            }
        });

    })(jQuery);

}));
