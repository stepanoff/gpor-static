/**
 * Created by hamway on 10.12.13.
 */
var serverPartnerJs = {

    /**
     * Адрес фрейма клиента, формируется автоматически
     * @private
     */
    _iFrameDomain: null,

    /**
     * Идентификатор клиентского фрейма
     * @private
     * @type {string}
     */
    _clientId: '#clientPartnerIframe',

    /**
     * Флаг инициализации
     * @private
     * @type {boolean}
     */
    _isInit: false,

    /**
     * Режим дебага
     * @private
     * @type {boolean}
     */
    _isDebug: false,

    /**
     * Объект сообщений
     */
    MESSAGE: {
        FINDIFRAME: 'Найден клиентский iframe, инициализирую api',
        WRONGORIGIN: 'Запрос с не зарегистрированнаого домена',
        ISEVENT: 'Произошло событие',
        ISEVENTDATA: 'Пришли данные',
        PARSEFAILED: 'Ошибка при разборе сообщения',
        FAILEDOREMPTY: 'Ошибка в сообщении или сообщение пустое',
        UNDEFINEDCOMMAND: 'Неизвестная комманда'
    },

    /**
     * Инициализация
     * @constructor
     */
    init: function (debug) {
        if (!debug) debug = this._isDebug;

        if (debug == true) {
            this._isDebug = true;
        }

        var client = $(this._clientId);

        if (client) {
            this._iFrameDomain = this._getIFrameDomain(client);
            this._debug(this.MESSAGE.FINDIFRAME);
            this._isInit = true;
        }
        this._receiveMessage();
    },

    /**
     * Получение адреса клиентского фрейма
     * @param iframe Объект фрейма
     * @returns {string}
     * @private
     */
    _getIFrameDomain: function (iframe) {
        var src = iframe.attr('src'),
            expression = /^(http[s]?:\/\/.*)\/.*$/,
            match = src.match(expression);

        return (match[1]) ? match[1] : false;
    },

    /**
     * Отправляет на клиент комманду о смене страници и возвращет состояние необходимости смены
     * @returns {boolean}
     * @private
     */
    _changeClientPage: function () {
        var hash = document.location.hash.substr(1);

        if (hash) {
            this._sendData({command: 'changePath', data: hash});
            return true;
        }

        return false;
    },

    /**
     * Отправка комманды на получение данных страницу от клиента
     * @private
     */
    _getClientInfo: function() {
        this._sendData({command:'getInfo'});
    },

    /**
     * Регистрируем прослушивание событий типа 'message' в формате json
     * @private
     */
    _receiveMessage: function () {

        var self = this;

        window.addEventListener('message', function (event) {
            if (self._iFrameDomain == event.origin) {
                self._debug(self.MESSAGE.ISEVENT, event);
                self._debug(self.MESSAGE.ISEVENTDATA, event.data);
                try {
                    var data = JSON.parse(event.data);
                    self._parseData(data);
                } catch (e) {
                    self._debug(self.MESSAGE.PARSEFAILED);
                    self._debug(e.stack);
                }
            } else {
                self._debug(self.MESSAGE.WRONGORIGIN)
            }
        });
    },

    /**
     * Обработка комманд
     * @param data
     * @private
     */
    _parseData: function (data) {
        if (data) {
            this._debug(data);
            switch (data.command) {
                case 'clientIsReady':
                    if (this._changeClientPage())
                        break;
                case 'pageChange':
                    this._getClientInfo();
                    break;
                case 'clientInfo':
                    //var title = data.data.title,
                    var url = data.data.url,
                        height = data.data.height;

                    //if (title) this._setTitle(title);
                    if (url) this._setUrl(url);
                    if (height) this._setClientHeight(height);

                    break;
                default:
                    this._debug(this.MESSAGE.UNDEFINEDCOMMAND);
                    break;
            }

        } else {
            this._debug(this.MESSAGE.FAILEDOREMPTY)
        }
    },

    /**
     * Отправка сообщения на сервер
     * @param json
     * @private
     */
    _sendData: function (json) {
        if (this._isInit) {
            $(this._clientId).get(0).contentWindow.postMessage(JSON.stringify(json), this._iFrameDomain);
        }
    },

    /**
     * Устанавливаем заголовок
     * @param title
     * @private
     */
    _setTitle: function(title) {
        document.title = title;
    },

    /**
     * Устанавливаем адрес страницы
     * @param url
     * @private
     */
    _setUrl: function(url) {
        if (url != '')
            document.location.hash = url;
    },

    /**
     * Выставляем высоту клиентского фрейма
     * @param height
     * @private
     */
    _setClientHeight: function(height) {
        $(this._clientId).height(height);
    },

    /**
     * Функция выводит в консоль список переданных ей параметров, при условии что включен режим дебага _isDebug
     * и существует консоль
     * @private
     */
    _debug: function () {
        if (console && this._isDebug) {
            if (arguments.length > 0) {
                for (var i in arguments) {
                    console.log(arguments[i]);
                }
            }
        }
    },

    /**
     * Метод для теста
     * @param page
     */
    sendData: function (page) {

        if (page)
            this._sendData({command: 'changePath', data: 'test.js'});
        else
            this._sendData({command: 'changePath', data: 'client.php'});
    }
};
