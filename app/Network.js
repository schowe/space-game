var HIGHSCORE_SERVER_BASE_URL = "http://localhost:8000";

var Network = function() {

    return {
        getTop10: function() {
            $.get(HIGHSCORE_SERVER_BASE_URL + "/api/1/highscore", function (data) {
                // TODO
            });
        },
        postNewScore: function(score) {
            $.ajax({
                type: "POST",
                url: HIGHSCORE_SERVER_BASE_URL + "/api/1/highscore",
                contentType: "application/json; charset=utf-8",
                data: score,
                dataType: "json",
                success: function(data) {
                    // TODO
                },
                failure: function(error) {
                    // TODO
                }
            });
        }

    };

};