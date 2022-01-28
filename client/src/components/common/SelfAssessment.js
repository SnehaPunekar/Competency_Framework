import '../../assests/css/Style.css';
import React from 'react'
import { useState, useEffect } from 'react';
import Axios from 'axios';  
import '../../assests/css/Preloader.css';

function SelfAssessment() {
    
    const[review, SetReview] = useState([]);
    useEffect(() => {
        Axios.get('http://localhost:3001/selfAssessment/getReview')
        .then(response =>{
            SetReview(response.data.data);
        })
    }, [])

    const[rating, SetRating] = useState([]);
    const [loading, setloading] = useState(undefined);
    const [completed, setcompleted] = useState(undefined);

    useEffect(() => {
        setTimeout(()=> {
        Axios.get('http://localhost:3001/getRatingDetails')
        .then(response =>{
            SetRating(response.data.data);
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
            SetCompetencyName(response.data.data);
        })
    },[])      
    
    const [review_id , SetReview_id] = useState('');  
    const [template, SetTemplate] = useState([]);
  
    const SearchTemplate = ()=>{       
        if(!review_id){
            alert("Please select Review Cycle");
        }else{
            Axios.post('http://localhost:3001/selfAssessment/getTemplate', {
                review_cycle_id : review_id,
                emp_id : localStorage.getItem('id'),
            }).then((response) => {
                if(response.data.data.success === true)
                {
                    SetTemplate(response.data.data.data);
                }else if(response.data.data.update === true){
                    alert("Your Self assessment is already submitted");
                    SetTemplate([]);
                }else{
                    alert("Self assessment not assigned");
                    SetTemplate([]);
                }
            });
        }                    
    }
     
    const SaveAssessment = () =>{
        Axios.post('http://localhost:3001/selfAssessment/insert', {
            review_id : review_id,
            emp_id : localStorage.getItem('id'),
            assessmentArr : assessmentArr,
            draft : 0,
        }).then((response) => {
            if(response.data.data.success === true){
                alert("Self Assessment Saved Temporarily");
                SetTemplate([]);
            }else{
                alert("Unable to save Self Assessment");
            }
        });
    }

    let assessmentArr = [];
    
    const SubmitAssessment = () =>{
        let flag = 0;
        assessmentArr.forEach(val => {
            // eslint-disable-next-line eqeqeq
            if(val.rating == '' || val.rating == 'S' || val.comment == ''){
                flag = 1;
            }
        });
        // eslint-disable-next-line eqeqeq
        if(flag == 1){            
            alert("Please fill all the fields");
        }else{
            Axios.post('http://localhost:3001/selfAssessment/insert', {
                review_id : review_id,
                emp_id : localStorage.getItem('id'),
                assessmentArr : assessmentArr,
                draft : 1,
            }).then((response) => {
                if(response.data.data.success === true){
                    alert("Self Assessment submited Successfully....");
                    SetTemplate([]);
                }else{
                    alert("Unable to submit Self Assessment");
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
            <center><h1>Self Assessment</h1>

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
                <tr><th>Competency Area</th><th>Competency Descriptior</th>
                <th width='150px'>Self Rating</th><th>Self Comment</th>
                </tr>
                {
                competencyName.map((val1) => {
                    // eslint-disable-next-line array-callback-return
                    return template.map((val) => {  
                        if(val1.Area_id === val.cid){                                           
                            var element = {};
                            element.id = val.did;  
                            element.rating = '';
                            element.comment = '';

                            if(val.selfRating || val.selfComment)
                            {
                                element.rating = val.selfRating;
                                element.comment = val.selfComment;
                            }
                                 
                            return <tr>
                                <td>{val1.AreaName}</td> 
                                <td>{val.des}</td> 
                                <td><select name='selfRating' defaultValue={val.selfRating} onChange = {e=> {element.rating = e.target.value}}>
                                    <option value='S'>Select</option>
                                    {
                                        rating.map((v)=>{  
                                        return(<option value={v.rating_name}>{v.rating_name}</option>)
                                        })
                                    }
                                    </select></td>                 
                                <td><textarea type='text' defaultValue={val.selfComment} name='selfComment' onChange = {e=> {element.comment = e.target.value;}}/>                             
                                <h6>{assessmentArr.push(element)}</h6></td>       
                                </tr>           
                            }  
                        })
                    })
                }          
            </table><br/>            
            <button className="inline-button " onClick={SaveAssessment} display="inline-block">Save as Draft</button>
            <button className="inline-button " onClick={SubmitAssessment} display="inline-block">Submit</button>
            <br/><br/><br/><br/><br/> 
            </center>
        </div>
        )}
    </>
    )
}

export default SelfAssessment;
