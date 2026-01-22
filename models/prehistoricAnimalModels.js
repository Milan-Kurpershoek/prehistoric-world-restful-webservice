import mongoose from "mongoose";

const prehistoricAnimalSchema = new mongoose.Schema({
        genus: { type: String, required: true },
        era: { type: String, required: true },
        family: { type: String, required: true },
        filename: { type: String, required: false },
        path: { type: String, required: false },
        size: { type: Number, required: false },


    },
    {
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret) => {
                ret._links = {
                    self: {
                        href: `${process.env.BASE_URI}${ret._id}`
                    },
                    collection: {
                        href: `${process.env.BASE_URI}`,
                    },
                };

                delete ret._id;
            },
        },
    }
);

const PrehistoricAnimal= mongoose.model("PrehistoricAnimal", prehistoricAnimalSchema);

export default PrehistoricAnimal;