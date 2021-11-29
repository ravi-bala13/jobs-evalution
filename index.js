const express = require("express");

const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const connect =  () =>{
    return mongoose.connect("mongodb://localhost:27017/jobs")
} 
// ********** schemas ************

const companySchema = new mongoose.Schema(
    {
        company_name : {type: String, required: true},
        city : {type: String, required: true},
        open_jobs: {type: Number, required: true}
    },
    {
        versionKey: false,
        timestamps: true
    }
)

const Company = mongoose.model("company", companySchema);

const skillSchema = new mongoose.Schema(
    {
        skill_name : {type: String, required: true}
    },
    {
        versionKey: false,
        timestamps: true
    }
)

const Skill = mongoose.model("skill", skillSchema);

const jobSchema = new mongoose.Schema(
    {
        job_name : {type: String, required: true},
        company_details: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "company",
            required: true,

        },
        skills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "skill",
                required: true,
    
            }
        ],
        notice_period : {type: Number, required: true},
        rating: {type: Number, required: true},
        type: {type: String, required: true}
    },
    {
        versionKey: false,
        timestamps: true
    }
)

const Job = mongoose.model("job", jobSchema);
// ***************** CRUD *************
app.post("/companys", async (req, res) => {
    
    try {
        const company = await Company.create(req.body);

        return res.status(200).send(company)
    } catch (e) {
        return res.status(500).json({message: e.message, status: "Failed"})
    }
    
})

app.get("/companys", async (req, res) => {
    
    try {
        const company = await Company.find().lean().exec();

        return res.status(200).send(company)
    } catch (e) {
        return res.status(500).json({message: e.message, status: "Failed"})
    }
    
})

app.get("/companys/:id", async (req, res) => {
    
    try {
        const company = await Company.findById(req.params.id).lean().exec();

        return res.status(200).send(company)
    } catch (e) {
        return res.status(500).json({message: e.message, status: "Failed"})
    }
    
})

app.post("/skills", async (req, res) => {
    
    try {
        const skill = await Skill.create(req.body);

        return res.status(200).send(skill)
    } catch (e) {
        return res.status(500).json({message: e.message, status: "Failed"})
    }
    
})

app.get("/skills", async (req, res) => {
    
    try {
        const skill = await Skill.find().lean().exec();

        return res.status(200).send(skill)
    } catch (e) {
        return res.status(500).json({message: e.message, status: "Failed"})
    }
    
})

app.post("/jobs", async (req, res) => {
    
    try {
        const job = await Job.create(req.body);

        return res.status(200).send(job)
    } catch (e) {
        return res.status(500).json({message: e.message, status: "Failed"})
    }
    
})

app.get("/jobs", async (req, res) => {
    
    try {
        const job = await Job.find().populate("company_details").populate({path:"skills", select:"skill_name"}).lean().exec();

        return res.status(200).send(job)
    } catch (e) {
        return res.status(500).json({message: e.message, status: "Failed"})
    }
    
})
//*****************queries */
app.get("/jobs/:notice_period", async (req, res) => {
    
    try {
        const job = await Job.find({notice_period: req.params.notice_period}).populate("company_details").populate({path:"skills", select:"skill_name"}).lean().exec();

        return res.status(200).send(job)
    } catch (e) {
        return res.status(500).json({message: e.message, status: "Failed"})
    }
    
})

app.get("/types/:type", async (req, res) => {
    console.log('req.params.type:', typeof(req.params.type))
    try {
        const job = await Job.find({type: "work from home"}).lean().exec();
        

        return res.status(200).send(job)
    } catch (e) {
        return res.status(500).json({message: e.message, status: "Failed"})
    }
    
})

app.get("/rating", async (req, res) => {
    
    try {
        const job = await Job.find().sort({rating: 1}).lean().exec();

        return res.status(200).send(job)
    } catch (e) {
        return res.status(500).json({message: e.message, status: "Failed"})
    }
    
})

app.get("/jobs/:city/:skill", async (req, res) => {
    
    try {
        const company = await Company.find({city: req.params.city}).lean().exec();

        // const job = await Job.find({company_details: company._id}).populate("company_details").populate({path:"skills", select:"skill_name"}).lean().exec();
        // const list = [];
        // company.foreach((each) => {
        //     list.push(each)
        // });
        let list = []
        for(let i = 0; i<company.length; i++){
            if(company[i].city == "trichy"){
                list.push(company[i]._id)
            }
        }
        
        console.log('typeof(company):', list)
        return res.status(200).send(company)
    } catch (e) {
        return res.status(500).json({message: e.message, status: "Failed"})
    }
    
})

//****************************** */
app.listen("2526", async() => {
    await connect();
    console.log("Hai friend i am listening port 2526")
})