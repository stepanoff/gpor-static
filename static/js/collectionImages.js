var collectionImages = {
    collectionId: '',
    newCollectionInputId: '',
    init: function(collectionId, newCollectionInputId) {
        collectionImages.newCollectionInputId = newCollectionInputId;
        if(collectionId==0){
            collectionImages.getCollectionId();
       } else {
            collectionImages.collectionId = collectionId;
       }
    },
    ajaxUploadAction: function() {
        return '/admin/collection/upload/' + collectionImages.collectionId + '/';
    },
    getImages: function(animate) {
        var animate = animate || false;
        jQuery.ajax({
            url: '/admin/collection/images/' + collectionImages.collectionId + '/',
               dataType: 'json',
            success: function(data) {
                var content = '';
                content+= '<ul>';
                for (image in data) {
                    content+= '<li id="collection-show-imageId-' + data[image]['id'] + '" style="width:100%">'
                    content+= '<table>'
                    content+= '<td class="collection-show-img"><img src="' + data[image]['src'] + '" alt="" /></td>'
                    content+= '<td class="collection-show-date"><div>' + data[image]['date'] + '</div></td>'
                    content+= '<td class="collection-show-delete"><div><div class="buttons_remove_small" id="collection-image-' + data[image]['id'] + '"></div></div></td>'
                    content+= '</table>'
                    content+= '</li>'
                }
                content+= '</ul>';

                $('#collection-show').html(content);

                window.setTimeout(function(){
                    collectionImages.removeListener();
                    $('#collection-show > ul').sortable(
                        {
                            axis: 'y',
                            update: function() {
                                collectionImages.updatePositions();
                            }
                        }
                    );
                }, 0);

                if (animate) {
                    window.setTimeout(function() {
                        $('#collection-show').scrollTop(99999999); // o_O, $('#collection-show-{{ collectionId }}').outerHeight()
                        $('#collection-show > ul > li:last').css('backgroundColor', '#fffe9d');
                        window.setTimeout(function() {
                            $('#collection-show > ul > li:last').css('backgroundColor', 'white');
                        }, 3000);
                    }, 10);
                }
            }
        });
    },

    updatePositions: function() {
        var items = $('#collection-show > ul > li');
        var images = '';
        items.each(function(){
            var imageId = this.id.substr(this.id.lastIndexOf('-') + 1);
            images+= ',' + imageId;
        });
        jQuery.ajax({
            url: '/admin/collection/setimagesordernum/' + collectionImages.collectionId + '/',
            data: {"images": images},
            type: 'POST',
            success: function(data) {

            }
        });
    },

    /**
     * Add listener to remove button
     */
    removeListener: function() {
        $('.buttons_remove_small').bind('click', function() {
            var imageId = this.id.substr(this.id.lastIndexOf('-') + 1);
            collectionImages.removeImage(imageId);
        });
    },

    removeImage: function(imageId) {
        jQuery.ajax({
            url: '/admin/collection/deleteimage/' + imageId + '/',
            success: function(data) {
                collectionImages.getImages();
            }
        });
    },

    getCollectionId: function(){
        jQuery.ajax({
            url: '/admin/collection/createCollection/',
            dataType:'json',
            async:false,
            success: function(data) {
                collectionImages.collectionId = data.collectionId;
                $('#' + collectionImages.newCollectionInputId).val(collectionImages.collectionId);
                $('#' + collectionImages.newCollectionInputId).change();
            }
        });
    },

    ajaxUpload: function() {
        $('#collection-upload-parent').html('<span id="collection-upload" class="collection-upload"><input name="userfile" type="file" multiple="multiple" id="collection-button" /></span>');

        window.setTimeout(function(){
            $("#collection-button").html5_upload({
                url: collectionImages.ajaxUploadAction(),
                onFinishOne: function(event, response, name, number, total) {
                    try {
                        response = eval( '(' + response + ')' );
                        collectionImages.uploadComplete(response);
                    }
                    catch (err) {
                        alert('Не верный формат ответа сервера');
                    }
                }
            });
        }, 0);
    },

    uploadComplete: function(response) {
        if (response['error']) {
            alert(response['error']);
        }
        if (response['success']) {
            collectionImages.getImages(true);
        }
    }
};
