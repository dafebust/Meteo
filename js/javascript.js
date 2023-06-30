//Data para identificar weather (en un futuro cartas con imágenes temperatura)
let weather_interpretation = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    80: 'Rain slight'
};

//Temperatura semanal de las lluvias
let plotmin = (data) => { 
    const ctx = document.getElementById('myChart2');
    const dataset = {
        labels: data.daily.time, /* ETIQUETA DE DATOS */
        datasets: [{
            label: 'Precipitaciones en la semana', /* ETIQUETA DEL GRÁFICO */
            data: data.daily.precipitation_sum, /* ARREGLO DE DATOS */
            fill: false,
            tension: 0.1,
            backgroundColor: 'rgba(54, 162, 235, 0.2)', // Color de fondo
            borderColor: 'rgba(54, 162, 235, 1)', // Color del borde
            borderWidth: 1,// Ancho del borde
        }]
    };
    const config = {
        type: 'bar',
        data: dataset,
    };
    const chart = new Chart(ctx, config);
}

//Temperatura semanal de temperaturas minimas vs maximas
let plotminvsmax = (data) => { 
    const ctx = document.getElementById('myChart');
    const dataset = {
        labels: data.daily.time, /* ETIQUETA DE DATOS */
        datasets: [{
            label: 'Temperatura semanal minima', /* ETIQUETA DEL GRÁFICO */
            data: data.daily.temperature_2m_min, /* ARREGLO DE DATOS */
            fill: false,
            tension: 0.5,
            backgroundColor: 'rgba(54, 162, 235, 0.2)', // Color de fondo
            borderColor: 'rgba(54, 162, 235, 1)', // Color del borde
            borderWidth: 1,// Ancho del borde
        },
        {
            label: 'Temperatura semanal maxima', /* ETIQUETA DEL GRÁFICO */
            data: data.daily.temperature_2m_max, /* ARREGLO DE DATOS */
            fill: false,
            tension: 0.5,
            backgroundColor: 'rgba(255, 159, 64, 1)', // Color de fondo
            borderColor: 'rgba(255, 159, 64, 1)', // Color del borde
            borderWidth: 1,// Ancho del borde
        }
    ]
    };
    const config = {
        type: 'line',
        data: dataset,
    };
    const chart = new Chart(ctx, config);
}

//Probabilidad de precipitaciones
let precipitaciones_probabilidad = (data)=>{
    const precipitaciones_probabilidadHTML = document.getElementById('precipitaciones_probabilidad');
    let arreglo= data['daily']['precipitation_probability_max']

    for (var i = 0; i < arreglo.length; i++) {

        var barra = document.createElement('div');
        barra.classList.add('progress', 'mb-4');
    
        var textoDia = document.createElement('h4');
        textoDia.classList.add('small', 'font-weight-bold');
        textoDia.innerText = 'Día: ' + i;
    
        barra.appendChild(textoDia);

        var barraInterna = document.createElement('div');
        barraInterna.classList.add('progress-bar');
        barraInterna.style.width = arreglo[i] + '%';
        barraInterna.setAttribute('aria-valuenow', arreglo[i]);
        barraInterna.setAttribute('aria-valuemin', '0');
        barraInterna.setAttribute('aria-valuemax', '100');
        barraInterna.innerText = arreglo[i] + '%';
        barra.appendChild(barraInterna);
        precipitaciones_probabilidadHTML.appendChild(barra);
  } 
}

//Gráfica para wind
let wind_table = (data) => { 
    const ctx = document.getElementById('wind_table');
    const dataset = {
        labels: data.daily.time, /* ETIQUETA DE DATOS */
        datasets: [{
            label: 'Viento en la semana', /* ETIQUETA DEL GRÁFICO */
            data: data.daily.windspeed_10m_max, /* ARREGLO DE DATOS */
            fill: false,
            tension: 0.1,
            backgroundColor: 'rgba(54, 162, 235, 0.2)', // Color de fondo
            borderColor: 'rgba(54, 162, 235, 1)', // Color del borde
            borderWidth: 1,// Ancho del borde
        }]
    };
    const config = {
        type: 'bar',
        data: dataset,
    };
    const chart = new Chart(ctx, config);
}

//Recogida de datos para sección current weather
let temperatura = (data) =>{
    const temperaturaHTML = document.getElementById('temperatura');
    let maxim = data['current_weather']['temperature']
    temperaturaHTML.textContent = maxim +' ' + data['daily_units']['temperature_2m_max'];
}

let windspeed = (data) =>{
    const windspeedHTML = document.getElementById('windspeed');
    let maxim = data['current_weather']['windspeed'] 
    windspeedHTML.textContent = maxim+' ' + data['daily_units']['windspeed_10m_max'];
}

let weathercode = (data) =>{
    const weathercodeHTML = document.getElementById('weathercode');
    let maxim = data['current_weather']['weathercode']
    let claves = Object.keys(weather_interpretation);
    for(let i=0; i< claves.length; i++){
        let clave = claves[i];
        if (clave == maxim){
            weathercodeHTML.textContent = weather_interpretation[maxim];
        }
      }
}

let current_time = (data) =>{
    const current_timeHTML = document.getElementById('current_time');
    let maxim = data['current_weather']['time']
    let fecha = maxim.split('T')
    current_timeHTML.textContent = fecha[1] + " " + fecha[0];
}

let timezone = (data) =>{
    let timezone = data['timezone']
    const timezoneHTML = document.getElementById('timezone')
    timezoneHTML.textContent = timezone
}

// Uso de servicio para cargar tabla inocar
let loadInocar = () => { 
    let URL = 'https://cors-anywhere.herokuapp.com/https://www.inocar.mil.ec/mareas/consultan.php';

    fetch(URL)
       .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "text/html");
        let contenedorMareas = xml.getElementsByClassName('container-fluid')[0];
        let contenedorHTML = document.getElementById('table-container');
        contenedorHTML.innerHTML = contenedorMareas.innerHTML;
        console.log(xml);
      })
      .catch(console.error);
 }


//Carga datos que van a ser llamados
let load = (data) => { 
    let URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.20&longitude=-79.89&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max&current_weather=true&start_date=2023-06-22&end_date=2023-06-29&timezone=auto';
        fetch( URL )
        .then(response => response.json())
        .then(data => {
            timezone(data);
            plotminvsmax(data);
            plotmin(data);
            temperatura(data);
            windspeed(data);
            weathercode(data);
            current_time(data);
            precipitaciones_probabilidad(data);
            wind_table(data);
            loadInocar();
        })
        .catch(console.error);
            
}

//Ejecuta y almacena en memoria local
(
    function () {
        let meteo = localStorage.getItem('meteo');
        if(meteo == null) {
            let URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.20&longitude=-79.89&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max&current_weather=true&start_date=2023-06-22&end_date=2023-06-29&timezone=auto';
            fetch(URL)
            .then(response => response.json())
            .then(data => {
                load(data)
                loadInocar();
                /* GUARDAR DATA EN MEMORIA */
                localStorage.setItem("meteo", JSON.stringify(data))
            })
            .catch(console.error);
          } else {
              /* CARGAR DATA EN MEMORIA */
              load(JSON.parse(meteo))
          }
 }
  )();