import multer from 'multer';
import csvtojson from 'csvtojson';
import xlsx from 'xlsx';
import path from "path";
import { upload} from '../services/user/user';

const handleMultipartData = multer({ limits: { fileSize: 1000000 * 5 } }).single("csvFile"); // ==> name ("csvFile") will be same as name specify in swaggerui configuration

export const handleCsv = async (req, res, next) => {
    handleMultipartData(req, res, async (err) => {
        if (err) {
            res.json({ msgs: err.message });
        } else {
            const fileBuffer = req.file.buffer;

            if (!fileBuffer) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            // console.log('fileBuffer.toString()====>', fileBuffer.toString())

            // Convert CSV buffer to JSON
            csvtojson().fromString(fileBuffer.toString())
                .then(async (jsonArray) => {
                    // console.log('jsonArray====>', jsonArray);
                    let uniqueProducts = [];
                    let Name = [];

                    jsonArray.map((item) => {
                        // If the product name is not already in the Array, push it to the Array and push the product to the uniqueProducts array
                        const lowercaseName = item.Name.toLowerCase(); // Convert product name to lowercase
                        if (!Name.includes(lowercaseName)) {
                            Name.push(lowercaseName);
                            uniqueProducts.push(item);
                        }
                    });
                    // console.log('jsonArray====>', jsonArray);

                    uniqueProducts.map((e) => {
                        e.Email = parseFloat(e.Email);
                        e.Number = parseFloat(e.Number);
                    })
                    // console.log('uniqueProducts====>', uniqueProducts);

                    req.body = uniqueProducts;
                    // console.log('req.body====>', req.body);
                    // res.json(uniqueProducts);
                    next()
                })
                .catch((error) => {
                    res.status(500).json({ error: 'Error converting CSV to JSON' });
                });
        }
    });
};

/*************************** handle Excel File ***************************/

const handleMultipartData1 = multer({ limits: { fileSize: 1000000 * 5 } }).single("excelFile"); // ==> name ("csvFile") will be same as name specify in swaggerui configuration

export const handleExcel = async (req, res, next) => {
    handleMultipartData1(req, res, async (err) => {
        if (err) {
            res.json({ msgs: err.message });
        } else {
            
            const fileBuffer = req.file.buffer;
            console.log('file====>', req.file);
            var workbook = xlsx.readFile(req.file);
            console.log('workbook====>',workbook);
            let workbook_sheet = workbook.SheetNames; 
            console.log('workbook sheet====>',workbook_sheet);               
            let workbook_response = xlsx.utils.sheet_to_json(        
              workbook.Sheets[workbook_sheet[0]]
            );

            // console.log('fileBuffer.toString()====>', fileBuffer.toString())

            // Convert CSV buffer to JSON
            csvtojson().fromString(fileBuffer.toString())
                .then(async (jsonArray) => {
                    // console.log('jsonArray====>', jsonArray);
                    let uniqueProducts = [];
                    let Name = [];

                    jsonArray.map((item) => {
                        // If the product name is not already in the Array, push it to the Array and push the product to the uniqueProducts array
                        const lowercaseName = item.Name.toLowerCase(); // Convert product name to lowercase
                        if (!Name.includes(lowercaseName)) {
                            Name.push(lowercaseName);
                            uniqueProducts.push(item);
                        }
                    });
                    // console.log('jsonArray====>', jsonArray);

                    uniqueProducts.map((e) => {
                        e.Email = parseFloat(e.Email);
                        e.Number = parseFloat(e.Number);
                    })
                    // console.log('uniqueProducts====>', uniqueProducts);

                    req.body = uniqueProducts;
                    // console.log('req.body====>', req.body);
                    // res.json(uniqueProducts);
                    next()
                })
                .catch((error) => {
                    res.status(500).json({ error: 'Error converting CSV to JSON' });
                });
        }
    });
};











// const handleMultipartData1= upload.single("excelFile"); // ==> name ("excelFile") will be same as name specify in swaggerui configuration

// export const handleExcel = async (req, res, next) => {
//     try {
//         console.log("================", req);
//         const storage = multer.diskStorage({
//             destination: function (req, file, cb) {
//               cb(null, 'uploads/')
//             },
//             filename: function (req, file, cb) {
              
//               cb(null,file.originalname)
//             }
//           });
        
//          const upload = multer({ storage: storage});
//         upload.single("excelFile");
//       next()
//     } catch (error) {
//         console.log(error)
//     }
//     // handleMultipartData1(req, res, async (err) => {
//     //     if (err) {
//     //         res.json({ msgs: err.message });
//     //     } else {
         

//     //         const fileBuffer = req.file.buffer;


//     //         if (!fileBuffer) {
//     //             return res.status(400).json({ error: 'No file uploaded' });
//     //         }

//     //         const workbook = xlsx.readFile(`./uplodas/${req.file.originalname}`);
//     //         let workbook_sheet = workbook.SheetNames;                // Step 3
//     //         let workbook_response = xlsx.utils.sheet_to_json(        // Step 4
//     //           workbook.Sheets[workbook_sheet[0]]
//     //         );
//     //       console.log(workbook_response)
//     //         // console.log("path==================>", req.file);
//     //         // const jsonData = xlsx.utils.sheet_to_json(req.file );
//     //         // console.log("path==================>", jsonData);
//     //         // const sheetName = workbook.SheetNames[0];
//     //         // console.log("path==================>", sheetName);

           
//     //         // Convert Excel string to json
//     //         // conveter().fromString(excelDataString)
//     //         //     .then(async (jsonArray) => {
//     //         //         console.log('jsonArray====>', jsonArray);
//     //         //         let uniqueProducts = [];
//     //         //         let Name = [];

//     //         //         jsonArray.map((item) => {
//     //         //             // If the product name is not already in the Array, push it to the Array and push the product to the uniqueProducts array
//     //         //             const lowercaseName = item.Name.toLowerCase(); // Convert product name to lowercase
//     //         //             if (!Name.includes(lowercaseName)) {
//     //         //                 Name.push(lowercaseName);
//     //         //                 uniqueProducts.push(item);
//     //         //             }
//     //         //         });
//     //         //         // console.log('jsonArray====>', jsonArray);

//     //         //         uniqueProducts.map((e) => {
//     //         //             e.Email = parseFloat(e.Email);
//     //         //             e.Number = parseFloat(e.Number);
//     //         //         })
//     //         //         // console.log('uniqueProducts====>', uniqueProducts);

//     //         //         req.body = uniqueProducts;
//     //         //         // console.log('req.body====>', req.body);
//     //         //         // res.json(uniqueProducts);
//     //         //         next()
//     //         //     })
//     //         //     .catch((error) => {
//     //         //         res.status(500).json({ error: 'Error converting Excel to JSON' });
//     //         //     });
//     //     }
//     // });
// };
