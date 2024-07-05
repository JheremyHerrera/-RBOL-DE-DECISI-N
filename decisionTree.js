const fs = require('fs');
const csv = require('csv-parser');
const DecisionTree = require('decision-tree');

// Función para leer el archivo CSV y convertirlo en un array de objetos
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' })) // Usar el separador ';' para columnas
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Función para entrenar y predecir con un árbol de decisión
async function trainAndPredict(filePath) {
  const data = await readCSV(filePath);

  // Asegurar que los datos se están leyendo correctamente
  console.log('Datos leídos del CSV:', data);

  // Separar los datos en características (features) y etiquetas (labels)
  const features = ['fecha de ingreso del vehículo', 'fecha de salida del vehículo', 'importe que pagó'];
  const className = 'proveedor'; // Ejemplo de clasificación por 'proveedor'

  const trainingData = data.map(row => ({
    proveedor: row['proveedor'],
    'fecha de ingreso del vehículo': row['fecha de ingreso del vehículo'],
    'fecha de salida del vehículo': row['fecha de salida del vehículo'],
    'importe que pagó': row['importe que pagó']
  }));

  // Crear y entrenar el árbol de decisión
  const dt = new DecisionTree(trainingData, className, features);

  // Ejemplo de datos de prueba (asegúrate de que el formato coincide)
  const testSample = {
    'fecha de ingreso del vehículo': '2023-07-01',
    'fecha de salida del vehículo': '2023-07-05',
    'importe que pagó': '100'
  };

  // Predecir la clase del ejemplo de datos de prueba
  const predictedClass = dt.predict(testSample);
  console.log(`La clase predicha para el ejemplo de datos de prueba es: ${predictedClass}`);
}

// Llamar a la función con la ruta del archivo CSV
trainAndPredict('ReportePCBienes202405.csv');
