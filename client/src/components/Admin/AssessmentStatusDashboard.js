import React from 'react';
import {  Cell, Legend } from 'recharts';
import { useState , useEffect} from 'react';
import Axios from 'axios';
import { PieChart, Pie } from "recharts";
import '../../assests/css/Preloader.css';

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
  
export default function AssessmentStatusDashboard(){
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


  const[roleNames, setRoleNames] = useState([]);
    useEffect(() => {
      Axios.get('http://localhost:3001/getRole')
      .then(response =>{
          setRoleNames(response.data.data);
      })
  }, [])

    const[newRoleValue, setNewRoleValue] = useState(0);
  const[selectedReviewCycleId,setSelectedReviewCycleId] = useState(0);
  const[selfAssessmentData, setSelfAssessmentData] = useState([]);
  useEffect(() => {
    if(change){
      Axios.post('http://localhost:3001/SelfAssessmentByRole', {roleId : newRoleValue, reviewId : selectedReviewCycleId })
      .then(response =>{
          setSelfAssessmentData(response.data.data);
          setChange(false);
      })
    }else{
      Axios.post('http://localhost:3001/SelfAssessmentByRole', {roleId : newRoleValue, reviewId : selectedReviewCycleId})
      .then(response =>{
          setSelfAssessmentData(response.data.data);
          setChange(false);
      })
    }    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRoleValue, selectedReviewCycleId])

  const[leadAssessmentData, setLeadAssessmentData] = useState([]);
  useEffect(() => {
    if(change){
      Axios.post('http://localhost:3001/LeadAssessmentByRole', {roleId : newRoleValue, reviewId : selectedReviewCycleId})
      .then(response =>{
          setLeadAssessmentData(response.data.data);
          setChange(false);
      })
    }else{
      Axios.post('http://localhost:3001/LeadAssessmentByRole', {roleId : newRoleValue, reviewId : selectedReviewCycleId})
      .then(response =>{
          setLeadAssessmentData(response.data.data);
          setChange(false);
      })
    }    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRoleValue, selectedReviewCycleId])

    return(
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
        <><div className="content">
             <center>
            <h1>Dashboard</h1>
            <h3>Assessment Status</h3>
            <div class="row">
                <div class="col-25">
                    <label for="cycles">Select Review Cycle</label>
                </div>
                <div class="col-75">
                    <select id="level" name="level" onChange={e => {
                        setChange(true);
                        // eslint-disable-next-line eqeqeq
                        if (e.target.value == 's')
                            setSelectedReviewCycleId(0);

                        else
                            setSelectedReviewCycleId(e.target.value);
                    } }>
                        <option value='s'>Select Review Cycle</option>
                        {reviewNames.map((value) => {
                            return (<option value={value.review_cycle_id}>{value.review_cycle_name}</option>);
                        })}
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-25">
                    <label for="role">Select Role</label>
                </div>
                <div class="col-75">
                    <select id="roles" name="roles" onChange={e => {
                        setChange(true);
                        // eslint-disable-next-line eqeqeq
                        if (e.target.value == 's')
                            setNewRoleValue(0);

                        else
                            setNewRoleValue(e.target.value);
                    } }>
                        <option value='s'>Select Role</option>
                        {roleNames.map((v) => {
                            return (<option value={v.role_id}>{v.role_name}</option>);
                        })}
                    </select>
                </div>
            </div></center>
            <div class="row">
                <div class="col-50">
                    <h3 class='assessmentLable'>Self Assessment</h3>
                    <PieChart width={400} height={400}>
                        <Pie data={selfAssessmentData} cx={200} cy={200} labelLine={false} label={renderCustomizedLabel}
                            outerRadius={120} fill="#8884d8" dataKey="value">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </div>
                <div class='col-50'>
                    <h3 class='assessmentLable'>Lead Assessment</h3>
                    <PieChart width={400} height={400}>
                        <Pie data={leadAssessmentData} cx={200} cy={200} labelLine={false} label={renderCustomizedLabel}
                            outerRadius={120} fill="#8884d8" dataKey="value">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </div>
            </div></div></>
         )}
      </>
    );
}
