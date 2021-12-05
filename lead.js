var MongoClient = require('mongodb').MongoClient;

const urlMongoDb = 'mongodb+srv://sales_prod:W9Xjd5cPrbZADHP9z6SMFpJ2q3aR8rb3@msuserscluster0-vvmvg.mongodb.net/<dbname>?retryWrites=true&w=majority'

// Delete generic users

// const fs = require('fs');

// fs.readFile('./genericUsers.json', 'utf8', (error, data) => {
//     if(error){
//         console.log(error);
//         return;
//     }
//     var objectJSON = JSON.parse(data)
//     objectJSON.genericUsers.forEach(genericUser => {
//         MongoClient.connect(urlMongoDb, (err, client) => {
//             client.db('MSSalesVAProd').collection('LeadPerson').deleteOne({"email":`${genericUser.email}`});
//             // const data = client.db('MSSales').collection('LeadPerson').find({"email":`${genericUser.email}`});
//             // data.forEach(doc => {
//             //     console.log(genericUser.email + "--" + doc._id)
//             // })
//         })
//         console.log(genericUser.email)
//     });
// })

// Replace LeadPerson users

const fs = require('fs');

fs.readFile('./genericUsers.json', 'utf8', async (error, data) => {
    var objectJSON = JSON.parse(data);

    const fn = async (user) => {
        const client = await MongoClient.connect(urlMongoDb);

        const lead = await client
        .db("MSSalesVAProd")
        .collection("LeadPerson")
        .findOne({ email: `${user.email}` });

        return lead;
    };

    const promises = objectJSON.genericUsers.map(fn);

    var leads = await Promise.all(promises);

    let line = await fs.promises.readFile("./users.json", "utf8");
    line = JSON.parse(line);

    let users = line.users;

    const replaceUsers = async (emailGeneric, emailUser, emailPhone) => {
        const client = await MongoClient.connect(urlMongoDb);

        client
        .db("MSSalesVAProd")
        .collection("LeadPerson")
        .replaceOne({"email":`${emailGeneric}`}, {"email":`${emailUser}`, "phone":`${emailPhone}`})

    };

    users = users.map((user, index) => {
        const currentLead = leads.find((lead) => lead.email === user.email);
        console.log(currentLead["email"], user.email);
        //replaceUsers(currentLead["email"].toString(), user.email.toString(), user.phone) --- en revisión
    });
})