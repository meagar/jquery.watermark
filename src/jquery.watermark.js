/**
 * jquery.watermark
 *
 * A script for watermarking input fields in jQuery.
 *
 * Usage:
 *
 *   $.watermark accepts a single optional argument which is the string to
 *   watermark the field with. If omitted, the plugin attempts to guess the
 *   watermark, first by finding labels for the given field, then by checking
 *   the field's "title" attribute.
 *
 *   Watermarking can be disabled for a field by calling
 *
 *   $('selector').watermark(false);
 *
 * Examples:
 *
 *   // Watermark a field with the string 'Username'
 *   $('input.username').watermark('Username');
 *
 *   // Attempt to guess the watermark for all inputs (first their labels, then their titles)
 *   $('input').watermark();
 */
(function($) {

	$.fn.watermark = function(watermark) {

		$(this).each(function() {
			var $box = $(this), altText = null;

      if (watermark === false) {
        if ($(this).hasClass('empty')) {
          // This field is currently "empty", discard its value
          $(this).val('')
        }
        $(this).unbind('.watermark.jquery');
        return;
      } else if (typeof(watermark) === 'string') {
				// We've been given an explicit watermark
				altText = watermark;
			} else {
				// We weren't given a watermark, attempt to guess
				var label = $('label[for=' + $box.attr('id') + ']');

				if (label.size()) {
					//label.hide();
					altText = label.text();
				} else if ($box.attr('title')) {
					altText = $box.attr('title');
				} else {
					alert('Unable to determine watermark for field ' + $box.attr('id'));
					altText = '';
				}
			}

			$box.data('watermark-text', altText);

			if (!$box.val() || $box.hasClass('empty')) {
				$box.val(altText);
				$box.addClass('empty');
			} else if ($box.val() === altText) {
				$box.addClass('empty');
			}

			$box.attr('title', altText);

		}).bind('focus.watermark.jquery', function() {
			if ($(this).hasClass('empty')) {
				$(this).removeClass('empty');
				$(this).val('');
			}
		}).bind('blur.watermark.jquery', function() {
			var watermark_text = $(this).data('watermark-text');

			if (!$(this).val() || $(this).val() == watermark_text) {
				// no value specified on blur
				$(this).addClass('empty');
				$(this).val(watermark_text);
			} else {
				// We have a value
				$(this).removeClass('empty');
			}
		});

		return this;
	};

})(jQuery);
