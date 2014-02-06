$(document).ready(function () {
    $('.js-job-list__name').click(function () {
        $current_row = $(this).parents('li.b-job-list__vacancy').find('.js-job-list__toggle-view').is(':visible');
        $('.js-job-list__toggle-view').hide();
        $('.b-job-list__preview').show();

        if (!$current_row) {
            $(this).parents('li.b-job-list__vacancy').find('.js-job-list__toggle-view').show();
            $(this).next('.b-job-list__preview').hide();
        }

        return false;
    });
});
function iefunc() {
    function d() {
        var frame = $('#if1')[0];
        try {
            doc = frame.contentWindow ? frame.contentWindow.document : frame.contentDocument ? frame.contentDocument : frame.document;
            var docRoot = doc.body ? doc.body : doc.documentElement;
            var ta = doc.getElementsByTagName('textarea')[0];
            if (ta) {
                data = JSON.parse(ta.value);
                if (data.status == 'sended')
                    $.popup.show({ title: 'Ваше резюме доставлено работодателю', content: data.fields, width: 800 });
                else
                    $('#sendResumeFormFields').html(data.fields);
            }
        }
        catch (e) {
            console.log(e);
        }

    }

    setTimeout(d, 100);

}
function sendResume(vacancy_id) {
    var options = {
        url: "/rabota/vacancy/" + vacancy_id + '/sendResume/',
        data: { },

        success: function (data) {
            $.popup.show({ title: 'Отправить резюме', content: data, width: 800 });

            $('#sendResumeForm').ajaxForm({
                data: { ajax: 1, referer: '{{ referer }}' },
                dataType: 'json',
                iframeTarget: '#if1',
                beforeSubmit: function (a, f, o) {
                },
                success: function (data) {
                    if (data.status == 'sended')
                        $.popup.show({ title: 'Ваше резюме доставлено работодателю', content: data.fields, width: 800 });
                    else
                        $('#sendResumeFormFields').html(data.fields);
                }
            });
        },
        type: 'post'
    };

    $.ajax(options);
}