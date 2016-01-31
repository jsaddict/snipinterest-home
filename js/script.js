var config = {
	url : 'http://snipinterest.com',
	title : 'SnipInterest - watch interested parts of video',
	text : 'Watch interested parts of video and decide whether to watch a video or not',
	// image : '../img/share.jpg',
	image : 'http://snipinterest.com/img/share.jpg',
	videoId : ['id1', 'id2', 'id3', 'id4'],
	videoInterval : {
		'id1' : [2, 3],
		'id2' : [3, 4],
		'id3' : [4, 5],
		'id4' : [5, 6]
	}, 
	resizeDelay : 200
}
var home = (function(){
	var url = encodeURIComponent(config.url),
	title = encodeURIComponent(config.title),
	text = encodeURIComponent(config.text),
	image = encodeURIComponent(config.image);

	var resizeDelay = config.resizeDelay;
	var scrollDelay = config.scrollDelay;
	var scrollHeight = config.scrollHeight;

	var resizeTimeout = null;
	var scrollTimeout = null;
	var bw = $('#body-wrapper');
	var isMobileBrowser = false;

	var ytPlayer = null;
	var currentSnip = 0;
	var totalSnips = config.videoId.length;
	function init(){	
		isMobileBrowser = isMobile();
		attachEvents();
		positionSocialButtons();
	}
	function isMobile() {
	    try {
	        document.createEvent("TouchEvent");
	        return true;
	    } catch (e) {
	        return false;
	    }
	}
	function positionSocialButtons(){
		if($('#social-share-buttons').css('position') == 'fixed'){
			// console.log('fixed social button');
			var top = 0;
			var ht = parseInt($(window).height()/2, 10);
			var socialHt = parseInt($('#social-share-buttons').height()/2, 10);
			if(ht - socialHt < 0){
				top = 0;
			}else{
				top = ht - socialHt;
			}
			$('#social-share-buttons').css('top', top);
		}
	}
	function addToChrome(){

	}
	// function setPopupPosition(id){
	// 	id = '#'+id;
	// 	var ww = parseInt($(window).width(), 10);
	// 	var wh = parseInt($(window).height()/2, 10);
	// 	var top = 50;
	// 	var ht = 50;
	// 	if(ww > 480){
	// 		$(id).width(450);
	// 	}else{
	// 		// $(id).width(300);
	// 		$(id).width(ww - 20);
	// 	}
	// 	ht = parseInt($(id).height()/2, 10);
	// 	top = parseInt((wh - ht), 10);

	// 	top = 75;
	// 	$(id).css('top', top);
	// }
	function setPopupPosition(id){
		var maxPopupHeight = 300;
		id = '#'+id;
		var ww = parseInt($(window).width(), 10);
		var wh = parseInt($(window).height(), 10);
		var top = 50;
		var ht = 50;
		if(ww > 480){
			$(id).width(450);
		}else{
			$(id).width(ww - 30);
		}

		top = 75;
		$(id).css('top', top);
		// console.log('setPopupPosition // ', ww, wh);
	}
	function checkAndAdd2Chrome(){
		if(alreadyInstalled){
			$('#popup-box').css('display', 'block');
			setPopupPosition('installed-popup');
			$('#installed-popup').css('display', 'block');
		}else
		if(isUnsupportedBrowser){
			$('#popup-box').css('display', 'block');
			setPopupPosition('unsupported-popup');
			$('#unsupported-popup').css('display', 'block');
		}else{
			addToChrome();
		}
	}
	function share(app){
		var link = null;
		if(app == 'Facebook'){
			// link = 'https://www.facebook.com/sharer.php?s=100&p[title]='+title+'&p[summary]='+text+'&p[url]='+url+'&p[images][0]='+image;
			link = 'https://www.facebook.com/sharer.php?s=100&p[title]='+title+'&p[images][0]='+image+'&p[summary]='+text+'&p[url]='+url;
		}else
		if(app == 'Twitter'){
                  link = 'https://twitter.com/intent/tweet?url='+url+'&text='+text;
		}else
		if(app == 'Google'){
                  link = 'https://plus.google.com/share?url='+url;
		}else
		if(app == 'Linkedin'){
                  link = 'https://www.linkedin.com/shareArticle?mini=true&url='+url+'&title='+title+'&summary='+text+'&source='+url;
		}else
		if(app == 'Pinterest'){
                  link = 'https://www.pinterest.com/pin/create/button/?media='+image+'&url='+url+'&description='+text;
		}else
		if(app == 'Delicious'){
                  link = 'https://delicious.com/save?url='+url+'&title='+title;
		}else
		if(app == 'Reddit'){
                  link = 'http://reddit.com/submit?url='+url+'&title='+title;
		}else
		if(app == 'StumbleUpon'){
                  link = 'https://www.stumbleupon.com/submit?url='+url+'&title='+title;
		}else
		if(app == 'Digg'){
                  link = 'https://digg.com/submit?url='+url+'&title='+title;
		}else
		if(app == 'Email'){
                  link = null;
		}
		if(link != null){
			var screen_width = parseInt(screen.width, 10);
                  var screen_height = parseInt(screen.height, 10);
                  var popup_width = screen_width - parseInt((screen_width*0.2), 10);
                  var popup_height = screen_height - parseInt((screen_height*0.2), 10);
                  var left = parseInt(((screen_width/2)-(popup_width/2)), 10);
                  var top = parseInt(((screen_height/2)-(popup_height/2)), 10);
                  top = 10;
                  var parameters = 'toolbar=0,status=0,width=' + popup_width + ',height=' + popup_height + ',top=' + top + ',left=' + left;
                  // return window.open($(this).attr('href'), '', parameters) && false;
                  window.open(link, '', parameters)
		}else{
                  window.location.href = 'mailto:?subject='+title+'&body='+text+' Link: '+url;
            }
	}
	function playSniplist(){
		ytPlayer.loadVideoById({'videoId': config.videoId[0],
						'startSeconds': config.videoInterval[config.videoId[0]][0],
						'endSeconds': config.videoInterval[config.videoId[0]][1]});
	}
	function attachEvents(){
		if(isMobileBrowser){
			$(window).on('orientationchange', function(){
				home.handleResize();
			});
		}
		$('#menu-button').on('click', function(){
			// console.log('  > ',$('#header-menu').css('display'))
			if($('#header-menu').css('display') == 'none'){
				$('#header-menu').css('display', 'block');
			}else{
				$('#header-menu').css('display', 'none')
			}
		});	
		$('#header-menu div').on('click', function(){
			if($('#menu-button').css('display') == 'block'){
				$('#header-menu').css('display', 'none');
			}
		});
		$('#header-menu div')
		.mouseenter(function(){
			$(this).css('border-top', '1px solid #2684DB');
			// color: #004F99;
		})
		.mouseleave(function(){
			$(this).css('border-top', '1px solid #FFFFFF');
		});
		$('#popup-box, .close-popup').on('click', function(){
			$('#popup-box').css('display', 'none');
			$('.popup-element').css('display', 'none');
		});

		$('#menu-install').on('click', function(){
			checkAndAdd2Chrome()
		});
		$('#menu-hiring').on('click', function(){
			$('#popup-box').css('display', 'block');
			setPopupPosition('hiring-popup');
			$('#hiring-popup').css('display', 'block');
		});
		$('#menu-contribute').on('click', function(){
			window.open('https://angel.co');
			// $('#popup-box').css('display', 'block');
			// setPopupPosition('contribute-popup');
			// $('#contribute-popup').css('display', 'block');
		});
		$('#menu-contact').on('click', function(){
			$('#popup-box').css('display', 'block');
			setPopupPosition('contact-popup');
			$('#contact-popup').css('display', 'block');
		});

		$('.share-button').on('click', function(){
			share($(this).attr('title'))
		});

		$('#sl-example-play').on('click', function(){
			playSniplist();
		});
		$(window).on('resize', function(){
			home.handleResize();
		});
	}
	function resizeNow(){
		var ww = $(window).width();
		// handle header menu - begin
		var w480 = $('#width480').css('display');
		if(w480 == 'block'){
			$('#header-menu').css('display', 'none');
			// console.log('menu is Displaying');
		}else{
			$('#header-menu').css('display', 'block');
			// console.log('menu is not Displaying');
		}
		// handle header menu - end
		positionSocialButtons();
	}
	function handleResize(){
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(function(){
			resizeNow();
		}, resizeDelay);
	}



	function playSniplist(){
		ytPlayer.playVideo();
	}


	function onPlay(){

	}
	function onPause(){

	}
	function onEnd(){
		if(currentSnip <= totalSnips){

		}else{

		}
	}
	function onError(){

	}
	function setPlayerObj(obj){
		ytPlayer = obj;
	}
	function onYtPlayerReady(){

	}
	function onYtPlayerStateChange(event){
		var state = event.data;
		if(state == -1){
			
		}else
		if(state == 0){
			onEnd();
		}else
		if(state == 1){
			onPlay();
		}else
		if(state == 2){
			onPause();
		}else
		if(state == 5){
			
		}
	}
	function onYtPlayerError(){
		onError();
	}
	return {
		init : init,
		handleResize : handleResize,
		setPlayerObj : setPlayerObj,
		onYtPlayerReady : onYtPlayerReady,
		onYtPlayerStateChange : onYtPlayerStateChange,
		onYtPlayerError : onYtPlayerError
	}
}());
$(document).ready(function(){
	home.init();
	home.handleResize();
});
function onYouTubeIframeAPIReady() {
	home.setPlayerObj(new YT.Player('sl-example-video-embed', {
		videoId: config.videoId[0],
		playerVars: { 'start': config.videoInterval[config.videoId[0]][0], 'end': config.videoInterval[config.videoId[0]][1], 'autoplay':1},
		events: {
			'onReady': home.onYtPlayerReady,
			'onStateChange': home.onYtPlayerStateChange,
			'onError': home.onYtPlayerError
		}
	}));
}
/*
// Divide large numbers eg. 5500 becomes 5.5k
if(count>1000) {
    count = (count / 1000).toFixed(1);
    if(count>1000) count = (count / 1000).toFixed(1) + "M";
    else count = count + "k";
}
*/

