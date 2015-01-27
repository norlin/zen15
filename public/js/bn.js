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
		'Действующий режим после многих лет проедания нефтяных денег завел страну в тупик и полностью обанкротился.',
		'Президент и его правительство не могут вывести страну из кризиса и должны уйти.',
		'Безусловный допуск оппозиционных партий и кандидатов к участию в выборах.',
		'Обеспечение честных выборов, формирование новых составов избирательных комиссий всеми участниками выборов.',
		'Немедленное прекращение войны и любых агрессивных действий в отношении Украины.',
		'Требуем принятия законодательства против незаконного обогащения чиновников.',
		'Прекратить пропагандистскую истерию в СМИ и отменить цензуру.',
		'Предоставить оппозиции один час эфирного времени в неделю на одном из центральных каналов.',
		'Немедленное освобождение всех политических заключенных.',
		'России нужна судебная реформа, обеспечивающая настоящую независимость судов.',
		'Стране необходима децентрализация власти.',
		'Сокращение раздутых военно-полицейских расходов в два раза.',
		'Отмена бесполезных продуктовых "контрсанкций", ставших причиной роста цен на продукты.',
		'Перераспределить средства в пользу регионов и местного самоуправления.',
		'Прекращение вливаний сотен миллиардов в госкомпании (Роснефть, ВЭБ, ВТБ, Газпромбанк и другие).',
		'Отмена решений по конфискации пенсионных накоплений граждан.'
	];
	var prefix = 'Требования антикризисного марша:<br/>';//'<br/>&copy; Навальный';
	function updateMantra(){
		var count = mantras.length-1;
		var i = Math.round(Math.random()*count);
		$mantra.fadeOut(1000, function(){
			$mantra.html(prefix+mantras[i]);
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

	var date = new Date('Sun Mar 1 2015 15:00:00 GMT+0300'),
		text = ' до начала весны';
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
		update();
	}

	updateDate();
	adjustFontSize();
	$(window).on('resize', adjustFontSize);

	if ($mantra.length) {
		updateMantra();
	}

	if ($sechin.length) {
		window.setInterval(updateSechin, 1000);
		switchSechin();
	}
});