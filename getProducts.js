// Remove fs module and adapt the code for browser usage
import Papa from 'papaparse';

export async function getMedicines() {
  try {
    // Use fetch to get the CSV file (hosted via a local server or over HTTP)
    const response = await fetch('http://localhost:3000/data/medicineDetails.csv'); // Adjust URL accordingly
    const csvText = await response.text();

    // Use PapaParse to parse the CSV
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          // Results contain an array of objects
          const medicines = results.data;
          console.log(medicines); // Output the parsed data
          resolve(medicines);  // Return the data
        },
        error: function(error) {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching or parsing CSV:', error);
  }
}



// import fs from 'fs';
// import Papa from 'papaparse';

// export function getMedicines() {
// // Read the CSV file from the local filesystem
// fs.readFile('D:/study/theranova/data/medicineDetails.csv', 'utf8', (err, csvText) => {
//   if (err) {
//     console.error('Error reading file:', err);
//     return;
//   }
//   // Use PapaParse to parse the CSV
//   Papa.parse(csvText, {
//     header: true, // Use first row as header
//     skipEmptyLines: true,
//     complete: function(results) {
//       // Results contain an array of objects
//       const medicines = results.data;
//       console.log(medicines); // Output the parsed data
//       return medicines;
//     }
//   });
// });

// }

// getProducts();