errorResource = (function() {
    var $errorCont, $errorMsg;

    $(function() {
        $errorCont = $('#errorCont');
        $errorMsg = $('#errorMsg');
    });

    return {
        show: function(msg) {
        	//$errorMsg.text("There was an unexpected system error");
        	$errorMsg.text(msg);
        	$errorCont.show(); 
            setTimeout(function() { 
            	$errorCont.hide(); 
            }, 5000);            
        }
    }
}());

