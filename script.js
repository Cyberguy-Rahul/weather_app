const user_dataTab=document.querySelector("[data-userweather]");
const search_dataTab=document.querySelector("[data-searchweather]");
const user_container=document.querySelector(".weathercontainer");
const grantlocation=document.querySelector(".grant-location-container");
const searchcontainer=document.querySelector(".search-form-container");
const loadingcontainer=document.querySelector(".loading-container ");
const userinfocontainer=document.querySelector(".user-info-container");
;


let currntTab=user_dataTab;
const clouds=document.querySelector(".cloud-data");


let Api_key="54e471876cad480695762cb940a10df1";

currntTab.classList.add("currnt-tab");
getfromsessionstorage();

function switchTab(clickTab){
    if(clickTab!=currntTab){
        currntTab.classList.remove("currnt-tab");
        currntTab=clickTab;
        currntTab.classList.add("currnt-tab");

        if(!searchcontainer.classList.contains("active")){
            userinfocontainer.classList.remove("active");
            grantlocation.classList.remove("active");
            searchcontainer.classList.add("active");
        }

        else{
            searchcontainer.classList.remove("active");
            userinfocontainer.classList.remove("active");

            getfromsessionstorage();

        }
    }


}

user_dataTab.addEventListener("click" , ()=>{
    switchTab(user_dataTab);
});

search_dataTab.addEventListener("click" , ()=>{
    switchTab(search_dataTab);
});

// // check id local cordinates are present or not 

function getfromsessionstorage(){
    const localcordinates=sessionStorage.getItem("user-cordinates");

    if(!localcordinates){
        grantlocation.classList.add("active");
    }
    else{
        const cordinates=JSON.parse(localcordinates);
        fetchuserinfo(cordinates);
    }
};

async function fetchuserinfo(cordinates){
    
    const {lat , lon}=cordinates;
    

grantlocation.classList.remove("active");

loadingcontainer.classList.add("active");

    try{
    const responce=await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${Api_key}&units=metric`
        );
        
    const data=await responce.json();
    loadingcontainer.classList.remove("active");
    userinfocontainer.classList.add("active");
    
    renderdinfo(data);
    }

    catch(err){
    loadingcontainer.classList.remove("active");

    }

};

function renderdinfo(weatherinfo){
    const cityname=document.querySelector("[data-city-name]");
    const countryicon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-description]");
    const weathericon=document.querySelector("[data-weather-icon]");
    const temperatur=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector(".humidity-data");
    const clouds=document.querySelector(".cloud-data");

    cityname.innerText=weatherinfo?.name;
    countryicon.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherinfo?.weather?.[0]?.description;
    weathericon.src=`https://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
    temperatur.innerText= Math.round(weatherinfo?.main?.temp)+"°C";
    
    windspeed.innerText=`${weatherinfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherinfo?.main?.humidity}%`;
    clouds.innerText=`${weatherinfo?.clouds?.all}%`;
    
}


function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else{
        console.log("geolocate not possible");
    }
}

function showPosition(position){
    const usercordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
   
 
    sessionStorage.setItem("user-cordinates" , JSON.stringify(usercordinates));
    fetchuserinfo(usercordinates);



}

const grantbtn=document.querySelector("[data-grant-btn]");

grantbtn.addEventListener("click" , getlocation);


const searchinput=document.querySelector("[data-search-input]")
searchcontainer.addEventListener("submit" , (e)=>{
    e.preventDefault();
    let cityname=searchinput.value;

    if(cityname==="") return;
    else fetchSearchWeatherinfo(cityname);

});

async function fetchSearchWeatherinfo(city){

    loadingcontainer.classList.add("active");
    grantlocation.classList.remove("active");
    userinfocontainer.classList.remove("active");
   

    try{
    const info=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Api_key}&units=metric`);
    const data=await info.json();
    
    loadingcontainer.classList.remove("active");
    userinfocontainer.classList.add("active");
    renderdinfo(data);
    }
    catch(err){

    }

}





