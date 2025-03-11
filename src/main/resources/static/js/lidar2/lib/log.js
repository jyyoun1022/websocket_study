$(document).ready(function(){
	if(!window.location.href.startsWith("http://localhost") && !window.location.href.startsWith("http://127.0.0.1")) {
		log.config.logLevel = 3;
	}
});
var log =
{
	level : [
		{
			level : 0
			, name : "debug"
		}, {
			level : 1
			, name : "info"
		}, {
			level : 2
			, name : "warn"
		}, {
			level : 3
			, name : "error"
		}
	]
	, config : {
		logLevel : 1
	}, getLevel : function(logLevelName) {
		var mx = log.level.length;
		for(var i = 0; i < mx; i++) {
			if(log.level[i].name == logLevelName) {
				return log.level[i].level;
			}
		}
		return null;
	}, info : function(msg, title) {
		log.out(msg, "info", title);
	}, error : function(msg, title){
		log.out(msg,"error", title);
	}, warn : function(msg, title){
		log.out(msg,"warn", title);
	}, debug : function(msg, title){
		log.out(msg, "debug", title);
	}, out : function(msg, logLevelName, title) {
		var isPrint = false;
		logLevelName = logLevelName == null ? "debug" : logLevelName;
		
		try {
			if(log.getLevel(logLevelName) >= log.config.logLevel){
				isPrint = true;
			}
		} catch (e) {
			
		}
		var nTime = moment().format('YYYY-MM-DD HH:mm:ss');
		if(isPrint) {
			if(logLevelName == "error") {
				console.log("[ERROR:" + nTime + "] " +title);
			} else if(nTime != _lastTiming || title != ntitle) {
				//console.log("["+logLevelName+ (title != null ? (" : " + title) : "") +"] " + nTime);
			}
			//console.log(msg);
			// if(logLevelName == "error") {
			// 	console.log("*ERROR");
			// }
		}else{
//			console.log(logLevelName + " : " + log.getLevel(logLevelName));
		}
		_lastTiming = nTime;
		ntitle = title;
	}
}
var _lastTiming = "", ntitle = null;