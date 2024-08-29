import mongoose from "mongoose";

const AccountsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    accountNumber: { type: String },
    accountName: { type: String },
    accountType: { type: String },
    balance: { type: Number },
    parentAccount: { type: String },
    notes: { type: String },
    user: { type: String }

})

const accountModel = mongoose.model("accounts", AccountsSchema)

export default accountModel