window.onload = function () {
    var wordcloudrr_data = JSON.parse(data)
    var wordcloudrr_list = []
    for (var row in wordcloudrr_data['data']) {
	wordcloudrr_list.push([wordcloudrr_data['data'][row]['words'], wordcloudrr_data['data'][row]['freq']])
    }
    var tar_wordcloudrr_data = TAFFY(wordcloudrr_data['data'])
    function query(word, freq) {
	return tar_wordcloudrr_data({'words': word, "freq": freq}).get()[0]['cols']
    }
    options= {
	list : wordcloudrr_list,
	rotateRatio: 0,
	shape: wordcloudrr_data['shape'][0],
	rotateRatio: wordcloudrr_data['rot_per'][0],
	backgroundColor: wordcloudrr_data['bgcolor'][0],
	color: function(word, weight) {
	    return query(word, weight)
	}
    }
    WordCloud(document.getElementById('wordcloudrr'), options)
}
