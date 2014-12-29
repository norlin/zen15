$(function(){
	var $count = $('#count'),
		lastValue = {
			count: +$count.text()||0,
			date: 0,
			sechin: 0
		},
		$mantra = $('#mantra'),
		$date = $('#date'),
		$dateNote = $('#dateNote'),
		$navalny = $('#navalnyBlock'),
		$sechin = $('#sechin'),
		$sechinBlock = $('#sechinBlock'),
		$sechinNote = $('#sechinNote');

	function parseNum(val) {
		val = ''+Math.round(val);
		val = val.split('').reverse();
		var num = [],
			i = 0,
			x;
		for (var j = 0; j < val.length; j+=1) {
			x = val[j];
			i+=1;
			num.push(x);
			if (i==3) {
				i = 0;
				num.push(' ');
			}
		}
		return num.reverse().join('');
	}

	function animate($item, value, lastName, duration){
		if (value > lastValue[lastName]) {
			$item.addClass('stocks-item-value-up');
		} else if (value < lastValue[lastName]) {
			$item.addClass('stocks-item-value-down');
		}

		$({value: lastValue[lastName]}).animate({value: value}, {
			duration: duration || 2000,
			easing:'linear',
			step: function() {
				$item.text(parseNum(this.value));
			}
		});

		window.setTimeout(function(){
			$item.removeClass('stocks-item-value-up stocks-item-value-down');
		}, 3000);

		lastValue[lastName] = value;
	}

	function update(){
		$.post('/count').done(function(count){
			animate($count, count, 'count');
		});

		setTimeout(update, 5000);
	}

	var mantras = [
		'Жизнь слишком коротка, чтобы всё время смотреть в стол.',
		'Мы придумали какую-то ерунду: нас всех побьют и посадят. Убить и посадить всех невозможно.',
		'Мне кажется, что ответственность — это как раз сделать так, чтобы мои дети захотели остаться здесь.',
		'Свободных СМИ в стране практически нет. Значит, нужно пытаться создавать политическую конкуренцию.',
		'Жизнь страны можно полностью изменить за пять лет.',
		'Когда человек мне говорит, что не интересуется политикой, я считаю его просто глупым.',
		'Каждый понимает, что коррупция — это плохо, а некоррупция — хорошо.',
		'Меня по телевизору не показывают, и я действую так, словно никакого телевизора не существует.',
		'Есть опыт других стран, он доступен, результаты понятны.',
		'Власть должна быть для людей, а там, где это возможно, то есть практически везде, сами люди и должны быть властью.',
		'Нужно перестать спонсировать войну.',
		'А моя жена является тем человеком, который меня поддерживает.',
		'Око Саурона не зажглось, но все знают, где Барад-дур.',
		'Я так люблю свою страну, но ненавижу государство.',
		'У людей есть законное право на восстание против этой несправедливой коррумпированной власти.'
	];
	var author = '';//'<br/>&copy; Навальный';
	function updateMantra(){
		var count = mantras.length-1;
		var i = Math.round(Math.random()*count);
		$mantra.fadeOut(1000, function(){
			$mantra.html(mantras[i]+author);
			$mantra.fadeIn(1000, function(){
				window.setTimeout(updateMantra, 10000);
			});
		});
	}

	var $item = $('.stocks-item'),
		$itemRight = $('.stocks-item-right'),
		$stocks = $('.stocks'),
		$value = $('.stocks-item-value');

	function adjustFontSize() {
		$value.css('font-size', $itemRight.width() / 5);
	}

	function wordEnd(word, num){
		//word = ['сайтов','сайта','сайт']
		var num100 = num % 100;

		if (num === 0){
			return typeof(word[3]) != 'undefined' ? word[3] : word[0];
		}
		if (num100 > 10 && num100 < 20){
			return word[0];
		}
		if ( (num % 5 >= 5) && (num100 <= 20) ){
			return word[0];
		}else{
			num = num % 10;
			if (((num >= 5) && num <= 9) || (num === 0)){
				return word[0];
			}
			if ((num >= 2) && (num <= 4)){
				return word[1];
			}
			if (num == 1){
				return word[2];
			}
		}
		return word[0];
	}

	var date = new Date('Thu Jan 15 2015 19:00:00 GMT+0300'),
		text = ', чтобы рассказать всем';
	function updateDate() {
		var ms = date.getTime(),
			msNow = Date.now(),
			diff = ms - msNow,
			msMin = 1000 * 60,
			min = Math.round(diff / msMin);
		animate($date, min, 'date');
		var minText = wordEnd(['Минут', 'Минуты', 'Минута'], min);
		$dateNote.html(minText + text);
		window.setTimeout(updateDate, 1000);
	}

	var salary = 5000000 / 86400,
		forUser = 0;

	function updateSechin(){
		forUser += salary;

		if (!showSechin) {
			animate($sechin, forUser, 'sechin', 600);
		}
	}

	var showSechin = false;
	function switchSechin() {
		function setUpdate($item1, $item2){
			if ($item2.is('visible')) {
				window.setTimeout(switchSechin, 10000);
				return;
			}
			$item1.fadeOut(1000, function(){
				showSechin = !showSechin;
				$sechin.text(parseNum(forUser));
				lastValue.sechin = forUser;
				$item2.removeClass('g-hidden');
				$item2.fadeIn(1000, function(){
					window.setTimeout(switchSechin, 10000);
				});
			});
		}

		if (showSechin) {
			setUpdate($navalny, $sechinBlock);
		} else {
			setUpdate($sechinBlock, $navalny);
		}
	}

	if ($count.length) {
		adjustFontSize();
		$(window).on('resize', adjustFontSize);
		update();
		updateDate();
	}

	if ($mantra.length) {
		updateMantra();
	}

	if ($sechin.length) {
		window.setInterval(updateSechin, 1000);
		switchSechin();
	}
});