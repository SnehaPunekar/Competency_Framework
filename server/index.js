const db = require('./config/config');
const AdminServices =  require('./services/AdminServices.js');
const LoginServices = require('./services/LoginServices.js');
const express = require('express');
const cors = require('cors')
const app = express();
app.use(cors());
app.use(express.json());

app.post('/login', async (request,response)=>{
    const username = request.body.username;
    const password = request.body.password;

    let out = await new LoginServices().getLoginDetail(username, password);
    response.json({data:out});     
});

app.post('/setPassword', async (request,response)=>{
    const pass = request.body.pass;
    const flogin = request.body.flogin;
    const Emp_id = request.body.Emp_id;

    let out = await new LoginServices().setPasswordDetail(pass, flogin, Emp_id);
    response.json({data:out});  
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

app.post('/getDescriptorByRole', async (request, response)=>{
    const roleId = request.body.role;
    let out = await new AdminServices().getAllDescriptorByRole(roleId);
    response.json({data:out}); 
});


app.post('/updateStatus', async (request, response)=>{
    const descriptorId = request.body.descId;
    const descriptorStatus = request.body.status;
    let out = await new AdminServices().changeStatusById(descriptorId, descriptorStatus);
    response.json({data:out}); 
});

app.post('/addRatings',async (request,response)=>{
    const ratingName = request.body.ratingName;
    const ratingDesc = request.body.ratingDesc;

    let out = await new AdminServices().addRating(ratingName, ratingDesc);
    response.json({data:out}); 
});

app.get('/getRatingDetails',async (request, response)=>{
    let out = await new AdminServices().getAllRating();
   
    response.json({data:out}); 
});

const checkIfDuplicate = async (reviewName)=>{
    return new Promise(function (resolve, reject){
        let c = db.query('select review_cycle_name from review_cycle where review_cycle_name = ?',[reviewName],(err,result)=>{
            if(err){
                console.log(err);
                return reject(err)
            }
            else{
                if(result.length === 0){   // When we receive empty array as a result 
                   return resolve(true); 
                }
                else{
                    return resolve(false);
                }
            }
        })
        return c;
    }
)}

app.post('/addReview',async (request,response)=>{  
    const reviewName = request.body.reviewName;
    const start = request.body.start;
    const end = request.body.end;
    const status = request.body.status;
    
    let flag = await checkIfDuplicate(reviewName);
    console.log(flag)
    if(flag === true){
        let out = await new AdminServices().addReview(reviewName,start,end,status);
        response.json({data:out}); 
    }
    else{
        response.json({flag:flag}); 
    } 
});

app.get('/getReview',async (request,response)=>{
    let out = await new AdminServices().getAllReview();
    response.json({data:out}); 
});

app.post('/updateReview',async (request,response)=>{
    const reviewId = request.body.reviewIdTemp;
    const status = request.body.statusTemp;

    let out = await new AdminServices().updateAllReview(reviewId, status);
    response.json({data:out}); 
});

app.get('/getTemplateNames',async(request,response)=>{
    let out = await new AdminServices().getAllTemplateName();
    response.json({data:out}); 
});

app.post('/getRoleName',async(request,response)=>{
    const temp_id = request.body.temp_id;

    let out = await new AdminServices().getRoleName(temp_id);
    response.json({data:out}); 
});

app.post('/addTemplateName', async(request,response)=>{
    const tempName = request.body.tempName;

    let out = await new AdminServices().addTemplateName(tempName);
    response.json({data:out})
});

app.post('/addTemplate', async(request,response)=>{
    const tid = request.body.tid;
    const roleid = request.body.roleid;
    const idArray = request.body.descId;
    const s = new Set(idArray)

    let out = await new AdminServices().addTemplate(tid, roleid, s);
    response.json({data:out})
})

app.post('/getEmpNames', async (request,response)=>{
    const roleId = request.body.roleId;
   // const reviewCId = request.body.reviewCId;
   
    let out = await new AdminServices().getAllEmpNames(roleId);
    response.json({data:out})
});

app.post('/assignTemplate',async (request,response)=>{
    const tempId = request.body.tempId;
    const reviewCId = request.body.reviewCId;
    const empId = request.body.empId;

    let out = await new AdminServices().addAssignTemp(tempId,reviewCId,empId);
    response.json({data:out}); 
});

app.post('/getEmpNamesByTemplate', async (request,response)=>{
    const reviewCId = request.body.reviewCId;

    let out = await new AdminServices().getEmpNamesByTemplate(reviewCId);
    response.json({data:out}); 
});

app.post('/getTemplateDescriptor', async (request,response)=>{
    const temp_id = request.body.temp_id;

    let out = await new AdminServices().getAllTemplateDescriptor(temp_id);
    response.json({data:out});
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
    const draft = request.body.draft;
    
    let out = await new AdminServices().addSelfAssessment(review_id, emp_id, assessmentArr, draft);
    response.json({data:out});    
});

app.post("/selfAssessment/viewTemplate", async (request, response) => {
    const review_id = request.body.review_cycle_id;
    const emp_id = request.body.emp_id; 

    let out = await new AdminServices().ViewAllSelfAssessment(review_id, emp_id);
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
    const lead_draft = request.body.lead_draft;

    let out = await new AdminServices().addLeadAssessment(review_id, emp_id, assessmentArr, lead_draft);
    response.json({data:out}); 
});

app.post("/leadAssessment/viewTemplate", async (request, response) => {
    const review_id = request.body.review_cycle_id;
    const emp_id = request.body.emp_id;    
    
    let out = await new AdminServices().ViewAllLeadAssessment(review_id, emp_id);
    response.json({data:out});  
});

app.post("/leadAssessment/getEmployee", async (request, response) => {
    const leadName = request.body.leadName;

    let out = await new AdminServices().getEmployee(leadName);
    response.json({data:out});     
});

app.post('/getCompetencyAreaRating', async (request, response)=>{
    const roleId = request.body.roleId;
    const reviewId = request.body.reviewId;

    let out = await new AdminServices().getRatingValue(roleId, reviewId);
    response.json({data:out}); 
})

app.post('/SelfAssessmentByRole', async (request, response)=>{
    const roleId = request.body.roleId;
    const reviewId = request.body.reviewId;
    let out = await new AdminServices().getSelfAssessmentByRole(roleId, reviewId);
    response.json({data:out}); 
})

app.post('/LeadAssessmentByRole', async (request, response)=>{
    const roleId = request.body.roleId;
    const reviewId = request.body.reviewId;
    let out = await new AdminServices().getLeadAssessmentByRole(roleId, reviewId);
    response.json({data:out}); 
})

app.get('/getTotalEmployees',async (request,response)=>{
    let out = await new AdminServices().getTotalEmployee();
    response.json({data:out}); 
});

app.post('/getTotalSelfAssessment',async (request,response)=>{
    const reviewId = request.body.reviewId;
    let out = await new AdminServices().getTotalSelfAssessment(reviewId);
    response.json({data:out});
});

app.get('/getTotalLeads',async (request,response)=>{
    let out = await new AdminServices().getTotalLead();
    response.json({data:out}); 
});

app.post('/getTotalLeadAssessment',async (request,response)=>{
    const reviewId = request.body.reviewId;
    let out = await new AdminServices().getTotalLeadAssessment(reviewId);
    response.json({data:out}); 
});

app.listen(3001, ()=>{
    console.log(`Listening on port 3001`);
});