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

	var texts = {
		'seconds': ['сек', 'сек', 'сек'],
		'minutes': ['мин', 'мин', 'мин'],
		'hours': ['часов', 'часа', 'час'],
		'days': ['дней', 'дня', 'день'],
		'weeks': ['недель', 'недели', 'неделю'],
		'months': ['месяцев', 'месяца', 'месяц'],
		'years': ['лет', 'года', 'год']
	};
	var nextPeriod = {
		'years': 'months',
		'months': 'weeks',
		'weeks': 'days',
		'days': 'hours',
		'hours': 'minutes',
		'minutes': 'seconds'
	};
	function getTime(period, date){
		period = period||'years';
		var text = '';
		var a = moment(date||theDate);
		var b = moment();
		var diff = b.diff(a, period, true);
		var next = nextPeriod[period];
		if (diff > 1) {
			var round = Math.floor(diff);
			text = wordEnd(texts[period], round);
			return round + ' ' + text + (next ? ' '+getTime(next, a.add(round, period)) : '');
		}
		return next ? getTime(next, a) : '';
	}

	function updateNemtsov(){
		var text = 'За&nbsp;'+getTime();
		$('#nemtsov').html(text);
		adjustFontSize();
		window.setTimeout(updateNemtsov, 1000);
	}

	adjustFontSize();
	$(window).on('resize', adjustFontSize);
	updateMantra();
	updateNemtsov();
});