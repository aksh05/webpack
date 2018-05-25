import { scrollHandler } from "../helper_methods/scrollHandler.js";
import { merger } from "../helper_methods/merger.js";

/*
 * Author: Saeed
 * Version: v10.0.0
 * 
 * Updated By: Saeed
 * Description: [compatible for Web Component also]
 *
 * Layout Breaking Change : [input filed color property]
 * [depricate input field text color handling from plugin, so developer should manage it by css]
 *     e.g --> 
 *         .ddwn{color:grey}
 *         .ddwn.open{color:black}
 *
 *  convert each node's attribute name to .toLowerCase() to support legacy code.
 *  e.g-->X.sortPrefix = obj.sortPrefix.toLowerCase();
 */

/*to handle IOS click issue*/
if (navigator.userAgent.match(/(iPhone|iPod|iPad)/i)) {
    $('body').css({
        'cursor': 'pointer'
    })
}

// // To support legacy calling structure, will be depricated soon
// var DD = function(obj, sts, key) {
//     var instance = new droope(obj, sts, key);
//     if (Object.keys) $('#' + Object.keys(obj.id)[0]).data('droope', instance);
//     return instance;
// }
// //End of deprecated calling snippet

window.droope = function(obj, sts, key) {
    var droopeInstance = $('#' + obj.id);
    if (!droopeInstance.data('droope')) {
        var instance = new _droope(obj, sts, key);
        droopeInstance.data('droope', instance);
        return instance;
    } else {
        droopeInstance.destroy && droopeInstance.destroy();
    }
}

var _droope = function(obj, sts, key) {

    // To support legacy parameter name
    obj.maxSelection = obj.maxSelection || obj.maxTagsCount;

    var defaultParams = {
        maxHeight: 300,
        maxTagsCount: Infinity, // this parameter is depricated, should be used maxSelection insted
        maxSelection: Infinity,
        searchBox: true,
        tagsSorting: true,
        tags: true,
        tagInSepContainer: false,
        checkBox: false,
        appendTags: false,
        clearTagId: false,
        prefillData: false,
        onDeselect: false,
        sortPrefix: false,
        tagwithOptGroup: false,
        clearAllInside: false,
        parentChkBox: false,
        allChk: false,
        allChecked: false,
        layerOpenStatus: false,
        tagTitle: false,
        Tagfocus: 0,
        TagCnt: 0,
        Allflg: '',
        curActElm: '',
        liCntrFx: [],
        preventClickFor: [],
        liCntr: [],
        optgrpNameRef: [],
        hidValue: [],
        parentRefData: {},
        optgrpObject: {},
        showSelText: false,
        preserveInputVal: false,
        onClickReq: emptyCalBckFun,
        onClickAll: emptyCalBckFun,
        onChange: emptyCalBckFun,

        selectedValues: {},

        /**
         * This valiable depend on tags==falase, if tags false and the value of "selectedCounter" == false, then droope will not fill counter value in input field with "pre and post text"
         */
        selectedCounter: true,

        //Prevent default nature of dd-layer close mode,
        //when user click outside of dd or select any value from it.
        preventClose: false,

        // default open state
        defaultOpen: false,

        //Call back function on tag click
        onTagClick: emptyCalBckFun,

        //call when tag create
        onTagCreate: emptyCalBckFun,

        // to enable/disabled reset for replace or add data
        isReset: true,

        // call back function for click on clearTag/clearAllTsg
        onClearTag: [],

        //Set dropLayer/Data layer width
        drpLyrWth: false,

        // for blur callback 
        onBlur: emptyCalBckFun,

        // for delay of blur call back when li is clicked 
        blurDelay: false,

        /**
         * [isSearch description] : for Disable search feature in single Select Case
         * @type {Boolean}
         */
        isSearch: true,

        /**
         * [remove value from hidden input:  When user removes all text from input value then value inside hidden input should be removed]
         * @type {[boolean]}
         */
        removeHiddenVal: false,

        /**
         * [preserveText: to preserve input text while onBlur or on hide DD]
         * @type {[boolean]}
         */
        preserveText: false,
        pKey: key,
        id: '',
        preText: "You have selected",
        postText: "item(s)",

        /**
           for start tab event to change values
        */
        selectOnBlur: false,
        toggleDropLayer: true,
        scrollToTop: false,

        isFirstValueHighlight: true, //By Default true

        returnFocus: false, //,

        onChangePrevent_onInit: false, // to prevent onChange callback at initialization time of droopeInstance
        onError: emptyCalBckFun

    };

    var X = $.extend(this, merger(defaultParams, obj));

    X.obj = obj;
    var defWth_fx = 30;
    var defWth = X.obj.postPlaceholder ? X.obj.postPlaceholder.width : 30;

    X.rootCont = $('#' + X.id);
    X.inpElm = X.rootCont.find('.srchTxt');
    X.isReadOnly = X.inpElm.is('[readonly]');

    /*Add new data parameter with legacy support*/
    X.dataObj = obj.data || (obj.id && obj.id[X.id] ? obj.id[X.id][0] : "");

    /**
     * [prefillData : to store prefill Data, with legacy support, will be removed in future]
     * @type {[Array or string]}
     */
    X.prefillData = X.prefillData || (X.obj.id[X.id] ? X.obj.id[X.id][1] : []);

    // To suport webcomponents
    if (typeof X.prefillData === "string") {
        X.prefillData = X.prefillData.split(',');
    }

    /**
     * [X.Ary: to store json data object]
     * @type {Object}
     */
    if (!X.pKey) {
        X.Ary = {};
        X.Ary['A'] = X.dataObj;
    } else {
        if (!X.checkBox) droope.Ary[X.id] = {};
        if (!droope.Ary[X.id]) droope.Ary[X.id] = {};
        droope.Ary[X.id][X.pKey] = X.dataObj;
        X.Ary = droope.Ary[X.id];
    }

    function emptyCalBckFun() {};

    function closeDD(e) {
        var rootNode = $(e.target).parents('.ddwn');
        $('.ddwn').removeClass('open');
        if (rootNode.length && Boolean(rootNode.attr('searchDisabled')) !== true) {
            var dpLayer = $('.ddwn, #' + window.lastOpen);
            dpLayer.find('.DDwrap').removeClass('brBotN');
            dpLayer.find('.drop').hide();
        }
    }

    /*Bind Click event on document on Click*/
    // if (!droope.lastRef['iseventBindOnDocument']) {
    // $(document).on('click touchstart', function(e) {
    //     closeDD(e);
    // });

    $(document).on('focus', '.srchTxt', function(e) {
        if (window.lastOpen && $('#' + window.lastOpen).find('.drop').css('display') == "block") {
            closeDD(e);
        }
    });
    //  droope.lastRef['iseventBindOnDocument'] = true;
    //}
    /*End of Bind Click event on document on Click*/


    /**
     * [tagsToReplace description: mapping for escape HTML tags as HTML entities]
     * @type {Object}
     */

    /*  var tagsToReplace = {   
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };*/

    var tagsToReplace = function(tag) {
        //      return tag.replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;');
        return tag.replace(/>/g, '&gt;').replace(/</g, '&lt;');

    }

    /**
     * [replaceTag description]
     * @param  {[type]} tag [string]
     * @return {[string]}     [escape HTML tags as HTML entities]
     */

    // function to break string at <b> & </b> and then replace '<,>,&' in string if found
    // it will return the string after adding back <b> & </b> at the required position
    var breakStringForBold = function(tag) {
        if (tag.indexOf('<b>') != -1) {
            tag = tag.split('<b>'); //breaking string at <b>
            var strAfter = tag[1].split('</b>'), //breaking string after <b> into two parts furthur to get string before & after </b>
                arr = [
                    tag[0], // string before <b>
                    strAfter[0], // string before </b>
                    strAfter[1] // string after </b>
                ],
                arrNew = [];

            for (var i in arr) {
                arrNew.push(tagsToReplace(arr[i]));
            }

            return arrNew[0] + '<b>' + arrNew[1] + '</b>' + arrNew[2];
        } else {
            return tagsToReplace(tag);
        }
    }

    var setFocus = function() {
        if (X.returnFocus) X.inpElm.focus();
    };

    // var highlightSelection = function(keys) {
    //     keys.forEach(function(val) {
    //         $('#' + X.id +'_'+ val).addClass('active');
    //     })
    // };

    X.replaceTag = function(tag) {
        return (tag.toString().indexOf('<') != -1) ? breakStringForBold(tag) : tag;
    };

    //creating li is current number of li is less than actual
    X.setLi = function(id) {
        var X = this;
        if ($('#ul_' + id).find('li').length < X.liCntr) {
            var html = X.appendData(X.Ary, '', '', true);
            X.dpLyr.find('ul').html(html[0]);
            X.liCntr = X.liCntrFx;
        }
    }

    if (X.obj.resetPrefillValues) { // to reset(empty checkBox Container) values to avoid prefill case... used in SM
        X.ChkBoxContr = {};
    } else {
        !X.ChkBoxContr ? X.ChkBoxContr = {} : '';
    }


    for (var x in X.clearTagId) {
        for (var y in X.clearTagId[x]) {
            X.onClearTag[x] = X.clearTagId[x][y];
        }
    }

    X.Fn = {
        preserveEventafterClone: function(Id, bool) {
            var id = X.id,
                tagElm;
            if (X.tagInSepContainer) {
                tagElm = $('#' + X.tagInSepContainer).find('[data-id="' + Id + '"]');
            } else {
                tagElm = X.rootCont.find('.DDsearch').find('[data-id="' + Id + '"]');
            }
            tagElm.on('click', '.dCross', function(e) { //remove tags by click on tag cross button  
                e.stopPropagation();
                X.removeTag(Id, $(this).find('.tagTxt').text(), bool);
                X.max_height();
                bool ? X.onTagClick(obj, X.TagCnt) : '';
                X.setInputText(); // for decrement count value when user click on tag cross sign
                X.dpLyr.css('display') == "block" ? setFocus() : '';
                // X.dpLyr.css('display') == "block" ? X.rootCont.find('.srchTxt')[0].focus() : '';
            });
        },
        keyUpEv: function(e) { //must be put code at key_up event           
            var id = $(this).data('id');
            var maxWth = X.rootCont.width() - 15;
            var iD = id.split('_')[1];
            var kCd = e.keyCode || e.which;
            var wth;

            var ddTxtVal = $(this).val().replace(/\b/g, '');
            if (kCd == 13 && X.curActElm && X.curActElm.length && !X.curActElm.hasClass('noData')) { // create tag on enter
                if (X.curActElm.hasClass('active')) {
                    var anchorTxt = X.curActElm.children('a');
                    if (X.checkBox) {
                        var tagid = anchorTxt.data('id') + '_' + X.Escp(X.curActElm.attr('bindto'));
                        if (anchorTxt.hasClass('chkd')) {
                            X.removeTag('tg_' + tagid, anchorTxt.html(), true);
                        } else {
                            X.CreateTags(anchorTxt, tagid, '', X.tags);
                        }
                    } else {
                        X.SingleSelection(anchorTxt.text(), anchorTxt.data('id').split('_'));
                        X.hideDD();
                    }
                }
            }
            if (kCd == 8) {
                if (X.checkBox && !X.tagInSepContainer && X.tags !== false) {
                    if (ddTxtVal) {
                        wth = DecreaseTxtBoxWth(id, maxWth) + 'px';
                    } else {
                        if (X.inpHid.val() != "") {
                            wth = defWth + 'px';
                        } else {
                            wth = '';
                        }
                    }
                    X.inpElm.css({
                        width: wth
                    });
                }
            }

            if (!X.isReadOnly && kCd != 9 && kCd != 13 && kCd != 18 && kCd != 32 && kCd != 37 && kCd != 38 && kCd != 39 && kCd != 40 && kCd != 16) {
                X.Fn.initSearch(ddTxtVal, id, kCd);
                if (X.dpLyr.css('display') == "none") {
                    X.dpLyr.show();
                }
            }


            // [remove value from hidden input:  When user removes all text from input value then value inside hidden input should be removed]
            if (X.removeHiddenVal) {
                if (!ddTxtVal) {
                    X.inpHid.attr('value', '');
                }
            }
        },

        initSearch: function(sTxtValue, id, kCd) {
            var html = '';
            window.srchCntr = 0;
            id = id.split('_')[1];
            var Ary = X.Ary;
            if (sTxtValue) {
                sTxtValue = sTxtValue.replace(/&amp;/gi, '&').replace(/[\s]+/g, " ").replace(/^\s/, "");
                for (var K in Ary) {
                    for (var Q in Ary[K]) {
                        if (typeof Ary[K][Q] === 'object') { // for optgroup case           
                            var Li = '',
                                dObj;
                            dObj = Ary[K][Q];
                            for (var m in dObj) {
                                Li += X.searchData(dObj[m], sTxtValue, id, id + '_' + m + '_' + X.eUnderScore(Q), X.Escp(K));
                            }
                            if (Li) {
                                html += '<li class="optgroup">' + X.eUnderScore(Q) + '</li>' + Li;
                                window.srchCntr++;
                            }
                        } else { // for single case
                            X.rootCont.find('.cross').show();
                            //$('#' + id).find('.cross').show();
                            html += X.searchData(Ary[K][Q], sTxtValue, id, id + '_' + X.eUnderScore(Q), X.Escp(K));
                            window.srchCntr++;
                        }
                    }

                }
            } else {
                X.rootCont.find('.cross').show();
                //$('#' + id).find('.cross').hide();
                html = X.appendData(X.Ary, '', '', kCd)[0];
                window.srchCntr = X.liCntrFx;
            }
            if (!html) {
                var txt = X.obj.noDataTxt ? X.obj.noDataTxt : "No data found in search";
                html = '<li class="noData">' + txt + '</li>';
                window.srchCntr++;
            }
            //$('#dp_'+id+' ul').html(html);
            X.dpLyr.find('ul').html(html);
            X.liCntr = window.srchCntr;
            X.max_height();
            X.firstHighlight();

        }
    };


    /*Added a variable to handle show and hide of .drop layer*/
    window.intervalX = 0;

    X.init = function(e) {

        //for (var i = 0; i < X.idLen; i++) {


        var id = X.id,
            clrAll, ifr;

        if (X.clearAllInside) {
            var text = 'Clear All';
            for (var x in X.clearAllInside) {
                text = X.clearAllInside[x];
            }
            clrAll = $('<div>').addClass('DDclearAll').attr({
                id: 'clrAll_' + id
            }).html(text);
        }
        var srchTxt = X.inpElm;
        srchTxt.val(''); // to reset/blank any selected value, since reset call this function to reset the droope to its original position

        if (!X.dpLyr || !X.dpLyr.length) { // to prevent create multiple drop loyer if same call initialize.

            var nm = srchTxt.attr('name');
            srchTxt.data({
                'name': nm
            }); // to reset in destroy function

            //            var arrow = $('#' + id).find('.arw').addClass('DDarwDwn');
            var arrow = X.rootCont.find('.arw').addClass('DDarwDwn');
            var movToLi = X.rootCont.find('.DDsearch')


            if (!X.checkBox) {
                X.rootCont.addClass('singleSelect')
            }

            srchTxt.data({
                'id': 'inp_' + id,
                'placeholder': srchTxt.attr('placeholder')
            }).attr({
                'name': '',
                'autocomplete': 'off'
            });

            if (!X.isSearch) srchTxt.attr('readonly', 'readonly');

            X.rootCont.find('.frst').css({
                'float': 'none'
            });

            if (!$('#hid_' + id).length) { // create hidden input field if it's not aleredy there
                X.inpHid = $('<input>').attr({
                    type: "hidden",
                    id: "hid_" + id,
                    name: nm
                });
                movToLi.append(X.inpHid);
            } else { X.inpHid = $('#hid_' + id); }
            var drop = $('<div>'),
                scrollWrap = $('<div>'),
                ul = $('<ul>'),
                ddCont = X.rootCont,
                checkbox = X.checkBox ? 'ChkboxEnb' : '';

            X.dpLyr = drop; // store reference of dropLayer container
            scrollWrap.addClass('nScroll').attr('id', 'ul_' + id);
            drop.addClass('drop').attr('id', 'dp_' + id);
            ul.addClass(checkbox);
            scrollWrap.append(ul);
            clrAll ? drop.append(clrAll) : '';
            drop.append(scrollWrap);
            ddCont.append(drop);
            //ddCont.append(ifr[0]);

            X.rootCont.on('click', '.DDinputWrap, .DDsearch, .arw', function(e) {
                e.stopPropagation();
                setFocus();
                //srchTxt[0].focus();
            }).on('mouseenter', function() {
                X.layerOpenStatus = (X.searchBox !== false) ? true : false;
            }).on('mouseleave', function() {
                X.layerOpenStatus = false;
            });
        }

        //Add events in dropDown
        X.bindEvents();

        X.layerOpenStatus = (X.searchBox !== false) ? true : false;
        //} // for loop end


        X.fillData(); // to append data dynamically at run time in Dropdown     

        function clearHandler(XclrId) {
            return function() {
                var clrid = $(this).attr('id');
                var param = XclrId[clrid];
                var Ides = param['id'];
                if (Ides) {
                    for (var y in Ides) {
                        var id = Ides[y];

                        //X.inpHid.attr('value','');
                        if (X.checkBox) {
                            X.removeAllTags();
                        } else {
                            X.inpElm.val('');
                            X.inpHid.data('optGroupKey', '');
                        }
                        X.Allflg = '';
                        X.hideDD();
                    }
                }
                if (param['clrCalbackfun']) {
                    X.onClearTag[clrid](X.obj, 0, $(this));
                }
            };
        }

        if (X.clearTagId) { // clear all tags and data on html tag fire event            
            for (var x in X.clearTagId) {
                $('#' + x).on('click', clearHandler(X.clearTagId));
            }
        }
    };



    X.blurEv = function(e) {
        var id = X.id,
            selectOnBlur = X.selectOnBlur;
        !X.tagInSepContainer && X.checkBox ? X.rootCont.find('.tagit').last().removeClass('TagSelected') : '';

        //enable scroll in case of readonly input field.
        if (X.isReadOnly) {
            enableScroll(e);
        }
        if (!X.layerOpenStatus) {
            X.hideDD();
        }
        if (!X.checkBox) {
            var hd = X.inpHid,
                inp = X.inpElm;


            var rr = X.uEscp(hd.attr('opt'));
            var val = hd.val();
            var dataAry = X.Ary['A'];
            var keySel, txt, retObj;
            retObj = X.getKeyFromVal(X.Ary['A'], inp.val());
            if (!selectOnBlur) {
                if (retObj.parentKey) {
                    txt = rr ? dataAry[rr][val] : dataAry ? dataAry[retObj.parentKey][val] : '';
                } else {
                    txt = rr ? dataAry[rr][val] : dataAry ? dataAry[val] : '';
                }
            } else {
                keySel = retObj.retKey;
                if (retObj.parentKey) {
                    txt = rr ? dataAry[rr][val] : dataAry ? dataAry[retObj.parentKey][keySel] ? dataAry[retObj.parentKey][keySel] : dataAry[retObj.parentKey][val] : '';
                } else {
                    txt = rr ? dataAry[rr][val] : dataAry ? dataAry[keySel] ? dataAry[keySel] : dataAry[val] : '';
                }

            }


            if (!inp.val()) {
                hd.val('');
                if (X.dpLyr.css('display') == "none") {
                    // X.onChange('');
                    X.onChangeHandler('');
                }
                if (X.onDeselect) X.onDeselect();
            } else if (txt) {
                if (X.preserveInputVal) {
                    txt = $(this).val();
                    hd.val('');
                }
                inp.val(txt)
                    //.css(X.style.inputBox);

                X.blurClearTimeoutId = setTimeout(function() {


                    if (selectOnBlur) {
                        var valSelKey = keySel ? keySel : X.getKeyFromVal(X.Ary['A'], txt).retKey;
                        var withoutPrefix = valSelKey.replace(X.sortPrefix, '');
                        hd.val(withoutPrefix);
                        // X.onChange(withoutPrefix);
                        X.onBlur(withoutPrefix);
                    }

                }, (X.blurDelay || 0));

            }
        }
    };

    X.getKeyFromVal = function(objArr, val, parentKey) {
        var dataAry = objArr,
            retObj = {},
            retKey;

        for (var i in dataAry) {
            if (typeof(dataAry[i]) == 'object') {
                return X.getKeyFromVal(dataAry[i], val, i);
            } else {
                if ($.trim(dataAry[i].toString().toLowerCase()) == $.trim(val.toLowerCase())) {
                    retObj.retKey = i;

                    break;
                }
            }
        }
        if (parentKey) {
            retObj.parentKey = parentKey;
        }
        return retObj;
    };

    X.focusEv = function(e) { //It fires when focus comes in dropdown text box
        X.layerOpenStatus = (X.searchBox !== false) ? true : false;
        X.inpt = $(this);

        var id = $(this).data('id'),
            iD = id.split('_')[1];
        //  dropLayer = $('#dp_'+iD);
        //X.dpLyr = $('#dp_'+iD);
        X.DDSearch = $(this).parent('.DDSearch');

        X.showDD();

        //disable scroll in case of readonly input field.
        if (X.isReadOnly) {
            disableScroll(e);
        }

        //$('#' + id).css(X.style.inputBox);

        // To handle open/show feature on input field
        setTimeout(function() { /*To handle show hide .drop layer*/
            intervalX = 1;
        }, 200)
    };

    X.keyDownEv = function(e, inpElm) {
        var wth, //td = 'inp_'+X.id,
            id = X.id,
            kCd = e.keyCode || e.which,
            maxWth = X.rootCont.width() - 15,
            ddTxtVal = inpElm.val().replace(/\b/g, '');

        var dropDisp = X.dpLyr.css('display');

        if (kCd == 13 || kCd == 38) { //for multiple select
            e.preventDefault();
        }

        if (kCd == 13 && dropDisp == "none" && !X.checkBox && X.obj.form) { // for single select                    
            X.obj.form[0].submit();
        }

        (kCd == 9 || kCd == 27) ? X.hideDD(): ''; // check why it is not work no keyUp                                

        if ((kCd >= 97 && kCd <= 122) || (kCd >= 65 && kCd <= 90) || (kCd >= 48 && kCd <= 57)) {
            if (!X.tagInSepContainer && X.checkBox && X.tags !== false) {
                wth = IncreaseTxtBoxWth(maxWth);
                X.inpElm.css({
                    width: wth + 'px'
                });
            }
        }

        if (!ddTxtVal && X.checkBox) { //must be put code at keyDown event          
            var lastTag = X.rootCont.find('.tagit').last(),
                tagId = lastTag.data('id');
            if (X.TagCnt > 0 && e.keyCode == 8 && !X.tagInSepContainer && tagId && tagId.length > 0) {
                if (!X.Tagfocus) {
                    X.rootCont.find('.DDsearch').find('[data-id="' + tagId + '"]').addClass('TagSelected');
                    X.Tagfocus = 1;
                } else {
                    X.removeTag(tagId, lastTag.children('.tagTxt').html(), true);
                    X.Tagfocus = 0;
                }
            } else if (tagId) {
                X.rootCont.find('.DDsearch').find('[data-id="' + tagId + '"]').removeClass('TagSelected');
                X.Tagfocus = 0;
            }
        }
        //var ulCont_hghtCont = $('#dp_'+id);
        var ulCont_parent = $('#ul_' + id)
        var ulCont = ulCont_parent.find('ul');
        var firstElm = ulCont.find('li').first();

        if (!X.curActElm.length) {
            X.curActElm = firstElm;
        }

        if (kCd == 40) { // down arrow key
            if (dropDisp == "none") {
                X.hideDD();
                X.showDD();
            } else {
                var node, nodeRef = X.curActElm.next();
                if (nodeRef.length && !nodeRef.hasClass('noData')) {
                    node = nodeRef.hasClass('optgroup') ? nodeRef.next() : nodeRef;
                    X.curActElm.removeClass('active');
                    node.addClass('active');
                    X.curActElm = node;
                    scrollHandler(X.dpLyr, ulCont.parent(), firstElm, X.curActElm);
                }
            }
        } else if (kCd == 38) { // up arrow key
            var _node, _nodeRef = X.curActElm.prev();
            if (_nodeRef.length) {
                _node = _nodeRef.hasClass('optgroup') ? _nodeRef.prev() : _nodeRef;
                if (_node.length) {
                    X.curActElm.removeClass('active');
                    _node.addClass('active');
                    X.curActElm = _node;

                    scrollHandler(X.dpLyr, ulCont.parent(), firstElm, X.curActElm);
                }
            }
        }

    };

    X.fillDatainDropdwonLayer = function(id, html, i, inpTxt, opt) {
        var sRtx = X.inpElm;
        if (X.checkBox) {
            X.inpHid.attr({
                'value': ''
            });
        }
        var rootCont = X.rootCont;
        var dropLayer = rootCont.find('.drop');
        if (X.searchBox === false) {
            rootCont.attr('searchDisabled', true).find('.DDwrap').hide();
            dropLayer.css({
                'position': 'static'
            });
        } else {
            dropLayer.css({
                'borderTop': 0
            });
        }

        /**
         * if defaultOpen true, then open dropdown layer by Default
         */
        if (X.defaultOpen) {
            setTimeout(function() {
                X.showDD();
            }, 0);
        }

        $('#ul_' + id).find('ul').html(html);
        html = '';
        X.searchBox === false ? X.showDD() : '';
        if (X.allChk || X.parentChkBox) {
            X.chkForParent(X.optgrpObject, X.DATA, id); //Check if all childrens inside a parent are prefill,then check parent(In parentChk case)
        }
    };


    X.liMousehover = function() {
        var id = X.id;
        X.dpLyr.on('mouseover', 'li.pickVal', function() {
            if (X.curActElm.length) {
                X.firstHighlight()
                X.curActElm.removeClass('active');
            }
            //!X.curActElm.length ? X.firstHighlight() : '';
            $(this).addClass('active');
            X.curActElm = $(this);
        }).on('mouseout', 'a', function() {
            $(this).removeClass('active');
        });
    }


    X.max_height = function() { // set max heigh of dropdown according to the user specified if user not specified the set default maximum height
        X.maxHeight = parseInt(X.maxHeight);
        if (X.maxHeight) {
            var id = X.id;
            var k = $('#ul_' + id);
            var liHgt = 0;
            var li = $('#ul_' + id).find(' ul li').first();

            while (li.length && X.maxHeight >= liHgt) {
                liHgt += li.outerHeight();
                li = li.next();
            }

            if (X.maxHeight < liHgt) {
                k.css({
                    height: X.maxHeight + 'px'
                });
            } else {
                k.css({
                    height: liHgt + 'px',
                    'width': '100%'
                });
            }

            if (k.length && k[0].csb) {
                k[0].csb.reset();
            }
        }
    };


    X.PickValuesFromDD = function() { // On selection it select the data from the dropdown and throw to specific(on the basic of ID) text field or or any HTML tag eg. Div, span, textarea          
        var q,
            t = '', // must be initialize here
            td = X.id;

        X.dpLyr.on('click', '.pickVal a', function(e) {

            if (X.checkBox) {
                var z = 0,
                    aTag = $(this),
                    aId = aTag.data('id');
                if (X.parentChkBox) {
                    var path = $(this).data('id').split('_');
                    var par = path[path.length - 1];
                }
                if ($(this).hasClass('chkd')) {
                    z = 1;
                }
                q = aTag.html();
                if (aId.split('_')[1] == X.eUnderScore(X.otherLabId)) {

                    if (z == 1) {
                        X.onClickReq(obj, X.otherLabId, 'unChecked');
                    } else {
                        X.onClickReq(obj, X.otherLabId, 'checked');
                    }
                    X.hideDD();
                } else {
                    var path = $(this).data('id').split('_');
                    if (X.parentChkBox) {
                        var par = X.dUnderScore(X.uEscp(path[path.length - 1]));
                        var reqId = X.uEscp(path[path.length - 2]);
                    } else {
                        var par = 'All';
                        var reqId = X.uEscp(path[path.length - 1]);
                    }
                    if (z == 1) {
                        var tgId = aId;
                        if ($(this).parent().attr('bindto')) {
                            tgId = aId + '_' + X.Escp($(this).parent().attr('bindto'));
                        }
                        X.removeTag('tg_' + tgId, q, true);
                        if (X.parentChkBox || X.allChk) {
                            var index = X.optgrpObject[par].checked.indexOf(reqId);
                            if (index > -1) {
                                X.optgrpObject[par].checked.splice(index, 1);
                            }
                            X.optgrpObject[par].unchecked.push(reqId);
                            X.chkForParent(X.optgrpObject, '', aId);
                        }
                    } else {
                        var bnd = $(this).parent().attr('bindto');
                        bnd ? aId = aId + '_' + X.Escp(bnd) : '';
                        X.CreateTags(aTag, aId, '', X.tags);
                        if (X.parentChkBox || X.allChk) {
                            var index = X.optgrpObject[par].unchecked.indexOf(reqId);
                            if (index > -1) {
                                X.optgrpObject[par].unchecked.splice(index, 1);
                            }
                            X.optgrpObject[par].checked.push(reqId);
                            X.chkForParent(X.optgrpObject, '', aId);
                        }
                    }
                    X.searchBox !== false && X.allChk !== true ? setTimeout(function() {
                        setFocus();
                    }, 100) : '';

                }
            } else {
                X.SingleSelection($(this).text(), $(this).data("id").split('_'));
            }
        });
    };



    X.SingleSelection = function(txt, key) { // when dropdown having a single select functionality  
        var id = key[0],
            opt = key[2] ? key[2] : '';

        //txt = txt.replace(/(<([^>]+)>)/ig, "").replace(/&amp;/gi, '&');
        X.inpElm ? X.inpElm.val(txt) : '';
        X.rootCont.find('.cross').show();

        var hidValue = X.dUnderScore(X.uEscp(key[1])).replace(X.sortPrefix, '');
        var hidPreviousValue = X.inpHid.val();
        X.inpHid.attr({
            'value': hidValue
        }).data('optGroupKey', opt);

        // highlightSelection([key]);

        if (X.layerOpenStatus) X.hideDD();
        X.onClickReq(obj, hidValue);
        //If previous value and next value are same then onChange will not be fired
        // if (hidPreviousValue !== hidValue) X.onChange(hidValue, txt);
//         if (hidPreviousValue !== hidValue) X.onChangeHandler(hidValue, txt);
        X.onChangeHandler(hidValue, txt);
        // X.onChange(hidValue, txt);
    };


    X.CreateTags = function(anchor, t, prfAryindex, tagsFlag) { //checked
        var id = X.id;
        var chk = t.split('_')[1];
        if ($.inArray(chk, X.preventClickFor) == '-1' && (tagsFlag != false)) {
            tagsFlag = true
        } else {
            tagsFlag = false;
        }
        if (X.hidValue.length < X.maxSelection) {
            var q, spl = X.uEscp(t).split('_'),
                lianchorTemp = t.split('_'),
                Lianchor = lianchorTemp.length == 3 ? lianchorTemp[0] + '_' + lianchorTemp[1] : lianchorTemp[0] + '_' + lianchorTemp[1] + '_' + lianchorTemp[2];
            if (typeof anchor != "string") {
                q = anchor.text(); // .html() --> .text() --> since gettting value in onchange with like this. --> "<b>De</b>nmark" insted of "Denmark";
                anchor.addClass('chkd');
            } else {
                q = anchor;
            }

            X.TagCnt++;

            if (X.selectedCounter) {
                if (X.obj.postPlaceholder && X.obj.postPlaceholder.text) {
                    X.inpElm.attr('placeholder', X.obj.postPlaceholder.text);
                } else {
                    X.inpElm.attr('placeholder', '');
                }
            }

            if (tagsFlag !== false) {
                q = q.replace(/(<([^>]+)>)/ig, "").replace(/&amp;/gi, '&');
                X.tagwithOptGroup ? q = '<b>' + spl[2].replace('xSlashX', '/').replace(/SxP/gi, ' ') + '</b>' + '(' + q + ')' : '';
                var optgrpName, selector, li = $('<li>').append('<span class="tagTxt">' + q + '</span>'),
                    Id = 'tg_' + t;
                if (X.tagTitle) {
                    li.attr("title", q);
                }
                var spContId = X.tagInSepContainer;
                if (spContId || tagsFlag === false) {
                    var newTag = li.append($('<a>').addClass('dCross')).addClass('tagit').attr({
                            'data-id': Id
                        }),
                        extCont = $('#' + spContId)[0];
                    if (X.appendTags) {
                        var refNode = extCont.children[prfAryindex];
                        if (refNode) {
                            refNode.parentNode.insertBefore(newTag[0], refNode);
                        } else {
                            $('#' + spContId).append(newTag);
                        }
                    } else {
                        tagsFlag === false ? '' : extCont.insertBefore(newTag[0], extCont.firstChild);
                    }
                    //X.inpElm.css(X.style.inputBox);
                    selector = Id + ' a.dCross';
                } else {
                    if (X.appendTags) {
                        X.rootCont.find('.DDsearch li').last().before(li.append($('<span>').addClass('dCross')).addClass('tagit').attr({
                            'data-id': Id
                        }));
                    } else {
                        X.rootCont.find('.DDsearch').prepend(li.append($('<span>').addClass('dCross')).addClass('tagit').attr({
                            'data-id': Id
                        }));
                    }
                    X.inpElm.css({
                        width: defWth + 'px'
                    });
                    selector = Id + ' span.dCross';
                }
                X.Fn.preserveEventafterClone(Id, true);
            }
            $('#ul_' + X.id).find('[data-id="' + Lianchor + '"]').addClass('chkd');

            X.setValueInHiddenField(spl[1], q);
            X.ChkBoxContr[spl[1]] = t;
            X.onClickReq(obj, X.dUnderScore(X.uEscp(spl[1])), 'Checked', $('li[data-id="tg' + t + '"]'), X.TagCnt);
            X.setInputText();
        } else {
            X.onError({ msg: 'Max ' + X.maxSelection + ' selections are allowed', type: "maxSelection_Reached" });
            X.onTagCreate('Maximum Tags Created'); // to support legacy code
        }

        if (X.tags && !X.tagInSepContainer) {
            X.inpElm.val(''); // removing the selected value once the tag is created.
            X.setLi(X.id);
            X.max_height();
        }

    };

    function disableScroll(e) {
        $(document).on('keydown', X.disb_Scroll_handler); // to disable window scroll
    }

    function enableScroll(e) {
        $(document).off('keydown'); // to enable window scroll
    }




    function IncreaseTxtBoxWth(mx) { // increase texbox width while entering the character accordingly
        if (mx > defWth) {
            return defWth += 5;
        } else {
            defWth += 1;
        }
    }

    function DecreaseTxtBoxWth(id, mx) { //Decrease texbox width while removing or deleting the charecter
        if (X.inpElm.val() !== "" && defWth > defWth_fx) {
            if (mx > defWth) {
                return defWth -= 5;
            } else {
                defWth -= 1;
            }
        }
    }


    X.disb_Scroll_handler = function(e) {
        var kCd = e.keyCode;
        if (kCd === 40 || kCd === 38 || kCd === 32) {
            e.preventDefault();
            return false;
        }
    }

    X.setValueInHiddenField = function(key, txt, isReset) {
        var id = X.id;
        var singleValueObject = {};
        singleValueObject[key] = txt;
        
        $.extend(X.selectedValues, singleValueObject);
        
        // $.extend(X.selectedValues, {
        //     [key]: txt
        // });

        if (key && txt) {
            if (txt.toLowerCase() == "all") {
                X.Allflg = 'all';
            }
            key = X.dUnderScore(X.uEscp(key)).replace(X.sortPrefix, '');
            var hdVal = X.inpHid.val();
            if (!hdVal) {
                X.hidValue.push(key);
                X.inpHid.val(JSON.stringify(X.hidValue));
                $('#clrAll_' + id).show();
                if (X.tagInSepContainer) {
                    $('#' + X.tagInSepContainer).show();
                } else {
                    X.rootCont.find('li.frst').css({
                        'float': 'left'
                    });
                }
            } else {
                X.hidValue.push(key);
                X.inpHid.val(JSON.stringify(X.hidValue));
            }
            X.onTagCreate();
        } else if (isReset !== false) {
            X.inpElm.val('');
            X.inpHid.val('');
        }
        //X.onChange(X.hidValue, X.selectedValues);
        X.onChangeHandler(X.hidValue, X.selectedValues);

    }

    X.init();
    X.PickValuesFromDD(); // Event deligation: event bind for data seelction or tag creation
    X.liMousehover(); // Event Deligation: listing highlight on mouseover

    if (X.parentChkBox) X.clickParent(); // In parentChk case:: parent click(check/uncheck all childrens)
    if (X.allChk) X.clickMain(); // In superParent Case:: check/uncheck all values

    if (this.allChecked) {
        $('li.optgroup[data-id="opt_all"]').click();
    }

    X.onChangePrevent_onInit = false;
};

_droope.prototype = (function(argument) {
    console.log(this)
    var showDD = function(argument) {
        var X = this;
        var id = X.id;
        window.lastOpen = id;
        var rootCont = X.rootCont;
        rootCont.addClass('open');
        rootCont.find('.DDwrap').addClass('brBotN');
        rootCont.find('.drop').show();

        if (X.scrollToTop) $('#ul_' + id)[0].scrollTop = 0;

        if (X.drpLyrWth) {
            X.dpLyr.css({
                'width': X.drpLyrWth
            });
        }
        //var wth = X.drpLyrWth || rootCont.outerWidth() + 'px';

        X.max_height();
        if (!X.checkBox) {
            X.firstHighlight();
        };
    };

    var bindEvents = function() {
        var X = this;

        if (X.toggleDropLayer) {
            function commonCode(e) {
                if (intervalX) { /* Its value is modified in hideDD and FocusEv */
                    X.hideDD();
                } else if (!window.isFocus) { /* Its value is modified on focus of DD input and in hideDD */
                    X.focusEv.call(this, e);
                }
            }

            X.inpElm.on('touchstart click', function(e) {
                e.stopPropagation();
                if (e.type == "touchstart") {
                    X.inpElm.off('click');
                    commonCode.call(this, e);
                } else if (e.type == "click") {
                    commonCode.call(this, e);
                }
            });

            /*Focus event added on input of DD*/
            X.inpElm.on('focus', function(e) {
                window.isFocus = 1;
                X.focusEv.call(this, e)
            });

            X.inpElm.on('keydown', function(e) {
                X.keyDownEv(e, $(this));
            }).on('keyup', X.Fn.keyUpEv).on('blur', X.blurEv);
        } else {
            X.inpElm.on('focus click', X.focusEv).on('keydown', function(e) {
                X.keyDownEv(e, $(this));
            }).on('keyup', X.Fn.keyUpEv).on('blur', X.blurEv);
        }
    };

    var disable = function() {
        var X = this;
        $('#' + X.id).addClass('disable');
        X.inpElm.attr('readonly', 'readonly');
        X.inpElm.off('click focus keydown keyup blur');
    };

    var enable = function() {
        var X = this;
        var node = $('#' + X.id);
        if (node.hasClass('disable')) {
            node.removeClass('disable');
            X.inpElm.removeAttr('readonly')
            X.bindEvents();
        }
    };

    var prefillDataFormation = function(prefillData) {
        var X = this;
        var njson = {};

        if (prefillData && prefillData.length && typeof prefillData === "object") {
            // only pass first index value , bcz in singleSelect only one value can be selected
            if (!X.checkBox) {
                njson[prefillData.shift().toString()] = '1';
                return njson;
            }
            for (var ky in prefillData) {
                njson[prefillData[ky].toString()] = '1';
            }
            return njson;
        }
        if (prefillData) {
            njson[prefillData.toString()] = '1';
        }
        return njson;
    };

    var removeAllTags = function() { //checked
        var X = this;
        var id = X.id;

        for (var x in X.ChkBoxContr) {
            var Id = X.ChkBoxContr[x],
                dep_Id = Id.split('_'),
                newId;

            if (dep_Id.length == 3) {
                newId = dep_Id[0] + '_' + dep_Id[1];
            } else if (dep_Id.length == 4) {
                newId = dep_Id[0] + '_' + dep_Id[1] + '_' + dep_Id[2];
            }
            $('#ul_' + id).find('[data-id="' + newId + '"]').removeClass('chkd');
            if (X.tagInSepContainer) {
                $('#' + X.tagInSepContainer).find('[data-id="tg_' + Id + '"]').remove();
            } else {
                X.rootCont.find('.DDsearch').find('[data-id="tg_' + Id + '"]').remove();
            }

            if (X.parentChkBox || X.allChk) {
                if (!X.parentChkBox) {
                    var par = 'All';
                } else {
                    var par = X.dUnderScore(X.uEscp(dep_Id[2]));
                }

                var reqId = dep_Id[1];
                var index = X.optgrpObject[par].checked.indexOf(reqId);
                if (index > -1) {
                    X.optgrpObject[par].checked.splice(index, 1);
                }
                X.optgrpObject[par].unchecked.push(reqId);
                // X.chkForParent(X.optgrpObject,'');
            }
        }

        if (X.parentChkBox) {
            $('#ul_' + id).find('li a[data-id="' + id + '"]').removeClass('chkd');
        }
        if (X.allChk) {
            $('#ul_' + id).find('li[data-id="opt_all"]').find('a').removeClass('chkd');
            X.onClickAll('unchecked')
        }
        X.resetInpWidth(id);
        X.ChkBoxContr = {};
        X.inpHid.val('');
        X.hidValue = []; // when click on clearon button then it should be removed
        X.TagCnt = 0;
        X.setPlaceHolderAttribute();
    };

    var destroy = function() {
        var X = this;
        var id = X.id;
        var rootNode = X.rootCont;
        X.dpLyr.remove();
        X.inpHid.remove();
        rootNode.find('.DDsearch .tagit').remove();
        X.inpElm.val('').attr({
            'placeholder': X.inpElm.data('placeholder'),
            name: X.inpElm.data('name')
        });
        X.inpElm.removeAttr('autocomplete style')
        X.inpElm.off('focus keydown keyup blur');
        rootNode.find('.DDwrap').show();
        rootNode.data('droope', null);
        console.log(rootNode.data('droope'));
    };

    var removeTag = function(tagId, txt, bool, remId) { //checked
        var X = this;
        var id = X.id;
        var rep = tagId.replace('tg_', '');
        var tgId = X.uEscp(rep).split('_');
        var reqId = $('#hid_' + id).val();
        reqId = reqId ? JSON.parse(reqId) : '';
        var tmp = tgId.length == 4 ? tgId[0] + '_' + tgId[1] + '_' + tgId[2] : tgId[0] + '_' + tgId[1]; // tgId.length=4 for optgroup case
        if ($.inArray(X.dUnderScore(X.uEscp(tgId[1])), reqId) != -1) {
            $('#ul_' + id).find('[data-id="' + X.Escp(tmp) + '"]').removeClass('chkd');
            if (X.parentChkBox) {
                var a = tmp.split('_');
                a = a[a.length - 1];
                for (key in X.parentRefData[a]) {
                    if (!$(X.parentRefData[a][key]).find('a').hasClass('chkd')) {
                        $('#ul_' + id).find('li[data-id="opt_' + a + '"]').find('a').removeClass('chkd');
                        if ($('#ul_' + id).find('li[data-id="opt_all"]').find('a').hasClass('chkd')) {
                            $('#ul_' + id).find('li[data-id="opt_all"]').find('a').removeClass('chkd');
                            X.onClickAll('unchecked');
                        }
                    }
                }
            }
            if (remId) {
                $('#' + remId).remove();
            } else {
                if (X.tagInSepContainer) {
                    $('#' + X.tagInSepContainer).find('[data-id="' + tagId + '"]').remove();
                } else {
                    X.rootCont.find('.DDsearch').find('[data-id="' + tagId + '"]').remove();
                }
            }
            X.emptyHidField(rep.split('_')[1], id, txt);
            X.TagCnt--;

            if (!X.TagCnt) {
                X.setPlaceHolderAttribute();
            }
            for (var x in X.ChkBoxContr) {
                if (X.ChkBoxContr[x] == rep) {
                    delete X.ChkBoxContr[x];
                }
            }
            bool ? X.onClickReq(X.obj, X.dUnderScore(X.uEscp(tgId[1])), 'Unchecked', '', X.TagCnt) : '';
            X.setInputText();
        };
    };

    var fillData = function() { //Append Dynamically data to dropdown                          
        var jSonAry = [];
        var _this = this;
        var Id = _this.id;
        var dependentIdKey = [];

        //  for (var i = 0; i < _this.idLen; i++) {

        var njson = _this.prefillDataFormation(_this.prefillData);
        jSonAry[Id] = njson;
        var j = 0,
            optBinding = 0;
        // if (_this.obj.dependTo) {
        //     if (_this.dpLyr && _this.dpLyr.length) {
        //         _this.NLi = _this.appendData(_this.Ary, jSonAry, njson);
        //         _this.dpLyr.find('ul').html(_this.NLi[0]);
        //     } else {
        //         _this.NLi = _this.appendData(Id, jSonAry, njson);
        //         _this.fillDatainDropdwonLayer(Id, _this.NLi[0], i, _this.NLi[3], _this.NLi[4]);
        //     }
        // } else {
        if (_this.inpHid.val()) { // when user call dd form at trigger(eg:onClick) many times , then to solve the prefill duplicate problem
            _this.removeAllTags();
        }

        _this.NLi = _this.appendData(_this.Ary, jSonAry, njson);
        _this.fillDatainDropdwonLayer(Id, _this.NLi[0], 0, _this.NLi[3], _this.NLi[4]);
        //}
        _this.liCntrFx = _this.liCntr = _this.NLi[1];
        _this.createTags_ifPrefillData(_this.NLi[2]);
        //} // end of for _this.idLen loop
    };

    var appendData = function(DATA, prefillData, njson, kCd) {
        var html = ''
        var _this = this;
        var id = _this.id;
        var optgroupId;
        var bindKey;
        var Tagcontainer = [],
            inpTxt = '',
            cntr = 0,
            q = 0; /*mustbe Defined null*/

        if (_this.allChk) { // for super parent case
            html += _this.createParLi('all', 'All', '0', true);
        }
        for (var M in DATA) {

            bindKey = M; // to extend data object for addData function
            for (var key in DATA[M]) {

                var mKey = key.replace(_this.sortPrefix, ''); // mKey = modified key (removing sortprifix parameter)
                var KY = _this.eUnderScore(_this.Escp(mKey));

                if (typeof DATA[M][key] === 'object') { //optgroup case

                    var pchkd = _this.parentChkBox;
                    html += _this.createParLi(KY, key, id, pchkd, bindKey);
                    // '<li class="optgroup" data-id='+'opt_'+ KY +' bindTo='+M+'>'+key+'</li>';

                    var unchkarr = [];
                    cntr++;
                    var arr = [];
                    _this.optgrpObject[key] = {};
                    _this.optgrpObject[key]['checked'] = arr;
                    _this.optgrpObject[key]['unchecked'] = unchkarr;
                    for (var m in DATA[M][key]) {

                        if (njson && njson[m] != undefined) {
                            arr.push(m);
                        } else {
                            unchkarr.push(m);
                        }

                        _this.optgrpNameRef[m] = {
                            'pName': key,
                            text: DATA[M][key][m]
                        }; // to determine child belongs in which parent family/optgroup

                        // to remove sortprefix String from further operations
                        var n = _this.Escp(m).replace(_this.sortPrefix, '');

                        // if prefill Data provided
                        if (prefillData[id]) {
                            if (prefillData[id][n]) { //
                                var prfKey;
                                parseInt(prefillData[id][n]) ? prfKey = n : '';
                                if (prfKey === n) {
                                    _this.inpVal = m;
                                    inpTxt = DATA[M][key][m];
                                    var t = M ? id + '_' + n + '_' + KY + '_' + M : id + '_' + n + '_' + KY,
                                        TagData1 = [inpTxt, t, id, n];
                                    Tagcontainer[q++] = TagData1;
                                    cntr++;
                                    var chkd = _this.selCheckBox(id, KY, M, n);
                                    html += _this.createLi(id + '_' + n + '_' + KY, DATA[M][key][m], M);
                                    optgroupId = KY;
                                }
                            } else {
                                if (njson.toString() === m) { //single Select Case
                                    _this.inpVal = m;
                                    inpTxt = DATA[M][key][m];
                                    optgroupId = KY;
                                    _this.SingleSelection(inpTxt, [id, m]); // for single select dependent case with prefill
                                }
                                cntr++;
                                var chkd = _this.selCheckBox(id, KY, M, n);
                                html += _this.createLi(id + '_' + n + '_' + KY, DATA[M][key][m], M, chkd);

                            }
                        } else { // non-prefill data Case
                            if (njson === m) {
                                _this.inpVal = m;
                                inpTxt = DATA[M][key][m];
                            }
                            var _chkd = _this.selCheckBox(id, KY, M, n);
                            html += _this.createLi(id + '_' + n + '_' + KY, DATA[M][key][m], M, _chkd);
                            cntr++;
                        }
                    }
                } else { // without optgroup case case
                    _this.optgrpNameRef[key] = {
                        text: DATA[M][key]
                    }; // to determine child belongs in which parent family/optgroup

                    if (_this.allChk) {
                        var unchkarr = [];
                        var arr = [];
                        _this.optgrpObject['All'] = {};
                        _this.optgrpObject['All']['checked'] = arr;
                        _this.optgrpObject['All']['unchecked'] = unchkarr;

                        // to determine child belongs in which parent family/optgroup
                        for (var m in DATA[M]) {
                            if (njson[m] != undefined) {
                                arr.push(m);
                            } else {
                                unchkarr.push(m);
                            }
                        }
                    }

                    _this.optgrpNameRef[key] = {
                        text: DATA[M][key]
                    };
                    if (_this.checkBox) { //checkBox Case
                        var _prfKey = '';
                        if (prefillData && !$.isEmptyObject(prefillData[id])) {
                            prefillData[id][mKey] ? _prfKey = mKey : '';
                        }
                        if (_prfKey == mKey) {
                            var _TagData1 = [DATA[M][key], id + '_' + KY + '_' + M, id, key];
                            Tagcontainer[q++] = _TagData1;
                            html += _this.createLi(id + '_' + KY, DATA[M][key], M, '');
                            cntr++;
                        } else {
                            var __chkd = _this.selCheckBox(id, KY, M);
                            html += _this.createLi(id + '_' + KY, DATA[M][key], M, __chkd);
                            cntr++;
                        }

                    } else { //single Select without optgroup and without checkbox
                        var _prfKey = '';
                        if (prefillData && !$.isEmptyObject(prefillData[id])) {
                            prefillData[id][mKey] ? _prfKey = mKey : '';
                        }
                        if (_prfKey == mKey) {
                            html += _this.createLi(id + '_' + KY, DATA[M][key]);
                            _this.inpVal = mKey;
                            inpTxt = DATA[M][key];
                            cntr++;
                            !kCd ? _this.SingleSelection(DATA[M][key], [id, mKey]) : ''; // for single select dependent case with prefill
                        } else {

                            html += _this.createLi(id + '_' + KY, DATA[M][key]);
                            cntr++;
                        }
                    }
                }
            }
        }

        /* Comment out this code due to issue in jobsearch end:
         * : Ideally this code should be placed inside search-result function...
         */
        // if (!html) {
        //     var noDatatxt = _this.obj.noDataTxt ? _this.obj.noDataTxt : "No data found in search";
        //     html = '<li class="noData">' + noDatatxt + '</li>';
        //     //window.srchCntr++;
        // }

        if (_this.checkBox && _this.tagsSorting === false) {
            var newAry = [],
                i = 0;
            for (var x in njson) {
                for (var y in Tagcontainer) {
                    if (Tagcontainer[y][3] == x) {
                        newAry[i++] = Tagcontainer[y];
                    }
                }
            }
            Tagcontainer = newAry;
        }
        $.extend(_this.Ary[bindKey], DATA[bindKey]);

        return [html, cntr, Tagcontainer, inpTxt, optgroupId];
    };

    var chkForParent = function(optgrpObject, Data, id) {
        var size = 0;
        var check = 0;
        var id = id.split('_')[0]
        for (key in optgrpObject) {
            size++;
            if (optgrpObject[key].unchecked.length == 0) {
                $('li[data-id="opt_' + this.eUnderScore(this.Escp(key)) + '"]').find('a').addClass('chkd');
                check++;
                //  $('li[data-id="opt_all"]').find('a').addClass('chkd');
                //  this.onClickAll('checked');
            } else {
                $('#ul_' + id).find('li[data-id="opt_' + this.eUnderScore(this.Escp(key)) + '"]').find('a').removeClass('chkd');
                if ($('#ul_' + id).find('li[data-id="opt_all"]').find('a').hasClass('chkd')) {
                    $('#ul_' + id).find('li[data-id="opt_all"]').find('a').removeClass('chkd');
                    this.onClickAll('unchecked');
                }
            }
        }
        if (size == check) {
            $('#ul_' + id).find('li[data-id="opt_all"]').find('a').addClass('chkd');
            this.onClickAll('checked')
        }
    };

    var Escp = function(key) { // encode key (space : [" "])
        return key ? key.replace(/\s/g, 'SxP') : '';
    };

    var uEscp = function(key) { // decode key
        return key ? key.replace(/SxP/g, ' ') : false;
    };

    var eUnderScore = function(str) {
        return str ? str.replace(/\_/g, 'undrxxscr') : '';
    };

    var dUnderScore = function(str) {
        return str ? str.replace(/undrxxscr/gi, '_') : '';
    };

    var clickParent = function() { //click event functionality of parent checkbox 
        var X = this; // if parent checkbox is clicked then all its childrens are automatically selected/deselected
        var q,
            t = '', // must be initialize here
            td = X.id;
        $('#ul_' + td).on('click', 'li.optgroup', function() {
            var _this = this;
            var arr = $(this).nextUntil('li.optgroup');
            var lnth = arr.length;
            if (!$(this).children('a').hasClass('chkd')) {
                for (i = 0; i <= lnth; i++) {
                    if (!$(arr).eq(i).find('a').hasClass('chkd'))
                        $(arr).eq(i).find('a').click();
                }
                $(_this).children('a').addClass('chkd')

            } else {
                for (i = 0; i <= lnth; i++) {
                    if ($(arr).eq(i).find('a').hasClass('chkd'))
                        $(arr).eq(i).find('a').click();
                }
                $(_this).children('a').removeClass('chkd')
            }



        })
    };

    var clickMain = function() { //click event functionality of parent checkbox 
        var X = this; // if parent checkbox is clicked then all its childrens are automatically selected/deselected
        var q,
            t = '', // must be initialize here
            td = X.id;
        $('#ul_' + td).on('click', 'li.optgroup[data-id="opt_all"]', function(e) {
            e.stopImmediatePropagation();
            var _this = this;
            var arr = $(this).siblings('li.optgroup');
            var lnth = arr.length;
            if ($(this).children('a').hasClass('chkd')) {
                for (j = 0; j <= lnth; j++) {
                    if (!$(arr).eq(j).find('a').hasClass('chkd'))
                        $(arr).eq(j).click();
                }
                $(_this).children('a').addClass('chkd')

            } else {
                for (j = 0; j <= lnth; j++) {
                    if ($(arr).eq(j).find('a').hasClass('chkd'))
                        $(arr).eq(j).click();
                }
                $(_this).children('a').removeClass('chkd');
                X.onClickAll('unchecked');
            }

        })
    };

    var searchData = function(innerHTML, sTxtValue, id, key, bindTo) {
        var html = '',
            _this = this,
            innerHTML = innerHTML.toString();
        var getPos = (innerHTML.toLowerCase()).indexOf(sTxtValue.toLowerCase());
        var strLower = innerHTML.toLowerCase();
        var sTxtValueLower = sTxtValue.toLowerCase();
        var spaceVal = ((strLower.indexOf(' ' + sTxtValueLower)) < 0) ? false : strLower.indexOf(' ' + sTxtValueLower);
        var bracketVal = ((strLower.indexOf('(' + sTxtValueLower)) < 0) ? false : strLower.indexOf('(' + sTxtValueLower);
        var slashVal = ((strLower.indexOf('/' + sTxtValueLower)) < 0) ? false : strLower.indexOf('/' + sTxtValueLower);
        if (getPos >= 0 && ((spaceVal || bracketVal || slashVal)) || getPos === 0) {
            if (getPos) {
                if (spaceVal) {
                    getPos = spaceVal + 1;
                } else if (bracketVal) {
                    getPos = bracketVal + 1;
                } else if (slashVal) {
                    getPos = slashVal + 1;
                }
            }
            var new1 = innerHTML.substr(0, getPos),
                e = '<b>' + innerHTML.substr(getPos, sTxtValue.length) + '</b>',
                new2 = innerHTML.substr(getPos + sTxtValue.length, innerHTML.length),
                KY = _this.Escp(key).replace(_this.sortPrefix, '');
            if (_this.selChkBox(KY + '_' + bindTo, id)) {
                html = _this.createLi(KY, new1 + e + new2, bindTo, 'chkd');
            } else {
                html = _this.createLi(KY, new1 + e + new2, bindTo);
            }
            //_this.window.srchCntr++;
        } //end of getPos if    
        return html;
    };

    var selChkBox = function(Lid, id) {
        var mtch = 0,
            X = this;
        for (var x in X.ChkBoxContr) {
            if (Lid == X.ChkBoxContr[x]) {
                mtch = 1;
            }
        }
        return mtch ? true : false;
    };

    var selCheckBox = function(id, KY, M, n) { // n is only avail in CASE of optGroup
        var flg = 0;
        for (var x in this.ChkBoxContr) {
            flg = 1;
            break;
        }
        if (flg) {
            if (n) {
                return this.selChkBox(id + '_' + n + '_' + KY + '_' + M, id) ? 'chkd' : '';
            } else {
                return this.selChkBox(id + '_' + KY + '_' + M, id) ? 'chkd' : '';
            }
        }
    };

    var createParLi = function(KY, key, id, chkd, bnd) { // code by Nitin 
        bnd = bnd ? 'bindTo="' + bnd + '"' : '';
        chkd = chkd ? 'class="' + chkd + '"' : '';
        var tag = "";
        if (chkd) {
            tag = '<a href="javascript:;" data-id=' + id + '>' + key + '</a>'; // only if parentChkBox is true
        } else {
            tag = key;
        }
        return '<li class="optgroup" ' + bnd + ' data-id=' + 'opt_' + KY + '>' + tag + '</li>';
    };

    var createLi = function(id, txt, bnd, chkd) {
        bnd = bnd ? 'bindTo="' + bnd + '"' : '';
        chkd = chkd ? 'class="' + chkd + '"' : '';
        return '<li class="pickVal" ' + bnd + '><a href="javascript:;" ' + chkd + ' data-id=' + id + '>' + this.replaceTag(txt) + '<i class="icon"></i></a></li>';
    };

    var resetInpWidth = function(id) {
        $('#clrAll_' + id).hide();
        this.inpElm.css({
            'width': ''
        });
        this.rootCont.find('li.frst').css({
            'float': 'none'
        });
    }

    var firstHighlight = function() {
        var X = this;
        var finalId;
        var id = X.id;
        var ulCont_parent = $('#ul_' + id);
        var ulCont = ulCont_parent.find('ul');
        if (X.curActElm) X.curActElm.removeClass('active');
        X.curActElm = X.isFirstValueHighlight ? ulCont.find('li').first() : X.curActElm;
        var hidVal = X.Escp(X.inpHid.attr('value'));
        if (hidVal && !X.checkBox) {
            // X.curActElm.removeClass('active');
            if (X.inpHid.data('optGroupKey')) {
                finalId = id + '_' + hidVal + '_' + X.inpHid.data('optGroupKey');
            } else {
                finalId = id + '_' + hidVal;
            }
            X.curActElm = ulCont.find('[data-id="' + finalId + '"]').parent().addClass('active');
        } else {
            if (X.curActElm) X.curActElm.addClass('active');
        }
    };

    var emptyHidField = function(key, id, txt) { //checked
        var X = this;
        txt ? txt.toLowerCase() == "all" ? X.Allflg = '' : '' : '';
        var cKey = X.dUnderScore(X.uEscp(key)).replace(X.sortPrefix, '');
        var index = $.inArray(cKey, X.hidValue),
            finalVal;
        if (index !== -1) {
            X.hidValue.splice(index, 1);
            finalVal = JSON.stringify(X.hidValue);
        }
        if (X.hidValue.length == 0) {
            X.resetInpWidth(id);
            finalVal = X.hidValue;
        }
        X.inpHid.val(finalVal);
        delete X.selectedValues[cKey];
        //X.onChange(X.hidValue, X.selectedValues);
        onChangeHandler.call(X, X.hidValue, X.selectedValues)
    };

    var setInputText = function() {
        var X = this;
        var midVal;
        var id = X.id;
        var inpString = '';

        if (X.Allflg == "all") {
            midVal = "all";
        } else {
            midVal = X.TagCnt;
        }

        if (X.selectedCounter) {
            if (X.TagCnt) {
                if (X.showSelText && X.hidValue.length) {
                    for (var i = 0; i < X.hidValue.length; i++) {
                        inpString += X.Ary.A[X.hidValue[i]] + ', ';
                    }
                    inpString = inpString.slice(0, -2);
                    X.tagInSepContainer || X.tags === false ? X.inpElm.val(inpString) : '';
                } else {
                    X.tagInSepContainer || X.tags === false ? X.inpElm.val(X.preTxt + ' ' + midVal + ' ' + X.postTxt) : '';
                }
            } else if (!X.inpHid.val() && !X.preserveText) {
                X.rootCont.find('.cross').hide();
                //X.inpElm.val('');
                if (X.checkBox) {
                    X.inpElm.val('')
                }
                X.inpElm.css({
                    width: ''
                });
            }
        }
    };

    var setPlaceHolderAttribute = function() {
        var X = this;
        X.inpElm.attr('placeholder', X.inpElm.data('placeholder'));
        X.inpElm.parents('.frst').css({
            'float-left': 'none'
        });
    };

    var removeData = function(obj) {
        var X = this,
            id = X.id,
            cntr = 0;
        X.dpLyr.find('ul li').each(function() {
            if ($(this).attr('bindTo') == obj.key) {
                var anch = $(this).children('a');
                if (anch.length) {
                    var id = anch.data('id');
                    if (anch.hasClass('chkd')) {
                        delete X.ChkBoxContr[X.uEscp(id.split('_')[1])];
                        X.removeTag('tg_' + id + '_' + X.Escp(obj.key), anch.html(), true);
                    }
                }
                cntr++;
                $(this).remove();
            }
        });
        delete X.Ary[obj.key];
        X.liCntr = X.liCntr - cntr;

        //Hack for Cja bug --- should be remove when the issue will fixed
        if (!$('#ul_' + X.id).find('li').length) {
            $('#' + X.id).find('.tagit').remove();
        }
    };

    var removeBlockofData = function(obj) {
        this.removeData(obj);
    };

    var addSelected = function(obj, tag_onof_flag) { // depricated removed in v10.0.0
        var id = this.id;
        for (var x in obj) {
            this.CreateTags(obj[x], id + '_' + x + '_A', 0, tag_onof_flag);
        }
    };

    var deleteSelected = function(obj) { // depricated removed in v10.0.0
        var id = this.id;
        for (var x in obj.keyObject) {
            this.removeTag('tg_' + id + '_' + obj.keyObject[x] + '_' + 'A', '', obj.tag_onof_flag, obj.remId);
        }
    };

    var select = function(obj) { // key accept after removing sortprefix
        var X = this;
        var id = X.id;
        if (X.checkBox) {
            for (var x in obj.key) {
                var key = obj.key[x];
                var sPkey = X.sortPrefix ? X.sortPrefix + key : key;
                var nodeData = X.optgrpNameRef[sPkey];
                if ($.inArray(key[0], X.hidValue) == -1) { // check if tag already existed
                    if (nodeData.pName) {
                        X.CreateTags(nodeData.text, id + '_' + key + '_' + nodeData.pName + '_A');
                    } else {
                        X.CreateTags(nodeData.text, id + '_' + key + '_A');
                    }
                }
            }
        } else {
            if (!X.optgrpNameRef[obj.key]) throw ('DD: Key not exist');
            X.SingleSelection(X.optgrpNameRef[obj.key].text, [id, obj.key]);
        }
    };

    var deselect = function(obj) {
        var X = this;
        var id = X.id;
        if (X.checkBox) {
            for (var x in obj.key) {
                var key = obj.key[x];
                var sPkey = X.sortPrefix ? X.sortPrefix + key : key;
                var nodeData = X.optgrpNameRef[sPkey];
                if (nodeData.pName) {
                    X.removeTag('tg_' + id + '_' + obj.key[x] + '_' + nodeData.pName + '_' + 'A');
                } else {
                    X.removeTag('tg_' + id + '_' + obj.key[x] + '_' + 'A');
                }
            }
        } else {
            if (!X.optgrpNameRef[obj.key]) throw ('DD: Key not exist');
            X.SingleSelection('', [id]);
        }
    };

    var addData = function(obj) { // to append data in dropdown
        var X = this;
        var data = {};
        var tempObj = [];

        // Fixed for data disapprear when data added dynamically by using instance.addData()
        var newObj = {};
        newObj[obj.key] = obj.data;
        $.extend(X.Ary, newObj);

        if (!obj.status) { // for lagacy support
            obj.status = "Checked";
        }
        var addKey = obj['key'] ? obj['key'] : 'A';
        if (obj.status == "Checked") {
            data[addKey] = obj['data'];
            var njson = X.prefillDataFormation(obj.prefillData);
            tempObj[X.id] = njson;
            X.NLi = X.appendData(data, tempObj, njson);
            $('#ul_' + X.id).find('ul').append(X.NLi[0]);
            X.createTags_ifPrefillData(X.NLi[2]);
            X.liCntr += X.NLi[1];
        } else if (obj.status == "Unchecked") {
            this.removeBlockofData(obj);
        }
    };

    var createTags_ifPrefillData = function(obj) {
        var X = this;
        var id = X.id;
        //    if (X.sts != "Unchecked") {
        if (X.checkBox && obj) { // create tag on prefill basis
            for (var k = 0; k < obj.length; k++) {
                for (var z in X.prefillData) {
                    if (X.prefillData[z] == obj[k][3]) {
                        break;
                    }
                }
                X.CreateTags(obj[k][0], obj[k][1], z, X.tags);
            }
        }

        //  }
        X.setInputText();
    };

    var replaceData = function(params) {
        var X = this;
        var id = X.id;
        var isReset = params.isReset === false ? params.isReset : X.isReset;
        var tempObj = [];
        var hidElm = X.inpHid;
        var hidVal = $.trim(hidElm.val());
        X.prefillData = params.prefillData;
        var prefillData;
        if (X.checkBox && hidVal) {
            if (X.tagInSepContainer) {
                $('#' + X.tagInSepContainer).find('.tagit').remove();
            } else {
                X.rootCont.find('.DDsearch').find('.tagit').remove();
            }
            X.resetInpWidth(id);
            X.ChkBoxContr = {};
            hidElm.val('');
            X.hidValue = []; // when click on clearon button then it should be removed
            X.TagCnt = 0;
            X.setPlaceHolderAttribute();
        }
        if (isReset) { // to enable/disabled reset filed 
            X.inpElm.val('');
            hidElm.val('');
        }

        if (!$.isEmptyObject(params.data)) {
            X.Ary = {
                'A': params.data
            };
            X.ChkBoxContr = [];
            var njson = X.prefillDataFormation(params.prefillData);
            tempObj[id] = njson;
            var html = X.appendData(X.Ary, tempObj, njson);
            X.dpLyr.find('ul').html(html[0]);
            X.createTags_ifPrefillData(html[2]);
            X.liCntr = html[1];
            X.firstHighlight();
            X.max_height();
        } else {
            throw ('Either data object is empty or undefined');
        }
    };

    var hideDD = function() {
        var X = this;

        //Prevent default nature of dd-layer close mode, when user click outside of dd or select any value from it.
        if (!X.preventClose) {
            var id = X.id;
            if (X.dpLyr.css('display') == "block") {
                X.dpLyr.hide();
                X.rootCont.removeClass('open');
                X.rootCont.find('.DDwrap').removeClass('brBotN');
                if (!X.checkBox) {
                    X.curActElm ? X.curActElm.removeClass('active') : '';
                    if (X.selectOnBlur) {
                        var hd = X.inpHid,
                            inp = X.inpElm,
                            validVal;
                        rr = X.uEscp(hd.attr('opt')),
                            dataAry = X.Ary['A'],
                            retObj = X.getKeyFromVal(X.Ary['A'], inp.val()),
                            keySel = retObj.retKey;
                        if (retObj.parentKey) {
                            validVal = rr ? dataAry[rr][hd.val()] : dataAry ? dataAry[retObj.parentKey][keySel] ? dataAry[retObj.parentKey][keySel] : '' : '';
                        } else {
                            validVal = rr ? dataAry[rr][hd.val()] : dataAry ? dataAry[keySel] ? dataAry[keySel] : '' : '';
                        }


                        if (!X.inpHid.val() && !X.preserveText && !validVal) {
                            X.inpElm.val('');
                        }
                    } else {
                        if (!X.inpHid.val() && !X.preserveText) {
                            X.inpElm.val('');
                        }
                    }

                }
                X.setInputText();
            }

            if (X.searchBox !== false) {
                X.setLi(id);
            }

            //To handle show and hide of .drop layer on click
            window.isFocus = 0;
            window.intervalX = 0
        }
    };

    var getSelectedValue = function(argument) {
        var keys = this.hidValue;
        var object = this.selectedValues;
        return {
            keys: keys,
            object: object
        }
    }

    /**
     * [reset -> Since reset and destroy both doing almost same functionality so in comming/next version will be merged both method functionality in one/through common function ]
     */
    var reset = function() {
        this.prefillData = [] // to reset prefill values
        this.ChkBoxContr = {}; // to reset checkbox counter
        this.selectedValues = {};
        this.init();
    }
    var resetSearch = function() {
        this.inpElm.val(''); // to reset text in field
        this.Fn.initSearch("", this.id, 8); // Simulate backspace with blank string
    }

    var onChangeHandler = function(key, value) {
        if (!this.onChangePrevent_onInit) {
            this.onChange(key, value);
        }
    }

    return {
        showDD: showDD, //required to public
        bindEvents: bindEvents,
        disable: disable, //required to public
        enable: enable, //required to public
        prefillDataFormation: prefillDataFormation,
        removeAllTags: removeAllTags,
        destroy: destroy, //required to public
        removeTag: removeTag,
        fillData: fillData,
        appendData: appendData,
        chkForParent: chkForParent,
        Escp: Escp,
        uEscp: uEscp,
        eUnderScore: eUnderScore,
        dUnderScore: dUnderScore,
        clickParent: clickParent,
        clickMain: clickMain,
        searchData: searchData,
        selChkBox: selChkBox,
        selCheckBox: selCheckBox,
        createParLi: createParLi,
        createLi: createLi,
        resetInpWidth: resetInpWidth,
        firstHighlight: firstHighlight,
        emptyHidField: emptyHidField,
        setInputText: setInputText,
        setPlaceHolderAttribute: setPlaceHolderAttribute,
        removeData: removeData,
        removeBlockofData: removeBlockofData,
        addSelected: addSelected,
        deleteSelected: deleteSelected,
        select: select, //required to public
        deselect: deselect, //required to public
        addData: addData, //required to public
        createTags_ifPrefillData: createTags_ifPrefillData,
        replaceData: replaceData, //required to public
        hideDD: hideDD, //required to public
        getSelectedValue: getSelectedValue,
        /**
         * [reset -> This function reset all selection made by user and reset droope to its initialization state without considering prefill case]
         * @type {[method]}
         */
        reset: reset, // required to public
        resetSearch: resetSearch, // required to public
        onChangeHandler: onChangeHandler // not required to make public
    }
})();

_droope.Ary = {};
_droope.lastRef = {};
//end of custom dropdown//
