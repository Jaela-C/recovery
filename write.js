var MongoClient = require("mongodb").MongoClient;

const urlMongoDb =
  "mongodb+srv://sales_prod:W9Xjd5cPrbZADHP9z6SMFpJ2q3aR8rb3@msuserscluster0-vvmvg.mongodb.net/<dbname>?retryWrites=true&w=majority";

const fs = require("fs");

fs.readFile("./genericUsers.json", "utf8", async (error, data) => {
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

  users = users.map((user, index) => {
    const currentLead = leads.find((lead) => lead.phone === user.phone);

    return { ...user, leadPersonId: currentLead["_id"].toString() };
  });

  //write updated users
  fs.writeFile(
    "./updated-users.json",

    JSON.stringify(users),

    function (err) {
      if (err) {
        console.error("Crap happens");
      }
    }
  );
});
