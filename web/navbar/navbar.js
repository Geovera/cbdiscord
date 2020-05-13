function loadPage(href)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", href, false);
    xmlhttp.send();
    return xmlhttp.responseText;
}
const nav_placeholder = document.querySelector('nav-placeholder')
nav_placeholder.innerHTML = loadPage('/navbar/navbar.html')
const bar_user = document.querySelector('bar-user a');
const saved_user = localStorage.getItem('username');
if(saved_user){
    bar_user.innerText = saved_user;
}
function testy(){
    console.log('asd')
}