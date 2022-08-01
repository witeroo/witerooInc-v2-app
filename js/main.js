"use strict";

// mobile menu
const $hamburger = $(".hamburger");
$hamburger.click(function(e) {
    $hamburger.toggleClass("is-active");
    // Do something else, like open/close menu
    $("#navbar-nav").toggleClass("open")
});


// delayed smooth scroll on landing page
$('a').click(function() {
    if ($("#navbar-nav").hasClass("open")) {
        $(".hamburger").click();
    }
    // $('.navbar').hide();

    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
        location.hostname == this.hostname && $(this).attr('href') != '#') {
        let $target = $(this.hash);
        $target = $target.length && $target ||
            $('[name=' + this.hash.slice(1) + ']');
        if ($target.length) {
            let targetOffset = $target.offset().top;
            $('html')
                .animate({
                    scrollTop: targetOffset - 89
                }, 2000);
            return false;
        }
    }
});



// hero slide animation
if ($('.hero-slide .slide-item')) {

    let currentPos = 0;

    $($('.hero-slide .slide-item')[currentPos]).addClass('active');
    $($('.hero-slide .indicator')[currentPos]).addClass('active');

    setInterval(() => {
        currentPos++;
        if (currentPos == 4) {
            currentPos = 0;
        }

        $('.hero-slide .slide-item.active').removeClass('active');
        $('.hero-slide .indicator.active').removeClass('active');

        $($('.hero-slide .slide-item')[currentPos]).addClass('active');
        $($('.hero-slide .indicator')[currentPos]).addClass('active');
    }, 8250);
}



// business section slide transition
if ($('.business-img .img')) {
    setInterval(() => {
        let curr = $('.business-img .img.active');
        let next = curr.next('div');

        next = next.length && next || $('.business-img .img')[0];

        curr.toggleClass('active');
        $(next).toggleClass('active');
    }, 2000);
}



// article section mobile scroll
if ($('.articles-indicators .indicator')) {

    $('.articles-indicators .indicator').click(function() {
        const singleArticleWidth = $('.article-cards-row .article-card-item').width();

        let offset = singleArticleWidth * $(this).index();

        $('.articles .articles-container, .blogs .recent-blogs-container').scrollLeft(offset);
    });

    $($('.articles-indicators .indicator')[1]).click();


    function activateArticleIndicator(indicator) {
        $('.articles-indicators .indicator.active').removeClass('active');
        $(indicator).addClass('active');
    }


    $('.articles-container').scroll(function() {
        const singleArticleWidth = $('.article-cards-row .article-card-item').width();
        let articlesScrollOffset = $('.articles-container').scrollLeft();

        if (articlesScrollOffset < singleArticleWidth) {
            activateArticleIndicator($('.articles-indicators .indicator')[0]);
        } else if ((articlesScrollOffset >= singleArticleWidth) && articlesScrollOffset < singleArticleWidth * 2) {
            activateArticleIndicator($('.articles-indicators .indicator')[1]);
        } else {
            activateArticleIndicator($('.articles-indicators .indicator')[2]);
        }

    });
}



// subscription form popup
let subscriptionActionTaken = false;
let subTriggerOffset = 0;
if ($('section.articles').offset()) {
    subTriggerOffset = $('section.articles').offset().top;
} else if ($('section.subscribe').offset()) {
    subTriggerOffset = $('section.subscribe').offset().top - 700;
}
$(document).scroll(function() {
    if (!subscriptionActionTaken) {
        if ($(window).scrollTop() >= subTriggerOffset) {
            $('.modal.subscription-popup-container').attr('style', 'display:flex;');
        }
    }
});

$('.modal.subscription-popup-container .btn, .modal.subscription-popup-container .close-btn').click(() => {
    subscriptionActionTaken = true;
    $('.modal.subscription-popup-container').hide();
})



if ($('#subscribe-btn')) {
    // show subscription form container
    $('#subscribe-btn, #popup-subscribe-btn').click(() => {
        $('.subscription-form-container').show();
    });

    // switch form
    $('#subscriber-type').change(function() {
        if ($(this).val() == 'Individual') {
            $('#business-form').slideUp();
            $('#individual-form').slideDown();
        } else if ($(this).val() == 'Business') {
            $('#individual-form').slideUp();
            $('#business-form').slideDown();
        }
    });

    // hide modal container
    $('.modal .close-btn').click(() => {
        $('.modal').hide();
    });


    function validateSubscriptionFormInputFields() {
        let form;
        if ($('#subscriber-type').val() == 'Individual') {
            form = $('#individual-form');
        } else if ($('#subscriber-type').val() == 'Business') {
            form = $('#business-form');
        }

        if (form) {
            let allFilled = true;
            $(form).find('input, select').each(function() {
                if ($(this).val() == '') {
                    allFilled = false;
                    return false;
                }
            });

            if (allFilled) {
                form.find('input[type="submit"]').attr('disabled', false).css('opacity', 1);
            } else {
                form.find('input[type="submit"]').attr('disabled', true).css('opacity', 0.5);
            }
        }
    }
    $('.subscription-body form input, .subscription-body form select').on('focus click change keyup', validateSubscriptionFormInputFields);
}



// toggle display blog nav
if ($('.navbar-drop-btn')) {
    $('.navbar-drop-btn').click(function(e) {
        e.preventDefault();
        $(this).next('.navbar').toggle();
    })
}



// state cities dropdown
$('select[name="country"]').change(function() {
    let countryCode = $(this).find(':selected').attr('data-value');
    let stateOpts = $(this).parent().find('select[name="state"]');
    $(stateOpts).empty();

    if (countryCode) {
        $.getJSON('states-cities/' + countryCode + '.json', (data) => {
            let states = [];
            $(data).each(function() {
                states.push('<option>' + $(this)[0].name + '</option>')
            })

            $(stateOpts).append('<option value="">State</option>' + states)
        })
    }
})

$('select[name="state"]').change(function() {
    let countryCode = $(this).parents('form').find('select[name="country"]').find(':selected').attr('data-value');
    let state = $(this).val();
    let cityOpts = $(this).parent().find('select[name="city"]');
    $(cityOpts).empty();

    if (state) {
        $.getJSON('states-cities/' + countryCode + '.json', (data) => {
            let jsonCities = data.find(jsonState => jsonState.name === state).cities;

            let cities = jsonCities.map((city) => {
                return '<option>' + city + '</option>';
            });

            $(cityOpts).append('<option value="">City</option>' + cities)
        })
    }
})