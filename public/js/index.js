$(function(){
	var list = [];

	var name = 'IgorK2'

	$(document).on('click', '#get', function () {
		$.get('http://localhost:5000/' + name + '/todo', function(res){
			console.log(res);
			list = res;
			$('ul').empty();
				for (var i = 0; i < res.length; i++) {
					$('ul').append('<li data-id="' + res[i].id + '">' + res[i].text + '/' + res[i].status + '</li>');
				};
		})
	});

	$(document).on('click', '#post', function () {
		var data = {
			"text": $('#todoInput').val()
		};
		$.ajax({
			url: 'http://localhost:5000/' + name + '/todo', 
			method: 'POST', 
			dataType: 'json',
			data: JSON.stringify(data),
			contentType: 'application/json', 
			success: function(res){
				list = res;
				$('ul').empty();
				for (var i = 0; i < res.length; i++) {
					$('ul').append('<li data-id="' + res[i].id + '">' + res[i].text + '/' + res[i].status + '</li>');
				};
				console.log(res);
			}
		})
	});

	$(document).on('click', 'li', function () {
		console.log($(this).data('id'));
		for (var i = 0; i < list.length; i++) {
			if (list[i].id == $(this).data('id')) {
				if (list[i].status == 'new') {
					list[i].status = 'blblblb';
					$.post('http://localhost:5000/' + name + '/todo', list[i] , function (res) {
						console.log(res);
						list = res;
						$('ul').empty();
						for (var i = 0; i < res.length; i++) {
							$('ul').append('<li data-id="' + res[i].id + '">' + res[i].text + '/' + res[i].status + '</li>');
						};
					})
				} else {
					$.post('http://localhost:5000/' + name + '/todo/delete', list[i] , function (res) {
						console.log(res);
						list = res;
						$('ul').empty();
						for (var i = 0; i < res.length; i++) {
							$('ul').append('<li data-id="' + res[i].id + '">' + res[i].text + '/' + res[i].status + '</li>');
						};
					})
				}
			}
		};
	});

})