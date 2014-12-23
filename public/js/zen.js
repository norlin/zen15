$(function(){
	var $count = $('#count'),
		lastValue = +$count.text()||0,
		$video = $('#video'),
		audio = $('#audio')[0],
		$volume = $('#volume');

	function parseNum(val) {
		val = ''+Math.round(val);
		val = val.split('').reverse();
		var num = [],
			i = 0;
		$.each(val, function(index, x){
			i+=1;
			num.push(x);
			if (i==3) {
				i = 0;
				num.push(' ');
			}
		});
		return num.reverse().join('');
	}

	function animate(value){
		if (value > lastValue) {
			$count.addClass('stocks-item-value-up');
		} else if (value < lastValue) {
			$count.addClass('stocks-item-value-down');
		}

		$({value: lastValue}).animate({value: value}, {
			duration: 2000,
			easing:'linear',
			step: function() {
				$count.text(parseNum(this.value));
			}
		});

		window.setTimeout(function(){
			$count.removeClass('stocks-item-value-up stocks-item-value-down');
		}, 3000);

		lastValue = value;
	}

	function update(){
		$.get('/count').done(function(count){
			animate(count);
		});

		setTimeout(update, 5000);
	}

	function updateBackground(){
		var bg = Math.round(Math.random()*4)+1;
		var $video2 = $video.clone();
		$video2.attr('class', 'holder-video holder-video-hidden holder-video-'+bg);
		$video2.insertAfter($video);

		window.setTimeout(function(){
			$video.addClass('holder-video-hidden');
			$video2.removeClass('holder-video-hidden');
		}, 13);

		window.setTimeout(function(){
			$video.remove();
			$video = $video2;
		}, 7000);

		window.setTimeout(updateBackground, 15000);
	}

	var $item = $('.stocks-item'),
		$itemRight = $('.stocks-item-right'),
		$stocks = $('.stocks'),
		$value = $('.stocks-item-value');
	function adjustFontSize() {
		$value.css('font-size', $itemRight.width() / 4);
		setTimeout(function() {
			$stocks.css('margin-top', -$stocks.height() / 2)
		}, 0);
	}

	$volume.on('click', function(){
		if (audio.paused) {
			audio.play();
			$volume.removeClass('volume-off');
		} else {
			audio.pause();
			$volume.addClass('volume-off');
		}
	});
	audio.play();

	adjustFontSize();
	$(window).on('resize', adjustFontSize);
	update();
	updateBackground();
});