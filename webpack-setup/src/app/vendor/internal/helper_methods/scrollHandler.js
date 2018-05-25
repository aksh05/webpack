export var scrollHandler = function(container, scrollContainer, firstElement, curActiveTouple) {
    if (curActiveTouple.length) {
        var scrollTopPos;

        var scrollCont_maxHeight = scrollContainer.height();
        var scrollCont_scrollTop = scrollContainer.scrollTop();
        var visible_bottom = scrollCont_maxHeight + scrollCont_scrollTop;
        var high_top = (curActiveTouple.position().top + scrollContainer.scrollTop());
        var high_bottom = high_top + curActiveTouple.outerHeight();

        if (high_bottom >= visible_bottom) {
            scrollTopPos = (high_bottom - scrollCont_maxHeight) > 0 ? high_bottom - scrollCont_maxHeight : 0;
            scrollContainer.scrollTop(scrollTopPos);
        } else if (high_top < scrollContainer.scrollTop()) {
            scrollTopPos = high_top;
            scrollContainer.scrollTop(scrollTopPos);
        }
        return scrollTopPos;
    }
}