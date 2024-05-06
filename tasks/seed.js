import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import { createUser } from "../data/users.js";
import { playlists, users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { addLike } from '../data/social.js';
const db = await dbConnection();
await db.dropDatabase();
    
const playlistCollection = await playlists();
const usersCollection = await users();

let bernard = await createUser("Bernard", "Vitale", "bvitale@stevens.com", "bvitale", "Password1!");
let joe = await createUser("Joe", "Trobiano", "jtrobian@stevens.com", "jtrobiano", "Password2!");
let cade = await createUser("Cade", "Cermak", "ccermak@stevens.com", "ccermak", "Password3!");
let melissa = await createUser("Melissa", "Atmaca", "matmaca@stevens.com", "matmaca", "Password4!");
let alvin = await createUser("Alvin", "Radoncic", "aradonc2@stevens.com", "aradoncic", "Password5!");
bernard = await usersCollection.find({username: "bvitale"}).project({password: 0}).toArray();
joe = await usersCollection.find({username: "jtrobiano"}).project({password: 0}).toArray();
cade = await  usersCollection.find({username: "ccermak"}).project({password: 0}).toArray();
melissa = await  usersCollection.find({username: "matmaca"}).project({password: 0}).toArray();
alvin = await usersCollection.find({username: "aradoncic"}).project({password: 0}).toArray();
bernard = bernard[0];
joe = joe[0];
cade = cade [0];
melissa = melissa[0];
alvin = alvin[0];

let newPlaylist = {
    userID: bernard._id.toString(),
    userName: bernard.username,
    title: 'Sadness',
    caption: "This is one of my favorite playlists. It contains all my favorite sad songs.",
    posted: true,
    tracks: ["2ckMlwtwPdQk3pjz128CI6","7cpCU3Denug5NGZsSpQl8v","5VWmMZCfJ4yVkJw9ZLFXej","3U4isOIWM3VvDubwSI3y7a","2bLqfJjuC5syrsgDsZfGmn","2XUxq1VOiB3KXIDCULji8A","1P5R9D8rslb3IcAXQEoIqR","0mh7eTsBmQj29bkgpQKoPj","0uWeFlsfgGofOpFd9VuzNp","3HMMhcOPHuCZAGPLhvqkC3","13PUJCvdTSCT1dn70tlGdm","4T9v4pCTlehkyxVHJZJWSK","53QF56cjZA9RTuuMZDrSA6","20p75WXHObYQcvc1ffp7ik","5A1u2GMvgMOMECWuYRBNc1","7utRJ4BeYx85khzP3lKoBX","4LloVtxNZpeh7q7xdi1DQc","1MksGqIztTT6M9R1ErKVs8","5hxrXwPN769VM5RxWkQjRm","5JDcQAztvZTIkrWoZihgvC","3ORfa5ilEthp2U0TRcv7kv","2LBhwMS0iYId8BWfNIiOuG","1vSQX9IioLU07yd8e7O18j"],
    likes: [],
    comments: [{_id: joe._id, comment: "This is sick.", author: joe.username, postDate: "4/28/2024 2:28:12 PM"}, 
               {_id: melissa._id, comment: "These type of songs are usually not my favorite, but I like this playlist.", author: melissa.username, postDate: "4/28/2024 5:06:14 PM"}
    ]
}



let insertInfo = await playlistCollection.insertOne(newPlaylist);
await addLike(joe._id.toString(), insertInfo.insertedId.toString());
await addLike(melissa._id.toString(), insertInfo.insertedId.toString());


let user = await usersCollection.findOneAndUpdate(
    { username: bernard.username},
    { $push: { createdPlaylists: insertInfo.insertedId.toString() } },
    { returnOriginal: false } 
);

newPlaylist = {
    userID: joe._id.toString(),
    userName: joe.username,
    title: 'PARTY PLAYLIST',
    caption: "This is one of my favorite playlists to play at parties!!!!!",
    posted: true,
    tracks: ["470oq4Gp1WAczVeuYri9ZU","6yjyAu1YQ9D2AqhEwjwVWU","6JG0qhINKVwiHxqN85j7RG","7CkhOFmxj4ODbVEmzxS7oj","3eMkNNMHtIWcRf4aXjl6QI","2DjxBxpUUVLoGNTcTQhkVT","4ZC8hXXqu2hPcDLw9QTdtQ","7pypjOgvF6cCXnHBfmrnC2","0KUTD1WbYvFSilvd2nDxDG","1Te8WIfLudxjHTr66BL0JK","3VA8T3rNy5V24AXxNK5u9E","0qt5f5EL92o8Snzopsv0en","2vzMWO0T008m86yDnXwkII","0puf9yIluy9W0vpMEUoAnN","0qo32JzZwNt6BXGkynH2jj"],
    likes: [],
    comments: [{_id: melissa._id, comment: "I will be 100% adding this to my Spotify!.", author: melissa.username, postDate: "4/29/2024 12:35:09 PM"}, 
               {_id: cade._id, comment: "Not really my kind of music not gonna lie.", author: cade.username, postDate: "4/29/2024 4:06:59 PM"}
    ]
}

insertInfo = await playlistCollection.insertOne(newPlaylist);
await addLike(melissa._id.toString(), insertInfo.insertedId.toString());
await addLike(alvin._id.toString(), insertInfo.insertedId.toString());
await addLike(bernard._id.toString(), insertInfo.insertedId.toString());

user = await usersCollection.findOneAndUpdate(
    { username: joe.username},
    { $push: { createdPlaylists: insertInfo.insertedId.toString() } },
    { returnOriginal: false } 
);

newPlaylist = {
    userID: alvin._id.toString(),
    userName: alvin.username,
    title: 'Laid Back Tracks',
    caption: "Some tracks to vibe to",
    posted: true,
    tracks: ["7cpCU3Denug5NGZsSpQl8v","2XUxq1VOiB3KXIDCULji8A","0mh7eTsBmQj29bkgpQKoPj","13PUJCvdTSCT1dn70tlGdm","5hxrXwPN769VM5RxWkQjRm","2ckMlwtwPdQk3pjz128CI6","2bLqfJjuC5syrsgDsZfGmn","1vSQX9IioLU07yd8e7O18j","4T9v4pCTlehkyxVHJZJWSK","1MksGqIztTT6M9R1ErKVs8"],
    likes: [],
    comments: [{_id: joe._id, comment: "Loving this!", author: joe.username, postDate: "4/30/2024 5:35:09 PM"}, 
               {_id: cade._id, comment: "Niceee!", author: cade.username, postDate: "4/30/2024 6:06:59 PM"}
    ]
}

insertInfo = await playlistCollection.insertOne(newPlaylist);
await addLike(joe._id.toString(), insertInfo.insertedId.toString());
await addLike(cade._id.toString(), insertInfo.insertedId.toString());

user = await usersCollection.findOneAndUpdate(
    { username: alvin.username},
    { $push: { createdPlaylists: insertInfo.insertedId.toString() } },
    { returnOriginal: false } 
);

newPlaylist = {
    userID: cade._id.toString(),
    userName: cade.username,
    title: 'Gym Playlist',
    caption: "Love listening to this in the gym",
    posted: true,
    tracks: ["470oq4Gp1WAczVeuYri9ZU","6yjyAu1YQ9D2AqhEwjwVWU","7pypjOgvF6cCXnHBfmrnC2","2lPACBENza3HRYBvQPOdWT","0KUTD1WbYvFSilvd2nDxDG","6ULwhgWVBtR6wcv4zaXkHv","0kYIsBXBR8bg8JN6xuqIDK","3odPjdX1SjxxjIr0EZjEht","1MPLZW7bMiS0vLdFaaVytb","5lBUY5BqQfbNCaMWkVfwpH","5CsDo9j3N4yFZNCN1h9loS","3eMkNNMHtIWcRf4aXjl6QI","7CkhOFmxj4ODbVEmzxS7oj","1N5BQbp8mCUB3W2tEfCdfT","2DjxBxpUUVLoGNTcTQhkVT","3FsRrAXaYIZgLAzmfpJ3QA"],
    likes: [],
    comments: []
}

insertInfo = await playlistCollection.insertOne(newPlaylist);
await addLike(melissa._id.toString(), insertInfo.insertedId.toString());
await addLike(alvin._id.toString(), insertInfo.insertedId.toString());

user = await usersCollection.findOneAndUpdate(
    { username: cade.username},
    { $push: { createdPlaylists: insertInfo.insertedId.toString() } },
    { returnOriginal: false } 
);

newPlaylist = {
    userID: melissa._id.toString(),
    userName: melissa.username,
    title: 'My Study Jams',
    caption: "Love listening to this in the gym",
    posted: true,
    tracks: ["1MksGqIztTT6M9R1ErKVs8","6qNQcYitWE3mY2WDaTv6Kc","7vcuTZAFyu0Z5dgMRLR0h0","3ORfa5ilEthp2U0TRcv7kv","2XUxq1VOiB3KXIDCULji8A","5hxrXwPN769VM5RxWkQjRm","7cpCU3Denug5NGZsSpQl8v","3Otjx9ULpmWdUbkDTYDXHc","13PUJCvdTSCT1dn70tlGdm","0mh7eTsBmQj29bkgpQKoPj"],
    likes: [],
    comments: [{_id: joe._id, comment: "Gonna use this!", author: joe.username, postDate: "5/1/2024 9:25:09 PM"}, 
    {_id: cade._id, comment: "Love most of this!", author: cade.username, postDate: "5/1/2024 11:16:59 PM"}]
}

insertInfo = await playlistCollection.insertOne(newPlaylist);
await addLike(cade._id.toString(), insertInfo.insertedId.toString());
await addLike(joe._id.toString(), insertInfo.insertedId.toString());

user = await usersCollection.findOneAndUpdate(
    { username: melissa.username},
    { $push: { createdPlaylists: insertInfo.insertedId.toString() } },
    { returnOriginal: false } 
);

newPlaylist = {
    userID: bernard._id.toString(),
    userName: bernard.username,
    title: 'Pregame Songs',
    caption: "This playlist gets me hyped up for games",
    posted: true,
    tracks: ["7pypjOgvF6cCXnHBfmrnC2","5fyIGoaaKelzdyW8ELhYJZ","6yjyAu1YQ9D2AqhEwjwVWU","0KUTD1WbYvFSilvd2nDxDG","7CkhOFmxj4ODbVEmzxS7oj","1Te8WIfLudxjHTr66BL0JK","1N5BQbp8mCUB3W2tEfCdfT","33zcmmElV1YbRZe57biUjg","2RiBogNRfulkNf7fVbPOrJ","5CsDo9j3N4yFZNCN1h9loS","3FsRrAXaYIZgLAzmfpJ3QA","5lBUY5BqQfbNCaMWkVfwpH","0MhKMVJ4ttIvi45tyrSsdR","4ZC8hXXqu2hPcDLw9QTdtQ","7MRyJPksH3G2cXHN8UKYzP","2DjxBxpUUVLoGNTcTQhkVT","2bJvI42r8EF3wxjOuDav4r","6H5TYO99H0twhaMrtAHjoK","52KvuGmgcgRdrLMXOtda0E"],
    likes: [],
    comments: [{_id: alvin._id, comment: "I could see this getting me hyped!", author: alvin.username, postDate: "5/2/2024 7:45:19 PM"}]
}

insertInfo = await playlistCollection.insertOne(newPlaylist);
await addLike(cade._id.toString(), insertInfo.insertedId.toString());
await addLike(joe._id.toString(), insertInfo.insertedId.toString());
await addLike(alvin._id.toString(), insertInfo.insertedId.toString());

user = await usersCollection.findOneAndUpdate(
    { username: bernard.username},
    { $push: { createdPlaylists: insertInfo.insertedId.toString() } },
    { returnOriginal: false } 
);


console.log('Done seeding database');

await closeConnection();