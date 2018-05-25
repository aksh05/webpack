(function($){
window.imageCropper = function() {

    var t = this;
    t.init = function() {
        t.obj = $(arguments[0].id);
        /*       if (window.addEventListener) {
                   window.addEventListener('load', t.load, false)

               }*/
        $(function() {
            t.load();
        });

    }
    t.load = function() {


        var width = t.obj.width(),
            height = t.obj.height(),
            lowWid = width < height ? width : height;
        objImg = t.obj.clone(), t.objParent = t.obj.parent();
        t.transparent_layer = $('<div>').addClass('tranparent_layer').css({ 'height': height + 'px', 'width': width + 'px', 'top': '0', 'left': '0' }).appendTo(t.objParent);

        t.img = $('<img>').addClass('transit').attr({ 'src': t.obj.attr('src') }).css({ 'width': width + 'px', height: 'auto', 'position': 'absolute', 'top': -(t.getHW(height)) * 5 + 'px', 'left': -(t.getHW(lowWid) * 10) / 2 + 'px' });

        t.topObj = $('<div>').addClass('cropWidth transit').css({ 'height': (t.getHW(lowWid)) * 90 + 'px', 'width': (t.getHW(lowWid)) * 90 + 'px', 'top': (t.getHW(height)) * 5 - 1 + 'px', 'left': (t.getHW(lowWid) * 10) / 2 - 1 + 'px' }).appendTo(t.objParent);
        t.topObj = $('.cropWidth.transit');
        t.topObj.append(t.img).on('touchstart', t.touchLayer).on('touchmove', t.moveLayer).on('touchend', t.touchEnd)

        t.point1 = $('<div>').addClass('transit point1').css({ 'top': ((t.getHW(height)) * 5 - 31) + (t.getHW(lowWid)) * 90 + 'px', 'left': ((t.getHW(lowWid) * 10) / 2 - 31) + (t.getHW(lowWid)) * 90 + 'px' });
        t.point1.appendTo(t.objParent);
        objImg.attr({ 'width': 'auto', 'id': 'newImageCropper' });
        t.point1 = $('.point1').on('touchmove', t.pointMove).on('touchstart', t.pointstart).on('touchend', t.touchEnd);

        t.parentCont = $('.tranparent_layer');
        t.parentCont.on('touchstart', function(event) {
            //      event.preventDefault();

        })


        $('body').append(objImg);
        var actual_Width = objImg.width(),
            actual_Height = objImg.height();
        objImg.remove();
        t.ratioW = actual_Width / width;
        t.ratioH = actual_Height / height;
        t.objWidth = parseInt(width);
        t.objHeight = parseInt(height);
        t.touchEnd();
    }


    t.pointstart = function(event) {
        //event.preventDefault();
        if (event.targetTouches && event.targetTouches.length == 1) {
            t.pointX_Start = event.targetTouches[0].pageX;
            t.pointY_Start = event.targetTouches[0].pageY;
            t.pointX_Left = parseInt(t.point1.css('left'));
            t.pointY_Top = parseInt(t.point1.css('top'));
            t.topObjWidth = t.topObj.width();
            t.topObjHeight = t.topObj.height();
        }

    }
    t.pointMove = function(event) {
        // event.preventDefault();
        if (event.targetTouches && event.targetTouches.length == 1) {
            var pointX_Move = event.targetTouches[0].pageX,
                pointY_Move = event.targetTouches[0].pageY,
                diffXMove = pointX_Move - t.pointX_Start,
                diffYMove = pointY_Move - t.pointY_Start,
                topObjCSS_Top = parseInt(t.topObj.css('top'));
            topObjCSS_left = parseInt(t.topObj.css('left'));
            var wid = t.topObjWidth + parseInt(diffXMove);
            if (wid <= 100) {
                wid = 100;
            } else if (topObjCSS_Top + wid + t.point1.width() > t.objHeight) {
                if ((topObjCSS_left + t.objHeight - topObjCSS_Top) > t.objWidth)
                    wid = t.objWidth - topObjCSS_left;
                else
                    wid = t.objHeight - topObjCSS_Top;

            } else if (wid >= t.objWidth) {
                wid = t.objWidth - 2;
            }
            t.point1.css({ 'top': topObjCSS_Top + wid - t.point1.height() + 'px', 'left': parseInt(t.topObj.css('left')) + wid - t.point1.width() + 'px' });
            t.topObj.css({ 'width': wid + 'px', 'height': wid + 'px' })
        }
        event.preventDefault();
    }

    t.touchLayer = function(event) {
        // event.preventDefault();
        t.touchLeft = parseInt(t.topObj[0].style.left);
        t.touchTop = parseInt(t.topObj[0].style.top);
        if (event.targetTouches && event.targetTouches.length == 1) {
            t.pageX_Start = event.targetTouches[0].pageX;
            t.pageY_Start = event.targetTouches[0].pageY;
            t.topObjWidth = t.topObj.width();
            t.topObjHeight = t.topObj.height();
        }
        //event.preventDefault();
    }
    t.moveLayer = function(event) {
        //event.preventDefault();
        if (event.targetTouches.length == 1) {
            t.pageX_Move = event.targetTouches[0].pageX;
            t.pageY_Move = event.targetTouches[0].pageY;
            var lft = t.touchLeft + (t.pageX_Move - t.pageX_Start);
            var tpt = t.touchTop + (t.pageY_Move - t.pageY_Start);
            var checkR = lft + t.topObjWidth;
            var checkB = tpt + t.topObjHeight;
            var tObjWidth = t.topObjWidth;
            var tObjHeight = t.topObjHeight;
            if (lft < 0 && checkR - tObjWidth < 0) {
                lft = 0;
            }
            if (tpt < 0 && checkB - tObjHeight < 0) {
                tpt = 0;
            }
            if (checkR > (t.objWidth)) {
                checkR = t.objWidth;
                lft = checkR - tObjWidth;
            }
            if (checkB > (t.objHeight)) {
                checkB = t.objHeight;
                tpt = checkB - tObjHeight;
            }
            if (lft >= 0 && tpt > 0 && checkR <= (t.objWidth) && checkB <= (t.objHeight)) {
                t.topObj.css({ 'left': lft - 1 + 'px', 'top': tpt - 1 + 'px' })
                t.img.css({ 'left': -lft + 'px', 'top': -tpt + 'px' })
                t.point1.css({ 'top': tpt + tObjHeight - t.point1.height() + 'px', 'left': lft + tObjWidth - t.point1.width() + 'px' });
            }
        }
        event.preventDefault();
    }
    t.touchEnd = function(event) {
        //event.preventDefault();
        var lft = parseInt(t.topObj.css('left'));
        var tpt = parseInt(t.topObj.css('top'));
        var width = t.topObj.width();
        widL = width * t.ratioW + lft * t.ratioW;
        heiL = width * t.ratioW + tpt * t.ratioW;
        lft = lft * t.ratioW;
        tpt = tpt * t.ratioH;
        t.coordinates = {
            'x1': lft,
            'y1': tpt,
            'x2': widL,
            'y2': heiL
        };
        if (event)
            event.preventDefault();
        $('#x1').val(lft);
        $('#y1').val(tpt);
        $('#x2').val(widL);
        $('#y2').val(heiL);
    }
    t.getHW = function(param) {
        return (param / 100);
    }

    /*end here*/
}

})(Zepto);