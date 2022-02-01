import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState , useEffect} from 'react';
import Axios from 'axios';
import '../../assests/css/Preloader.css';

export default function AverageRatingDashboard() {
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
        </div> </center> <br/>
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
        </div></div> 
      )}
      </>     
  );      
}

