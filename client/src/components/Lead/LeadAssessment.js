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
    }, [])

    const[rating, SetRating] = useState([]);
    useEffect(() => {
        Axios.get('http://localhost:3001/getRatingDetails')
        .then(response =>{
            SetRating(response.data.data);
        })
    }, []);

    const[employees, SetEmployee] = useState([]);
    useEffect(()=>{
        Axios.post('http://localhost:3001/leadAssessment/getEmployee',
            {leadName : localStorage.getItem('first_name')}
        ).then(response =>{
            SetEmployee(response.data.data);
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
                if(response.data.data.success === true)
                {
                    SetTemplate(response.data.data.data);
                }else if(response.data.data.update === true){
                    alert("Your Lead assessment is already submitted");
                    SetTemplate([]);
                }else{
                    alert("Self assessment not yet performed by employee");
                    SetTemplate([]);
                }
            })  
        }                  
    }

    const SaveAssessment = () => {
        let flag = 0;
        assessmentArr.forEach(val => {
            if(!val.rating || !val.comment){
                flag = 1;
            }
        });
        if(flag == 1){            
            alert("Please fill all the fields");
        }else{
            Axios.post('http://localhost:3001/leadAssessment/insert', {
                review_id : review_id,
                emp_id : emp_id,
                assessmentArr : assessmentArr,
                lead_draft : 0,
            }).then((response) => {
                if(response.data.data.success === true){
                    alert("Lead Assessment Saved Temporarily");
                    SetTemplate([]);                  
                }else{
                    alert("Unable to save Lead Assessment");
                }
            });
        }
    }

    const SubmitAssessment = () => {
        let flag = 0;
        assessmentArr.forEach(val => {
            if(!val.rating || !val.comment){
                flag = 1;
            }
        });
        if(flag == 1){            
            alert("Please fill all the fields");
        }else{
            Axios.post('http://localhost:3001/leadAssessment/insert', {
                review_id : review_id,
                emp_id : emp_id,
                assessmentArr : assessmentArr,
                lead_draft : 1,
            }).then((response) => {
                if(response.data.data.success === true){
                    alert("Lead Assessment submited Successfully....");
                    SetTemplate([]);                  
                }else{
                    alert("Unable to submit Lead Assessment");
                }
            });
        }
    }
    
    let assessmentArr = [];

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
                <tr><th>Competency Area</th><th>Competency Descriptor</th><th>Self Rating</th><th>Self Comment</th><th>Lead Rating</th><th>Lead Comment</th></tr>
                {
                    competencyName.map((val1) => {
                        return template.map((val) => {                        
                                            
                            if(val1.Area_id === val.cid){                                           
                                var element = {};
                                element.id = val.did;  
                                if(val.leadRating && val.leadComment)
                                {
                                    element.rating = val.leadRating;
                                    element.comment = val.leadComment;
                                }                       
                                return <tr>
                                        <td>{val1.AreaName}</td> 
                                        <td>{val.des}</td>
                                        <td class='unselected'>{val.selfRating}</td>
                                        <td class='unselected'>{val.selfComment}</td>
                                        <td width='80px'><select name='leadRating' defaultValue={val.leadRating} onChange = {e=> {element.rating = e.target.value}}>
                                            <option>Select</option>
                                            {
                                                rating.map((val)=>{  
                                                return(<option value={val.rating_name}>{val.rating_name}</option>)
                                                })
                                            }
                                        </select></td>                 
                                        <td><textarea type='text' name='lead_Comment' defaultValue={val.leadComment} onChange = {e=> {element.comment = e.target.value;}}/>                             
                                        <h6>{assessmentArr.push(element)} </h6> </td>
                                    </tr>           
                            }  
                        })
                    })
                }
                </table><br/>
                <button className="inline-button " onClick={SaveAssessment} display="inline-block">Save as Draft</button>
                <button className="inline-button " onClick={SubmitAssessment} display="inline-block">Submit</button>         
                <br/>
            </center>
        </div>
    )
}

export default LeadAssessment

