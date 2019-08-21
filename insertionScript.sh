#!/usr/bin/env bash
mongo mongodb://localhost:27017/db <<EOF
db.accounts.insert([{
    _id: 1,
    email: "shubhankit@ymail.com"
},{
    _id: 2,
    email: "sshubhankit@ymail.com"
},{
    _id: 3,
    email: "shubhankit@gmail.com"
},{
    _id: 4,
    email: "ankit@ymail.com"
},{
    _id: 5,
    email: "shubh@ymail.com"
}])

db.inventories.insert([{
    name: "samsung galaxy",
    description: "Mobile Phone",
    quantity: 10
},{
    name: "samsung galaxy 3",
    description: "Mobile Phone",
    quantity: 100
},{
    name: "samsung galaxy 4",
    description: "Mobile Phone",
    quantity: 2
},{
    name: "samsung galaxy 5",
    description: "Mobile Phone",
    quantity: 6
},{
    name: "samsung galaxy 6",
    description: "Mobile Phone",
    quantity: 1000
}])
EOF