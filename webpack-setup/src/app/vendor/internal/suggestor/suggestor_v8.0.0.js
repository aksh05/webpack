import { getCookie } from "./../cookie/cookie.js"; //cookie
import { ncCacheFactory } from "./ncCache_v2.js";
import { merger } from "../helper_methods/merger.js";
import "./jsonpErrorSupport_v1.js";
/*
 * Author: Saeed
 * Version: v8.0.0
 * 
 * Updated By: Saeed
 * Description: [compatible for Web Component also]
 *
 */

/*Start of Suggestor.js*/
(function($) {
    var openDrops = {};
    var sugId;
    var sugInpNode;
    var sInputVal;
    var trackingObject = {};
    var trackingURL;
    var tObj = [];


    function document_clickBind() {
        $(document).on('click.suggestor', function(e) {
            var closest = $(e.target).closest(".suggest");
            if (!openDrops[closest.attr('id')] || !closest.is(".suggest")) {
                $.each(openDrops, function(key, value) {
                    sugId = $(this).attr('id').split('_')[1];
                    sugInpNode = $(this).parent().find('.sugInp');
                    sInputVal = sugInpNode.val();
                    if (sInputVal) sugInpNode.val((sInputVal.replace(/,\s*$/, '')));
                    $(this).removeClass('slideDown');
                    delete openDrops[sugId];
                })
            }
        });
    }


    var sugCache = ncCacheFactory.getCache('sgtr');
    var checkLS = function() {
        if (typeof(Storage) !== "undefined") {
            return true;
        } else {
            return false;
        }
    };
    var sendBeacon = function(url, data) {
        var _data = JSON.stringify(data);
        if (navigator.sendBeacon && url) {
            navigator.sendBeacon(url, _data);
        } else if (checkLS()) {
            sugCache.setItem('sug_Tracking', data);
        }
    }
    var createTrackObject = function(textVal, position, typedValue, dataType, cached, Qry) {
        var obj;
        if (dataType == "autoconcepts") {
            obj = {
                "type": 'ac',
                "acFor": typedValue,
                "sel": textVal,
                "pos": position,
                "cached": cached
            };
        } else if (dataType == "relatedConcept") {
            obj = {
                "type": 'rc',
                "rcFor": Qry,
                "sel": textVal,
                "pos": position,
                "cached": cached
            };
        } else {
            obj = {
                "sel": textVal,
                "pos": position
            };
        }
        return obj;
    }

    var setTrackingObject = function(id, textVal, position, typedValue, dataType, cached, Qry) {
        trackingObject[id] && trackingObject[id]['Events'].push(createTrackObject(textVal, position, typedValue, dataType, cached, Qry))
    };

    var sendTrackingData = function() {
        /**  send data to server on window unload event by using sendBecon feature if exist,
         *   otherwise stored that data in localStorage and send in next user visit
         *   and also deleted if successfully send.
         */
        $('.sugInp').each(function(key, val) {
            var _params = $(this).attr('trackParams');
            var inpVal = $(this).val();
            _params = _params ? $.parseJSON(_params) : null;
            if (_params) {
                if (inpVal || (trackingObject[_params.id]['Events'].length)) {
                    if (!trackingObject[_params.id]['Events'].length) {
                        tObj = [];
                        setTrackingObject(_params.id, inpVal, 0);
                    }
                    if (_params.sourceId) trackingObject[_params.id]['sId'] = _params.sourceId;
                    if (_params.appId) trackingObject[_params.id]['appId'] = _params.appId;
                    if (_params.platform) trackingObject[_params.id]['platform'] = _params.platform;
                    if (_params.formId) trackingObject[_params.id]['formId'] = _params.formId;
                    if (_params.trackingSrc) trackingObject[_params.id]['trackingSrc'] = _params.trackingSrc;
                } else {
                    if (!trackingObject[_params.id]['Events'].length) {
                        delete trackingObject[_params.id];
                    }
                }
            }
        });

        if (!$.isEmptyObject(trackingObject)) {
            sendBeacon(trackingURL, {
                "lgData": trackingObject
            });
        }
    }

    window.onunload = function() {
        sendTrackingData();
    };

    $.fn.suggestor = function(options) {

        if (!options.domain && !(options.url.autoComplete && options.url.relatedConcept && options.url.checkVersion && options.url.prefetch)) {
            throw Error("One or more mandatory parameters are missing, please refer documentation. https://github.com/saeed3e/suggestjs/blob/gh-pages/README.md");
            return false;
        }
        var defaults = {
            id: null,
            url: {
                autoComplete: options.domain + '/suggest/autosuggest?',
                relatedConcept: options.domain + '/suggest/autoconcepts?',
                checkVersion: options.domain + '/suggest/v?',
                prefetch: options.domain + '/suggest/prefetch?'
            },
            relatedConcept_dataLayer: true,
            autoCorrect_dataLayer: true,
            maxSuggestions: 15,
            maxHeight: 300,
            multiSearch: false,
            startSearchAfter: 1,
            suggestOnClick: false,
            whiteListSpecialChar: [],
            relatedCorrectionText: 'Did you mean ?',
            relatedConceptText: 'Related Skills',
            glbArray: false,
            placeholder: false,
            trackUserInteraction: false, // to track user Interaction
            grouping: true,
            isPrefetch: true,
            source: 'server',
            category: {},
            relatedConceptCategory: null,
            getRelatedConcepts: null,
            onSelect: false,
            scrollStyle: '',
            width: null,
            preventClose: false,
            returnFocus: true,
            form: false,
            showDataOnFocus: false,
            storageKey: { // This parameter is used to store prefetched data agarint pretetchKey and version value against versionKey in localStorage.
                prefetchKey: '__suggest_prefetch',
                versionKey: '__suggest_versions',

            },
            userCookie: null,
            titleForSingleBucket: 'Last Searched Keywords',
            appId: null,
            relatedConceptsLimit: Infinity

        };

        var params = $.extend(true, {}, merger(defaults, options));

        params.storageKey.userCookie = params.storageKey.userCookie || params.userCookie;


        // To prevent close when user click outside of suggestor's boudry
        if (!params.preventClose) {
            document_clickBind();
        }



        var makeAjax = function(url, succCbFn, hideLoader) {
            if (url) {
                var _t = this;
                var id = _t.id;
                $.jsonp({
                    "url": url + "&callback=suggestCallback",
                    cache: true,
                    callback: "suggestCallback",
                    beforeSend: function() {
                        if (!hideLoader) $('#' + id + ' .nLoder').show();
                        // if (!params.relatedConcept_dataLayer) {
                        //     hide.call(_t);
                        // }
                    },
                    "success": function(resp) {
                        _t.cached = false;
                        if (resp.resultList) {
                            if ($.isEmptyObject(resp.resultList) && _t.dropCont.hasClass('slideDown')) {
                                hide.call(_t);
                            } else {
                                _t.dataType = 'autoconcepts';
                                succCbFn(resp);
                                params.vertical = resp.vertical;
                            }
                        } else if (resp.resultConcepts) {
                            if ($.isEmptyObject(resp.resultConcepts)) {
                                hide.call(_t);
                            } else {
                                _t.dataType = 'relatedConcept';
                                if (params.getRelatedConcepts) params.getRelatedConcepts(resp, _t.Qry); // to pass related concept data in callback
                                if (params.relatedConcept_dataLayer) {
                                    succCbFn(resp);
                                } else {
                                    //Since sometime due to delay in request response, droplayer open again so, to prevent this nature again close the layer 
                                    hide.call(_t);
                                }
                            }
                            _t.RCMaxCntr++;
                        } else if (resp.resultCorrections) {
                            if ($.isEmptyObject(resp.resultCorrections)) {
                                hide.call(_t);
                            } else {
                                _t.dataType = 'relatedConcept';
                                if (params.getAutoCorrect) params.getAutoCorrect(resp, _t.Qry); // to pass autoCorrect data in callback
                                if (params.autoCorrect_dataLayer) succCbFn(resp);
                            }
                            _t.RCMaxCntr++;
                        } else {
                            succCbFn(resp);
                        }
                    },
                    complete: function() {
                        _t.node.find('.nLoder').hide();
                    },
                    "error": function(d, msg) {
                        _t.node.find('.nLoder').hide();
                        hide.call(_t);
                    }
                })
            }
        };


        var prefetchData_personalized = function() {
            var _t = this;
            _t.rs_kWrds = [];
            _t.rs_kWrdsStr = '';
            var recentSearches = params.showDataOnFocus;
            if (recentSearches) {
                _t.rs_kWrds = recentSearches;
                if (_t.rs_kWrds.length) {
                    _t.rs_kWrdsStr = _t.rs_kWrds.join(',').replace(/\s,|,\s/g, ',');
                }
            }

            var prefData = params.storageKey;
            var isLoggedIn = prefData.userCookie ? getCookie(prefData.userCookie) : false;
            var vertical = params.vertical ? '&vertical=' + params.vertical : '';
            //var qParamString = !$.isEmptyObject(params.qParams) ? '&'+$.param(params.qParams):'';
            var qParamString = getQparam();

            if (isLoggedIn) {
                return {
                    key: prefData.prefetchKey + '/uId/' + isLoggedIn,
                    url: params.url.prefetch + '&' + Math.random(1, 100) + '&keywords=' + _t.rs_kWrdsStr + '&uid=' + isLoggedIn + vertical + qParamString,
                    keywords: _t.rs_kWrdsStr
                }
            } else if (_t.rs_kWrdsStr) {
                return {
                    key: prefData.prefetchKey,
                    url: params.url.prefetch + '&' + Math.random(1, 100) + '&keywords=' + _t.rs_kWrdsStr + vertical + qParamString,
                    keywords: _t.rs_kWrdsStr
                }
            } else {
                return {
                    key: prefData.prefetchKey,
                    url: params.url.prefetch + '&' + Math.random(1, 100) + '&keywords=' + vertical + qParamString,
                    keywords: _t.rs_kWrdsStr
                }
            }
        }

        var generatePrefetchURL = function(url) {
            var isLoggedIn = '&' + getCookie(prefData.userCookie);
            return params.url.prefetch + '&' + Math.random(1, 100) + isLoggedIn
        }

        var mergeData = function(oldD, newD) {
            params.vertical = newD.vertical;
            if (params.vertical) {
                var newAC = newD.ac,
                    newRC = newD.rc;

                var category = params.category;
                var rcCategory = params.relatedConceptCategory;
                //                debugger
                for (key in newAC) {
                    for (k in newAC[key]) {
                        if (category[k]) {
                            var premKey = k + "_" + params.vertical;

                            newAC[key][premKey] = newAC[key][k];
                            delete newAC[key][k];
                        } else {
                            delete newAC[key][k];
                        }
                    }

                }
                for (key in newRC) {
                    for (k in newRC[key]) {
                        if (rcCategory[k]) {
                            var premKey = k + "_" + params.vertical;
                            newRC[key][premKey] = newRC[key][k];
                            delete newRC[key][k];
                        } else {
                            delete newRC[key][k];
                        }
                    }
                }
                var ac = $.extend(true, {}, oldD.ac, newAC);
                var rc = $.extend(true, {}, oldD.rc, newRC);
            } else {
                var ac = $.extend(true, {}, oldD.ac, newD.ac);
                var rc = $.extend(true, {}, oldD.rc, newD.rc);
            }


            return {
                'ac': ac,
                'rc': rc,
                "ttl": newD.ttl,
                "segments": newD.segments,
                "keyword_based_data": newD.keyword_based_data

            }
        }


        var callPrefetchData = function() {
            var _t = this;
            params.url.checkVersion += Math.random(0, 100);
            _t.prefetchObj = prefetchData_personalized.call(_t);

            // isFirstCall : if multiple suggestor call in a page then version checks only one time.
            if (!window.isFistCall && params.url.prefetch && checkLS() && params.isPrefetch) {
                makeAjax.call(_t, params.url.checkVersion, function(resp) {

                    setLS(params.storageKey.versionKey, resp);
                    var isData = sugCache.getItem(_t.prefetchObj.key);
                    if (isData) {
                        /**
                         * [if description]
                         * @param  {String} isData.keyword_based_data [need to check with blank string,
                         * because in some cases false is treated as a true]
                         */
                        if ((_t.prefetchObj.keywords && isData.keyword_based_data === false) || (+new Date(isData.ttl)) - (+new Date()) < 0) {
                            makeAjax.call(_t, _t.prefetchObj.url + '&segments=' + isData.segments, function(pData) {
                                setLS(_t.prefetchObj.key, mergeData(isData, pData));
                            });
                        }
                    } else {
                        let isDataExist = sugCache.getItem(params.storageKey.prefetchKey);
                        var segm = isDataExist ? isDataExist.segments : '';
                        makeAjax.call(_t, _t.prefetchObj.url + '&segments=' + segm, function(pData) {
                            setLS(_t.prefetchObj.key, pData);
                        }, true);
                    }
                }, true);
                window.isFistCall = true;
            }

        };

        var setCaretPos = function(input, pos) { // need to rewrite this function
            var selectionStart = pos,
                selectionEnd = pos;
            if (input.setSelectionRange) {
                input.focus();
                input.setSelectionRange(selectionStart, selectionEnd);
            } else if (input.createTextRange) {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd('character', selectionEnd);
                range.moveStart('character', selectionStart);
                range.select();
            }
        };

        var decodeTxt = function(txt) { //'Unit Test Done':
            return txt ? txt.replace(/(<([^>]+)>)/ig, "").replace(/&amp;/gi, '&') : "";
        };

        var txtAfterLastComma = function(z) {
            z = $.trim(z).toLowerCase();
            z = $.trim(z.substring(z.lastIndexOf(',') + 1, z.length));
            return z;
        };

        var txtBeforeLastComma = function(val) {
            var z = $.trim(val).replace(/,*$/g, '');
            return $.trim(z.substring(z.lastIndexOf(',') + 1, z.length)).toLowerCase();
        };

        var setLS = function(key, data) {
            sugCache.setItem(key, data);
        };

        var getLS = function(key, type) {
            if (this.prefetchObj) {
                var d = sugCache.getItem(this.prefetchObj.key);
                if (!d || !d[type] || !d[type][key]) {
                    d = sugCache.getItem(params.storageKey.prefetchKey);
                }
                return d ? d[type][key] : false;
            } else {
                return false;
            }

        };

        var returnDataArray = function(val) {
            var _t = this;
            var id = _t.id;
            if (params.glbArray) {
                showSugt.call(_t, val, params.glbArray);
            } else {
                showSugt.call(_t, val, S.data[id]);
            }
        };

        var removeComma = function() {
            var _t = this;
            var sInputVal = _t.inpElm.val();
            if (sInputVal) _t.inpElm.val((sInputVal.replace(/,\s*$/, '')));
        };

        var addComma = function(txt) { //'Unit Test Done':     
            var _t = this;
            var str = _t.inpElm.val();
            var nStr = str.substring(0, str.lastIndexOf(',') + 1);
            nStr = nStr ? nStr + ' ' : '';
            txt = $.trim((decodeTxt(txt)).replace(/,*$/g, ''));
            return params.multiSearch ? nStr + txt + ', ' : txt;
        };

        var getIndex = function(elm, parent) {
            return $.inArray(elm[0], parent.find('li.sugTouple')) + 1;
        };

        var setValueInTextBox = function(btn, relatedConceptFlag) {
            var _t = this;
            var id = _t.id;
            var elm = _t.inpElm;
            var txt = btn.html();
            var custVal = addComma.call(_t, txt);

            _t.enableRC_for_onfocus = false;

            if (custVal.length < params.maxlength) {
                elm.val(custVal);
                if (params.trackUserInteraction) {
                    tObj = [];
                    setTrackingObject(id, txtAfterLastComma(custVal.replace(/[,\s]*$/, '')), _t.posIndex, txtAfterLastComma(_t.queryChar), _t.dataType, _t.cached, _t.Qry);
                }
                //if (params.trackUserInteraction) setTrackingObject.call(_t, txtAfterLastComma(custVal.replace(/[,\s]*$/, '')), txtAfterLastComma(_t.queryChar), _t.dataType, _t.id, _t.posIndex, _t.cached, _t.Qry, params);
                if (params.returnFocus) setCaretPos(elm[0], elm.val().length);
                if (relatedConceptFlag) _t.get_RCdata(elm.val());
                if (params.onSelect) params.onSelect(id, decodeTxt(txt), elm, _t);
            } else {
                if (params.onSelect) params.onSelect(id, "Warning: maximum length reached", elm, _t);
            }
            hide.call(_t);
        };

        var multiSearchOnOff = function(sel) { // no Unit Test
            var _t = this;
            var li = _t.dropCont.find(sel);
            li = li.hasClass('category') ? li.next() : li;
            return li;
        };

        var removeHighligting = function(elm) {
            if (elm) elm.find('.sAct').removeClass('sAct');
        };

        var currActElm = function(node, PevNxt) { // handled on arrow key up and down
            var _t = this;
            var prevNode = node;
            if (PevNxt == "prev") {
                if (node.prev().hasClass('category')) {
                    if (node.prev().prev().length) {
                        node = node.prev().prev();
                    } else {
                        node = multiSearchOnOff.call(_t, ' li:last-child');
                    }
                } else {
                    if (node.prev().length) {
                        node = node.prev();
                    } else {
                        node = multiSearchOnOff.call(_t, ' li:last-child');
                    }

                }
            } else if (!node.next().length) {
                node = multiSearchOnOff.call(_t, ' li:first-child');
            } else if (node.next().hasClass('category')) {
                node = node.next().next();
            } else {
                node = node.next();
            }
            if (_t.curElm.find('.Sarw').hasClass('sAct')) {
                node.find('.Sarw').addClass('sAct');
            } else {
                node.find('.Sbtn').addClass('sAct');
            }
            removeHighligting(prevNode);
            if (!params.multiSearch) _t.inpElm.val(decodeTxt(node.find('.Sbtn').html()));
            return node;
        };

        var gotoFirstLast = function(sel, node) { // handled on arrow key up and down
            var _t = this;
            node = $('#' + sel);
            node = node.hasClass('category') ? node.next() : node;
            node.find('.Sbtn').addClass('sAct');
            if (!params.multiSearch) _t.inpElm.val(decodeTxt(node.find('.Sbtn').html()));
            return node;
        };

        var FilterCommon = function(dataOb, lastchar) { //'Unit Test Done':   
            var _t = this;
            //firstPart, secondPart = '';
            var dataAryAt;
            if (typeof dataOb == "object") {
                dataAryAt = dataOb.displayTextEn;
            } else {
                dataAryAt = dataOb;
            }

            var Li = '',
                new1 = '',
                e = '',
                new2 = '';
            dataAryAt = (dataAryAt).replace(/&amp;/gi, '&');
            if (lastchar.split(',')[1] && params.multiSearch) {
                lastchar = getlastChar(lastchar);
            }
            lastchar = (lastchar.replace(/[\s]+/g, " ").replace(/^\s/, "")).toLowerCase();
            var str = dataAryAt,
                strL = str.toLowerCase(),
                getPos = strL.indexOf(lastchar),
                strLower = strL,
                sTxtValueLower = lastchar,
                spaceVal = ((strLower.indexOf(' ' + sTxtValueLower)) < 0) ? false : strLower.indexOf(' ' + sTxtValueLower),
                bracketVal = ((strLower.indexOf('(' + sTxtValueLower)) < 0) ? false : strLower.indexOf('(' + sTxtValueLower),
                slashVal = ((strLower.indexOf('/' + sTxtValueLower)) < 0) ? false : strLower.indexOf('/' + sTxtValueLower);
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
                new1 = str.substr(0, getPos);
                e = str.substr(getPos, lastchar.length);
                new2 = '<strong>' + str.substr(getPos + lastchar.length, str.length) + '</strong>';

            }
            e = e ? e : dataAryAt;
            var combined_Text;
            if (lastchar) {
                combined_Text = new1 + e + new2;
            } else {
                combined_Text = e;
            }
            // if (lastchar) var splitedData = dataAryAt.toLowerCase().split(lastchar.toLowerCase());

            // if ($.isArray(splitedData)) {
            //     if (splitedData.length == 1) {
            //         firstPart = dataAryAt;
            //     } else {
            //         firstPart = splitedData[0] + lastchar;
            //         secondPart = '<strong>' + splitedData[1] + '</strong>';
            //     }

            // } else {
            //     firstPart = dataAryAt;
            // }
            var arwDiv = params.suggestOnClick ? '<div class="wrapTable"><div tabindex="-1" class="Sbtn">' + new1 + e + new2 + '</div></div><span class="Sarw"></span>' : '<div tabindex="-1" class="Sbtn" style="width:100%">' + combined_Text + '</div>';
            //var arwDiv = params.suggestOnClick ? '<div class="wrapTable"><div tabindex="-1" class="Sbtn">' + firstPart + secondPart + '</div></div><span class="Sarw"></span>' : '<div tabindex="-1" class="Sbtn" style="width:100%">' + firstPart + secondPart + '</div>';

            Li = '<li class="sugTouple">' + arwDiv + '</li>';
            return Li;
        };

        var dataOrdering = function(data, categoryObj) {
            var newObj = {},
                flg = 0,
                xV = '';
            for (var x in categoryObj) {
                if (params.vertical) {
                    xV = x + "_" + params.vertical;
                }
                if (data[xV] || data[x]) {
                    newObj[x] = data[xV] || data[x];
                    flg++;
                }
            }
            return [newObj, flg];
        };

        var Filter = function(lastchar, dataAry, relConcpt) {
            var _t = this;
            var fLi = '';
            var catgObj, resp;

            if (relConcpt == "resultConcepts") {
                catgObj = params.relatedConceptCategory;
                // } else if (relConcpt == "autoComplete") {
                //     catgObj = params.category;
            } else {
                catgObj = params.category;
            }

            // This is temporary fix : optimize solution is in v7.2.0
            if (!relConcpt && params.showTitleForSingleBucket) {
                resp = dataOrdering(dataAry, {
                    'rs': 'rs'
                });
            } else {
                resp = dataOrdering(dataAry, catgObj);
            }

            var flg = resp[1];
            dataAry = resp[0];
            lastchar = lastchar.replace(/&amp;/gi, '&');
            for (var i in dataAry) {
                var Li = '';
                var maxSuggestionCounter = 0;
                for (var z in dataAry[i]) {

                    if (relConcpt || maxSuggestionCounter++ < params.maxSuggestions) { // show max number of suggestion specified in plugin call
                        var inpVal = _t.inpElm.val().replace(/\s,/g, ',').replace(/,\s/g, ',').toLowerCase();

                        if (inpVal.indexOf(',') == -1 || $.inArray(dataAry[i][z].displayTextEn.toLowerCase(), inpVal.split(',')) == -1) { // exclude the value which already in search box
                            Li += FilterCommon.call(_t, dataAry[i][z], lastchar);
                        } else {
                            continue;
                        }

                    }
                }
                if (Li && flg > 1) {
                    if (params.grouping) {
                        fLi += '<li class="category ' + i + '">' + (params.category[i] ? params.category[i] : i) + '</li>' + Li;
                    } else {
                        fLi += Li;
                    }
                } else if (!relConcpt && params.showTitleForSingleBucket) {
                    fLi += '<li class="category ' + i + '">' + 'Last Searched Keywords' + '</li>' + Li;
                } else {
                    fLi = Li;
                }
            }
            if (!$.isEmptyObject(dataAry)) {
                if (relConcpt == "resultCorrections") {
                    fLi = '<li class="category">' + params.relatedCorrectionText + '</li>' + fLi;
                } else if (relConcpt == "resultConcepts") {
                    fLi = '<li class="category">' + params.relatedConceptText + '</li>' + fLi;
                }
            }
            return fLi;
        };

        var setPlaceHolder = function() {
            var _t = this;
            var elm = _t.inpElm;
            params.placeholderTxt = elm ? elm[0].getAttribute('placeholder') : '';
            elm.val(params.placeholderTxt)
                // .css({
                //     'color': '#8B8B8B'
                // });
        };

        var showPlaceHolder = function() {
            var _t = this;
            var elm = _t.inpElm;
            if (!$.trim(elm.val())) {
                elm.val(params.placeholder)
                    // .css({
                    //     'color': '#8B8B8B'
                    // });
            }
        };

        var hidePlaceHolder = function() {
            var _t = this;
            _t.inpElm.val('').css({
                'color': '#444'
            });
        };

        var setResponse = function(resp) {
            var _t = this;
            showSugt.call(_t, _t.queryChar, resp.resultList, 'autoComplete');
        };

        var categoryList = function(relConcpt) {
            var txt = '';
            var catagory;
            if (relConcpt) {
                catagory = params.relatedConceptCategory;
            } else {
                catagory = params.category;
            }
            for (var x in catagory) {
                txt += x + ',';
            }
            return txt.replace(/,$/g, '');
        };

        var getQparam = function() {
            return !$.isEmptyObject(params.qParams) ? '&' + $.param(params.qParams) : '';
        }

        var encodeURL = function(url, queryText, relConcptFlag) {
            var _t = this;
            var version = '';
            var appId = params.appId ? "&appId=" + params.appId : '';
            var sourceId = params.sourceId ? '&sourceId=' + params.sourceId : '';
            var patr = new RegExp('[^a-zA-Z0-9,\\s' + params.whiteListSpecialChar + ']', 'g');
            _t.Qry = queryText.replace(patr, '');
            if (_t.Qry) {
                if (checkLS() && _t.prefetchObj) {
                    var versionObj = sugCache.getItem(params.storageKey.versionKey);
                    var version = versionObj ? '&version=' + versionObj.suggester_v : "";
                    //if (sugVersoin) version = '&version=' + sugVersoin;
                }
                return url + "query=" + encodeURIComponent(_t.Qry) + appId + '&vertical=' + params.vertical + '&category=' + categoryList.call(_t, relConcptFlag) + '&limit=' + params.maxSuggestions + sourceId + version + getQparam();
            } else {
                return false;
            }
        };

        var showSugt = function(val, data, relConcpt) {
            var _t = this;
            /*
               issue : handle tab case : type "ja" and scroll to any position(e.g. third or fourth) 
               and again type "a"(final keyword : jav), now press tab key, val of last selected index
                fill in input box, which should not be.
                Fix : blank the _t.curElm reference
             */
            _t.curElm = undefined;
            var Li = Filter.call(_t, getlastChar(val), data, relConcpt);
            if (Li) {
                _t.dropCont.find('ul').html(Li);
                show.call(_t);
            } else {
                hide.call(_t);
            }
        };

        var getAutoCompletes = function(val) {
            var _t = this;
            if (params.multiSearch) val = getlastChar(val);
            if (val) {
                var URL = encodeURL.call(_t, params.url.autoComplete, val, false);
                makeAjax.call(_t, URL, function(resp) {
                    setResponse.call(_t, resp);
                });
            }
        };



        var checkDatainLocalStorage = function(queryText, type, category) {
            var isData = 0,
                getData;
            if (queryText && checkLS()) {
                //var startX = (new Date).getMilliseconds()
                getData = getLS.call(this, queryText, type);
                if (getData) {
                    var qv = '';
                    for (var q in category) {
                        if (params.vertical) {
                            qv = q + "_" + params.vertical;
                            if (getData[qv]) {
                                isData = 1;
                                this.cached = true;
                            }
                        } else {
                            if (getData[q]) {
                                isData = 1;
                                this.cached = true;
                            }

                        }

                    }
                }
            }
            return [isData, getData];
        };

        var getlastChar = function(lastchar) { //'Unit Test Done':    this function gets last character after comma
            var txt = $.trim(lastchar).replace(/,*$/g, '').toLowerCase();
            return $.trim(txt.substring(txt.lastIndexOf(',') + 1, txt.length));
        };



        var onSuggest = function() {
            var _t = this;
            return function(e) {
                var _T = $(this);
                var selector;
                var reference;
                var flag;
                if ($(e.target).hasClass('Sarw')) {
                    selector = $(e.target).parents('li');
                    flag = true;
                } else if ($(e.target).hasClass('Sbtn') || $(e.target).is('strong')) {
                    selector = $(e.target).closest('li');
                    flag = params.suggestOnClick ? false : true;
                }
                reference = selector.find('.Sbtn');
                if (!params.relatedConceptCategory || _t.RCMaxCntr >= params.relatedConceptsLimit - 1) { // prevent RC after 'n' number of RC
                    flag = false;
                    hide.call(_t);
                }
                _t.posIndex = getIndex(selector, _t.dropCont);
                if (params.suggestOnClick) hide.call(_t);

                // "50ms Timeout": This timeout is to give first prioriry to document click (click.suggestor) to capture closest node easily.
                // Reason: Whenever a click is fired on document and we want to capture closest element using code : "$(event.target).closest(".suggest")"
                // then we lose that closest element because that targeted element either hide or displaced from it's original position
                // So to overcome this problem we set "50 ms" timeout to easily capture closest selector.
                setTimeout(function() {
                    setValueInTextBox.call(_t, reference, flag);
                }, 50)
            };
        };

        var hide = function() {
            var _t = this;
            var id = _t.id;
            removeHighligting(_t.curElm);
            // _t.dropCont.slideUp(100);
            _t.dropCont.removeClass('slideDown');
            _t.curElm = '';
            $('#' + id).find('.sWrap').removeClass('sOpen').addClass('sHide');
            delete openDrops[id];
            if (params.onHide) params.onHide();

            /*This timeout give assurance that flag only set when suggestor completely closed*/
            setTimeout(function() {
                _t.enableRC_for_onfocus = true;
            }, 500)

        };

        var show = function() {
            var _t = this;
            var id = _t.id;
            if (params.width) {
                _t.wth = params.width;
            } else {
                _t.wth = $(document.getElementById(id)).outerWidth() + 'px';
            }

            _t.dropCont.css({
                'width': _t.wth
            }).addClass('slideDown');

            $('#' + id).find('.sWrap').removeClass('sHide').addClass('sOpen');
            openDrops[id] = _t.dropCont;
            if (params.onShow) params.onShow();
        };

        var liEvnBind = function() {
            var _t = this;
            _t.dropCont.on('mouseover', '.Sbtn,.Sarw,strong', function(e) {

                if ($(this).hasClass('Sbtn')) {
                    $(this).addClass('sAct');
                } else if ($(this).is('strong')) {
                    $(this).parent().addClass('sAct');
                } else {
                    $(this).addClass('sAct');
                }

                removeHighligting(_t.curElm);
                _t.curElm = $(this);
            }).mouseout(function(e) {
                _t.curElm = undefined;
                removeHighligting($(this));
            });
        };

        var bindClick = function(e) {
            var targ = e.target || e.srcElement;
            if ($(targ).hasClass('inpWrap')) {
                $(this).find('.sugInp').focus();
            }
        };

        var convertRawData_toDataObject = function() {
            var dOb = {};
            var dAry = [];
            for (var x in this.rs_kWrds) {
                dAry.push({
                    "displayTextEn": this.rs_kWrds[x]
                })
            }
            //dOb['rs'] = params.showDataOnFocus;
            dOb['rs'] = dAry;
            return dOb;
        }

        var bindFocus = function(e) {
            var _t = this;
            var val = $.trim(_t.inpElm.val());
            _t.curOpenSugg = _t.id;

            if (params.showDataOnFocus) {
                if (!$.trim(_t.inpElm.val())) {
                    params.category = $.extend({}, params.category, {
                        'rs': 'rs'
                    });
                    if (_t.rs_kWrdsStr) {
                        showSugt.call(_t, '', convertRawData_toDataObject.call(_t));
                    } else {
                        prefetchData_personalized.call(_t);
                        if (_t.rs_kWrdsStr) showSugt.call(_t, '', convertRawData_toDataObject.call(_t));
                    }
                }
            }


            if (params.multiSearch && val && val != params.placeholderTxt) {
                //if ($.support.placeholder) {
                _t.inpElm.val((val.replace(/[,\s]*$/, ', ')));
                // } else {
                //     setTimeout(function() {
                //         _t.inpElm.val((val.replace(/[,\s]*$/, ', ')));
                //     }, 10); // to support legacy, might be remove setTimeout of "10 ms" in future version
                // }

                // to show relatedConcepts if comma is present after keyword
                if (params.relatedConceptCategory && _t.enableRC_for_onfocus && _t.RCMaxCntr < params.relatedConceptsLimit - 1) {
                    _t.get_RCdata(txtBeforeLastComma(val));

                }

            } else if (!$.support.placeholder && params.placeholder && params.placeholderTxt == val) {
                hidePlaceHolder.call(_t);
            }
        };

        /**
         * [getKeyCode description :for android chrome keycode fix]
         * @return {[type]} [keycode value]
         */
        var getKeyCode = function() {
            var str = this.val();
            return str.charCodeAt(str.length - 1);
        }

        var keyUpEv = function(inpObj, e) {
            var _t = this;
            var Id = inpObj.attr('id');
            var kCd = e.keyCode || e.which;
            if (kCd == 0 || kCd == 229) { //for android chrome keycode fix
                kCd = getKeyCode.call(inpObj);
            }
            var sugInputElm = _t.inpElm;
            var id = _t.id;
            //var patr = new RegExp('[^a-zA-Z0-9,\\s' + params.whiteListSpecialChar + ']', 'g');
            var val = $.trim(sugInputElm.val());

            _t.queryChar = val;
            if (kCd == 13 && _t.dropCont.css('display') == "block") {
                if (!_t.curElm) {
                    hide.call(_t);
                } else {
                    _t.posIndex = getIndex(_t.curElm, _t.dropCont);
                    var relConcpt_flag;

                    if (!params.relatedConceptCategory || _t.RCMaxCntr >= params.relatedConceptsLimit - 1) {
                        relConcpt_flag = false;
                        _t.RCMaxCntr++;
                    } else if (params.suggestOnClick && _t.curElm.find('.Sbtn').hasClass('sAct')) {
                        relConcpt_flag = false;
                    } else {
                        relConcpt_flag = true;
                    }
                    setValueInTextBox.call(_t, _t.curElm.find('.Sbtn'), relConcpt_flag);
                    if (!relConcpt_flag) hide.call(_t);
                }
            } else if (kCd == 27) {
                hide.call(_t);
            } else if (!val && (kCd == 8 || kCd == 46)) { // on backspace or delete btn
                $('#' + id + ' .sCross').hide();
                hide.call(_t);
            } else if ((kCd >= 48 && kCd < 90) || (kCd >= 97 && kCd <= 122) || kCd == 16 || kCd == 188 || kCd == 8) {
                if (e.ctrlKey && (kCd === 86)) { //to handle on paste case (ctrl+v)
                    val = val.replace(/,$/, '');
                    sugInputElm.val(val);
                }
                if (val) {
                    if (params.source == "server") {
                        if (kCd == 188 && val.lastIndexOf(',') != -1 && params.multiSearch) { // on Comma
                            if (params.relatedConceptCategory) { _t.get_RCdata(txtBeforeLastComma(val)) } else {
                                hide.call(_t);
                            }
                        } else {
                            var queryText = params.multiSearch ? txtAfterLastComma(val) : val;
                            if (queryText.length > (params.startSearchAfter - 1)) {
                                var vData = checkDatainLocalStorage.call(_t, queryText, 'ac', params.category);
                                if (vData[0]) {
                                    _t.dataType = 'autoconcepts';
                                    showSugt.call(_t, val, vData[1], 'autoComplete');
                                } else {
                                    getAutoCompletes.call(_t, val);
                                }
                            }
                        }
                    } else if (S.client[id] == "local") {
                        S.returnDataArray(id, val);
                    }
                }
                $('#' + id).find('.sCross').show().click(function() {
                    _t.inpElm.val('').focus();
                    $(this).hide();
                    hide.call(_t);
                    _t.dropCont.find('ul').html('');
                });
            } else if (e.ctrlKey && kCd == 39 || e.ctrlKey && kCd == 40) {

                _t.curElm.find('.Sbtn').removeClass('sAct');
                _t.curElm.children('.Sarw').addClass('sAct');

            } else if (e.ctrlKey && kCd == 37 || e.ctrlKey && kCd == 38) {

                _t.curElm.children('.Sarw').removeClass('sAct');
                _t.curElm.find('.Sbtn').addClass('sAct');

            } else if (_t.dropCont.find('li').length) {
                if (_t.dropCont.css('display') == "none" && kCd == 40) {
                    show.call(_t);
                } else {
                    if (kCd == 38) {
                        if (_t.curElm) {
                            _t.curElm = currActElm.call(_t, _t.curElm, 'prev');
                        } else {
                            _t.curElm = gotoFirstLast.call(_t, id + ' li:last-child', _t.curElm);
                        }
                        show.call(_t);
                    } else if (kCd == 40) {
                        if (_t.curElm) {
                            _t.curElm = currActElm.call(_t, _t.curElm, 'next');
                        } else {
                            _t.curElm = gotoFirstLast.call(_t, id + ' li:first-child', _t.curElm);
                        }
                    }
                }
            }
        };

        var keyDnEv = function(e) {
            var _t = this;
            var kCd = e.which || e.keyCode;
            if (kCd == 38) {
                e.preventDefault();
            } else if (kCd == 13) {
                //Enter is prevent Default when an item in suggestor is under selection
                if (_t.dropCont.css('display') == "block" && _t.curElm) {
                    e.preventDefault();
                }
            } else if (kCd == 9) {
                if (_t.curElm) {
                    var setVal = _t.curElm.html().replace(/(<([^>]+)>)/ig, "").replace(/&amp;/gi, '&');
                    _t.inpElm.val(addComma.call(_t, setVal));
                }
                removeComma.call(_t);
                hide.call(_t);
            }
        };

        var assignment = function(node) {
            var _t = this,
                tParam;
            trackingURL = params.url.trackingURL; // set tracking URL to a global variable, to access it in "unload" event;
            _t.id = params.id;
            _t.enableRC_for_onfocus = true; // This flag is for "to enable RC on focus, if any keyword exist in search box".
            _t.RCMaxCntr = 0;
            _t.inpElm = node.find('.sugInp');
            params.placeholderTxt = _t.inpElm.attr('placeholder');

            trackingObject[_t.id] = {}; // for central tracking 
            trackingObject[_t.id]['Events'] = []; // for central tracking 

            // If tracking enabled then set some parameters on suggetor input node for future reference
            if (params.trackUserInteraction) {
                tParam = {
                    'trackParams': JSON.stringify({
                        "id": _t.id ? _t.id : "",
                        "sourceId": params.sourceId ? params.sourceId : "",
                        "platform": params.platform ? params.platform : "",
                        "appId": params.appId ? params.appId : "",
                        "trackingSrc": params.trackingSrc ? params.trackingSrc : ''
                    })
                }
            }

            _t.inpElm.attr($.extend({
                "autocomplete": "off"
            }, tParam));

            params.maxlength = _t.inpElm.attr('maxlength') || 10000;

            _t.dropCont = $('<div class="sugCont ' + params.scrollStyle + '" id="sugDrp_' + _t.id + '">').append('<ul class="Sdrop"></ul>');
            node.append(_t.dropCont);

            if (params.placeholder && !$.support.placeholder && !$.trim(_t.inpElm.val())) {
                setPlaceHolder.call(this);
            }

            //Bind focus handler on suggestor input node
            _t.inpElm.focus(function() {
                bindFocus.call(_t);

            }).keyup(function(e) {
                keyUpEv.call(_t, $(this), e);
            }).keydown(function(e) {
                if (!_t.curOpenSugg) { // to handle bug for: if suggestor not initialized and user already foucs on suggestor
                    _t.curOpenSugg = _t.id;
                }
                keyDnEv.call(_t, e);
            })

            //Bind click handler on suggestor input node
            node.find('.sWrap').click(bindClick);

            //Bind event on list nodes
            liEvnBind.call(_t);

            //Bind click handler on suggestor drop listing nodes
            _t.dropCont.on('click', '.sugTouple', onSuggest.call(_t));

            //Get version and prefetch data
            callPrefetchData.call(_t);

            //This code of block is for to send tracking object to server
            if (params.trackUserInteraction && checkLS() && trackingURL) {
                var trackingData = sugCache.getItem('sug_Tracking');
                if (trackingData) {
                    makeAjax.call(_t, trackingURL + '?lgData=' + JSON.stringify(trackingData), function() {
                        sugCache.removeItem('sug_Tracking')
                    });
                }
            }
        };



        //Constructor
        var initialization = function(node) {
            this.node = node;
            assignment.call(this, node);
            this.setTrackingObject = setTrackingObject;
        };
        initialization.prototype = (function() {
            var getValue = function(argument) {
                return this.inpElm.val();
            };
            var get_RCdata = function(val) {
                var _t = this;
                var z = getlastChar(val);
                var vData = checkDatainLocalStorage.call(_t, z, 'rc', params.relatedConceptCategory);
                if (vData[0]) {
                    hide.call(_t);
                    _t.dataType = 'relatedConcept';
                    showSugt.call(_t, z, vData[1], 'resultConcepts');
                    _t.RCMaxCntr++;
                } else {
                    var URL = encodeURL.call(_t, params.url.relatedConcept, z, true);
                    makeAjax.call(_t, URL, function(resp) {
                        hide.call(_t);
                        for (var x in resp) {};
                        showSugt.call(_t, z, resp[x], x);
                    });
                }
            };

            return {
                getValue: getValue,
                get_RCdata: get_RCdata,
                sendTrackingData:sendTrackingData
            }
        })();
        // initialization.prototype .getValue = function(argument){
        //     return this.inpElm.val();
        // };

        //initialization.prototype = proto_Object;

        var obj = this.data('suggestor');

        if (!obj) {
            this.each(function(index, node) {
                var _node = $(node);
                obj = new initialization(_node);
                _node.data('suggestor', obj);
                /**
                 * For unit test cases
                 * This section is only for development environment and should be removed from production
                 * either from manual or through grunt
                 */
                /*                if (DEBUG) {
                                    obj.testObject = {
                                        txtAfterLastComma: txtAfterLastComma,
                                        decodeTxt: decodeTxt,
                                        checkLS: checkLS,
                                        makeAjax: makeAjax,
                                        setTrackingObject: setTrackingObject
                                    }
                                }*/
                /*End of unit test cases*/
            });
        }
        return obj;
    };
})(window.jQuery || window.Zepto);

// formating, parameter rename, and optimize code

// v6.3.0: add sourceId in tracking object

/* v6.4.0: for whitelistingSpecialCharacter paramater : whitelisting only from query URL 
 *         add missing getRelatedConcepts parameter
 */

/**
 * v6.5.0:
 * Enhancement: Enhance versioning control system: if multiple suggestor call trigger from the same page then
                versioning check goes only for first call.
 * Bug Fix: if user type only special character
             in suggestor and that's special character not specify in "whiteListSpecialChar" param,
             then a blanck query goes to server
 */

/*
 * v6.5.1: 
 * Bug fix : handle showrelated concept on/off by pressing comma also
 *         : Also handle tab case 
 */

/**
 * v7.0.0 : Enhancements --> 
 * a) Add support of RC(related concept) data in prefetch library, previous version only support AC("auto complete")
 *    data in prefech library.
 * b) Add support of bucketing/grouping in Related concept data.
 * c) Now prefetch data library will be update/replace based on TTL(Time to live) from local storage
 */


/**
 * v7.0.1 :  showrelatedconcept param fix,
 * fix : after comma startSearchAfter support
 */


/**v7.1.0 : enhancement
 * add parameter returnFocus : this is for to disable focus on input field after selection.
 * add width 100% support 
 */


/**
 * v7.1.1 :  Temporary fix for recent Searches label:
 * Optimie solution is in v7.2.0 
 */



/**
 * v7.2.0 : add Central Tracking feature
 * v7.2.0 : To show relatedConcepts if comma is present after keyword
 */



/**
 *  v7.3.0 : add onShow/onHide function,
 *           fix issue in "show relatedConcepts if comma is present after keyword"
 *
 */


// 7.4.0 : update opening and closing issue on mobile


/**
 * v7.6.0 :  Enhance central tracking systeam , also add feature to track data even user not selected from suggestor suggestions. 
 *
 */

/**
 * v7.6.2 :  Enhanced central tracking systeam , added check if sugInp field is blank*
 */


/**
 * v7.6.3 :  fix prefechObj variable issue
             optimze code
             add Domain parameter

 */

/*
    v7.6.4 : Made Suggestor backward compatible 
         Replaced JSON with JSON.stringify for IE7 fix
*/

/*
    v7.6.5 : premium category support on suggestor
*/