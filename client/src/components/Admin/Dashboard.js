import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState , useEffect} from 'react';
import Axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
//import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
//import { blue } from "@mui/material/colors";
import { PieChart, Pie } from "recharts";

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const data = [
  { name: "Completed", value: 7 },
  { name: "Saved as draft", value: 3 },
  { name: "not yet Performed", value: 2 }
];

const COLORS = ["#32CD32", "#FFBB28", "#DC143C"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Dashboard() {
  const[change, setChange] = useState(false);
  
  const[reviewNames, setReviewNames] = useState([]);
  useEffect(() => {
    Axios.get('http://localhost:3001/getReview')
    .then(response =>{
        setReviewNames(response.data.data);
    })
  }, [])

  const[roleNames, setRoleNames] = useState([]);
    useEffect(() => {
      Axios.get('http://localhost:3001/getRole')
      .then(response =>{
          setRoleNames(response.data.data);
      })
  }, [])

  const[roleValue, setRoleValue] = useState(0);
  const[reviewValue, setReviewValue] = useState(0);
  const[AreaRating, setAreaRating] = useState([]);
  useEffect(() => {
    if(change){
      Axios.post('http://localhost:3001/getCompetencyAreaRating',{
        roleId : roleValue,
        reviewId : reviewValue
      })
      .then(response =>{
          console.log(response.data);
          setAreaRating(response.data.data);
      });
      setChange(false);
    }else { 
      Axios.post('http://localhost:3001/getCompetencyAreaRating',{
        roleId : roleValue,
        reviewId : reviewValue
      })
      .then(response =>{
          setAreaRating(response.data.data);
      });
      setChange(false);
    }
  }, [roleValue, reviewValue])

  const[newRoleValue, setNewRoleValue] = useState(0);
  const[selfAssessmentData, setSelfAssessmentData] = useState([]);
  useEffect(() => {
    if(change){
      Axios.post('http://localhost:3001/SelfAssessmentByRole', {roleId : newRoleValue})
      .then(response =>{
          setSelfAssessmentData(response.data.data);
          setChange(false);
      })
    }else{
      Axios.post('http://localhost:3001/SelfAssessmentByRole', {roleId : newRoleValue})
      .then(response =>{
          setSelfAssessmentData(response.data.data);
          setChange(false);
      })
    }    
  }, [newRoleValue])

  const[leadAssessmentData, setLeadAssessmentData] = useState([]);
  useEffect(() => {
    if(change){
      Axios.post('http://localhost:3001/LeadAssessmentByRole', {roleId : newRoleValue})
      .then(response =>{
          setLeadAssessmentData(response.data.data);
          setChange(false);
      })
    }else{
      Axios.post('http://localhost:3001/LeadAssessmentByRole', {roleId : newRoleValue})
      .then(response =>{
          setLeadAssessmentData(response.data.data);
          setChange(false);
      })
    }    
  }, [newRoleValue])

  const[TotalEmp, setTotalEmp] = useState([]);
  useEffect(() => {
    Axios.get('http://localhost:3001/getTotalEmployees')
    .then(response =>{
        console.log(response);
        setTotalEmp(response.data.data);
    })
  }, [])

  const[TotalSelfAssessment, setTotalSelfAssessment] = useState([]);
  useEffect(() => {
    Axios.get('http://localhost:3001/getTotalSelfAssessment')
    .then(response =>{
        console.log(response);
        setTotalSelfAssessment(response.data.data);
    })
  }, [])

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
    Axios.get('http://localhost:3001/getTotalLeadAssessment')
    .then(response =>{
        console.log(response);
        setTotalLeadAssessment(response.data.data);
    })
  }, [])

  return (
    <div className="content">
      <center>
        <h1>Dashboard</h1>
        <h3>Average Rating</h3>
        <div class="row">
          <div class="col-25">
            <label for="cycles">Select Review Cycle</label>                                
          </div>
          <div class="col-75">
            <select id="level" name="level" onChange={e=> { setChange(true);
                if(e.target.value == 's')
                  setReviewValue(0)
                else
                  setReviewValue(e.target.value)}}>
              <option value='s'>Select Review Cycle</option>
                {
                  reviewNames.map((value)=>{  
                    return(<option value={value.review_cycle_id}>{value.review_cycle_name}</option>)
                  })
                }                     
            </select>
          </div>
          <div class="col-25">
            <label for="role">Select Role</label>  
          </div>
          <div class="col-75">
            <select id="roles" name="roles" onChange={ e=> {setChange(true);
                if(e.target.value == 's')
                  setRoleValue(0)
                else
                  setRoleValue(e.target.value)} }>
              <option value='s'>Select Role</option>
                {
                  roleNames.map((v)=>{  
                    return(<option value={v.role_id}>{v.role_name}</option>)
                  })
                }  
            </select>
          </div>
        </div><br/>
        <div class="row">
          <div class="col-70">
            <ResponsiveContainer width="70%" aspect={2}>
              <BarChart width={500} height={300} data={AreaRating}
                  margin={{
                      top: 5,
                      right: 10,
                      left: 10,
                      bottom: 5,
                  }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name"/>
                <YAxis />
                <Tooltip />
                <Legend />          
                <Bar dataKey="Emp" fill="#82ca9d"/>
                <Bar dataKey="Lead" fill="#8884d8"/>
              </BarChart>
            </ResponsiveContainer>        
          </div>
          <div class="col-20">
            <table>
              <tr><th>Rating </th><th>Value</th></tr>
              <tr><td>A</td><td>15 - 20</td></tr>
              <tr><td>B</td><td>10 - 15</td></tr>
              <tr><td>C</td><td>5 - 10</td></tr>
              <tr><td>I</td><td>0 - 5</td></tr>
            </table>
          </div>
          <div class="col-10"></div>
        </div><br/>
        <h3>Assessment based on Role</h3> 
        <div class="row">          
          <div class="col-25">
            <label for="role">Select Role</label>  
          </div>
          <div class="col-75">
            <select id="roles" name="roles" onChange={ e=> {setChange(true);
                if(e.target.value == 's')
                  setNewRoleValue(0)
                else
                  setNewRoleValue(e.target.value)} }>
              <option value='s'>Select Role</option>
                {
                  roleNames.map((v)=>{  
                    return(<option value={v.role_id}>{v.role_name}</option>)
                  })
                }  
            </select>
          </div>
        </div></center>    
        <div class="row">          
          <div class = "col-50">
            <h3 class = 'assessmentLable'>Self Assessment</h3>
            <PieChart width={400} height={400}>
              <Pie data={selfAssessmentData} cx={200} cy={200} labelLine={false} label={renderCustomizedLabel}
                outerRadius={120} fill="#8884d8" dataKey="value">
                {
                  data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))
                }
              </Pie>              
              <Legend />  
            </PieChart>
          </div>
          <div class = 'col-50'>
            <h3 class = 'assessmentLable'>Lead Assessment</h3>
            <PieChart width={400} height={400}>
              <Pie data={leadAssessmentData} cx={200} cy={200} labelLine={false} label={renderCustomizedLabel}
                outerRadius={120} fill="#8884d8" dataKey="value">
                {
                  data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))
                }
              </Pie>
              <Legend />  
            </PieChart>
          </div>
        </div>      
        <center><h3>Total Self Assessment</h3></center>
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
                {/* <div class="col-15">
                  <AutorenewRoundedIcon sx={{ position: 'absolute'}} sx={{ right: '20px' }} color="primary" sx={{ bgcolor: blue[200] }} fontSize="large" />       
                </div>     */}
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
                  {Math.round(TotalSelfAssessment)}%
                </Typography>        
              </CardContent>
            </Card>
          </div>
        </div>
        <center><h3>Total Lead Assessment</h3></center>
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
              {/* <div class="col-15">
                <AutorenewRoundedIcon  color="primary" sx={{ bgcolor: blue[200] }} fontSize="large" /> 
              </div>       */}
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
                {Math.round(TotalLeadAssessment)}%
              </Typography> 
              {/* <i class="cis-percent"></i> */}
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    );
}
