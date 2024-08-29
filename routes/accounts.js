import express, { request, response } from "express"
import bcrypt from "bcryptjs"

const router = express.Router(); // Create a router instance

//import accounts model file
const accountModel = (await import('../models/accounts.js')).default; // Destructure and await

router.get('/', async (request, response) => {
    const data = await accountModel.find();
    response.json(data);
});

router.get('/maxAccountNumber', async (request, response) => {
    const maxAccountNumber = await accountModel.aggregate([
        { $group: { _id: null, maxAccountNumber: { $max: "$accountNumber" } } }
    ]);

    response.json(maxAccountNumber[0].maxAccountNumber);
});

router.get('/list', async (request, response) => {
    try {
        const data = await accountModel.find();
        const options = data.map(account => ({
            label: account.accountName,
            value: account.accountName
        }));
        response.json(options);
    } catch (error) {
        response.status(500).json({ error: error });
    }
});

//get account data by accountname
router.get('/:accountNumber', async (request, response) => {
    const data = await accountModel.findOne({ accountNumber: request.params.accountNumber });
    response.json(data);
});

router.post('/', async (request, response) => {

    const { accountName } = request.body
    const finded = await accountModel.findOne({ accountName }) // search if name exist
    if (finded) return (response.json({ message: finded.accountName + ' Already Exist!' }))

    const newUser = new accountModel({
        _id: new global.db.Types.ObjectId(), // to generate a value for id
        // accountNumber: request.body.accountNumber,
        // accountName: request.body.accountName,
        // accountType: request.body.accountType,
        // balance: request.body.balance,
        // parentAccount: request.body.parentAccount,
        // notes: request.body.notes,
        // user: request.body.user,
         ...request.body, //to get all data from request.body
    })
    await newUser.save()
    response.json({ message: 'Saved!' })
})

router.put('/', async (request, response) => {
    try {
        const id = request.body._id;// get id for updated record

        const { accountNumber, accountName, accountType, balance, parentAccount, notes } = request.body;//get the new data
        const finded = await accountModel.findOne({ accountName }) // search if accountName exist
        //if (finded) return (response.json({ message: finded.name + ' Already Exist!' }))

        const updatedUser = await accountModel.findByIdAndUpdate(id, {
            accountNumber, accountName, accountType, balance, parentAccount, notes
        }, { new: true }); // Return the updated document

        if (!updatedUser) {
            response.json({ message: 'Account not found!' })
        }

        response.json({ message: 'Updated!' })

    } catch (err) {
        response.json({ message: 'Error updating account: ', err })
    }
});

router.delete('/:id', async (request, response) => {
    const { id } = request.params;
    const deletedItem = await accountModel.findByIdAndDelete(id);
    if (deletedItem) {
        response.status(200).json({ message: 'account deleted successfully' });
    } else {
        response.status(404).json({ message: 'account not found' });
    }
})

export default router;