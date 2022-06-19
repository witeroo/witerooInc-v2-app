"use strict";

// mobile menu
const $hamburger = $(".hamburger");
$hamburger.click(function(e) {
    $hamburger.toggleClass("is-active");
    // Do something else, like open/close menu
    $("#navbar-nav").toggleClass("open")
});


// delayed smooth scroll on landing page
$('.main-nav li a').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
        location.hostname == this.hostname) {
        let $target = $(this.hash);
        $target = $target.length && $target ||
            $('[name=' + this.hash.slice(1) + ']');
        if ($target.length) {
            let targetOffset = $target.offset().top;
            $('html')
                .animate({
                    scrollTop: targetOffset
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
if ($('#subscribe-btn')) {
    // show subscription form container
    $('#subscribe-btn').click(() => {
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

    // hide subscription form container
    $('.subscription-form-container .close-btn').click(() => {
        $('.subscription-form-container').hide();
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
    $('.subscription-body form input, .subscription-body form select').on('focus, click, change', validateSubscriptionFormInputFields);
}



// toggle display blog nav
if ($('.navbar-drop-btn')) {
    $('.navbar-drop-btn').click(function(e) {
        e.preventDefault();
        $(this).next('.navbar').toggle();
    })
}



// load more projects
$('#more-projects').click(function(e) {
    e.preventDefault();
    $('.load-more-projects').slideDown();
    $(this).hide();
})