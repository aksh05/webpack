$.fn.sticky = function(options) {
    var obj = $(this),
        tL = options.topLimit || null,
        bL = options.bottomLimit || null,
        cnt = options.container || null,
        cls = options['class'],
        rT = options.relatedTo || 'bottom',
        cBak = options.callback || null,
        elm = options.optElmToClick || null,
        inViewTop, inViewTopPos,
        inViewBot, inViewBotPos,
        flg = false,
        callbackWhenSticky=true,
        callbackWhenUnsticky=true;

    rT = rT.toLowerCase();
    if (elm != null && elm.length > 0) {
        elm.on('click', function() {
            setTimeout(function() {
                processSticky();
            }, 300);

        });
    }
    $(window).on('scroll', function() {
        processSticky();
    });
    processSticky();

    function processSticky() {
        if (tL || bL) {
            inViewTop = (tL) ? tL.inView().status : false,
                inViewTopPos = (tL) ? tL.inView().position : 'bottom',
                inViewBot = (bL) ? bL.inView().status : false;
            inViewBotPos = (bL) ? bL.inView().position : 'bottom';
        }
        if (rT == 'bottom' && ((inViewTop && !inViewBot) || (!inViewTop && !inViewBot && inViewTopPos == 'top' && inViewBotPos == 'bottom'))) {
            flg = true;
        } else if (rT == 'top' && (!inViewTop && inViewTopPos == 'top' && (inViewBotPos == 'bottom' || inViewBotPos == 'inside'))) {
            flg = true;
        } else {
            flg = false;
        }
        if (flg) {
            obj.addClass(cls);
            if (cBak&&callbackWhenSticky) cBak.call(obj);
            callbackWhenSticky=false;
            callbackWhenUnsticky=true;
        } else {
            obj.removeClass(cls);
            if (cBak&&callbackWhenUnsticky) cBak.call(obj);
            callbackWhenUnsticky=false;
            callbackWhenSticky=true;
        }
    }
};


$.fn.inViewCallback = function(options) {
    var self = this;
    var inC = options.inCallback,
        outC = options.outCallback,
        repeatInCbFlag = (typeof options.repeatInCbFlag != "undefined") ? options.repeatInCbFlag : true,
        repeatOutCbFlag = (typeof options.repeatOutCbFlag != "undefined") ? options.repeatOutCbFlag : true,
        _repeatInCbFlag = self.attr('id'),
        _repeatOutCbFlag = true;


    var insideFlag = false;
    $(window).scroll(function() {
        var inViewStatus = self.inView().status;

        if (inViewStatus != insideFlag) {
            insideFlag = inViewStatus;

            if (insideFlag && _repeatInCbFlag) {

                if (!repeatInCbFlag) {
                    _repeatInCbFlag = repeatInCbFlag;
                }
                (inC ? inC() : '');
            } else if (!insideFlag && _repeatOutCbFlag) {

                if (!repeatOutCbFlag) {
                    _repeatOutCbFlag = false;
                }
                (outC ? outC() : '');
            }

        }
    });
    $(window).scroll();
};


$.fn.inView = function(options) {
    var topOff = 0,
        bottomOff = 0,
        win = $(window),
        obj = $(this),
        scrollPosition = win.scrollTop(),
        visibleArea = win.scrollTop() + win.height();
        var objEndPos = (obj.length) ? (obj.offset().top + obj.outerHeight()) : null,
        stat,
        pos;

    if (options) {
        topOff = options.topOff || 0;
        bottomOff = options.bottomOff || 0;
    }

    if (scrollPosition > objEndPos + bottomOff) {
        pos = 'top';
    } else if (visibleArea < objEndPos - topOff) {
        pos = 'bottom';
    } else {
        pos = 'inside';
    }
    stat = (visibleArea >= objEndPos - topOff && scrollPosition <= objEndPos + bottomOff) ? true : false;
    return {
        status: stat,
        position: pos
    };
};
