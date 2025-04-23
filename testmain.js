const { sommeDurer }  = require('./routes/tache');

const services = [
    { durer: 30 },
    { durer: 45 },
    { durer: 60 },
];

console.log("Test sommeDurer :", sommeDurer(services));