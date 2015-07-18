$(document).ready( function() { 
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	}); //End submit for .unanswered-getter

	$('.inspiration-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tag the user submitted
		var tag = $(this).find("input[name='answerers']").val();
		getTopAnswerers(tag);
	});//End submit for .inspiration-getter





}); //End Ready

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
				   site: 'stackoverflow',
				   order: 'desc',
				   sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET"
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
			// console.log(result.items);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	}); 
}; //End getUnanswered


/*====================Inspiration Piece=========================*/
/*===============================================================*/
var showAnswerer = function(answerer) {
	
	// clone our result template code
	var result = $('.templates .answerer').clone();
	
	// Set the link to the answerer profile in result
	var answererElem = result.find('.link a');
	answererElem.attr('href', answerer.user.link);
	answererElem.text('Link to User Profile');

	// set the display name property in result
	var displayName = result.find('.display-name');
	displayName.text(answerer.user.display_name);

	// set the Reputation property in result
	var reputation = result.find('.reputation');
	reputation.text(answerer.user.reputation);

	// set the Accept Rate property in result
	var acceptRate = result.find('.accept-rate');
	acceptRate.text(answerer.user.accept_rate);

	return result;
};






//takes a string of tag to be searched
//for on StackOverflow for Top Answerers
var getTopAnswerers = function(tag) {

	//the parameters we need to pass in our request to SO's API
	var request = {
		tag: tag,
		site: 'stackoverflow',
		period: 'all_time'
	}; 

		var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/"+request.tag+"/top-answerers/"+request.period,
		data: request,
		dataType: "jsonp",
		type: "GET"
	}) //End $.ajax
	.done(function(result) {
		$.each(result.items, function(i, item) {
			var answerer = showAnswerer(item);
			$('.results').append(answerer);

			var displayName = item.user.display_name;
			var reputation = item.user.reputation;
			var acceptRate = item.user.accept_rate;
			var link = item.user.link
			console.log("Name :" + displayName + '\n' + 
						"Reputation: " + reputation + '\n' +
						"Accept Rate: " + acceptRate + '\n' + 
						"Link: " + link + '\n');

		});//End $.each
	}); //End done
	

} //End getTopAnswerers

// getTopAnswerers("jQuery");

//Available information on Top Answerers object
/*
- display_name
 - reputation
 - accept_rate 
 - link

*/




