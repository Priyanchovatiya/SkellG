import { create } from "lodash";
import mongoose from "mongoose";

const customerSchema = mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    password: {type: String},
    loginToken: [
        {
            token: {
                type: String,
            },
        },
    ],
    isEnable: {type: Boolean , default: false},
    isDeleated: {type: Boolean , default: false},
    lastLoginDate: {type: Number},
    deletedAt: Number,
    isUpdated: Boolean,
    isMailVerified: {type: Boolean , default: false},
    createdAt: { type: Date, default:  Date()},
    updatedAt: { type: Date, default:  Date()}
});

export default mongoose.model("customer", customerSchema);