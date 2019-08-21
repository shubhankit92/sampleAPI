var mongoose       = require('mongoose');
const Orders = require('./models/Orders');
const Account = require('./models/Account');
const Inventory = require('./models/Inventory');
const crypto = require('crypto');
const _ = require('underscore');
const algorithm = 'aes-256-ctr';
const config = require('../config/config.json');
const secretKey = config && config.secret || 'vedantu';

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,secretKey)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,secretKey)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

function invalidUser(req, res) {
  res.status(403);
  res.render('Invalid User...');
}

function errorCreatingRecords(req, res) {
  res.status(404);
  res.render('No accountId found...');
}

function invalidInventoryQuantity(req, res) {
  res.status(404).end('invalid Inventory Quantity...');
}
function getOrderList(result, res) {
	//Retrieve the order list
	if(result && result.accountId){
		Orders.find({
	  	accountId: result.accountId
	  },function (err, records) {
      if (err) {
        res.send(err);
      }
      res.json(records);
	  });
	}
	else {
		errorCreatingRecords(null, res);
	}
};

async function isInventoryQuantityValid(inventoryList){
	let isValid = true;
	//Start a session to avoid race condition.(only works for mongo replica settings)
	// const session = await Inventory.startSession();
  // session.startTransaction();
  // const opts = { session };
	for(let index in inventoryList){
		let inventoryId = inventoryList[index].inventoryId;
		let inventoryDetails = await Inventory.findOne({
			_id: inventoryId
		});
		if(inventoryList[index].quantity > inventoryDetails.quantity){
			isValid = false;
		}
	}
	if(isValid){
		for(let index in inventoryList){
			let inventoryId = inventoryList[index].inventoryId;
			let inventoryDetails = await Inventory.findOne({
				_id: inventoryId
			});
			await Inventory.findOneAndUpdate({
				_id: inventoryId
			}, {
				quantity: (inventoryDetails.quantity-inventoryList[index].quantity)
			});
		}
	}
	// Commit the session and close it
	// await session.commitTransaction();
  // session.endSession();
  // If error
  // await session.abortTransaction();
  // session.endSession();
	return isValid;
}

module.exports = function(app) {

	app.post('/create', async function(req, res) {
		try {
			let inventoryList = req.body.inventories;
			let token = req.headers.token;
			let email = decrypt(token);
			let accountDetails = await Account.findOne({
				email: email
			});
			if(!_.isEmpty(accountDetails)){
				//First check if the particular inventory id already exist
				let orderDetails = await Orders.findOne({
					accountId: accountDetails._id
				})
				if(!_.isEmpty(orderDetails)){
					//Update the inventory list wrt the current account id
					let validateInventory = await isInventoryQuantityValid(inventoryList)
					if(validateInventory){
						Orders.findOneAndUpdate({
							accountId: accountDetails._id
						}, {
							list: inventoryList
						}, function(err, createdResult){
							getOrderList(createdResult, res);
						})
					}
					else {
						invalidInventoryQuantity(req, res);
					}
				}
				else {
					//Else create a new one
					let validateInventory = await isInventoryQuantityValid(inventoryList)
					if(validateInventory){
						Orders.create({
							accountId: accountDetails._id,
							list: inventoryList
						}, function(err, createdResult){
							getOrderList(createdResult, res);
						})
					}
					else {
						invalidInventoryQuantity(req, res);
					}
				}
			}
			else {
				invalidUser(req, res);
			}
		} catch(err){
			console.log('Error: ', err);
			res.status(404);
		}
	});

	//To create a token wrt email
	app.post('/createToken', async function(req, res) {
		let email = req.body.email;
		res.json(encrypt(email));
	});

};
