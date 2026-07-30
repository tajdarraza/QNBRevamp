function serviceCall(response, successCallback, delay) {

    kony.print("Inside serviceCall");

    delay = delay || 5;

    var timerId = "mockService_" + new Date().getTime();

    kony.timer.schedule(timerId, function () {

        kony.print("Timer executed");

        kony.timer.cancel(timerId);

        successCallback(response);

    }, delay, false);
}