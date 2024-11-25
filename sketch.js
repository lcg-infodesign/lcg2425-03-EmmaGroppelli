let table;
let rivers = [];

function preload() {
  // Caricamento del dataset
  table = loadTable('Rivers in the world - Data.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(240);
  
  // Titolo
  textSize(16);
  fill(0);
  textAlign(CENTER);
  text('Rappresentazione dei Fiumi del Mondo', width / 2, 30);  // Posizione del titolo
  
  // Impostiamo un margine più grande
  let marginTop = 100; // Aumentato per distanziare meglio i fiumi
  
  // Creazione delle linee ondulate e salvataggio dati dei fiumi
  noFill();
  
  // Creazione di un array temporaneo per verificare i duplicati
  let namesSet = new Set();
  
  for (let i = 0; i < table.getRowCount(); i++) {
    let name = table.getString(i, 'name').toUpperCase(); // Trasforma il nome del fiume in maiuscolo
    let countries = table.getString(i, 'countries'); // Paesi attraversati dal fiume
    let length = table.getNum(i, 'length'); // Lunghezza
    let discharge = table.getNum(i, 'discharge'); // Portata
    let area = table.getNum(i, 'area'); // Area

    // Controlla se il fiume è già stato aggiunto
    if (namesSet.has(name)) {
      continue; // Salta l'aggiunta se il fiume è già presente
    }
    namesSet.add(name);

    // Posizionamento verticale di base (spaziatura tra i fiumi)
    let yBase = map(i, 0, table.getRowCount(), marginTop, height - 50);  // Partenza dopo il margine

    // Parametri delle onde
    let waveLength = map(length, 0, 7000, 50, width - 50);
    let amplitude = map(area, 0, 7050000, 5, 50); // Ampiezza basata sull'area
    let waveWidth = map(discharge, 0, 210000, 1, 20); // Spessore basato sulla portata

    // Calcolo del colore basato sulla lunghezza
    let colorValue;
    
    // Mappa la lunghezza per scegliere i colori tra i vari toni
    if (length < 1000) {
      colorValue = color('#c9d2ff'); // Cortissimi
    } else if (length < 2000) {
      colorValue = color('#89a7ff'); // Brevi
    } else if (length < 4000) {
      colorValue = color('#1b69d0'); // Lunghi
    } else if (length < 6000) {
      colorValue = color('#2153a2'); // Mediamente lunghi
    } else {
      colorValue = color('#1c2b4f'); // Super lunghi
    }

    stroke(colorValue);
    strokeWeight(waveWidth);

    // Disegno della linea ondulata e salvataggio punti
    let riverPoints = [];
    beginShape();
    for (let x = 0; x < width; x++) {
      let y = yBase + amplitude * sin((x / waveLength) * TWO_PI);
      vertex(x, y);
      riverPoints.push({ x: x, y: y });
    }
    endShape();
    rivers.push({ name: name, countries: countries, points: riverPoints, color: colorValue, thickness: waveWidth, amplitude: amplitude });
  }

  // Ordinamento dei fiumi in base all'ampiezza dell'onda (dal più grande al più piccolo)
  rivers.sort((a, b) => b.amplitude - a.amplitude);
}

function draw() {
  // Ridisegna lo sfondo per eliminare eventuali nomi fissi
  background(240);

  // Riprogetta il layout statico
  textSize(16);
  fill(0);
  textAlign(CENTER);
  text('Rappresentazione dei Fiumi del Mondo', width / 2, 30);  // Titolo fisso in cima

  // Ridisegna i fiumi
  for (let river of rivers) {
    stroke(river.color);
    strokeWeight(river.thickness);
    noFill();
    beginShape();
    for (let point of river.points) {
      vertex(point.x, point.y);
    }
    endShape();
  }

  // Controlla se il cursore è sopra un fiume
  for (let river of rivers) {
    for (let point of river.points) {
      if (dist(mouseX, mouseY, point.x, point.y) < river.thickness / 2) {
        // Usa il colore giallo (#edc000) per il testo
        fill(237, 192, 0); // Giallo (#edc000)
        textSize(24); // Font più grande
        textAlign(LEFT);
        text(river.name, mouseX + 10, mouseY - 10);

        // Mostra i paesi solo quando si passa sopra il fiume
        fill(0);  // Colore del testo (nero)
        textSize(18); // Testo più grande per i paesi
        text(river.countries, mouseX + 10, mouseY + 20);  // Mostra i paesi sopra il fiume
        return; // Interrompe il ciclo una volta trovato un fiume
      }
    }
  }
}

function windowResized() {
  // Rende la visualizzazione responsive, adattando la tela quando la finestra cambia dimensioni
  resizeCanvas(windowWidth, windowHeight);
}
