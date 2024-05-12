const QuizModel = require('../models/quiz.model');
const objID = require('mongoose').Types.ObjectId;

module.exports.getCategories = async (req,res)=>{
    await QuizModel.collection.dropIndexes();
    const quiz = await QuizModel.find().select();
    res.status(200).json(quiz);
}

module.exports.getQuestions = async (req,res)=>{
    
}

module.exports.getQuestionsOf= async (req,res)=>{
    
}

module.exports.addCategory=async (req,res)=> {
    const {categoryName}=req.body
   
    try {
        const category= await  QuizModel.create({name:categoryName})
        res.status(201).json({category:category})
    } catch (err) {
        res.status(200).send(err.message);  
    }
}

module.exports.addQuestion=async (req,res)=> {
    console.log(req.body)
    try {
        const category = await QuizModel.findOne({ name: req.params.name});
        category.questions.push({ 
            text: req.body.text,
            choices: req.body.choices,
            answers: req.body.answers,
            info: req.body.info,
            timestamp: Date.now()
        });
        await category.save();
        res.send(req.body);
    } catch (err) {
        console.log(err.message);
    }
    
}

