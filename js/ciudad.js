class Ciudad {
  #coordenadas;
  #nombre;
  #gentilicio;
  #pais;
  #cantidadPoblacion;
  #datosCarrera;
  #datosEntrenos;
  #diaCarrera = "2025-10-26";
  #diaInicioEntrenos = "2025-10-23";
  #diaFinalEntrenos = "2025-10-25";

  constructor(nombre, pais, gentilicio) {
    this.#nombre = nombre;
    this.#pais = pais;
    this.#gentilicio = gentilicio;
    this.#rellenarValores();
  }

  #rellenarValores() {
    this.#cantidadPoblacion =
      "La ciudad tiene una población de alrededor de 2.075.600 habitantes";
    this.#coordenadas =
      " Un punto centrico de la ciudad es 3°09'00\"N 101°41'40\"E";
  }

  darNombreCiudad() {
    return this.#nombre;
  }

  darNombrePais() {
    return this.#pais;
  }

  darInfo() {
    return `<li>El gentilicio es ${
      this.#gentilicio
    }</li><li>La población es de ${this.#cantidadPoblacion} habitantes</li>`;
  }

  darCoordenadas() {
    return this.#coordenadas;
  }

  #getMeteorologiaCarrera() {
    const lat = 2.760753307114973;
    const lon = 101.7380794852975;

    return $.ajax({
      url: "https://archive-api.open-meteo.com/v1/archive",
      dataType: "json",
      data: {
        latitude: lat,
        longitude: lon,
        start_date: this.#diaCarrera,
        end_date: this.#diaCarrera,
        hourly:
          "temperature_2m,apparent_temperature,precipitation,relativehumidity_2m,windspeed_10m,winddirection_10m",
        daily: "sunrise,sunset",
        timezone: "Asia/Kuala_Lumpur",
      },
    }).then((data) => {
      return this.#procesarJSONCarrera(data);
    });
  }

  #procesarJSONCarrera(datosJSON) {
    this.#datosCarrera = {
      hourly: [],
      daily: {},
    };

    let indiceHoraCarrera = -1;
    for (let i = 0; i < datosJSON.hourly.time.length; i++) {
      if (datosJSON.hourly.time[i].endsWith("15:00")) {
        indiceHoraCarrera = i;
        break;
      }
    }

    const z = datosJSON.hourly;
    const a = {
      hora: z.time[indiceHoraCarrera].split("T")[1],
      temperatura: z.temperature_2m[indiceHoraCarrera],
      sensacion_termica: z.apparent_temperature[indiceHoraCarrera],
      lluvia: z.precipitation[indiceHoraCarrera],
      humedad_relativa: z.relativehumidity_2m[indiceHoraCarrera],
      velocidad_viento: z.windspeed_10m[indiceHoraCarrera],
      direccion_viento: z.winddirection_10m[indiceHoraCarrera],
    };
    this.#datosCarrera.hourly.push(a);

    this.#datosCarrera.daily = {
      salida_sol: datosJSON.daily.sunrise[0].split("T")[1],
      puesta_sol: datosJSON.daily.sunset[0].split("T")[1],
    };

    return this.#datosCarrera;
  }

  mostrarDatosCarrera() {
    const $section = $("<section></section>");
    const $h3 = $(
      `<h3>Datos meteorológicos en ${
        this.#nombre
      } - Día de la carrera (15:00)</h3>`
    );
    $section.append($h3);

    this.#getMeteorologiaCarrera().then((datosCarrera) => {
      this.#datosCarrera = datosCarrera;

      // Datos diarios
      const $ulDiarios = $("<ul></ul>");
      $ulDiarios.append(
        `<li>Salida del sol: ${this.#datosCarrera.daily.salida_sol}</li>`
      );
      $ulDiarios.append(
        `<li>Puesta del sol: ${this.#datosCarrera.daily.puesta_sol}</li>`
      );
      $section.append($ulDiarios);

      const datosHora = this.#datosCarrera.hourly[0];
      const $ulHora = $("<ul></ul>");
      $ulHora.append(
        `<li>Hora: ${datosHora.hora}</li> <li> Temp: ${datosHora.temperatura}°C </li> <li>Sensación: ${datosHora.sensacion_termica}°C </li><li> Lluvia: ${datosHora.lluvia} mm </li><li> Humedad: ${datosHora.humedad_relativa}% </li> <li>Viento: ${datosHora.velocidad_viento} km/h </li> <li>Dir. viento: ${datosHora.direccion_viento}°</li>`
      );
      $section.append($ulHora);

      const $main = $("main");
      $main.append($section);

      this.#mostrarMeteorologiaEntrenos();
    });
  }

  // Obtener meteorología de los entrenamientos
  #getMeteorologiaEntrenos() {
    const lat = 2.760753307114973;
    const lon = 101.7380794852975;

    return $.ajax({
      url: "https://archive-api.open-meteo.com/v1/archive",
      dataType: "json",
      data: {
        latitude: lat,
        longitude: lon,
        start_date: this.#diaInicioEntrenos,
        end_date: this.#diaFinalEntrenos,
        hourly:
          "temperature_2m,precipitation,relativehumidity_2m,windspeed_10m",
        timezone: "Asia/Kuala_Lumpur",
      },
    }).then((data) => {
      return this.#procesarJSONEntrenos(data);
    });
  }

  // Procesar datos de entrenamientos
  #procesarJSONEntrenos(datosJSON) {
    const datoHorario = datosJSON.hourly;
    const tiempos = datoHorario.time;

    this.#datosEntrenos = {}; // Objeto privado para almacenar los datos procesados

    // Recorremos todas las horas
    for (let i = 0; i < tiempos.length; i++) {
      const fecha = tiempos[i].split("T")[0];

      if (!this.#datosEntrenos[fecha]) {
        this.#datosEntrenos[fecha] = {
          temperatura: [],
          lluvia: [],
          viento: [],
          humedad: [],
        };
      }

      this.#datosEntrenos[fecha].temperatura.push(
        datoHorario.temperature_2m[i]
      );
      this.#datosEntrenos[fecha].lluvia.push(datoHorario.precipitation[i]);
      this.#datosEntrenos[fecha].viento.push(datoHorario.windspeed_10m[i]);
      this.#datosEntrenos[fecha].humedad.push(
        datoHorario.relativehumidity_2m[i]
      );
    }

    // Calcular medias por día
    for (const dia in this.#datosEntrenos) {
      const f = this.#datosEntrenos[dia];
      this.#datosEntrenos[dia] = {
        temperatura_media: (
          f.temperatura.reduce((a, b) => a + b, 0) / f.temperatura.length
        ).toFixed(2),
        lluvia_media: (
          f.lluvia.reduce((a, b) => a + b, 0) / f.lluvia.length
        ).toFixed(2),
        viento_media: (
          f.viento.reduce((a, b) => a + b, 0) / f.viento.length
        ).toFixed(2),
        humedad_media: (
          f.humedad.reduce((a, b) => a + b, 0) / f.humedad.length
        ).toFixed(2),
      };
    }

    return this.#datosEntrenos; // Retornamos los datos procesados
  }

  // Mostrar datos de entrenamientos
  #mostrarMeteorologiaEntrenos() {
    const $main = $("main");
    const $section = $("<section></section>");
    const $h3 = $(
      `<h3>Datos meteorológicos de los entrenamientos en ${this.#nombre}</h3>`
    );
    $section.append($h3);

    this.#getMeteorologiaEntrenos().then((datosEntrenos) => {
      this.#datosEntrenos = datosEntrenos;

      const $ul = $("<ul></ul>");

      for (const fecha in this.#datosEntrenos) {
        const datos = this.#datosEntrenos[fecha];
        $ul.append(`
      <li>
        ${fecha} → 
        Temperatura media: ${datos.temperatura_media}°C, 
        Lluvia media: ${datos.lluvia_media} mm, 
        Viento medio: ${datos.viento_media} km/h, 
        Humedad media: ${datos.humedad_media}%
      </li>
    `);
      }

      $section.append($ul);
      $main.append($section);
    });
  }
}

const ciudad = new Ciudad("Kuala Lumpur", "Malasia", "kualalumpurense");
const contenedor = document.createElement("section");

const h3 = document.createElement("h3");
h3.textContent = "Información de la ciudad";
contenedor.appendChild(h3);

const p1 = document.createElement("p");
p1.textContent = "Nombre: " + ciudad.darNombreCiudad();
contenedor.appendChild(p1);

const p2 = document.createElement("p");
p2.textContent = " País: " + ciudad.darNombrePais();
contenedor.appendChild(p2);

const h4 = document.createElement("h4");
h4.textContent = "Información adicional";
contenedor.appendChild(h4);

const p3 = document.createElement("p");
p3.textContent = ciudad.darCoordenadas();
contenedor.append(p3);

const ul = document.createElement("ul");
ul.innerHTML = ciudad.darInfo();
contenedor.append(ul);
const main = document.querySelector("main");
main.appendChild(contenedor);
ciudad.mostrarDatosCarrera();
