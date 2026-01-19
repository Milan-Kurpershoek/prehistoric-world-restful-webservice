import express from "express";
import router from "./routes/prehistoricAnimalsRouter.js";
import mongoose from "mongoose";

const app = express();

try {
    await mongoose.connect("mongodb://127.0.0.1:27017/myapp");

    app.use(express.json());

    app.use(express.urlencoded({ extended: true }));

    app.use("/prehistoric-animals", router)

} catch (e) {
    app.use((req,res)=>{
        res.status(500).json({
            message:"Database is down"
        })
    })

}

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});