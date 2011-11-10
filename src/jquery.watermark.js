/**
 * jquery.watermark
 *
 * A script for watermarking input/textarea fields in jQuery.
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
    var emptyClass = options['empty_class'];

    $box.addClass(options['watermark_class']);

    if (options['hide_label'] && options['hide_label'])
      options['label'].hide();

    if (options['set_title'])
      $box.attr('title', options['watermark']);

    if (!$box.val() || $box.hasClass(emptyClass)) {
      // We have an empty box, restore the watermark text
      $box.val(options['watermark']);
      $box.addClass(options['empty_class']);
    } else if ($box.val() === options['watermark'] && !options['accept_watermark']) {
      // The box already contains the watermark text
      $box.addClass(options['empty_class']);
    }

    $box.bind('focus.watermark', function() {
      var options = $(this).data('watermark-options');
      if ($(this).hasClass(options['empty_class'])) {
        $(this).val('').removeClass(options['empty_class']);
      }
    });

    $box.bind('blur.watermark', function() {
      var options = $(this).data('watermark-options');

      if (!$(this).val() || ($(this).val() == options['watermark'] && !options['accept_watermark'])) {
        // no value specified on blur
        $(this).addClass(options['empty_class']);
        $(this).val(options['watermark']);
      } else {
        // We have a value
        $(this).removeClass(options['empty_class']);
      }
    });
  };

  function unbindWatermark($box, options) {
    $box.removeClass(options['watermark_class']);

    if ($box.hasClass(options['empty_class'])) {
      // This field is currently "empty", discard its value
      $box.val('');
    }

    $box.unbind('.watermark').removeClass(options['empty_class']);

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

    options = $.extend({
      watermark_class  : 'watermarked',
      empty_class      : 'empty',
      accept_watermark : false
    }, options);

    console.log(options);

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
