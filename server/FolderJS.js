function sendrequest(requestURL) {
	let request = new XMLHttpRequest();
	request.open('GET',requestURL);
	request.responseType = 'json';
	request.send()
}
function showFolder(path) {
	let request = new XMLHttpRequest();
	request.open('GET',path);
	request.responseType = 'json';
	request.send()
	request.onload = function() {
		let requestResponse = request.response;
		drawList(requestResponse,path);
	}
}
function drawList(jsonObj,curdir) {
	if (!document.getElementById('content_div')) {
		let content_div = document.createElement('div');
		content_div.id = 'content_div';
		document.body.appendChild(content_div);
	}
	else {
		let content_div = document.getElementById('content_div');
	}
	let content_h2 = document.createElement('h2');
	content_h2.textContent = 'Вы в папке server' + curdir;
	content_div.appendChild(content_h2);
	let list_ul = document.createElement('ul');
	for (let i=0;i<jsonObj.length;i++){
		let new_li = document.createElement('li');
		let new_li_content_div = document.createElement('div');
		new_li_content_div.textContent = jsonObj[i].Name;
		if (jsonObj[i].Type == 'file') { 
			new_li_content_div.textContent += ' (File: ' + jsonObj[i].Size + 'B)';
		}
		if (jsonObj[i].Type == 'folder' && jsonObj[i].isEmpty == 'true') { 
			new_li_content_div.textContent += ' (Empty Folder)';
		}
		else{new_li_content_div.textContent += ' (Not empty Folder)';}
		new_li_content_div.addEventListener("click",function(){
			if (jsonObj[i].Type == 'folder') {
				content_div.innerHTML = '';
				showFolder(curdir + '/' + jsonObj[i].Name);
			}
			else {window.location.href = curdir + '/' + jsonObj[i].Name;}
		}
		)
		new_li.appendChild(new_li_content_div);
		if (jsonObj[i].Type == 'folder' && jsonObj[i].isEmpty == 'true'){
			let new_li_delete_button = document.createElement('button');
			new_li_delete_button.textContent = 'Удалить';
			new_li_delete_button.addEventListener("click",function(){
				content_div.innerHTML = '';
				sendrequest(curdir+'?deletedir='+jsonObj[i].Name);
				showFolder(curdir);
				}
			)
			new_li.appendChild(new_li_delete_button);
		}		
		list_ul.appendChild(new_li);		
	}
	content_div.appendChild(list_ul);
	let create_folder_div = document.createElement('div');
	create_folder_div.id = 'create_folder_div';
	create_folder_div.textContent = '';
	let create_folder_div_input = document.createElement('input');
	create_folder_div_input.placeholder = 'Имя';
	create_folder_div.appendChild(create_folder_div_input);
	let create_folder_div_button = document.createElement('button');
	create_folder_div_button.textContent = 'Создать папку';
	create_folder_div.appendChild(create_folder_div_button);
	create_folder_div_button.addEventListener("click",function(){
		content_div.innerHTML = '';
		sendrequest(curdir+'?createdir='+create_folder_div_input.value);
		showFolder(curdir);
		}
	)
	content_div.appendChild(create_folder_div);
	if (curdir == '/Folder') return; 
	let back_li = document.createElement('button');
	back_li.textContent = 'Назад';
	back_li.addEventListener("click",function(){
		content_div.innerHTML = '';
		let temp = curdir.split('/');
		let new_request = '';
		for (let i=1;i<temp.length - 1;i++){
			new_request += '/' + temp[i];
		}
		showFolder(new_request);			
		}
	)
	list_ul.appendChild(back_li);
}

showFolder('/Folder');