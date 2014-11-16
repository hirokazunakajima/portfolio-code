/*
 *
 *    Remove page loader, then start moving tagline
 *
 */

$(window).load(function () {

    var bodyH = $('body').height();

    $('#fade').css('height', bodyH).delay(900).fadeOut(800);
    $('#loader').delay(200).fadeOut(1000, '', function () {
        setTimeout(taglineIn, 750);
    });

    // attach FastClick to get quick response when you tap on touch device
    FastClick.attach(document.body);
    // Initial Featured Area Animation
    taglineOut(true);

});


/*
 *
 *    Feature detection for iOS and Touch device
 *
 */

var feature = (function () {

    var _agent = navigator.userAgent;
    var _isiOS;
    var _isTouchDevice;

    if (_agent.match(/(iPhone|iPod|iPad)/i)) {
        _isiOS = true;
    } else {
        _isiOS = false;
    }

    if (_agent.match(/(iPhone|iPod|iPad|Blackberry|Android)/)) {
        _isTouchDevice = true;
    }

    try {
        document.createEvent('TouchEvent');
        _isTouchDevice = true;
    }
    catch (e) {
        _isTouchDevice = false;
    }

    return {
        isiOS: function () {
            return _isiOS;
        },
        isTouchDevice: function () {
            return _isTouchDevice;
        }
    }
})();


/*
 *
 *    init Animation by adding class
 *
 */

// save ids which are used for about, work, contact section
var sectionIDs = ['about', 'work', 'contact'];

// initialization. "outQuick" class is gonna be used as a key for first section title moving in.
for (var i = 0; i < sectionIDs.length; i++) {
    $('#' + sectionIDs[i] + ' .section-title').addClass('outQuick');
}

/*
 *
 *    Create work area
 *
 */

//  Creating each work are using using swipe.js
$('.work-each-wrapper').each(function (i) {

    var itemLength = $(this).find('.swipe-wrap').children('div').length;
    $(this).find('.work-total-num').text(itemLength);
    var btns = $(this).find('.slide-btn');
    var $workEachWrapper = $(this);

    var swipe = new Swipe($(this).find('.swipe')[0], {
        continuous: false,
        callback: function (index) {

            $workEachWrapper.find('.work-current-index').html(index + 1);

            for (var j = 0; j < btns.length; j++) {
                if (j == index) {
                    $(btns[j]).addClass('slide-btn-active');
                } else {
                    $(btns[j]).removeClass('slide-btn-active');
                }
            }
        }
    });

    $(this).find('.slide-btn-wrapper li:first-child').children().addClass('slide-btn-active');
    $(this).find('.slide-btn').each(function (k) {
        $(this).click(function () {
            swipe.slide(k, 300);
        });
    });
});

/*
 *
 *    For Retina display
 *
 */

(function () {

    function isRetina() {
        if (window.devicePixelRatio > 1) {
            return true;
        } else {
            return false;
        }
    }

    function init() {
        window.onload = function () {
            var images = [];
            var imageTags = document.querySelectorAll('img');
            for (var i = 0; i < imageTags.length; i++) {
                images.push(new getImages(imageTags[i]));
            }
        }
    }

    function getImages(imgTag) {
        this.el = imgTag;
        this.path = new saveImagePath(imgTag);
        var that = this;
        this.path.hasRetinaImg(function (hasRetina) {
            if (hasRetina) {
                that.swap();
            }
        });
    }

//creating retina path
    function saveImagePath(imgTag) {
        var prefix = '@2x';
        var imgSrc, imgfullName, lastIndex, folderPath, imgName, extention, retinaImgPath;
        imgSrc = imgTag.src;
        imgfullName = imgSrc.split('/').pop().split('.');
        lastIndex = imgSrc.lastIndexOf('/');
        folderPath = imgSrc.substring(0, lastIndex + 1);
        imgName = imgfullName.shift();
        extention = imgfullName.pop();
        retinaImgPath = folderPath + imgName + prefix + '.' + extention;
        this.originalPath = imgSrc;
        this.retinaPath = retinaImgPath;
    }

// check retina check if it exists
    saveImagePath.prototype = {
        hasRetinaImg: function (callback) {
            $.ajax({
                url: this.retinaPath,
                type: 'HEAD',
                success: function (msg, txt, response) {
                    var contentType = response.getResponseHeader('Content-Type');
                    if (contentType != null || contentType.match(/^image/i)) {
                        return callback(true); // swap image to retina one
                    } else {
                        return callback(false); // wont swap
                    }
                },
                error: function () {
                    return callback(false);
                }
            });
        }
    }

// swap images to retina image
    getImages.prototype = {
        swap: function () {
            this.src = this.path.retinaPath;
            // constrain ratio
            this.el.setAttribute('width', this.el.offsetWidth);
            this.el.setAttribute('height', this.el.offsetHeight);
            this.el.src = this.path.retinaPath;
        }
    }

    if (isRetina()) {
        init();
    }

})();

/*
 *
 *   Animation function for Tagline
 *
 */

function taglineIn() {
    var headLines = $('.tagline-list');

    if (!$(headLines[0]).hasClass('fadeInDown')) {
        $.each(headLines, function (i, elem) {

            if ($(headLines[i]).hasClass('fadeOutUpQuick')) {   // remove class used initialization
                $(elem).removeClass('fadeOutUpQuick').css('opacity', 0);
            }

            $(elem).clearQueue();
            $(elem).removeClass('fadeOutUp').css('opacity', 0).delay(i * 120).queue(function () {
                $(this).css('opacity', 1).addClass('fadeInDown').dequeue();
            });
        });

        var $tab = $('#take-action-btn');
        if ($tab.hasClass('fadeOutUpQuick')) {
            $tab.removeClass('fadeOutUpQuick').css('opacity', 0);// this will call only once which is first time page load
        }

        $tab.removeClass('fadeOutUp').css('opacity', 0).delay(240).queue(function () {
            $(this).css('opacity', 1).addClass('fadeInDown').dequeue();
        });

    }
}

// init will be passed "true" when first page loading
function taglineOut(init) {
    var headLinesReverse = $('.tagline-list').get().reverse();

    if (!$(headLinesReverse[0]).hasClass('fadeOutUp')) {
        $.each(headLinesReverse, function (i, elem) {

            if (init) {

                $(elem).css('opacity', 0).addClass('fadeOutUpQuick');

            } else {

                $(elem).clearQueue();
                $(elem).removeClass('fadeInDown').delay(i * 120).queue(function () {
                    $(this).css('opacity', 0).addClass('fadeOutUp').dequeue();
                });
            }

        });

        if (init) {
            $('#take-action-btn').css('opacity', 0).addClass('fadeOutUpQuick');

        } else {

            $('#take-action-btn').removeClass('fadeInDown').css('opacity', 0).addClass('fadeOutUp');

        }
    }
}

/*
 *
 *    Scroll related
 *
 */

// Detecting click on what makes scroll happen
$('a[href^=#]').click(function () {
    dynamicScrollTrigger($(this).attr("href"));
    return false;
});

// Page scrolling
var scroll_timer;
var target;

function dynamicScrollTrigger(t) {
    if (scroll_timer) clearTimeout(scroll_timer);
    target = t;

    getPosition();
    dynamicScroll();
}

function getPosition() {

    if (target != "#") {
        cPos = $(target).offset().top;
    }
}

function dynamicScroll() {

    var dY;
    var to = 40;// destination position
    if (target == '#contact' && window.innerHeight == 1024 && window.innerWidth == 768) {
        to = 180; // this value is only fitting such as iPad
    }
    var divider = 3; // more short more quick dynamic scroll
    var perTime = 24; // time out value, more short more smooth

    if (scroll_timer) clearTimeout(scroll_timer);

    var scrollPos = $(window).scrollTop();

    if (target == "#") {

        dY = Math.floor((scrollPos - (scrollPos / divider)));

    } else {

        getPosition();
        dY = Math.floor((cPos - to - scrollPos) / divider);

    }

    if (Math.abs(dY) > 0) {

        if (target == "#") {
            window.scrollTo(0, dY);

        } else {

            window.scrollTo(0, scrollPos + dY);

        }
        scroll_timer = setTimeout(dynamicScroll, perTime);

    } else {
        clearTimeout(scroll_timer);

    }
}

// if get scroll as dynamic scrolling..stop dynamic scroll timer
var mousewheel = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
try {
    document.addEventListener(mousewheel, stopDynamicScroll, false);
} catch (e) {
    document.attachEvent("onmousewheel", stopDynamicScroll);//for legacy IE
}

// if someone send a event while dynamic scrolling, dynamic scroll is gonna stop
function stopDynamicScroll(e) {
    if (scroll_timer) clearTimeout(scroll_timer);
}


// Functionality which will associate with scrolling
$(window).scroll(scrolling);

if (feature.isiOS()) {
    $(window).on('touchstart', stopDynamicScroll);
    $(window).on('touchmove', scrolling);
}

function scrolling() {

    // set CSS to "while solid background" again in case for touch and moving happen while loading page
    if (feature.isiOS()) {
        $('#fade').css({position: 'fixed', top: 0, left: 0});
    }

    //  changing section threshold
    var changePosFromTop = 190;

    for (var i = 0; i < sectionIDs.length; i++) {

        var sectionId = '#' + sectionIDs[i];
        var sectionPos = $(sectionId)[0].getBoundingClientRect().top;
        var t = sectionId + ' .section-title';

        if (sectionPos < changePosFromTop) {
            if ($(t).hasClass('out') || $(t).hasClass('outQuick')) {

                if (!feature.isTouchDevice() && sectionId == "#about") {
                    taglineOut();
                }

                $(t).removeClass('out outQuick').addClass('in');
                $('#navigation li').css('background-image', 'none');
                $('#navigation a[href=' + sectionId + ']').parent('li').css({'background-image': 'url(./img/nav.png)', 'background-repeat': 'no-repeat', 'background-position': 'center bottom'});
            }

        } else {

            if ($(t).hasClass('in') || $(t).hasClass('inQuick')) {

                if (!feature.isTouchDevice() && sectionId == "#about") {
                    taglineIn();
                }

                $(t).removeClass('in').addClass('out');
                $('#navigation li').css('background-image', 'none');
                $('#navigation a[href=#' + sectionIDs[i - 1] + ']').parent('li').css({'background-image': 'url(./img/nav.png)', 'background-repeat': 'no-repeat', 'background-position': 'center bottom'});

            }
        }
    }
}

/*
 *
 *    Video related
 *
 */

$('#video-cover-img').click(function () {
    playVideo();
    return false;
});

// When "video image" is clicked, this will fire
function playVideo() {
    $('#video-img').after('<iframe src="//player.vimeo.com/video/104029308?title=0&amp;byline=0&amp;portrait=0&amp;autoplay=1" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>').remove();

}


/*
 *
 *    Contact form validation
 *
 */

function validate() {

    if ($('#submit-btn').data('sending') === true) {
        return;
    }

    var name = $('#name').val(),
        email = $('#email').val(),
        message = $('#message').val(),
        flag = 0;

    if (name.replace(/\s+/g, '').length == 0) {
        flag++;
    }

    if (email.replace(/\s+/g, '').length == 0) {
        flag++;
    }

    if (message.replace(/\s+/g, '').length == 0) {
        flag++;
    }

    $('#response').css('display', 'none').removeClass('redMessage greenMessage').html('');

    if (flag > 0) {
        $('#response').html('Sorry, Could you fill out all fields?').addClass('redMessage').slideDown();
        return;
    }

    $('#submit-btn').css('background', '#2d2d2d').val('Sending...').data('sending', true);


    $.ajax({
        type: 'post',
        url: 'contactHandler.php',
        data: {
            name: name,
            email: email,
            message: message
        },
        dataType: 'json',
        timeout: 10000,
        success: function (e) {

            switch (e.status) {
                case '0':
                    $('#response').html(e.response).addClass('redMessage').slideDown();
                    break;
                case '1':
                    $('#name,#email,#message').val('');

                    $('#response').html(e.response).addClass('greenMessage').slideDown();
                    break;

                case '2':
                    $('#response').html(e.response).addClass('redMessage').slideDown();
                    break;
            }

            $('#submit-btn').css('background', '#00ad4b').val('SUBMIT').data('sending', false);

        },
        error: function () {
            $('#response').html('Connection Error...Please try again.').addClass('redMessage').slideDown();
            $('#submit-btn').css('background', '#00ad4b').val('SUBMIT');
        }
    });

}



