/*
 * Author: Saeed
 * Version: v2.0.0
 * 
 * Updated By: Saeed
 * Description: [compatible for Web Component also]
 *
 */

window.chips = function(obj){
    new createTags(obj);
};

function createTags(ob) {
    this.init(ob);
}

createTags.prototype = (function() {
    var init = function(obj) {
        var defaultParams = {
            key: null,
            text: "",
            textEncoded: "",
            insertBefore: null,
            contId: null,
            suggestorNode: null,
            hiddenTag: null,
            deleteIcon: true,
            placeTagEnd: false,
            retainText: false,
            hiddenAttr: false,
            tagTitle: false,
            setValInLowercase: false,
            tagType: 'li',
            chipClass: "chip",
            onClick: function() {},
            onCreate: function() {},
            onDelete: function() {},
            onCrossClick: function() {},
            tagExists: function() {},
        };

        var _t = $.extend(this, defaultParams, obj);
        _t.textEncoded = _t.text.replace(/\\/g, '').replace(/>/g, '&gt;').replace(/</g, '&lt;');
        _t.text = _t.text.replace(/\\/g, '');

        var deleteTag, anchorHr, dataHid, tagTitleTip;

        var tagId = _t.textEncoded.replace(/\_/g, '|xudrScrx|').toLowerCase(),
            tag; //.replace(/\s/g, '-')
        if (_t.deleteIcon) {
            deleteTag = '<a class="material-icons close" href="javascript:void(0)">cross</a>';
        } else {
            deleteTag = '';
        }
        if (_t.hiddenAttr) {
            dataHid = "data-hidden='" + _t.hiddenAttr + "'";
        } else {
            dataHid = '';
        }
        if (_t.tagTitle) {
            //  tagTitleTip = _t.textEncoded;
            tagTitleTip = _t.textEncoded.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        } else {
            tagTitleTip = "";
        }
        if (_t.tagType == 'a') {
            anchorHr = 'href="javascript:void(0)"';
            tag = $('<li class=' + _t.chipClass + ' data-id=' + _t.key + '_' + tagId + ' title="' + tagTitleTip + '"><' + _t.tagType + ' ' + anchorHr + ' class="tagTxt">' + _t.textEncoded + '</span>' + deleteTag + '</' + _t.tagType + '>');
        } else {
            tag = $('<' + _t.tagType + dataHid + ' class="' + _t.chipClass + '" data-id=' + _t.key + '_' + tagId + ' title="' + tagTitleTip + '"> <span class="tagTxt">' + _t.textEncoded + '</span>' + deleteTag + '</' + _t.tagType + '>');
        }

        tag.attr('data-id', _t.key + '_' + tagId).on('click', '.tagTxt', function(e) {
            _t.onClick(tag, _t.key);
        }).children('.close').on('click', function() {
            _t.onCrossClick(tag,_t.hiddenTag.val());
        });

        _t.container = _t.contId;

        _t.hiddenTag = _t.hiddenTag || _t.container.children('input');
        _t.setValue(_t.text, tag); // set value in hidden field

        _t.bindEvent_cross(tag);
    };

    var bindEvent_cross = function(tag) {
        var _t = this;
        tag.children('.close').on('click', function() {
            _t.remValue($(this).parent()); // remove value from hidden field
        }).on('keydown', function(e) {
            _t.keyHandling.call($(this), e, _t.contId);
        });
    };
    var setValue = function(key, tag) {
        var _t = this,
            hdVal = _t.hiddenTag.val() || '',
            lastLi,
            hdValSplit = hdVal.toLowerCase().split(",");
        if ($.inArray(key.toLowerCase(), hdValSplit) == -1) {
            if (_t.placeTagEnd == true) {
                lastLi = _t.container.find(".lastLi");
                lastLi.before(tag);
                _t.onCreate(key);
            } else if (_t.insertBefore) {
                tag.insertBefore(_t.insertBefore)
                _t.onCreate(key);
            } else {
                _t.container.append(tag);
                _t.onCreate(key);
            }

            if (_t.setValInLowercase) {
                key = key.toLowerCase();
            }

            if (!hdVal) {
                _t.hiddenTag.val(key);
            } else {
                _t.hiddenTag.val(hdVal + ',' + key);
            }
        } else {
            _t.tagExists(tag);
        }
    };
    var remValue = function(_this) {
        var next = _this.next().children('.close'),
            prev = _this.prev().children('.close'),
            _t = this;

        if (next.length) {
            next.focus(); //next[0].focus();    
        } else if (prev.length) {
            prev.focus(); //prev[0].focus();
        }

        var key = (_this.attr('data-id').split('_')[1]).replace(/&gt;/g, '>').replace(/&lt;/g, '<'), //.replace(/\-/g,' ')
            hdVal = _t.hiddenTag.val().toLowerCase().split(',');
        var index = $.inArray(key.replace('|xudrscrx|', '_'), hdVal);

        index != -1 ? hdVal.splice(index, 1) : '';
        key = hdVal;
        if (_t.retainText) {
            _t.suggestorNode ? _t.suggestorNode.val(key) : '';
        }
        _t.hiddenTag.val(key);
        setTimeout(function() {
            _this.remove();
            _t.onDelete(_this,key);
        }, 100);
    };

    var keyHandling = function(e, contId) {
        var kCd = e.keyCode || e.which,
            tagLi = this.parent(),
            prev = tagLi.prev().children('.close'),
            next = tagLi.next().children('.close');
        if (kCd == 37) {
            prev.length ? prev[0].focus() : '';
        } else if (kCd == 39) {
            next.length ? next[0].focus() : '';
        } else if (kCd == 38) {
            contId.find('.tagit').first().children('.close')[0].focus();
        } else if (kCd == 40) {
            contId.find('.tagit').last().children('.close')[0].focus();
        }
    };

    return {
        init: init,
        setValue: setValue,
        remValue: remValue,
        keyHandling: keyHandling,
        bindEvent_cross: bindEvent_cross
    };
})();

//v2 -> replaced " and ' in title attribue of tag //Sakshi 

//v1.0.2 -> added variable _t.textEncoded to be used to replace <, > everywhere except hidden field. //Sakshi

// v1.0.2 -> Following fixes were done to resolve issue when tags created with hyphen were not removed from hidden field.
//              (1) Removed ".replace(/\s/g, '-')" while creating tagId variable 
//              (2) Removed ".replace(/\-/g,' ')" from remValue function


// v1.0.1 -> replaced '<' & '>' with &lt; &gt; //Sakshi
// v1.0.1 -> Changes in "remValue" function to resolve focus issue on javascript object


// v1.0.0 ->[requirement change] [add new parameter onCrossClick : which trigger only when cross will be triggered]
// [now onDelete call when tag will be deleted]
// v1.0.0 -> _t.setValInLowercase parameter added to add hidden field value in lowercase base on parameter provided by user.

// 1. changes my mahima for adding title attribute on parameter base (tagTitle: true/false)
// 2. change by Saeed - Delegate event on .tagTxt. Earlier it was just "tag.on('click',function(){"
// 3. Changing remvalue function to get value using attr method
// 4. Duplicate Tag callback created in "setValue" function
