import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

//Initialize a GraphQL Schema 
let schema = buildSchema(`
    type Query {
        user(id: Int!): Person
        users(shark: String): [Person]
    },
    type Person {
        id: Int
        name: String
        age: Int
        shark: String
    }
    type Mutation {
      updateUser(id: Int!, name: String!, age: String): Person
    }
`);

var users = [
    {
      id: 1,
      name: 'Brian',
      age: '21',
      shark: 'Great White Shark'
    },
    {
      id: 2,
      name: 'Kim',
      age: '22',
      shark: 'Whale Shark'
    },
    {
      id: 3,
      name: 'Faith',
      age: '23',
      shark: 'Hammerhead Shark'
    },
    {
      id: 4,
      name: 'Joseph',
      age: '23',
      shark: 'Tiger Shark'
    },
    {
      id: 5,
      name: 'Joy',
      age: '25',
      shark: 'Hammerhead Shark'
    }
  ];

// Return a single user (based on id)
var getUser = function(args) {
    var userID = args.id;
    return users.filter(user => user.id == userID)[0];
  }
  
  // Return a list of users (takes an optional shark parameter)
  var retrieveUsers = function(args) {
    if (args.shark) {
      var shark = args.shark;
      return users.filter(user => user.shark === shark);
    } else {
      return users;
    }
  }

  var updateUser = function({id, name, age}) {
    users.map(user => {
      if (user.id === id) {
        user.name = name;
        user.age = age;
        return user;
      }
    });
    return users.filter(user => user.id === id)[0];
  }

let root = {
    user: getUser,
    users: retrieveUsers,
    updateUser: updateUser
}

let app = express()
app.use('/graphql', graphqlHTTP({
    schema: schema, 
    rootValue: root,
    graphiql: true,
}))

app.listen(4000, ()=> console.log('Now Browse to localhost:4000/graphql'))