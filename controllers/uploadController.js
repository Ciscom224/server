const UserModel = require("../models/user.model");
const objID = require('mongoose').Types.ObjectId;
const fs = require("fs");
const path = require("path");
const { uploadErrors } = require("../utils/errors.utils");

module.exports.uploadProfil = async (req, res) => {
    const { id } = req.params;
    const { image } = req.body;
    if (!objID.isValid(id))
        return res.status(400).send("ID inconnu : " + id);
    try {
   

        if (!image) {
            throw new Error("Aucune image trouvée dans la requête.");
        }

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(400).json({ message: "Utilisateur non trouvé." });
        }
        // Mise à jour du chemin de l'image dans le modèle d'utilisateur
        user.profilImage = image ;
        const updatedUser = await user.save();
        res.status(200).json({ user: updatedUser });
    } catch (error) {
        const errors = uploadErrors(error);
        res.status(400).json(error);
    }
};
