var ip_table = require('./ip');
var inSubnet = require('insubnet');
var list = [], l;

ip_table.forEach(function(record){
	var ranges = record.ranges;
	if (ranges) {
		ranges.forEach(function(mask){
			if (mask[0] != '#') {
				list.push(mask);
			}
		});
	}
});
l = list.length;

function ipInMask(ip) {
	for (var i=0; i < l; i += 1) {
		if (inSubnet.Auto(ip, list[i])) {
			return true;
		}
	}
	return false;
}

function kitty(req, res) {
	res.redirect('/kitty');
}

function check(req, res, next){
	var ips = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	ips = ips.split(',');
	var ip_l = ips.length;
	var ip;
	var fail = false;
	for (var i = 0; i < ip_l; i += 1) {
		ip = ips[i];
		ip = ip && ip.trim ? ip.trim() : ip;
		if (ip && ipInMask(ip)) {
			fail = true;
			break;
		}
	}

	if (fail) {
		return kitty(req, res);
	}
	next();
}

module.exports = check;