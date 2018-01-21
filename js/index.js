$(document).ready(function() {
  $('.accordion').find('.accordion-toggle').click(function() {
    $(this).next().slideToggle('600');
    $('.accordion-content').not($(this).next()).slideUp('600');
  });
  $('.accordion-toggle').on('click', function() {
    $(this).toggleClass('active').siblings().removeClass('active');
  });
});

$('#photo-wall-form, #custom-form, #stage-form').submit(function(e) {
  e.preventDefault();
  name = $(this).attr('id');
  var $inputs = $(`#${name} :input`);

  event_date = $(`#${name} #event-date`).val();
  height = $(`#${name} #height`).val();
  width = $(`#${name} #width`).val();
  contact = $(`#${name} #contact`).val();
  email = $(`#${name} #email`).val();

  if (event_date == '') {
    $(`#${name} .event-date-alert`).removeClass('hidden');
  } else {
    $(`#${name} .event-date-alert`).addClass('hidden');
  }

  if (height < 8 || width < 8) {
    $(`#${name} .size-alert`).removeClass('hidden');
  } else {
    $(`#${name} .size-alert`).addClass('hidden');
  }

  // not sure if you wanted this, but I thought I'd add it.
  // get an associative array of just the values.
  var values = {};
  $inputs.each(function() {
    values[this.name] = $(this).val();
  });

  console.log(values);

  window.location = `thank-you.html?email=${email}&contact=${contact}`;
});

$('#photo-wall-form, #custom-form, #stage-form').change(function() {
  name = $(this).attr('id');
  delivery_timing = $(`#${name} [name=delivery-timing]:checked`).val();
  teardown_timing = $(`#${name} [name=teardown-timing]:checked`).val();

  if (name == 'photo-wall-form') {
    cost = 1164;
  } else if (name == 'stage-form') {
    cost = 2329.60;
  } else if (name == 'custom-form') {
    height = $(`#${name} #height`).val();
    width = $(`#${name} #width`).val();
    cost = height * width * 14 * 1.3;

    additional_panels = $(`#${name} [name=additional-panels]:checked`).val();

    if (additional_panels == 'back-panels') {
      $('#side-panels').parent().removeClass('active');
      cost += 40;
    } else {
      $('#back-panels').parent().removeClass('active');
    }
  }

  if (delivery_timing == 'weekend') {
    cost += 50;
  }

  if (teardown_timing == 'weekend') {
    cost += 50;
  }

  $(`#${name} .calculated-cost`).text(numeral(cost).format('0,0'));
});

$('.datepicker').datepicker({
  format: 'dd/mm/yyyy',
  autoclose: true,
  todayHighlight: true
});
