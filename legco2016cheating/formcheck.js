function counting (who, db, selected) {
    var res = db({'code':selected})
    return(res.sum(who))
}

function recount (meta_db, db, selected) {
    var cand = meta_db().select('name1')
    var vote_db = TAFFY(cand.map(function(item) { return({'name': item, 'vote': counting(item, db, selected)})}))
    var sorted_vote_db = vote_db().order('vote desc').get()
    return(sorted_vote_db.map(function(item) { return({'name': item['name'], 'vote': item['vote'] }) }))
}

$(document).ready(function(){
    $("p").html(recount(nte_metadb, nte_db, nte_db().select('code')).map(function(item) { return(item['name'] + ":" +item['vote']) }).join('<br>'))
    var options = nte_db().map(function(item) { return({'name': 'station', 'caption':item["cname"], 'value': item['code'], 'type': 'checkbox', 'checked': 'checked'}) })
    var foptions = []
    options.forEach(function(item) {
	foptions.push(item)
	foptions.push({'type': 'br'})
    })
    $("#myform").dform({
	"action" : "index.html",
	"method" : "get",
	"html" : foptions
    })

    $("input[type='checkbox']").change(function(){
	var selected=[]
	$("[name=station]:checkbox:checked").each(function(){ selected.push($(this).val()) })
//	var res = nte_db({'code':selected})
//	var stations = res.map(function (item) { return(item['cname']) })
	    $("p").html(recount(nte_metadb, nte_db, selected).map(function(item) { return("<li>" + item['name'] + ":" +item['vote']) + "</li>" }).join(''))
    })
})
