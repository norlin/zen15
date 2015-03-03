$(function(){
	var $volume = $('#volume'),
		$mantra = $('#mantra');

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
		$value.css('font-size', $itemRight.width() / 20);
		setTimeout(function() {
			$stocks.css('margin-top', -$stocks.height() / 2)
		}, 0);
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
	updateMantra();
	updateNemtsov();
});