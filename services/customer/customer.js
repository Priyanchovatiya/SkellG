
const ObjectId = require("mongodb").ObjectID;
import dbService from "../../utilities/dbService";
import {
  encryptpassword,
  decryptPassword,
  generateJwtTokenFn,
} from "../../utilities/universal";
const multer = require('multer');
import fs from 'fs';


/*************************** addCustomer ***************************/

export const addCustomer = async (req) => {
  console.log("req service =>", req.body);
  const { email, password } = req.body;
  console.log("email =>", email);
  
  //password validation function
  const validatePassword = (password) => {
    const minLength = 8;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{3,}$/;
    if (password.length < minLength) {
      return { valid: false, message: `Password must be at least ${minLength} characters long.` };
    }

    if (!passwordRegex.test(password)) {
      return { valid: false, message: 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.' };
    }
    return { valid: true, message: 'Password is valid.' };
  }
  

  // Validate the password
  const validation = validatePassword(password);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  let customerData = await dbService.findOneRecord("customerModel", {
    email: email,
  });
  console.log("customerData =>", customerData);
  if (customerData) {
    throw new Error("Email Address Already Exists!");
  } else {
    console.log("req.body.password =>", req.body.password);
    let password = await encryptpassword(req.body.password);
    console.log("encryptpassword  password =>", password);
    console.log("still we have req.body.password =>", req.body.password);
    req.body.password = password;
    console.log("after we have req.body.password =>", req.body.password);
    //let project = await customerModel.saveQuery(req.body);
    let project = await dbService.createOneRecord("customerModel", req.body);
    console.log("project data =>", project);

    return project;
  }
};


/*************************** LogInCustomer ***************************/

export const onLogin = async (req, res, next) => {

  const payload = req.body;
  console.log("payload==>", payload);
  let userData = await dbService.findOneRecord("customerModel", {
    email: payload.email.toLowerCase(),
    isDeleted: false
  });
  console.log("userData==>", userData);
  if (!userData) throw new Error("Email not exists");
  console.log("userData.password==>", userData.password);
  let match = await decryptPassword(payload.password, userData.password);

  if (!match) throw new Error("Password Invalid");
  if (userData.isMailVerified == false) throw new Error("Please verify email");

  if (userData?.loginToken) {
    if (userData?.loginToken?.length >= 5) {
      let rr = await dbService.findOneAndUpdateRecord(
        "customerModel",
        { _id: userData._id },
        {
          $pop: { loginToken: -1 },
        },
        { new: true }
      );
    }
  }

  let token = await generateJwtTokenFn({ userId: userData._id });
  let updateData = {
    $push: {
      loginToken: {
        token: token,
      },
    },
    lastLoginDate: Date.now(),
  };
  let data = await dbService.findOneAndUpdateRecord(
    "customerModel",
    { _id: userData._id },
    updateData,
    { new: true }
  );

  // res.setHeader("Access-Control-Expose-Headers", "token");
  // res.setHeader("token", data.loginToken[data.loginToken.length - 1].token);

  return {
    email: data.email,
    lastLogin: data.lastLoginDate,
    token: token,
  };


};

/*************************** getCustomer ***************************/

export const getCustomer = async (entry) => {

  console.log("entry=>", entry);
  let { user: { userId }, } = entry
  console.log("userId=>", userId);

  let customerData = await dbService.findAllRecords("customerModel", {
    _id: userId,
  });
  return customerData;
}


/*************************** imageImport ***************************/
export const importImage = async (entry) => {

}



/*************************** FileUploadStorage ***************************/
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    const jobType = req.body.jobType;
    console.log("djnfbmdsm", req.body.jobType)
    const dir = `uploads/${jobType}/`;
    fs.mkdirSync(dir, { recursive: true });  // Ensure the directory exists
    cb(null, dir);
  },
  // destination: function (req, file, cb) {
  //   cb(null, 'uploads/')
  // },
  filename: function (req, file, cb) {

    cb(null, file.originalname)
  }
});

export const upload = multer({ storage: storage });