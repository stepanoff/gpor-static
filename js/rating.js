var path = "/rateditems/ratedItemsAjax/changeRating/";

function rateDown (a, b) {
    $.post (path, {ratedItemId : a, ratedItemType : b, rateDown : 1}, function(ready) {
        if (!ready) {
            alert('Ошибка при изменении рейтинга');
            return;
        }
        if (ready.ifError) {
            alert(ready.message);
            return;
        }

        var $ratingBlock = $("div.jsOnCommentBlock-" + b + "-" + a);
        var $ratingValue = $ratingBlock.find("span.js_rating_value");
        var strRatingValue = ready.rating;

        $ratingBlock.find(".rating_control").css("visibility", "hidden");

        if (strRatingValue > 0) {
            strRatingValue = "+" + strRatingValue;
            $ratingValue.removeClass("js_rating_value-negative");
        } else if (strRatingValue == 0) {
            $ratingValue.removeClass("js_rating_value-negative");
        }
        else {
            $ratingValue.addClass("js_rating_value-negative");
        }

        $ratingValue.html(strRatingValue);

    }, 'json');
}

function rateUp (a, b) {
    $.post (path, {ratedItemId : a, ratedItemType : b, rateUp   : 1}, function(ready){
        if (!ready) {
            alert('Ошибка при изменении рейтинга');
            return;
        }
        if (ready.ifError) {
            alert(ready.message);
            return;
        }

        var $ratingBlock = $("div.jsOnCommentBlock-" + b + "-" + a);
        var $ratingValue = $ratingBlock.find("span.js_rating_value");
        var strRatingValue = ready.rating;

        $ratingBlock.find(".rating_control").css("visibility", "hidden");

        if (strRatingValue > 0) {
            strRatingValue = "+" + strRatingValue;
            $ratingValue.removeClass("js_rating_value-negative");
        } else if (strRatingValue == 0) {
            $ratingValue.removeClass("js_rating_value-negative");
        } else {
            $ratingValue.addClass("js_rating_value-negative");
        }
        $ratingValue.html(strRatingValue);
    }, 'json');
}