import '../../assests/css/Style.css';
import React from 'react'
import { useState, useEffect } from 'react';
import Axios from 'axios';  
function SelfAssessment() {
    
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
    }, [])

    const[competencyName, SetCompetencyName] = useState([]);
    useEffect(()=>{
        Axios.get('http://localhost:3001/getCompetencyAreaNames')
        .then(response =>{
           // console.log(response);
            SetCompetencyName(response.data.data);
        })
    },[])      
    
    const [review_id , SetReview_id] = useState('');  
    const [template, SetTemplate] = useState([]);
    // const [errorMessage, SetErrorMessage] = useState('');
  
    const SearchTemplate = ()=>{       
        if(!review_id){
            alert("Please select Review Cycle");
        }else{
            Axios.post('http://localhost:3001/selfAssessment/getTemplate', {
                review_cycle_id : review_id,
                emp_id : localStorage.getItem('id'),
            }).then((response) => {
                SetTemplate(response.data.data);
            });
        }                    
    }
     
    let assessmentArr = [];
    
    const SubmitAssessment = () =>{
        let flag = 0;
        assessmentArr.forEach(val => {
            if(!val.rating || !val.comment){
                flag = 1;
            }
        });
        if(flag == 1){            
            alert("Please fill all the fields");
        }else{
            Axios.post('http://localhost:3001/selfAssessment/insert', {
                review_id : review_id,
                emp_id : localStorage.getItem('id'),
                assessmentArr : assessmentArr,
            }).then((response) => {
                //console.log(response);
                if(response.data.data.success === true){
                    alert("Self Assessment submited Successfully....");
                }else{
                    alert("Unable to submit Self Assessment");
                }
            });
        }
    }

    return (
        <div className="content"><br/><br/>
            <center><h1>Self Assessment</h1>

            {/* {errorMessage && <div className="error"> {errorMessage} </div>} */}

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
                <tr><th>Competency Area</th><th>Competency Descriptior</th><th>Employee Rating</th><th>Self Comment</th><th>Lead Rating</th><th>Lead Comment</th></tr>
                {
                    competencyName.map((val1) => {
                        return template.map((val) => {  
                            if(val1.Area_id === val.cid){                                           
                                var element = {};
                                element.id = val.did;                         
                                return <tr>
                                        <td>{val1.AreaName}</td> 
                                        <td>{val.des}</td>
                                        <td><select name='selfRating' onChange = {e=> {element.rating = e.target.value}}>
                                                <option>Select</option>
                                                {
                                                    rating.map((val)=>{  
                                                    return(<option value={val.rating_name}>{val.rating_name}</option>)
                                                    })
                                                }
                                            </select></td>                 
                                        <td><textarea type='text' name='selfComment' onChange = {e=> {element.comment = e.target.value;}}/>                             
                                        <h6>{assessmentArr.push(element)}</h6></td>             
                                        <td class='unselected'>{val.leadRating}</td>
                                        <td class='unselected'>{val.leadComment}</td>
                                    </tr>           
                            }  
                        })
                    })
                }          
            </table>            
            <br/>
            <button onClick={SubmitAssessment}>Save</button><br/><br/><br/><br/><br/> 
            </center>
        </div>
    )
}

export default SelfAssessment


