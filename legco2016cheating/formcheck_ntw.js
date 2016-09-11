function counting (who, db, selected) {
    var res = db({'code':selected})
    return(res.sum(who))
}

function recount (meta_db, db, selected) {
    var cand = meta_db().select('name1')
    var vote_db = TAFFY(cand.map(function(item) { return({'name': item, 'vote': counting(item, db, selected), 'numcand': meta_db({'name1': item}).select('numcand')[0]})}))
//    console.log(vote_db().select('name'))
    var res = countw(vote_db, 9)
    //    console.log(res().select('name'))
    //    console.log(res().select('elected'))
    // console.log(res({'name': '方國珊'}).select('elected')[0])
    //var sorted_vote_db = vote_db().order('vote desc').get()
    return(vote_db().get().map(function(item) { return({'name': item['name'], 'vote': item['vote'], 'elected': res({'name': item['name']}).select('elected')[0] }) }))
}

function still_chopp(wdata, seat, criteria) {
    return(wdata().sum('elected') < seat && wdata().select('vote').some(function(item) { return (item > criteria) }))
}

function gend(names, votes, num, seat) {
    var names = x().select('name')
    var wdata = TAFFY(names.map(function (e, i) { return({'name': e, 'vote': votes[i], 'num': num[i], 'elected': 0}) }))
    return(wdata)
}

function countw(x, seat) {
    var names = x().select('name')
    var votes = x().select('vote')
    var num = x().select('numcand')
    var wdata = TAFFY(names.map(function (e, i) { return({'name': e, 'vote': votes[i], 'num': num[i], 'elected': 0}) }))
    // stage 1: chopping stage
    var criteria = wdata().sum('vote') / seat
//    console.log(criteria)
    while (still_chopp(wdata, seat, criteria)) {
//	console.log('any chop')
	wdata({'vote':{'gt': criteria}, 'num': {'gt': 0}}).update(function() {
	    this.vote = this.vote - criteria ;
	    this.num = this.num - 1;
	    this.elected = this.elected + 1;
	    return(this) })
    }
    // stage 2: KO stage
    var sorted_name = wdata().order('vote desc').select('name')
//    console.log("KO")
//    console.log(wdata().order('vote'))
//    console.log(sorted_name)
    for (var i = 0; i < sorted_name.length; i++) {
	if (wdata().sum('elected') < seat) {
	    wdata({'name': sorted_name[i], 'num': {'gt': 0}}).update(function() {
		this.num = this.num - 1;
		this.elected = this.elected + 1;
		return(this) })
	}
    }
    return(wdata)
}

function print_recount(recount_res) {
    formatted_html = recount_res.map(function(item) {
	if (item['elected'] > 0) {
	    return("<li class = 'won'>" + item['name'] + " - " +item['vote'] + "票 (" + item['elected'] + "席)</li>")
	} 
	return("<li>" + item['name'] + " - " +item['vote'] + "票 (" + item['elected'] + "席)</li>") 
    })
    return("<ol>" + formatted_html.join('') + "</ol>")
}

$(document).ready(function(){
    $("p").html(print_recount(recount(ntw_metadb, ntw_db, ntw_db().select('code'))))
    var options = ntw_db().map(function(item) { return({'name': 'station', 'caption':item["cname"], 'value': item['code'], 'type': 'checkbox', 'checked': 'checked'}) })
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
//	var res = ntw_db({'code':selected})
//	var stations = res.map(function (item) { return(item['cname']) })
	    $("p").html(print_recount(recount(ntw_metadb, ntw_db, selected)))
    })
})

