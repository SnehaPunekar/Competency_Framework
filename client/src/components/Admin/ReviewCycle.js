import '../../assests/css/Style.css';
import * as React from 'react';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import '../../assests/css/Preloader.css';

function ReviewCycle() {
  const[reviewName,SetReviewName] = useState('');
  const[start,SetStart] = useState('');
  const[end,SetEnd] = useState('');
  const[change,setChange] = useState(false);
  const[reviewDetails,setReviewDetails] = useState([]);
  const[reviewId, setReviewId] = useState('');
  const[status, setStatus] = useState('');
  const [loading, setloading] = useState(undefined);
  const [completed, setcompleted] = useState(undefined);
  
  const toggler = (e) => {
    setReviewId(e.target.id);
    if(status === 0){
      alert("Warning : Activation of the Review Cycle is only Restricted to completion of assessments. One cannot ASSIGN or CREATE NEW TEMPLATES!");
      setStatus(1);
    }
    else{
      setStatus(0);
    }
    // (e.target.checked) ?  :
    setChange(true);
  }


  const addReview = ()=>{
    if(!reviewName || !start || !end){
      alert('Please fill all the fields');
    } 
      Axios.post('http://localhost:3001/addReview',{
      reviewName:reviewName,
      start:start,
      end:end,
      status:1,
      }).then(res => {
        console.log(res.data.flag);
        if(res.data.flag === false){
          alert('Duplicate review name not allowed!')
        }
        else{
          alert('Added successfully!')
        }
        setChange(!change);
      });
     }

  useEffect(() => {
    if(reviewId){
      console.log('set');
      setChange(false);
      Axios.post('http://localhost:3001/updateReview',{reviewIdTemp : reviewId, statusTemp : status})
      .then(response =>{
        setReviewDetails(response.data.data);        
      });
    }else{
      setTimeout(()=> {
      Axios.get('http://localhost:3001/getReview')
      .then(response =>{
        setReviewDetails(response.data.data);
        setloading(true);

            setTimeout(() => {
                 setcompleted(true);
              }, 0);
        })
    }, 1500);   
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [change])

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
                return <tr><td>{val.review_cycle_id}</td>
                <td>{val.review_cycle_name}</td>
                <td>{val.start_date}</td>
                <td>{val.end_date}</td>
                <td><label class="switch">                  
                    <input type="checkbox" 
                      id={val.review_cycle_id} 
                      checked={ Boolean(val.active) } 
                      onChange={ toggler } />
                    <span class="slider round"></span>
                </label>
                </td></tr>    
            })}
        </table>
      </center><br/>
    </div>
     )}
    </>
  );
}

export default ReviewCycle;
