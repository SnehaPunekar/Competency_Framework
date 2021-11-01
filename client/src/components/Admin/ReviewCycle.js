import '../../assests/css/Style.css';
import * as React from 'react';
import { useState, useEffect } from 'react';
import Axios from 'axios';
  
function ReviewCycle() {

  const[reviewName,SetReviewName] = useState('');
  const[start,SetStart] = useState('');
  const[end,SetEnd] = useState('');
  const[change,setChange] = useState(false);
  const[reviewDetails,setReviewDetails] = useState([]);
  const[checked,setChecked] = useState(false);
  
  const addReview = ()=>{
    if(!reviewName || !start || !end){
      alert('Please fill all the fields');
    }else{
      Axios.post('http://localhost:3001/addReview',{
        reviewName:reviewName,
        start:start,
        end:end
      }).then(res => {
        setChange(!change);
      });
    }
  };

  useEffect(() => {
    Axios.get('http://localhost:3001/getReview')
    .then(response =>{
      setReviewDetails(response.data.data);
    })
}, [change])

  return (
    <div className="content">
      <center><h1>Review Cycle</h1> 
        <div class="row">
          <div class="col-25">
            <label for="rname">Review Cycle Name</label>
          </div>
          <div class="col-75">
            <input type="text" id="rname" name="review_name" 
            placeholder="Review Name" required
            onChange={(e)=>{
              SetReviewName(e.target.value);
            }}/>
          </div>
        </div>
        <div class="row">
          <div class="col-25">
            <label for="startdate">Start Date</label>
          </div>
          <div class="col-25">
            <input type="date" id="startdate" 
            name="startdate" required
            onChange={(e)=>{
              SetStart(e.target.value);
            }}
            />
          </div>
          <div class="col-25">
            <label for="enddate">End Date</label>
          </div>
          <div class="col-25">
            <input type="date" id="enddate" 
            name="enddate" required
            onChange={(e)=>{
              SetEnd(e.target.value);
            }}/>
          </div>
        </div>
        <button onClick={addReview}>Save</button><br/>
        <h3>List of Review Cycle</h3>    
        <table>
            <tr><th>Sr. No.</th><th>Review Cycle Name</th><th>Start Date</th><th>End Date</th><th>Status</th></tr>
            {
            reviewDetails.map((val) => {
                return <tr><td>{val.review_cycle_id}</td><td>{val.review_cycle_name}</td><td>{val.start_date}</td><td>{val.end_date}</td>
                <td><label class="switch">
                <input type="checkbox" checked={checked} onClick={!checked}/>
                <span class="slider round"></span>
              </label>
              </td></tr>              
            })}
        </table>
              </center><br/>
    </div>
  );
}

export default ReviewCycle;
