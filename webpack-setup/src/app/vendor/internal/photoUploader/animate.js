if(!window.editPhotoModule){
    editPhotoModule = {};
}


editPhotoModule.animate = (function() {
    var isTransitionEndSupported = (function() {

        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        }
        for (var name in transEndEventNames) {
            if (document.documentElement.style[name] !== undefined) {
                return (transEndEventNames[name]);
            }
        }
    }());

    var isAnimationEndSupported = (function() {

        var animationEndEventNames = {
            WebkitAnimation: 'webkitAnimationEnd',
            animation: 'animationEnd'
        }
        for (var name in animationEndEventNames) {
            if (document.documentElement.style[name] !== undefined) {
                return (animationEndEventNames[name]);
            }
        }
    }());

    function leave() {
        this.state = isAnimationEndSupported ? 'leave' : 'leave-active';
        this.model.removeClass('enter enter-active').addClass(this.state)

        // this.model.removeClass(this.state + "-active");
        // if(isAnimationEndSupported){
        //     this.state = "leave";    
        // }else{
        //     this.state = "leave-active";    
        // }
        
        // this.model.addClass(this.state);
    }

    function enter() {
        this.state = isAnimationEndSupported ? 'enter' : 'enter-active';
        this.model.removeClass('leave leave-active').addClass(this.state)
        // this.model.removeClass(this.state + "-active");
        // if(isAnimationEndSupported){
        //     this.state = "enter";    
        // }else{
        //     this.state = "enter-active";    
        // }
        
        // this.model.addClass(this.state);
    }

    function constructor(model) {
        var _this = this;
        model.find('.cropContainer').on(isAnimationEndSupported, function() {
            model.removeClass(_this.state);
            model.addClass(_this.state + '-active');
        });
        this.model = model;
    }
    constructor.prototype = {
        leave: leave,
        enter: enter
    }

    var init = function(model) {        
        return new constructor(model);
    }

    return {
        init:init
    }

}());
