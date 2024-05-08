module.exports.signUpErrors = (err) => {

    let errors = { surName: "", email: "", password: "" }
    if (err.message.includes("surName"))
        errors.surName = "Pseudo incorrect ou  deja pris";

    if (err.message.includes("email"))
        errors.email = "Email incorrect ";

    if (err.message.includes("password"))
        errors.email = "Le mot de passe doit faire 7 caracteres minimum ";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
        errors.email = "cet email existe deja";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("surName"))
        errors.surName = "cet pseudo existe deja";
    return errors;
}

module.exports.signInErrors = (err) => {

    const errors = { email: "", password: "" }
    if (err.message.includes("email"))
        errors.email = "Email inconrrect";

    if (err.message.includes("password"))
        errors.password = "Le mot de passe ne correspond pas"
    return errors;
}
module.exports.uploadErrors = (err) => {
    let errors = { format: "", maxSize: "" };

    if (err.message.includes("invalide file"))
        errors.format = "Format incompatible";

    if (err.message.includes("max size"))
        errors.masxize = "Le fichier depasse 500 KO";

    return errors;
}