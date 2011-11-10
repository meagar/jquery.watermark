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

  function bindWatermark($box, options) {
    if (options['hide_label'] && options['hide_label'])
      options['label'].hide();

    if (options['set_title'])
      $box.attr('title', options['watermark']);


    if (!$box.val() || $box.hasClass('empty')) {
      $box.val(options['watermark']);
      $box.addClass('empty');
    } else if ($box.val() === options['watermark'] && !options['accept_watermark']) {
      $box.addClass('empty');
    }

    $box.bind('focus.watermark', function() {
      if ($(this).hasClass('empty')) {
        $(this).val('').removeClass('empty');
      }
    });

    $box.bind('blur.watermark', function() {
      var options = $(this).data('watermark-options');

      if (!$(this).val() || $(this).val() == options['watermark']) {
        // no value specified on blur
        $(this).addClass('empty');
        $(this).val(options['watermark']);
      } else {
        // We have a value
        $(this).removeClass('empty');
      }
    });
  };

  function unbindWatermark($box, options) {
    if ($box.hasClass('empty')) {
      // This field is currently "empty", discard its value
      $box.val('');
    }

    $box.unbind('.watermark').removeClass('empty');

    if (options['label'] && options['hide_label'])
      options['label'].show();
  }


	$.fn.watermark = function(watermark, options) {

    if (!options) {
      if ($.isPlainObject(watermark)) {
        options = watermark;
        watermark = null;
      } else {
        options = {};
      }
    }

    options = $.extend({ }, options);

		$(this).each(function() {
			var $box = $(this), $label = null;

      if (watermark === false) {
        unbindWatermark($box, options);
        return;
      } else if (typeof(watermark) === 'string') {
				// We've been given an explicit watermark
				options['watermark'] = watermark;
			} else {
				// We weren't given a watermark, attempt to guess
				$label = $('label[for=' + $box.attr('id') + ']');

				if ($label.size()) {
          options['label'] = $label;
					options['watermark'] = $label.text();
				} else if ($box.attr('title')) {
					options['watermark'] = $box.attr('title');
				} else {
					alert('Unable to determine watermark for field ' + $box.attr('id'));
          return;
				}
			}

			$box.data('watermark-options', options);

      bindWatermark($box, options);
		});

		return this;
	};

})(jQuery);
