const api = '2ce4ead64f6aba19ba40cdbd3a3963c6';
const url = 'https://developers.zomato.com/api/v2.1/search';
const params = {};
const option = {
	headers : new Headers({
		'user-key' : api
	})
};
$('form').on('submit', (e) => {
	e.preventDefault();
	const input = $('#input').val().trim();
	console.log(input);
	params.q = input;
	params.entity_id = 'san diego';
	console.log(params);

	const url = $.param(params);
	console.log(url);
});

//search for restaurants by name
const getData = (url, option) => {
	fetch(url, option).then((res) => res.json()).then((resjson) => console.log(resjson));
};

function main (){
	getData(url, option);
}

$(main);
