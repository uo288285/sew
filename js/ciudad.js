class Ciudad {
    constructor(nombre, pais, gentilicio) {
        this.nombre = nombre;
        this.pais = pais;
        this.gentilicio = gentilicio;
        this.rellenarValores();
        this.datosCarrera = null;
        
    }

    rellenarValores() {
        this.cantidadPoblacion = 2075600;
        this.coordenadas = "3.1527826326283592, 101.6966140032153"; // lat, lon
    }

    darNombreCiudad() {
        return this.nombre;
    }

    darNombrePais() {
        return this.pais;
    }

    darInfo() {
        return `<li>El gentilicio es ${this.gentilicio}</li><li>La población es de ${this.cantidadPoblacion} habitantes</li>`;
    }

    darCoordenadas() {
        return this.coordenadas;
    }

    // Función que obtiene y muestra meteorología para las 15:00 hora Malasia
    getMeteorologiaCarrera() {
        const coords = this.coordenadas.split(",").map(Number);
        const lat = coords[0];
        const lon = coords[1];

        $.ajax({
            url: "https://archive-api.open-meteo.com/v1/archive",
            dataType: "json",
            data: {
                latitude: lat,
                longitude: lon,
                start_date: "2025-10-26",
                end_date: "2025-10-26",
                hourly: "temperature_2m,apparent_temperature,precipitation,relativehumidity_2m,windspeed_10m,winddirection_10m",
                daily: "sunrise,sunset",
                timezone: "Asia/Kuala_Lumpur"
            }
        }).done((data) => {
            this.procesarJSONCarrera(data);
        })
    }

    procesarJSONCarrera(datosJSON) {
        
        this.datosCarrera = {
            fecha: datosJSON.hourly.time[0].split("T")[0],
            hourly: [],
            daily: {}
        };

        // Filtrar la hora 15:00
        const indexHora1500 = datosJSON.hourly.time.findIndex(t => t.endsWith("15:00"));
        if (indexHora1500 === -1) {
            console.warn("No se encontró la hora 15:00 en los datos");
        } else {
            const f = {
                hora: datosJSON.hourly.time[indexHora1500],
                temperatura: datosJSON.hourly.temperature_2m[indexHora1500],
                sensacion_termica: datosJSON.hourly.apparent_temperature[indexHora1500],
                lluvia: datosJSON.hourly.precipitation[indexHora1500],
                humedad_relativa: datosJSON.hourly.relativehumidity_2m[indexHora1500],
                velocidad_viento: datosJSON.hourly.windspeed_10m[indexHora1500],
                direccion_viento: datosJSON.hourly.winddirection_10m[indexHora1500]
            };
            this.datosCarrera.hourly.push(f);
        }

        this.datosCarrera.daily = {
            salida_sol: datosJSON.daily.sunrise[0],
            puesta_sol: datosJSON.daily.sunset[0]
        };

        // Crear sección con jQuery
        const $section = $("<section></section>");
        const $h2 = $(`<h2>Datos meteorológicos en ${this.nombre} - Día de la carrera (15:00)</h2>`);
        $section.append($h2);

        // Datos diarios
        const $ulDiarios = $("<ul></ul>");
        $ulDiarios.append(`<li>Salida del sol: ${this.datosCarrera.daily.salida_sol.split("T")[1]}</li>`);
        $ulDiarios.append(`<li>Puesta del sol: ${this.datosCarrera.daily.puesta_sol.split("T")[1]}</li>`);
        $section.append($ulDiarios);

            const f = this.datosCarrera.hourly[0];
            const $ulHora = $("<ul></ul>");
            $ulHora.append(
                `<li>Hora: ${f.hora.split("T")[1]} | Temp: ${f.temperatura}°C | Sensación: ${f.sensacion_termica}°C | Lluvia: ${f.lluvia} mm | Humedad: ${f.humedad_relativa}% | Viento: ${f.velocidad_viento} km/h | Dir. viento: ${f.direccion_viento}°</li>`
            );
            $section.append($ulHora);
       
        const $main = $("main");
        $main.append($section);
    }



getMeteorologiaEntrenos() {
    const coords = this.coordenadas.split(",").map(Number);
    const lat = coords[0];
    const lon = coords[1];

    $.ajax({
        url: "https://archive-api.open-meteo.com/v1/archive",
        dataType: "json",
        data: {
            latitude: lat,
            longitude: lon,
            start_date: "2025-10-23",
            end_date: "2025-10-25",
            hourly: "temperature_2m,precipitation,relativehumidity_2m,windspeed_10m",
            timezone: "Asia/Kuala_Lumpur"
        }
    }).done((data) => {
        this.procesarJSONEntrenos(data);
    })
}



// Método que procesa los datos JSON de los entrenamientos
procesarJSONEntrenos(datosJSON) {
    const hourly = datosJSON.hourly;
    const tiempos = hourly.time;
    const fechas = {};

    // Recorremos todas las horas
    for (let i = 0; i < tiempos.length; i++) {
        const fecha = tiempos[i].split("T")[0];
        if (!fechas[fecha]) {
            fechas[fecha] = {
                temperatura: [],
                lluvia: [],
                viento: [],
                humedad: []
            };
        }

        fechas[fecha].temperatura.push(hourly.temperature_2m[i]);
        fechas[fecha].lluvia.push(hourly.precipitation[i]);
        fechas[fecha].viento.push(hourly.windspeed_10m[i]);
        fechas[fecha].humedad.push(hourly.relativehumidity_2m[i]);
    }

    // Calcular medias por día
    const medias = {};
    for (const dia in fechas) {
        const f = fechas[dia];
        medias[dia] = {
            temperatura_media: (f.temperatura.reduce((a, b) => a + b, 0) / f.temperatura.length).toFixed(2),
            lluvia_media: (f.lluvia.reduce((a, b) => a + b, 0) / f.lluvia.length).toFixed(2),
            viento_media: (f.viento.reduce((a, b) => a + b, 0) / f.viento.length).toFixed(2),
            humedad_media: (f.humedad.reduce((a, b) => a + b, 0) / f.humedad.length).toFixed(2)
        };
    }

    // Puedes guardar los resultados en la clase si lo necesitas:
    this.datosEntrenos = medias;
    this.mostrarMeteorologiaEntrenos();
}


mostrarMeteorologiaEntrenos() {
    const $main = $("main");
    

    const $section = $("<section></section>");
    const $h2 = $(`<h2>Datos meteorológicos de los entrenamientos en ${this.nombre}</h2>`);
    $section.append($h2);

    const $ul = $("<ul></ul>");

    for (const fecha in this.datosEntrenos) {
        const datos = this.datosEntrenos[fecha];
        const $li = $(`
            <li>
                ${fecha} → 
                Temperatura media: ${datos.temperatura_media}°C, 
                Lluvia media: ${datos.lluvia_media} mm, 
                Viento medio: ${datos.viento_media} km/h, 
                Humedad media: ${datos.humedad_media}%
            </li>
        `);
        $ul.append($li);
    }
    $section.append($ul);
    $main.append($section);
}


}
