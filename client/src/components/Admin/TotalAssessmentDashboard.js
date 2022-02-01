import React from 'react';
import { useState , useEffect} from 'react';
import Axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import '../../assests/css/Preloader.css';

export default function TotalAssessmentDashboard() {
    const[change, setChange] = useState(false);

    const[reviewNames, setReviewNames] = useState([]);
    const [loading, setloading] = useState(undefined);
    const [completed, setcompleted] = useState(undefined);
  useEffect(() => {
    setTimeout(()=> {
    Axios.get('http://localhost:3001/getReview')
    .then(response =>{
        setReviewNames(response.data.data);

        setloading(true);
            setTimeout(() => {
                 setcompleted(true);
              }, 0);
        })
    }, 1500);
  }, [])

    const[TotalEmp, setTotalEmp] = useState([]);
    useEffect(() => {
      Axios.get('http://localhost:3001/getTotalEmployees')
      .then(response =>{
          console.log(response);
          setTotalEmp(response.data.data);
      })
    }, [])
  
    const[TotalSelfAssessment, setTotalSelfAssessment] = useState([]);
    const[reviewValue1,setReviewValue1] = useState("");
    useEffect(() => {
      if(change){
      Axios.post('http://localhost:3001/getTotalSelfAssessment', {reviewId : reviewValue1})
      .then(response =>{
          console.log(response);
          setTotalSelfAssessment(response.data.data);
          setChange(false);
      })
    } else {
      Axios.post('http://localhost:3001/getTotalSelfAssessment', {reviewId : reviewValue1})
      .then(response =>{
          console.log(response);
          setTotalSelfAssessment(response.data.data);
          setChange(false);
        })
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reviewValue1])
  
    const[TotalLead, setTotalLead] = useState([]);
    useEffect(() => {
      Axios.get('http://localhost:3001/getTotalLeads')
      .then(response =>{
          console.log(response);
          setTotalLead(response.data.data);
      })
    }, [])
  
    const[TotalLeadAssessment, setTotalLeadAssessment] = useState([]);
    useEffect(() => {
      if(change){
      Axios.post('http://localhost:3001/getTotalLeadAssessment',{reviewId : reviewValue1})
      .then(response =>{
          console.log(response);
          setTotalLeadAssessment(response.data.data);
          setChange(false);
      })
    } else {
      Axios.post('http://localhost:3001/getTotalLeadAssessment',{reviewId : reviewValue1})
      .then(response =>{
          console.log(response);
          setTotalLeadAssessment(response.data.data);
          setChange(false);
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }},[reviewValue1])

    return (
      <>
      {!completed ? (
        <>
          {!loading ? (
            <div className="spinner">
              <span>Loading...</span>
              <div className="half-spinner"></div>
            </div>
          ) : (
            <></>
        )}
        </>
      ) : (
        <div className="content">
          <center>
            <h1>Dashboard</h1>
            <h3>Total Assessments</h3>
  
        <div class="row">
             <div class="col-25">
                <label for="cycles">Select Review Cycle</label>                                
            </div>
            <div class="col-75">
            <select id="level" name="level" onChange={e=> { setChange(true);
                 // eslint-disable-next-line eqeqeq
                 if(e.target.value == 's')
                    setReviewValue1(0)
                 else
                  setReviewValue1(e.target.value)}}>
            <option value='s'>Select Review Cycle</option>
            {
                 reviewNames.map((value)=>{  
                    return(<option value={value.review_cycle_id}>{value.review_cycle_name}</option>)
                  })
            }                     
            </select>
            </div>
        </div> </center>  

        <center><h3>Self Assessment</h3></center>
        <div class="row">
          <div class="col-50">
            <Card sx={{ minWidth: 200 }}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Total Employees
                </Typography>
                <div class="col-25">
                  <Typography variant="h5" component="div">
                    {TotalEmp}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </div>
          <div class="col-50">
            <Card sx={{ minxWidth: 200 }}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Completed Assessment
                </Typography>
                <Typography variant="h5" component="div">
                  {Math.round(TotalSelfAssessment)}
                </Typography>        
              </CardContent>
            </Card>
          </div>
        </div>
        <center><h3>Lead Assessment</h3></center>
        <div class="row">
          <div class="col-50">
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Total Leads
              </Typography>
              <div class="col-25">
                <Typography variant="h5" component="div">
                  {TotalLead}
                </Typography> 
              </div>              
            </CardContent>
          </Card>
          </div>
          <div class="col-50">
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Completed Assessment
              </Typography>
              <Typography variant="h5" component="div">                
                {Math.round(TotalLeadAssessment)}
              </Typography> 
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
       )}
       </>  
     );
  
}
