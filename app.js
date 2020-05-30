const customers = require("./db/customer");
const express = require("express");
const bodyParser = require("body-parser");
const Joi = require("joi");
const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 2000;
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello I am Customer crud..");
});

app.get("/customers", (req, res) => {
  res.send(customers);
});

app.get("/customers/:id", (req, res) => {
  let customer = customers.find((obj) => obj.id == req.params.id);
  if (!customer)
    return res.status(404).send("No customer with given id found!!");
  res.send(customer);
});

app.post("/customers", (req, res) => {
  const customer = { id: customers.length + 1, name: req.body.name };
  const { error } = validate(customer);
  if (error) return res.status(400).send(error.details[0].message);
  customers.push(customer);
  res.send(customer);
});

app.put("/customers/:id", (req, res) => {
  let customer = customers.find((obj) => obj.id == req.params.id);
  if (!customer)
    return res.status(404).send("No customer with given id found!!");
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  customer.name = req.body.name;
  res.send(customer);
});

app.delete("/customers/:id", (req, res) => {
  let customer = customers.find((obj) => obj.id == req.params.id);
  if (!customer)
    return res.status(404).send("No customer with given id found!!");
  let index = customers.indexOf(customer);
  customers.splice(index, 1);
  res.send(customer);
});

function validate(customer) {
  const schema = {
    id: Joi.number(),
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(customer, schema);
}
