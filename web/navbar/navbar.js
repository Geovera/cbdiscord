function loadPage(href)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", href, false);
    xmlhttp.send();
    return xmlhttp.responseText;
}
const nav_placeholder = document.querySelector('nav-placeholder')
nav_placeholder.innerHTML = loadPage('/navbar/navbar.html')
const saved_user = localStorage.getItem('username');
if(saved_user){
    const bar_user_default = document.querySelector('bar-user a');
    const bar_user_dropdown = document.querySelector('bar-user .dropdown')
    const bar_user_name = bar_user_dropdown.querySelector('p');
    bar_user_default.style.display = "none";
    bar_user_dropdown.style.display = "";
    bar_user_name.innerText = saved_user;
}

function logOut(){
    console.log(document.cookie);
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++){   
        var spcook =  cookies[i].split("=");
        document.cookie = spcook[0] + "=;expires=Thu, 21 Sep 1979 00:00:01 UTC;";                                
    }
    localStorage.removeItem('username');
    location.reload();
}