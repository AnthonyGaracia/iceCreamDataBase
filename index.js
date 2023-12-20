const pg = require ('pg')
const client = new pg.Client('postgres://localhost/ice_crea')

const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.get('/', (req,res,next) =>{
    res.send("Hello world")
})
//all flavors
app.get('/api/flavors', async (req,res,next) => {
    try {
        const SQL = `
        SELECT * FROM flavors;
        `
        const response = await client.query(SQL)
        res.send(response.rows)
    } catch (error) {
        next(error)

    }
})
//single flavor
app.get('/api/flavors/:id' , async (req,res,next) => {
    try {
        console.log(req.params.id)
        const SQL = `
        SELECT * from flavors WHERE id=$1
        `
        const response = await client.query(SQL, [req.params.id])

        if(!response.rows.length){
            next({
                name: "id error",
                message: `food with ${req.params.id} not found`
            })
        }else{
            res.send(response.rows[0])
        }
        
    } catch (error) {
        next(error)
    }
})
//delete a flavor
app.delete('/api/food/:id', async(req,res,next) =>{
    try{
        const SQL =`
        DELETE FROM flavors WHERE id=$1
        `
        const response = await client.query(SQL, [req.params.id])
        res.sendStatus(204)

    }catch (error) {
        next(error)
    }
})

//error handler
app.use((error, req, res, next) => {
    res.status(500)
    res.send(error)
})

app.use('*', (req,res,next) =>{
    res.send("No such route exists")
})

const init = async() => {
   await client.connect()
   console.log("connected to database")
   const SQL =`
   DROP TABLE IF EXISTS flavors;
   CREATE TABLE flavors(
       id SERIAL PRIMARY KEY,
       name VARCHAR(20)
   );
   INSERT INTO flavors (name) VALUES ('Chocolate');
   INSERT INTO flavors (name) VALUES ('Vanilla');
   INSERT INTO flavors (name) VALUES ('Strawberry');
   INSERT INTO flavors (name) VALUES ('Rocky Road');
   INSERT INTO flavors (name) VALUES ('Coffee');
   INSERT INTO flavors (name) VALUES ('Pistachio');
   `
   await client.query(SQL)
   console.log("table created")

   const port = process.env. PORT || 3000;
   app.listen(port, () => {
    console.log(`listening on port ${port}`)
   })

}

init()