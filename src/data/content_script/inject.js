const injectScript = function() {
	const ytVideoIdFromUrl = function (url) {
		const p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
		return (url.match(p)) ? RegExp.$1 : false;
	};

	const getCurrentVideoId = function () {
		return ytVideoIdFromUrl(window.location.href);
	};

	const videoEmbedFromId = function(videoId) {
		return '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/'+videoId+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
	};

	const innerHtmlToDom = function (html) {
		return new DOMParser().parseFromString(html, 'text/html').getElementsByTagName('body');
	};

	const injectEmbed = function() {
		const currentVideoId = getCurrentVideoId();
		if (currentVideoId) {
			setTimeout(function(){
				const errorScreenNode = document.getElementById('error-screen');
				if (errorScreenNode) {
					errorScreenNode.innerHTML = '';
					for (const embedNode of innerHtmlToDom(videoEmbedFromId(getCurrentVideoId()))) {
						for (const embedNodeChildren of embedNode.children) {
							errorScreenNode.appendChild(embedNodeChildren)
						}
					}
				}

			}, 2000);
		}
	};

	injectEmbed();

	let lastUrl = document.location.href;
	window.onload = function() {
		let bodyList = document.querySelector("body");

		const observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (lastUrl !== document.location.href) {
					lastUrl = document.location.href;
					injectEmbed();
				}
			});
		});

		const config = {
			childList: true,
			subtree: true
		};

		observer.observe(bodyList, config);
	};

};


injectScript();
