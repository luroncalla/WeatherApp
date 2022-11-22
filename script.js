const wrapper = document.querySelector(".wrapper"),
      inputPart = wrapper.querySelector(".input-part"),
      infoTxt = inputPart.querySelector(".info-txt"),
      inputField = inputPart.querySelector("input"),
      locationBtn = inputPart.querySelector("button"),
      wIcon = document.querySelector(".weather-part img"),
      arrowBack = wrapper.querySelector("header i");

let api;


inputField.addEventListener("keyup", e => {
    if(e.key == "Enter" && inputField.value !=""){
        requestApi(inputField.value);
    }
});

// Location Device
locationBtn.addEventListener("click", () => {
    if(navigator.geolocation){ //Si el navegador soporta la api de geolocalización
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocalization");
    }
});


// Error
function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}


// Success
function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=22211faf3a6caeca0c4fb4fe5c46ce84`;
    fetchData();
}

// Llamada a la API
function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=22211faf3a6caeca0c4fb4fe5c46ce84`; 
    fetchData();
}


// Mostrar resultados
function fetchData(){
    infoTxt.innerText = "Getting Weather details...";
    infoTxt.classList.add("pending");
    //obtenemos una respuesta de la api y lo retornamos parseado como un objeto js
    //luego llamamos a la función weatherDetails y le pasamos el resultado de la api como parámetro
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}
function weatherDetails(info){
    infoTxt.classList.replace("pending", "error");
    if(info.cod == "404"){
        infoTxt.innerText = `${inputField.value} isn't a valid city name`
    }else{
        //obtenemos los valores de las propiedades requeridas de la info del objeto
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        // custom icons
        if(id==800){
            wIcon.src="icons/clear.svg";
        }else if(id >=200 && id <= 232){
            wIcon.src="icons/strom.svg";
        }else if(id >=600 && id <= 622){
            wIcon.src="icons/snow.svg";
        }else if(id >=701 && id <= 781){
            wIcon.src="icons/haze.svg";
        }else if(id >=801 && id <= 804){
            wIcon.src="icons/cloud.svg";
        }else if((id >=300 && id <= 321) || (id >= 500 && id<= 531)){
            wIcon.src="icons/rain.svg";
        }


       //le pasamos los valores a un elemento en particular del html
       wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
       wrapper.querySelector(".weather").innerText = capitalize(description);
       wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
       wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
       wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    //    Capitalize (first letter :) )
       function capitalize(word) {
        return word[0].toUpperCase() + word.slice(1);
      }
      
    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
    }
}
// Fin


// Volver
arrowBack.addEventListener("click", () =>{
    wrapper.classList.remove("active");
})
