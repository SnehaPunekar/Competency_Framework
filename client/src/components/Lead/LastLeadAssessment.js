import '../../assests/css/Style.css';
import React from 'react'
import { useState, useEffect } from 'react';
import Axios from 'axios'; 

function LeadAssessment() {
    const[review, SetReview] = useState([]);
    useEffect(() => {
        Axios.get('http://localhost:3001/selfAssessment/getReview')
        .then(response =>{
            SetReview(response.data.data);
        })
    }, []);

    const[employees, SetEmployee] = useState([]);
    useEffect(()=>{
        Axios.post('http://localhost:3001/leadAssessment/getEmployee',{leadName : localStorage.getItem('first_name')}
        ).then(response =>{
            SetEmployee(response.data);
        })
    },[]);
    
    const[competencyName, SetCompetencyName] = useState([]);
    useEffect(()=>{
        Axios.get('http://localhost:3001/getCompetencyAreaNames')
        .then(response =>{
            console.log(response);
            SetCompetencyName(response.data.data);
        })
    },[]);

    const [review_id , SetReview_id] = useState('');  
    const [emp_id, SetEmp_id] = useState('');
    const [template, SetTemplate] = useState([]);
    const SearchTemplate = ()=>{
        if(!review_id || !emp_id){
            alert("Please Select Review Cycle and Employee");
        }else{
            Axios.post('http://localhost:3001/leadAssessment/getTemplate', {
                review_cycle_id : review_id,
                emp_id : emp_id,
            }).then((response) => {
                SetTemplate(response.data.data);            
            });
        }                    
    }
    
    return (
        <div className="content"><br/><br/>
            <center><h1>Lead Assessment</h1> 
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
                    <select id="Emp_id" name="emp_id" onChange={e=> SetEmp_id(e.target.value)}>
                        <option value = "emp">Select Employee </option>
                        {
                            employees.map((val)=>{  
                            return(<option value={val.emp_id}>{val.first_name}</option>)
                            })
                        }   
                    </select>
                </div>
                <div class="col-25">
                    <button onClick={SearchTemplate}>Search</button>  
                </div>
            </div> 
            <br/><br/>          
            <table id="lead_assessment">
                <tr><th>Competency Area</th><th>Competency Descriptor</th><th>Self Rating</th><th>Self Comment</th><th>Select Lead Rating</th><th>Lead Comment</th></tr>
                {
                    competencyName.map((val1) => {
                        return template.map((val) => {  
                            if(val1.Area_id === val.cid){                                    
                                return <tr>
                                        <td>{val1.AreaName}</td> 
                                        <td>{val.des}</td>
                                        <td class='unselected'>{val.selfRating}</td>
                                        <td class='unselected'>{val.selfComment}</td>
                                        <td>{val.leadRating}</td>
                                        <td>{val.leadComment}</td>
                                    </tr>           
                            }
                        })
                    })
                }
                </table><br/>
		    {/* <button onClick={SubmitAssessment}>Save</button><br/><br/>             */}
            </center>
        </div>
    )
}

export default LeadAssessment;


