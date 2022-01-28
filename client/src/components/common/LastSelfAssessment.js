import '../../assests/css/Style.css';
import React from 'react'
import { useState, useEffect } from 'react';
import Axios from 'axios'; 
import '../../assests/css/Preloader.css'; 

function SelfAssessment() {
    
    const[review, SetReview] = useState([]);
    const [loading, setloading] = useState(undefined);
    const [completed, setcompleted] = useState(undefined);

    useEffect(() => {
        setTimeout(()=> {
        Axios.get('http://localhost:3001/getReview')
        .then(response =>{
            SetReview(response.data.data);
            setloading(true);

            setTimeout(() => {
                 setcompleted(true);
              }, 0);
        })
    }, 1500);
    }, [])
    
    const[competencyName, SetCompetencyName] = useState([]);
    useEffect(()=>{
        Axios.get('http://localhost:3001/getCompetencyAreaNames')
        .then(response =>{
            console.log(response);
            SetCompetencyName(response.data.data);
        })
    },[])      
    
    const [review_id , SetReview_id] = useState('');  
    const [template, SetTemplate] = useState([]);
    
    const SearchTemplate = ()=>{   
        if(!review_id){
            alert("Please Select Review Cycle");
        }else{
            Axios.post('http://localhost:3001/selfAssessment/ViewTemplate', {
                review_cycle_id : review_id,
                emp_id : localStorage.getItem('id'),
            }).then((response) => {
                if(response.data.data.success === true)
                {
                    SetTemplate(response.data.data.data);
                }else if(response.data.data.update === true){
                    alert("Please submit your assessment to view here");
                    SetTemplate([]);
                }else{
                    alert("Self assessment not performed");
                    SetTemplate([]);
                }
            }); 
        }                  
    }

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
        <div className="content"><br/><br/>
            <center><h1>Previous Self Assessment</h1>
             <div class="row">
                <div class="col-25">
                    <label for="review">Review Cycle</label>
                </div>
                <div class="col-25">
                    <select id="review_id" name="review_id" onChange={e=> SetReview_id(e.target.value)}>
                        <option value = "review_cycle">Select Review Cycle </option>
                        {
                            review.map((val)=>{  
                            return(<option value={val.review_cycle_id}>{val.review_cycle_name}</option>)
                            })
                        }   
                    </select>
                </div>
               
                <div class="col-25">
                    <button onClick={SearchTemplate}>Search</button>  
                </div>
            </div> 
            <br/><br/>
            <table id="assessment">
                <tr><th>Competency Area</th><th>Competency Descriptior</th><th>Self Rating</th><th>Self Comment</th><th>Lead Rating</th><th>Lead Comment</th></tr>
                {
                    competencyName.map((val1) => {
                        // eslint-disable-next-line array-callback-return
                        return template.map((val) => {      
                            if(val1.Area_id === val.cid){                                    
                                return <tr>
                                        <td>{val1.AreaName}</td> 
                                        <td>{val.des}</td>
                                        <td>{val.selfRating}</td>
                                        <td>{val.selfComment}</td>
                                        <td>{val.leadRating}</td>
                                        <td>{val.leadComment}</td>
                                    </tr>           
                            }                                                                                     
                        })
                    })
                }          
            </table><br/> 
            </center>
            </div>
        )}
    </>
    )
}

export default SelfAssessment;


