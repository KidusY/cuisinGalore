'use strict';

let showBackBtn = false;
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
	$('.loading').hide();
	$('.results').empty();
	$('.results').show();

	/*checks whether or the search is coming form 
	either search by restaurant or discover.
   depending on that button gets rendered out */
	if (showBackBtn) {
		$('.results').append(`<button class="back">Back</button>`);
	}
	for (const restaurant of restaurants) {
		let url = restaurant.restaurant.featured_image;
		let imageUrl = url.split('.');
		let image = restaurant.restaurant.featured_image;
		//checks if there is broken img link coming through
		if (imageUrl[imageUrl.length - 1] !== 'jpg') {
			image = 'assets/noimage.jpg';
		}

		$('.results').append(`		 
			<div class = resultsBox data-restaurantId = ${restaurant.restaurant.id}>
			<img src="${image}" alt="${restaurant.restaurant.name}">				
				<div class="description">
					<h1>${restaurant.restaurant.name}</h1>
					<h4>${restaurant.restaurant.cuisines}</h4>
					<address>			
					<a href="https://maps.google.com/?q=${restaurant.restaurant.location.address}" target="_blank" >
					<h5>${restaurant.restaurant.location.address}</h5>
					<h6>${restaurant.restaurant.location.locality}</h6>
					</a>
					</address>	

					<span class ="Features">Features:</span> <span>${restaurant.restaurant.highlights.map((feature) => feature)}</span>
					<p class= "rating">${restaurant.restaurant.user_rating.aggregate_rating}, ${restaurant.restaurant.user_rating
			.rating_text}</p>
				</div>
				<p class ="timeOpen"> ${restaurant.restaurant.timings}</p>
			</div>		
		`);
	}
};

//search for restaurants by name
const getDataByName = async (restaurantSearch, cityName) => {
	let cityId;
	try {
		cityId = await getLocationId(cityName);
	} catch (err) {
		console.log(err);
	}
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
			} else {
				$('.loading').hide();
				throw new Error('Error');
			}
		})
		.then((resjson) => {
			$('.loading').hide();
			renderHtml(resjson.restaurants);
			if (resjson.restaurants.length == 0) {
				$('.loading').hide();
				throw new Error('No Results');
			} else {
				$('.loading').hide();
				renderHtml(resjson.restaurants);
			}
		})
		.catch((err) => {
			let error = 'No Results, Please Check a Different City';
			if (err == "TypeError: Failed to fetch") {
				error = 'No Internet Connection, Please Try again later';
			}

			$('.loading').hide();
			$('.collections').empty();
			$('.collections').append(`<p class="noResults">${error}</p>`);
			$('.collections').show();
		});
};

//get location by name and passes the city Id to discover
const getLocationId = (citySearch) => {
	const params = {};
	let newUrl;
	params.query = citySearch;
	const searchParams = $.param(params);
	newUrl = `${urlSearchLocation}?${searchParams}`;

	return fetch(newUrl, option)
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
		})
		.then(resJson => resJson.location_suggestions[0].city_id)
		.catch(e => console.log(e));



};

//get different restaurants by city Id
const discover = async (cityName) => {
	let cityId;
	const params = {};
	let newUrl;
	try {
		cityId = await getLocationId(cityName);
	} catch (err) {
		console.log(err);
	}

	params.city_id = cityId;
	const searchParams = $.param(params);
	newUrl = `${urlDiscover}?${searchParams}`;
	//collections obj

	fetch(newUrl, option)
		.then((res) => {
			if (res.ok) {

				return res.json();
			} else {
				$('.loading').hide();
				throw new Error('Error');
			}
		})
		.then((resjson) => {
			if (resjson.collections.length == 0) {
				throw new Error('No Results');
			} else {
				$('.loading').hide();
				renderHtmlDiscover(resjson.collections, cityId);
			}
		})
		.catch((err) => {

			let error = 'No Results, Please Check a Different City';
			if (err == "TypeError: Failed to fetch") {
				error = 'No Internet Connection, Please Try again later';
			}
			$('.loading').hide();
			$('.collections').empty();
			$('.collections').append(`<p class="noResults">${error}</p>`);
			$('.collections').show();
		});
};

//render for collection
const renderHtmlDiscover = (collections, cityId) => {
	$('.collections').empty();
	$('.collections').show();
	$('.loading').hide();
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
			} else {
				$('.loading').hide();
				throw new Error('Network Error');
			}
		})
		.then((resjson) => {
			renderHtml(resjson.restaurants);
			if (resjson.restaurants.length == 0) {
				$('.loading').hide();
				throw new Error('No Results');
			} else {
				$('.loading').hide();
				renderHtml(resjson.restaurants);
			}
		})
		.catch((err) => {
			let message = 'No Results';
			if (err == 'Network Error') {
				message = 'Network Error';
			}
			$('.results').show();
			$('.results').empty();
			$('.results').append(`<p class="noResults">${message}</p>`);
		});
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

	$('.results').on('click', '.back', function (e) {
		e.preventDefault();
		$('.collections').show();
		$('.results').hide();
	});
};

function main() {
	events();
	//gets info for search restaurant by name
	$('.searchRestaurantForm').on('submit', (e) => {
		e.preventDefault();
		$('.results').empty();
		$('.loading').show();
		const restaurantSearch = $('#restaurantSearch').val().trim();
		const citySearch = $('#citySearchRestaurant').val().trim();
		getDataByName(restaurantSearch, citySearch);
		$('#restaurantSearch').val('');
		$('#citySearchRestaurant').val('');
		showBackBtn = false;
		$('.back').hide();
		$('.results').empty();
		$('.results').show();
	});

	//discover restaurants
	$('.discoverForm').on('submit', (e) => {
		e.preventDefault();
		$('.results').empty();
		$('.loading').show();
		$('.collections').empty();
		$('.results').hide();
		const citySearch = $('#citySearch').val().trim();
		discover(citySearch);
		$('#citySearch').val('');
		showBackBtn = true;
	});
}

$(main);