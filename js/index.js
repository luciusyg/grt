$(document).ready(function() {
  $('.accordion')
    .find('.accordion-toggle')
    .click(function() {
      $(this)
        .next()
        .slideToggle('600');
      $('.accordion-content')
        .not($(this).next())
        .slideUp('600');
    });
  $('.accordion-toggle').on('click', function() {
    $(this)
      .toggleClass('active')
      .siblings()
      .removeClass('active');
  });
});

$('#contact-form').submit(function(e) {
  e.preventDefault();
  name = $(this).attr('id');
  var inputs = {
    name: null,
    email: null,
    contact: null,
    message: null
  };

  inputs.name = $(`#${name} #name`).val();
  inputs.contact = $(`#${name} #contact`).val();
  inputs.email = $(`#${name} #email`).val();
  inputs.message = $(`#${name} #message`).val();

  var valid = true;
  for (var key in inputs) {
    if (inputs[key] == '') {
      $(`#${name} .${key}-alert`).removeClass('hidden');
      valid = false;
    } else {
      $(`#${name} .${key}-alert`).addClass('hidden');
    }
  }
  if (!valid) return false;

  $(`#${name} button.submit-job-btn`).attr('disabled', 'disabled');
  $(`#${name} button.submit-job-btn`).html(
    '<i class="fa fa-circle-o-notch fa-spin"></i> Sending'
  );
  send_contact_email(inputs);
});

$('#photo-wall-form, #custom-form, #stage-form').submit(function(e) {
  e.preventDefault();
  name = $(this).attr('id');
  var inputs = {
    event_date: null,
    height: null,
    width: null,
    instructions: null,
    name: null,
    contact: null,
    email: null,
    banner_type: null,
    delivery_timing: null,
    teardown_timing: null,
    additional_panels: null,
    print_type: null
  };

  inputs.event_date = $(`#${name} .event-date`).val();
  inputs.height = $(`#${name} #height`).val();
  inputs.width = $(`#${name} #width`).val();
  inputs.instructions = $(`#${name} #instructions`).val();
  inputs.name = $(`#${name} #name`).val();
  inputs.contact = $(`#${name} #contact`).val();
  inputs.email = $(`#${name} #email`).val();
  inputs.banner_type = name.replace('-form', '');
  inputs.delivery_timing = $(`#${name} [name=delivery-timing]:checked`).val();
  inputs.teardown_timing = $(`#${name} [name=teardown-timing]:checked`).val();
  inputs.additional_panels = $(
    `#${name} [name=additional-panels]:checked`
  ).val();
  inputs.print_type = $(`#${name} [name=print-type]:checked`).val();

  var valid = true;
  for (var key in inputs) {
    if (inputs[key] == '') {
      $(`#${name} .${key}-alert`).removeClass('hidden');
      valid = false;
    } else {
      $(`#${name} .${key}-alert`).addClass('hidden');
    }

    if (key == 'width' || key == 'height') {
      if (inputs.height < 8 || inputs.width < 8) {
        $(`#${name} .size-alert`).removeClass('hidden');
        valid = false;
      } else {
        $(`#${name} .size-alert`).addClass('hidden');
      }
    }

    if (key == 'instructions') valid = true;
  }
  if (!valid) return false;

  $(`#${name} button.submit-job-btn`).attr('disabled', 'disabled');
  $(`#${name} button.submit-job-btn`).html(
    '<i class="fa fa-circle-o-notch fa-spin"></i> Sending'
  );
  send_email(inputs);
});

$('#photo-wall-form, #custom-form, #stage-form').change(function() {
  name = $(this).attr('id');
  delivery_timing = $(`#${name} [name=delivery-timing]:checked`).val();
  teardown_timing = $(`#${name} [name=teardown-timing]:checked`).val();

  if (name == 'photo-wall-form') {
    cost = 1164.6;
  } else if (name == 'stage-form') {
    cost = 2329.6;
  } else if (name == 'custom-form') {
    height = $(`#${name} #height`).val();
    width = $(`#${name} #width`).val();

    print_type = $(`#${name} [name=print-type]:checked`).val();
    base_cost = 14;

    if (print_type == 'banner') {
      base_cost = 12;
    }

    cost = height * width * base_cost * 1.3;

    additional_panels = $(`#${name} [name=additional-panels]:checked`).val();

    if (additional_panels == 'back-panels') {
      $('#side-panels')
        .parent()
        .removeClass('active');
      cost += height * width * 2.5;
    } else {
      $('#back-panels')
        .parent()
        .removeClass('active');
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

function send_contact_email(inputs) {
  subject = `${inputs.name} contacted you`;
  message = `
    <p>Email: ${inputs.email}</p>
    <p>Contact No: ${inputs.contact}</p>
    <p>Message: ${inputs.message}</p>`;

  Email.send('orders@greate.sg', 'orders@greate.sg', subject, message, {
    token: '10f7f77f-e414-491c-8796-42e1591c0aa4',
    callback: function done(message) {
      window.location = `thank-you.html?email=${inputs.email}&contact=${
        inputs.contact
      }`;
    }
  });
}

function send_email(inputs) {
  subject = `New order from ${inputs.name}`;
  message = `
    <p>Banner: ${inputs.banner_type}</p>
    <p>Event Date: ${inputs.event_date}</p>
    <p>Delivery Timing: ${inputs.delivery_timing}</p>
    <p>Teardown Timing: ${inputs.teardown_timing}</p>
    <p>Width: ${inputs.width}</p>
    <p>Height: ${inputs.height}</p>
    <p>Print Type: ${inputs.print_type}</p>
    <p>Additional Panels: ${inputs.additional_panels}</p>
    <p>Additional Instructions: ${inputs.instructions}</p>
    <p>Email: ${inputs.email}</p>
    <p>Contact No: ${inputs.contact}</p>`;

  Email.send('orders@greate.sg', 'orders@greate.sg', subject, message, {
    token: '10f7f77f-e414-491c-8796-42e1591c0aa4',
    callback: function done(message) {
      window.location = `thank-you.html?email=${inputs.email}&contact=${
        inputs.contact
      }`;
    }
  });
}
