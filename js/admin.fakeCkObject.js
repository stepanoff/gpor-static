var fakeCkObject =
{
	images:	{},

	getImageById: function(collectionId)
	{
		if (fakeCkObject.images[collectionId]) return fakeCkObject.images[collectionId];
		else return null;
	},

	getPhotoreportageImage: function()
	{
		return $(document).data('portal.resources') + '/img/ckeditor/placeholder_photoreportage.png';
	},

	getPollImage: function()
	{
		return $(document).data('portal.resources') + '/img/ckeditor/placeholder_poll.png';
	},

	getPositiveImage: function()
	{
		return $(document).data('portal.resources') + '/img/ckeditor/positive.jpg';
	},

	getNegativeImage: function()
	{
		return $(document).data('portal.resources') + '/img/ckeditor/negative.jpg';
	},

	setImageById: function(collectionId, src, type)
	{
		if (!type && !src) {
			fakeCkObject.images[collectionId] = $(document).data('portal.resources') + '/img/ckeditor/placeholder_not_available.png';
		}
		else if (!type) {
			fakeCkObject.images[collectionId] = src;
		}
		else if (type == 'AudioFile') {
			fakeCkObject.images[collectionId] = $(document).data('portal.resources') + '/img/ckeditor/placeholder_audio.png';
		}
		else if (type == 'VideoFile') {
			fakeCkObject.images[collectionId] = $(document).data('portal.resources') + '/img/ckeditor/placeholder_video.png';
		}
	},

	insertImage: function(editorId, collectionId, imageSrc)
	{
		return fakeCkObject._insert('image', editorId, collectionId, imageSrc);
	},

	insertVideo: function(editorId, collectionId)
	{
		return fakeCkObject._insert('video', editorId, collectionId);
	},

	insertAudio: function(editorId, collectionId)
	{
		return fakeCkObject._insert('audio', editorId, collectionId);
	},

	insertPhotoreportage: function(editorId)
	{
		if (CKEDITOR && CKEDITOR.instances[editorId]) {
			try {
				CKEDITOR.instances[editorId].insertHtml('<fake_photoreportage />');
				return true;
			}
			catch(err) {
				return false;
			}
		}
	},
	insertPoll: function(editorId)
	{
		if (CKEDITOR && CKEDITOR.instances[editorId]) {
			try {
				CKEDITOR.instances[editorId].insertHtml('<fake_poll />');
				return true;
			}
			catch(err) {
				return false;
			}
		}
	},

	_insert: function(type, editorId, collectionId, imageSrc)
	{
		if (CKEDITOR && CKEDITOR.instances[editorId]) {
			try {
				var el =  CKEDITOR.instances[editorId].getSelection().getSelectedElement()
				var foAttr = "";

				if(el) {
					var parent = el.getParent();
					var parentClass = " " + parent.getAttribute("class");
					var re = new RegExp("\\sfo-([a-z0-9_]+)-([a-z0-9_]+)", "i");
					var matches;

					while(matches = parentClass.match(re)) {
						parentClass = parentClass.replace(matches[0], "");
						foAttr += " " + matches[1] + "=\"" + matches[2] + "\"";
					}
				}
                if(type=='Audio')
                {
                    CKEDITOR.instances[editorId].insertHtml('<fake_audio object_id="' + collectionId + '"' + foAttr + ' />');
                }
                else
                {
				    CKEDITOR.instances[editorId].insertHtml('<fake_object object_id="' + collectionId + '"' + foAttr + ' />');
                }
				return true;
			}
			catch(err) {
				return false;
			}
		}
		else {
			return false;
		}
	}
}