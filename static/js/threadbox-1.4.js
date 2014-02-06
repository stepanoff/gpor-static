/**
 * Javascript thread isolation box
 *
 * DOM-independent implementation of FThread {@link http://habrahabr.ru/blogs/javascript/86852/}
 *
 * Usage: threadBox([context,] function);
 *
 * @author Vasiliy Aksyonov <outring@gmail.com>
 * @version 1.4
 */

threadBox = (function () {

    var thread;

    try { thread = new ActiveXObject("Msxml2.XMLHTTP"); }

    catch (e) {

        try { thread = new ActiveXObject("Microsoft.XMLHTTP"); }

        catch (e) { thread = false; }
    }

    if (!thread && typeof XMLHttpRequest != 'undefined') {

        thread = new XMLHttpRequest();
    }

    if(thread && !Array.toSource) {

        return function () {

            var context = arguments.length >= 2 ? arguments[0] : window;
            var process = arguments.length >= 2 ? arguments[1] : arguments[0];

            thread.open('GET', '#', false);

            thread.onreadystatechange = function () {

                thread.onreadystatechange = function () { };

                process.call(context);
            };

            thread.send(null);
        }
    }

    else {

        return function () {

            var context = arguments.length >= 2 ? arguments[0] : null;
            var process = arguments.length >= 2 ? arguments[1] : arguments[0];

            try { process.call(context); }

            catch(e) { setTimeout(function() { throw e; }, 0); }
        }
    }

})();
