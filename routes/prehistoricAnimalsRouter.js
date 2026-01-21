import express from "express";
import PrehistoricAnimal from "../models/prehistoricAnimalModels.js";
import {faker} from "@faker-js/faker/locale/nl";

const router =express.Router()

router.use((req,res, next)=>{

    res.setHeader("Access-Control-Allow-Origin", "*");

    console.log("Check accept header");
    if(req.headers.accept === "application/json"){
        next();
    }else {
        if (req.method === "OPTIONS"){
            next();
        }else {
            res.status(406).json({message: "Webservice only supports json. Did you forget the Accept header?"})
        }
    }
})

router.post("/", async (req, res, next) => {

    if(req.body?.method && req.body.method === "SEED" ){

    const prehistoricAnimals = []
    await PrehistoricAnimal.deleteMany({})

    const amount = req.body?.amount ?? 0;

    for (let i = 0; i < amount; i++) {
        const prehistoricAnimal = PrehistoricAnimal({
            genus: faker.animal.petName(),
            era: faker.date.past(),
            family: faker.animal.crocodilia(),
        })
        prehistoricAnimal.save();

        prehistoricAnimals.push(prehistoricAnimal)
    }
        res.status(201).json(prehistoricAnimals)

    }else{
        next()
    }
})

router.options("/",(req,res)=>{
    res.header("Allow","GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Methods","GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
    res.status(204).send();
})

router.get("/", async (req, res) => {
    // Check Accept header

    const prehistoricAnimals = await PrehistoricAnimal.find({},'-family')

    if (prehistoricAnimals.length === 0){
        res.status(404).json({message: "Collection not found."})
    }else {

        const prehistoricAnimalsCollection = {
            items: prehistoricAnimals,
            _links: {
                self: {
                    href: process.env.BASE_URI
                },
                collection: {
                    href: process.env.BASE_URI
                }
            }
        }
        res.status(200).json(prehistoricAnimalsCollection);
    }
});

//Create
router.post("/", async (req, res) => {

    const prehistoricAnimal = PrehistoricAnimal({
        genus: req.body.genus,
        era: req.body.era,
        family: req.body.family,
    })

    if (!prehistoricAnimal.genus || !prehistoricAnimal.era || !prehistoricAnimal.family) {
        res.status(400).json({message: "All fields are required."})
    } else {
        await prehistoricAnimal.save()
        res.status(201).json(prehistoricAnimal)
    }
})

//Read
router.options("/:id",(req,res)=>{
    res.header("Allow","GET, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Methods","GET, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
    res.status(204).send();
})

router.get("/:id", async (req, res) => {
    const prehistoricAnimalId = req.params.id;

    try{
        const prehistoricAnimal = await PrehistoricAnimal.findById(prehistoricAnimalId);

        if (!prehistoricAnimal){
            res.status(404).json({message: "Resource not found."})
        }else{
            res.status(200).json(prehistoricAnimal)
        }

    }catch (e){
        res.status(404).json({message: "Resource not found."})
    }
})

//Update
router.put("/:id", async (req, res)=>{
    const prehistoricAnimalId = req.params.id;

    try{
        const updatePrehistoricAnimal = await PrehistoricAnimal.findByIdAndUpdate(prehistoricAnimalId,{
            genus:req.body.genus,
            era:req.body.era,
            family:req.body.family,
        },{
            new:true,
            runValidators:true
        })

        if (!updatePrehistoricAnimal){
            res.status(404).json({message: "Resource not found."})
        }else{
            res.status(200).json(updatePrehistoricAnimal)
        }

    }catch (e){
        res.status(400).json({message: "All fields are required."})
    }
})

//Delete
router.delete("/:id", async (req, res)=>{
    const prehistoricAnimalId = req.params.id;

    try{
        const deletePrehistoricAnimal = await PrehistoricAnimal.findByIdAndDelete(prehistoricAnimalId)
        if (deletePrehistoricAnimal ) {

            res.status(204).json({message: "Note deleted successfully"})
        } else { res.status(404).send()}

    }catch (e){
        res.status(404).send()
    }
})

export default router