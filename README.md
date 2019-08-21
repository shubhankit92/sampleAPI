# sampleAPI
### Create token 

POST localhost:3000/createToken
{
"email":"XXXXXXXXX"
}


### Create Order
POST  localhost:3000/create
Headers: 
token: "tokenValue from above"

{	
	"inventories": [
		{
			"inventoryId": "5d5d7ea2dbeb3af85f5be5e6", (objectID)
			"quantity": 1
		}
		]
}
