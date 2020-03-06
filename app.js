'use strict';

const api = '2ce4ead64f6aba19ba40cdbd3a3963c6';
const urlSearch = 'https://developers.zomato.com/api/v2.1/search';
const urlSearchId = 'https://developers.zomato.com/api/v2.1/restaurant';
const urlSearchLocation = 'https://developers.zomato.com/api/v2.1/locations';
const urlDiscover = 'https://developers.zomato.com/api/v2.1/collections';
const option = {
	headers : new Headers({
		'user-key' : api
	})
};
//render results for search restaurant by name
const renderHtml = (restaurants) => {
	console.log(restaurants);
	$('.results').empty();
	$('.results').show();
	for (const restaurant of restaurants) {
		$('.results').append(`		
			<div class = resultsBox data-restaurantId = ${restaurant.restaurant.id}>
				<img src="${restaurant.restaurant.featured_image}" alt="" width=30%>				
				<div class="description">
					<h1>${restaurant.restaurant.name}</h1>
					<h4>${restaurant.restaurant.cuisines}</h4>
					<address>			
					<a href="https://maps.google.com/?q=${restaurant.restaurant.location.address}">
					<h5>${restaurant.restaurant.location.address}</h5>
					<h6>${restaurant.restaurant.location.locality}</h6>
					</a>
					</address>	

					<p class ="Features">Features ${restaurant.restaurant.highlights[0]},${restaurant.restaurant
			.highlights[1]},${restaurant.restaurant.highlights[2]}</p>
					<p class= "rating" color="${restaurant.restaurant.user_rating.rating_color}">${restaurant.restaurant.user_rating
			.aggregate_rating}, ${restaurant.restaurant.user_rating.rating_text}</p>
				</div>
				<p class ="timeOpen"> ${restaurant.restaurant.timings}</p>
			</div>		
		`);
	}
};

//search for restaurants by name
const getDataByName = async (restaurantSearch, cityName) => {
	const cityData = await getLocationId(cityName);
	const cityId = await cityData.location_suggestions[0].city_id;
	const params = {};
	let newUrl;
	params.q = restaurantSearch;
	params.entity_type = 'city';
	params.entity_id = cityId;
	const searchParams = $.param(params);
	newUrl = `${urlSearch}?${searchParams}`;
	fetch(newUrl, option)
		.then((res) => {
			if (res.ok) {
				console.log('Error');
				return res.json();
			}
			else {
				console.log('Error');
				throw new Error('Error');
			}
		})
		.then((resjson) => renderHtml(resjson.restaurants));
};

//get location by name and passes the city Id to discover
const getLocationId = (citySearch) => {
	const params = {};
	let newUrl;
	params.query = citySearch;
	const searchParams = $.param(params);
	newUrl = `${urlSearchLocation}?${searchParams}`;
	return fetch(newUrl, option).then((res) => {
		if (res.ok) {
			return res.json();
		}

		console.log('Error');
		throw new Error('Error');
	});
};

//get info by restaurant id
const getDataById = (id) => {
	const params = {};
	let newUrl;
	params.res_id = id;
	const searchParams = $.param(params);
	newUrl = `${urlSearchId}?${searchParams}`;
	fetch(newUrl, option).then((res) => res.json()).then((resjson) => resjson);
};

//get different restaurants by city Id
const discover = async (cityName) => {
	const res = await getLocationId(cityName);
	let cityId = await res.location_suggestions[0].entity_id;
	const params = {};
	let newUrl;
	params.city_id = cityId;
	const searchParams = $.param(params);
	newUrl = `${urlDiscover}?${searchParams}`;
	//collections obj
	fetch(newUrl, option)
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
			console.log('Error');
			throw new Error('Error');
		})
		.then((resjson) => renderHtmlDiscover(resjson.collections, cityId));
};

//render for collection
const renderHtmlDiscover = (collections, cityId) => {
	$('.collections').empty();
	$('.collections').show();
	for (const collection of collections) {
		$('.collections').append(`		
		<div data-target=${collection.collection.collection_id} data-cityId=${cityId}>
				<h2>${collection.collection.title}</h2>
				<p>${collection.collection.description}</p>
				<img src="${collection.collection.image_url}">
				<p>${collection.collection.url}</p>				
		</div>
		
		`);
	}
};

const collections = (collections, cityId) => {
	const params = {};
	let newUrl;
	params.entity_id = cityId;
	params.entity_type = 'city';
	params.collection_id = collections;
	const searchParams = $.param(params);
	newUrl = `${urlSearch}?${searchParams}`;
	fetch(newUrl, option)
		.then((res) => {
			if (res.ok) {
				console.log('Error');
				return res.json();
			}
			else {
				console.log('Error');
				throw new Error('Error');
			}
		})
		.then((resjson) => renderHtml(resjson.restaurants))
		.catch((res) => alert(res));
};

//events
const events = () => {
	$('.widget1').click(function (e){
		e.preventDefault();
		$('main section').hide();
		$('.searchRestaurant').show();
	});
	$('.widget2').click(function (e){
		e.preventDefault();
		$('main section').hide();
		$('.search').show();
	});

	$('.collections').on('click', 'div', function (e){
		e.preventDefault();
		$('.collections').hide();
		collections($(this)[0].dataset.target, $(this)[0].dataset.cityid);
	});

	//returns to landing page on h1 click
	$('.searchRestaurant', 'search').on('click', 'h1', function (e){
		e.preventDefault();
		$('.landingPage').show();
	});
};
function main (){
	events();
	//gets info for search restaurant by name
	$('.searchRestaurantForm').on('submit', (e) => {
		e.preventDefault();
		const restaurantSearch = $('#restaurantSearch').val().trim();
		const citySearch = $('#citySearchRestaurant').val().trim();
		getDataByName(restaurantSearch, citySearch);
		$('.results').show();
	});

	//discover restaurants
	$('.discoverForm').on('submit', (e) => {
		e.preventDefault();
		$('.results').hide();
		const citySearch = $('#citySearch').val().trim();
		discover(citySearch);
	});

	//after selecting a restaurant, search info by Id
}

$(main);
