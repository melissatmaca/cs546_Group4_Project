import express from 'express';
let app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(3000, () =>{
    console.log("Server is running!");
    console.log('Your routes will be running on http://localhost:3000');
});