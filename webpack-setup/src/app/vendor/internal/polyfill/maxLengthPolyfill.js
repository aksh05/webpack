(function($) {
    var enableMaxLength = function enableMaxLength() {
        $(document).on('keyup', '[maxlength]', function(e) {
            var max = $(e.target).attr('maxlength') && parseInt($(e.target).attr('maxlength')) || 0;
            if (max && ($(e.target).val().length > max)) {
                $(e.target).val($(e.target).val().substr(0, max));
            }
        });
    };
    enableMaxLength();
})(jQuery);
