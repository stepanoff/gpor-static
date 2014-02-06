var curRequestFormVals = new Array();
var curSubscribeFormVals = new Array();
$(document).ready(function (e) {
    $("tr.body_group a").each(function () {
        var that = this;
        $(this).popup({
            title: $(that).html(),
            content: "<img src='" + $(that).attr("href") + "' />"
        });
    });
    
    inputs = $("#advertRequestForm input[type='text']");

    inputs.each(function () {
    	id = $(this).attr("id");
    	curRequestFormVals[id] = $(this).attr("value");
    });
    initRequestForm();

    inputs = $("#advertQuivkSubscribeForm input[type='text']");

    inputs.each(function () {
    	id = $(this).attr("id");
    	curSubscribeFormVals[id] = $(this).attr("value");
    });
    initQuickSubscribeForm();

});

function initRequestForm ()
{
    inputs = $("#advertRequestForm input[type='text']");

    inputs.bind("click", function (e) {
    	id = $(this).attr("id");
        if($(this).attr("value") == curRequestFormVals[id]) {
           $(this).attr("value", ""); 
        }
    });
    
    inputs.bind("blur", function (e) {
    	id = $(this).attr("id");
        if($(this).attr("value") == "") {
           $(this).attr("value", curRequestFormVals[id]);
        }
    });
}

function initQuickSubscribeForm ()
{
    inputs = $("#advertQuivkSubscribeForm input[type='text']");

    inputs.bind("click", function (e) {
    	id = $(this).attr("id");
        if($(this).attr("value") == curSubscribeFormVals[id]) {
           $(this).attr("value", ""); 
        }
    });
    
    inputs.bind("blur", function (e) {
    	id = $(this).attr("id");
        if($(this).attr("value") == "") {
           $(this).attr("value", curSubscribeFormVals[id]);
        }
    });
}