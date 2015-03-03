$(function(){
	var $count = $('#count'),
		lastValue = {
			count: +$count.text()||0,
			date: 0,
			sechin: 0
		},
		bgTimeout = 15000,
		$video = $('#video'),
		audioZen = $('#audio_zen')[0],
		audioDrive = $('#audio_drive')[0],
		$zenSwitch = $('#zen_switch'),
		$zenLabel = $('#zenLabel'),
		$driveLabel = $('#driveLabel'),
		$volume = $('#volume'),
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

	var bgs = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
	var bgTurn = 0;
	function updateBackground(){
		var count = bgs.length-1;
		var num = Math.round(Math.random()*count);
		var bg = bgs[num];
		var $video2 = $video.clone();
		$video2.attr('class', 'holder-video holder-video-hidden holder-video-vesna-'+bg);

		bgTurn += 1;

		if (bgTurn % 2) {
			$video2.addClass('holder-video-invert');
		}

		$video2.insertAfter($video);

		window.setTimeout(function(){
			$video.addClass('holder-video-hidden');
			$video2.removeClass('holder-video-hidden');
		}, 13);

		window.setTimeout(function(){
			$video.remove();
			$video = $video2;
		}, 7000);

		window.setTimeout(updateBackground, bgTimeout);
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
		$itemRight = $('.stocks-item-nemtsov'),
		$stocks = $('.stocks'),
		$value = $('.stocks-item-value');

	function adjustFontSize() {
		$value.css('font-size', $itemRight.width() / 15);
		setTimeout(function() {
			$stocks.css('margin-top', -$stocks.height() / 2)
		}, 0);
	}

	var paused = false;
	function updateAudio() {
		var drive = $zenSwitch.is(':checked');
		var selected = 'switch-label-selected';

		if (paused) {
			audioZen.pause();
			audioDrive.pause();
			$volume.addClass('volume-off');
			$zenLabel.removeClass(selected);
			$driveLabel.removeClass(selected);
		} else {
			if (drive) {
				audioZen.pause();
				audioDrive.play();
				$zenLabel.removeClass(selected);
				$driveLabel.addClass(selected);
			} else {
				audioDrive.pause();
				audioZen.play();
				$driveLabel.removeClass(selected);
				$zenLabel.addClass(selected);
			}
			$volume.removeClass('volume-off');
		}
	}

	$volume.on('click', function(){
		paused = !paused;
		updateAudio();
	});

	$zenSwitch.on('change', updateAudio);
	$zenLabel.on('click', function(){
		$zenSwitch[0].checked = false;
		updateAudio();
	});
	$driveLabel.on('click', function(){
		$zenSwitch[0].checked = true;
		updateAudio();
	});

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

	var date = new Date('Sun Mar 1 2015 00:00:00 GMT+0300'),
		text = ' до начала весны';
	function updateDate() {
		var ms = date.getTime(),
			msNow = Date.now(),
			diff = ms - msNow,
			msMin = 1000 * 60,
			min = Math.round(diff / msMin);
		if (min<0){
			min = 0;
		}
		animate($date, min, 'date');
		if (min == 0){
			$dateNote.html('Весна началась!');
		} else {
			$dateNote.html(wordEnd(['Минут', 'Минуты', 'Минута'], min) + text);
		}
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

	var theDate = new Date(2015, 1, 27, 23, 31);
	var date_sec = {
		MS: 0.001,
		SEC: 1,
		MIN: 60,
		HOUR: 60*60,
		DAY: 24*60*60,
		WEEK: 7*24*60*60,
		MONTH: 30*24*60*60,
		YEAR: 365*24*60*60
	};
	var date_ms = {};
	for (var key in date_sec)
	{
		date_ms[key] = date_sec[key]*1000;
	}

	function timeAgo(now, diff){
		var ms = now-theDate;
		diff = diff||0;
		if (diff){
			ms -= diff;
		}
		var text;
		var val;
		if (ms <= date_ms.SEC)
			return '';
		if (ms < date_ms.MIN)
			return Math.floor(ms/date_ms.SEC)+'&nbsp;сек';
		if (ms < date_ms.HOUR)
		{
			val = Math.floor(ms/date_ms.MIN);
			return val+'&nbsp;мин '+timeAgo(now, date_ms.MIN*val+diff);
		}
		if (ms < date_ms.DAY)
		{
			val = Math.floor(ms/date_ms.HOUR);
			text = wordEnd(['часов', 'часа', 'час'], val);
			return val+'&nbsp;'+text+' '+timeAgo(now, date_ms.HOUR*val+diff);
		}
		if (ms < date_ms.WEEK)
		{
			val = Math.floor(ms/date_ms.DAY);
			text = wordEnd(['дней', 'дня', 'день'], val);
			return val+'&nbsp;'+text+' '+timeAgo(now, date_ms.DAY*val+diff);
		}
		if (ms < date_ms.MONTH)
		{
			val = Math.floor(ms/date_ms.WEEK);
			text = wordEnd(['недель', 'недели', 'неделю'], val);
			return val+'&nbsp;'+text+' '+timeAgo(now, date_ms.WEEK*val+diff);;
		}
		if (ms < date_ms.YEAR)
		{
			val = Math.floor(ms/date_ms.MONTH);
			text = wordEnd(['недель', 'недели', 'неделю'], val);
			return val+'&nbsp;'+text+' '+timeAgo(now, date_ms.MONTH*val+diff);
		}
		val = Math.floor(ms/date_ms.YEAR);
		text = wordEnd(['лет', 'года', 'год'], val);
		return val+'&nbsp;'+text+' '+timeAgo(now, date_ms.YEAR*val+diff);;
	}

	function updateNemtsov(){
		var text = 'За&nbsp;'+timeAgo(+Date.now());
		$('#nemtsov').html(text);
		adjustFontSize();
		window.setTimeout(updateNemtsov, 1000);
	}

	adjustFontSize();
	$(window).on('resize', adjustFontSize);
	window.setTimeout(updateBackground, bgTimeout);
	updateMantra();
	updateNemtsov();
});