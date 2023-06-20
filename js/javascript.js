let plot = (data) => { 
    const ctx = document.getElementById('myChart');
    const dataset = {
        labels: data.hourly.time, /* ETIQUETA DE DATOS */
        datasets: [{
            label: 'Temperatura semanal', /* ETIQUETA DEL GRÁFICO */
            data: data.hourly.temperature_2m, /* ARREGLO DE DATOS */
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };
    const config = {
        type: 'line',
        data: dataset,
    };
    const chart = new Chart(ctx, config);
}

let maxima = (data) =>{
    const maximaHTML = document.getElementById('maxima');
    let maxim = data['daily']['temperature_2m_max']
    let m = Math.max.apply(null, maxim);
    console.log(m);
    maximaHTML.textContent = m;
}

let plot2 = (data) => { 
    const ctx2 = document.getElementById('myChart2');
    const dataset = {
        labels: data.daily.time, /* ETIQUETA DE DATOS */
        datasets: [{
            label: 'Temperatura semanal', /* ETIQUETA DEL GRÁFICO */
            data: data.daily.temperature_2m_max, /* ARREGLO DE DATOS */
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };
    const config = {
        type: 'bar',
        data: dataset,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
      };
      
    const chart = new Chart(ctx2, config);
}

let loadInocar = () => { 
    let URL = 'http://localhost:8080/https://www.inocar.mil.ec/mareas/consultan.php';

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



let load = (data) => { 
    let URL = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,rain,cloudcover,windspeed_10m,winddirection_10m,windgusts_10m,soil_temperature_0cm,soil_moisture_1_3cm,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&start_date=2023-06-01&end_date=2023-06-10&timezone=auto';
        fetch( URL )
        .then(response => response.json())
        .then(data => {
           
            let timezone = data['timezone']
            let timezoneHTML = document.getElementById('timezone')
            timezoneHTML.textContent = timezone
            console.log(timezone);
            plot(data);
            plot2(data);
            maxima(data);
            loadInocar();
        })
        .catch(console.error);
            
}


(
    function () {
        let meteo = localStorage.getItem('meteo');
        if(meteo == null) {
            let URL = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,rain,cloudcover,windspeed_10m,winddirection_10m,windgusts_10m,soil_temperature_0cm,soil_moisture_1_3cm,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&start_date=2023-06-01&end_date=2023-06-10&timezone=auto';
                
            fetch(URL)
            .then(response => response.json())
            .then(data => {
                load(data)
        
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