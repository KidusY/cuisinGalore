'use strict';

let counter = 0;
const api = '2ce4ead64f6aba19ba40cdbd3a3963c6';
const urlSearch = 'https://developers.zomato.com/api/v2.1/search';
const urlSearchId = 'https://developers.zomato.com/api/v2.1/restaurant';
const urlSearchLocation = 'https://developers.zomato.com/api/v2.1/locations';
const urlDiscover = 'https://developers.zomato.com/api/v2.1/collections';
const option = {
	headers: new Headers({
		'user-key': api
	})
};
//render results for search restaurant by name
const renderHtml = (restaurants) => {
	$('.results').empty();
	$('.results').show();
	$('.loading').hide()
	if (counter == 1) {
		$('.results').append(`<button class="back">Back</button>`)
	} 
	for (const restaurant of restaurants) {
		let url = restaurant.restaurant.featured_image
		let imageUrl = url.split(".")
		let image = restaurant.restaurant.featured_image
			if (imageUrl [imageUrl.length - 1] != "jpg")
			{
				image = "assets/noimage.jpg"
			}
		$('.results').append(`		 
			<div class = resultsBox data-restaurantId = ${restaurant.restaurant.id}>
				<img src="${image}" alt="${restaurant.restaurant.name}">				
				<div class="description">
					<h1>${restaurant.restaurant.name}</h1>
					<h4>${restaurant.restaurant.cuisines}</h4>
					<address>			
					<a href="https://maps.google.com/?q=${restaurant.restaurant.location.address}">
					<h5>${restaurant.restaurant.location.address}</h5>
					<h6>${restaurant.restaurant.location.locality}</h6>
					</a>
					</address>	

					<span class ="Features">Features:</span> ${restaurant.restaurant.highlights[0]},${restaurant.restaurant
				.highlights[1]},${restaurant.restaurant.highlights[2]}
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
	$('.loading').show();
	fetch(newUrl, option)
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
			else {
				throw new Error('Error');
			}

		})
		.then((resjson) => {
			if (resjson.restaurants.length == 0) {
				$('.loading').hide()
				throw new Error('No Results')
			}
			else {
				$('.loading').hide();
				renderHtml(resjson.restaurants)
			}
		})
		.catch(err => {
			$('.results').show()
			$('.results').empty()
			$('.results').append(`<p class="noResults">No Results, Please Check a Different City</p>`)
		})
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
	$('.loading').show();
	fetch(newUrl, option)
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else { 
				$('.loading').hide()
				throw new Error('Error'); }
		})
		.then((resjson) => {
			if (resjson.collections.length == 0) {
				$('.loading').hide()
				throw new Error('No Results')
			}
			else {
				$('.loading').hide();
				renderHtmlDiscover(resjson.collections, cityId)
			}
		})
		.catch(err => {
			$('.collections').show()
			$('.collections').empty()
			$('.loading').hide()
			$('.collections').append(`<p class="noResults">No Results, Please Check a Different City</p>`)
		})
};

//render for collection
const renderHtmlDiscover = (collections, cityId) => {
	$('.collections').empty();
	$('.collections').show();
	$('.loading').hide()
	for (const collection of collections) {
		$('.collections').append(`		
		<div data-target=${collection.collection.collection_id} data-cityId=${cityId}>
				<h2>${collection.collection.title}</h2>
				<h3 class ="text-mute">${collection.collection.description}</h3>
				<img src="${collection.collection.image_url}">
							
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
	$('.loading').show();
	fetch(newUrl, option)
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
			else {
				$('.loading').hide()
				throw new Error('Error');
			}
		})
		.then((resjson) => {
			renderHtml(resjson.restaurants)
			if (resjson.restaurants.length == 0) {
				$('.loading').hide()
				throw new Error('No Results')
			}
			else {
				$('.loading').hide();
				renderHtml(resjson.restaurants)
			}

		})
		.catch(err => {
			$('.results').show()
			$('.results').empty()
			$('.results').append(`<p class="noResults">No Results</p>`)
		})
};

//events
const events = () => {
	$('.widget1').click(function (e) {
		e.preventDefault();
		$('main section').hide();
		$('.searchRestaurant').show();
	});
	$('.widget2').click(function (e) {
		e.preventDefault();
		$('main section').hide();
		$('.search').show();
	});

	$('.collections').on('click', 'div', function (e) {
		e.preventDefault();
		$('.collections').hide();
		collections($(this)[0].dataset.target, $(this)[0].dataset.cityid);
		$('.back').show();
	});

	//returns to landing page on h1 click
	$('.headerH1').click(function (e) {
		e.preventDefault();
		$('main section').hide();
		$('.landingPage').show();
	});

	$('.results').on("click", ".back", function (e) {
		e.preventDefault();
		$('.collections').show();
		$('.results').hide();
	})
};
function main() {
	events();
	//gets info for search restaurant by name
	$('.searchRestaurantForm').on('submit', (e) => {
		e.preventDefault();
		const restaurantSearch = $('#restaurantSearch').val().trim();
		const citySearch = $('#citySearchRestaurant').val().trim();
		getDataByName(restaurantSearch, citySearch);
		$('#restaurantSearch').val('');
		$('#citySearchRestaurant').val('');
		counter = 0;
		$('.back').hide();
		$('.results').show();
	});

	//discover restaurants
	$('.discoverForm').on('submit', (e) => {
		e.preventDefault();
		$('.results').hide();
		const citySearch = $('#citySearch').val().trim();
		discover(citySearch);
		$('#citySearch').val('');
		counter = 1;
	});

	//after selecting a restaurant, search info by Id
}

$(main);
