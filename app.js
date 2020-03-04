const api = '2ce4ead64f6aba19ba40cdbd3a3963c6';
const urlSearch = 'https://developers.zomato.com/api/v2.1/search';
const urlSearchId = 'https://developers.zomato.com/api/v2.1/restaurant';
const option = {
	headers : new Headers({
		'user-key' : api
	})
};

//search for restaurants by name
const getDataByName = (restaurantSearch, citySearch) => {
	const params = {};
	let newUrl;
	params.q = restaurantSearch;
	params.entity_id = citySearch;
	const searchParams = $.param(params);
	newUrl = `${urlSearch}?${searchParams}`;
	fetch(newUrl, option).then((res) => res.json()).then((resjson) => console.log(resjson.restaurants));
};

//get info by restaurant id
const getDataById = (id) => {
	const params = {};
	let newUrl;
	params.res_id = id;
	const searchParams = $.param(params);
	newUrl = `${urlSearchId}?${searchParams}`;
	fetch(newUrl, option).then((res) => res.json()).then((resjson) => console.log(resjson));
};

//events
const events = () => {
	$('.widget1').click(function (e){
		e.preventDefault();
		$('main section').hide();
		$('.searchRestaurant').show();
	});
};

function main (){
	events();
	//gets info for search restaurant by name
	$('form').on('submit', (e) => {
		e.preventDefault();
		const restaurantSearch = $('#restaurantSearch').val().trim();
		const citySearch = $('#citySearch').val().trim();
		getDataByName(restaurantSearch, citySearch);
	});

	//after selecting a restaurant, search info by Id
}

$(main);
