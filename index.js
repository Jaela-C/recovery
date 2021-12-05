const { Client } = require('pg');

const msContractDevconfig = {
    user: 'postgres',
    password: 'xbIsAaZ0Nt156GOCscUf', 
    host: 'ironsales-db-dev.cqdhe0m9vw8h.us-east-1.rds.amazonaws.com',
    database: 'MS_contract', 
    port: 5432, 
}

const msUserDevelop = {
    user: 'postgres',
    password: 'xbIsAaZ0Nt156GOCscUf', 
    host: 'ironsales-db-dev.cqdhe0m9vw8h.us-east-1.rds.amazonaws.com',
    database: 'MS_user', 
    port: 5432,
}

const msUserProduction = {
    user: 'postgres',
    password: 'jCYR1OKTQN0DRxdkdRda', 
    host: 'ironsales-db-prod.cqdhe0m9vw8h.us-east-1.rds.amazonaws.com',
    database: 'MS_user', 
    port: 5432,
}

// ms contracts postgers prod
// Server=ironsales-db-prod.cqdhe0m9vw8h.us-east-1.rds.amazonaws.com;Port=5432;Database=MS_contract;User Id=postgres;Password=jCYR1OKTQN0DRxdkdRda;

// ms user develop
// Server=ironsales-db-dev.cqdhe0m9vw8h.us-east-1.rds.amazonaws.com;Port=5432;Database=MS_user;User Id=postgres;Password=xbIsAaZ0Nt156GOCscUf;

// ms user producción
// Server=ironsales-db-prod.cqdhe0m9vw8h.us-east-1.rds.amazonaws.com;Port=5432;Database=MS_user;User Id=postgres;Password=jCYR1OKTQN0DRxdkdRda;


// Reset user emails

const fs = require('fs');

fs.readFile('./users.json', 'utf8', (error, data) => {
    if(error){
        console.log(error);
        return;
    }
    var objectJSON = JSON.parse(data)
    objectJSON.users.forEach(user => {
        replaceEmail(String(user.phone), String(user.email)) 
        // replacePassword(String(user.identification), String(user.passwordHash))
    });
})

async function replaceEmail (phone, email) {
    const client = new Client(msUserProduction)
    await client.connect()
    const text = `SELECT phone, email FROM public.user where phone='${phone}'`
    const res = await client.query(text)
    const dataUser = res.rows
    dataUser.forEach(data => {
        async function replace (){
            const client = new Client(msUserProduction)
            await client.connect()
            const textReplace = `UPDATE public.user SET email = REPLACE('${data.email}', '${data.email}', '${email}') where phone='${phone}'`
            const res = await client.query(textReplace)
            console.log(res)
            await client.end()
        }
        replace()
    })
    await client.end()
} 

async function replacePassword (identification, password) {
    const client = new Client(msUserDevelop)
    await client.connect()
    const text = `SELECT identification, password FROM public.user where identification='${identification}'`
    const res = await client.query(text)
    const dataUser = res.rows
    dataUser.forEach(data => {
        async function replace (){
            const client = new Client(msUserDevelop)
            await client.connect()
            const textReplace = `UPDATE public.user SET email = REPLACE('${data.password}', '${data.password}', '${password}') where identification='${identification}'`
            const res = await client.query(textReplace)
            console.log(res)
            await client.end()
        }
        replace()
    })
    await client.end()
}
