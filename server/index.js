const db = require('./config/config');
const AdminServices =  require('./services/AdminServices.js');
const express = require('express');
const cors = require('cors')
const app = express();
app.use(cors());
app.use(express.json());

app.post('/login',(request,response)=>{
    const username = request.body.username;
    const password = request.body.password;

    db.query('SELECT Emp_id,first_name,last_name,username,password,role,flogin FROM employee where username = ? AND password = ?',
     [username,password],
     (error,result)=>{
        if(error){
            console.log(error);
            response.json({err:error, success:false});
        }
        else{
            if(result.length > 0){
                console.log(result);
                response.json({data:result, success:true});
            }
            else{
                response.json({success:false});
            }
        }
    });
});

app.post('/setPassword', (request,response)=>{

    const pass = request.body.pass;
    const flogin = request.body.flogin;
    const Emp_id = request.body.Emp_id;

    db.query('UPDATE employee SET password = ?, flogin = ? WHERE Emp_id = ? ',[pass,flogin,parseInt(Emp_id)],
    (error,result)=>{
        if(error){
            console.log(error);
            response.json({err:error, success:false});
        }
        else{
            response.json({success:true});
        }
    }); 
});

app.post('/addCompetencyArea', async (request,response)=>{
    const AreaName = request.body.AreaName;
    let out = await new AdminServices().addCompetencyAreas(AreaName);
    response.json({data:out}); 
});

app.get('/getCompetencyAreaNames', async (request,response)=>{
    let out = await new AdminServices().getAllCompetencyAreas();
    response.json({data:out}); 
});

app.get('/getRole', async (request, response)=>{
    let out = await new AdminServices().getAllRoles();
    response.json({data:out});    
});

app.post('/AddDescriptor', async (request,response)=>{
    const areaName = request.body.value;
    const desc = request.body.desc;
    const role = request.body.role;
    const track = request.body.track;
    const status = request.body.status;

    let out = await new AdminServices().addCompetencyDescriptor(areaName, desc, role, track, status);
    response.json({data:out});  
});

app.get('/getDescriptor', async (request,response)=>{
    let out = await new AdminServices().getAllCompetencyDescriptor();
    response.json({data:out});  
});

app.post('/getDescriptorByRole',(req,res)=>{
    const roleId = req.body.role;
    console.log(roleId);
    let ans = [];
    db.query('SELECT Desc_id,Description, Area_id, Role_id, Track, Status FROM competency_descriptor where role_id=?;',[parseInt(roleId)],(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            if(result.length > 0 ){       
               // console.log(result);
                res.json({data:result});
            
            }
            else{
                console.log('No data found!');
            }
        }
    });
})

app.post('/addRatings',async (request,response)=>{
    const ratingName = request.body.ratingName;
    const ratingDesc = request.body.ratingDesc;
  //  console.log(ratingName,ratingDesc);
    let out = await new AdminServices().addRating(ratingName, ratingDesc);
    response.json({data:out}); 
});

app.get('/getRatingDetails',async (request, response)=>{
    let out = await new AdminServices().getAllRating();
   // console.log(out);
    response.json({data:out}); 
});

app.post('/addReview',async (request,response)=>{  
    const reviewName = request.body.reviewName;
    const start = request.body.start;
    const end = request.body.end;
    let out = await new AdminServices().addReview(reviewName,start,end);
    response.json({data:out}); 
});

app.get('/getReview',async (request,response)=>{
    let out = await new AdminServices().getAllReview();
     response.json({data:out}); 
});

app.get('/getTemplateNames',async(request,response)=>{
    let out = await new AdminServices().getAllTemplateName();
     response.json({data:out}); 
});

app.post('/addTemplateName', async(request,response)=>{

    const tempName = request.body.tempName;
    let out = await new AdminServices().addTemplateName(tempName);
    response.json({data:out})
});

app.post('/addTemplate', async(request,response)=>{

    const tid = request.body.tid;
    const idArray = request.body.descId;
    const s = new Set(idArray)
    console.log(tid);
    console.log(s);
    let out = await new AdminServices().addTemplate(tid,s);
    response.json({data:out})
})

app.post('/assignTemplate',async (request,response)=>{
    const tempId = request.body.tempId;
    const reviewCId = request.body.reviewCId;
    const empId = request.body.empId;
    let out = await new AdminServices().addAssignTemp(tempId,reviewCId,empId);
    response.json({data:out}); 
});

app.get('/getEmpNames',(req,res)=>{
    db.query('SELECT Emp_id,first_name,last_name FROM Employee;',(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            if(result.length > 0 ){
                res.json({data:result});
            }
            else{
                console.log('No data found!');
            }
        }
    });
});

app.post('/getTemplateDescriptor',(req,res)=>{

    const temp_id = req.body.temp_id;
    db.query('Select AreaName,Description, ct.Desc_id from comp_temp ct, competency_descriptor cd, competency_area ca where ct.Desc_id = cd.Desc_id AND cd.Area_id = ca.Area_id AND Temp_id= ? ',[parseInt(temp_id)],(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            if(result.length > 0 ){
                res.json({data:result, success:true});
                console.log(result)
            }
            else{
                console.log('No data found!');
            }
        }
    });
})

app.get('/selfAssessment/getReview',async (request,response)=>{
    let out = await new AdminServices().getActiveReviewCycle();
    response.json({data:out}); 
});

app.post("/selfAssessment/getTemplate", async (request, response) => {
    const review_id = request.body.review_cycle_id;
    const emp_id = request.body.emp_id; 

    let out = await new AdminServices().getAllSelfAssessment(review_id, emp_id);
    response.json({data:out}); 
});

app.post("/selfAssessment/insert", async(request, response) => {
    const review_id = request.body.review_id;
    const emp_id = request.body.emp_id;
    const assessmentArr = request.body.assessmentArr;
    
    let out = await new AdminServices().addSelfAssessment(review_id, emp_id, assessmentArr);
    response.json({data:out});    
});

app.post("/leadAssessment/getTemplate", async (request, response) => {
    const review_id = request.body.review_cycle_id;
    const emp_id = request.body.emp_id;    
    
    let out = await new AdminServices().getAllLeadAssessment(review_id, emp_id);
    response.json({data:out});  
});

app.post("/leadAssessment/insert", async (request, response) => {
    const review_id = request.body.review_id;
    const emp_id = request.body.emp_id;
    const assessmentArr = request.body.assessmentArr;
    
    let out = await new AdminServices().addLeadAssessment(review_id, emp_id, assessmentArr);
    response.json({data:out}); 
});

app.post("/leadAssessment/getEmployee", (req, res) => {
    const leadName = req.body.leadName;
    const selectEmp = "SELECT emp_id, first_name FROM employee WHERE lead_name = ?;";
    db.query(selectEmp,[leadName], (err, result) => {
         if(result.length > 0){
            res.send(result);
        }
    })
});

app.listen(3001, ()=>{
    console.log(`Listening on port 3001`);
});