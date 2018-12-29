"use strict";

document.addEventListener('DOMContentLoaded', function () {

    var input = document.getElementById("sum-name-inp");
    input.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("search-btn").click();
        }
    });
});