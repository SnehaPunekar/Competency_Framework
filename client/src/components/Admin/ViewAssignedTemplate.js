import '../../assests/css/Style.css';
import React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { useState,useEffect } from 'react';
import Axios from 'axios';
import '../../assests/css/Preloader.css';

 const columns = [
  { field: 'id', headerName: 'ID', width: 160 },
  {
    field: 'firstName',
    headerName: 'First Name',
    width: 300,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last Name',
    width: 300,
    editable: true,
  }, 
  {
    field: 'TempName',
    headerName: 'Template Name',
    width: 300,
    editable: true,
  },
];

function AssignTemplate() {

  let a = [];
  const[change,setChange] = useState(false);
  const[reviewId,setReviewId] = useState('');
  const[reviewNames,setReviewNames] = useState([]);
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

    const[assignTemplate,setAssignTemplate] = useState([]);
    useEffect(()=>{
        if(change){
          Axios.post('http://localhost:3001/getEmpNamesByTemplate',{
          reviewCId:reviewId,})
        .then(response =>{
            if(response.data.data.success === true){  
              setAssignTemplate(response.data.data.data);
            }else{
              setAssignTemplate([]);
            }
        });
        }  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[reviewId]);

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
            <center><h1>View Assigned Template</h1>
            <div class="row">
                <div class="col-25">
                    <label for="cycles">Select Review Cycle</label>                                
                </div>
                <div class="col-75">
                    <select id="level" name="level" 
                     onChange={e=> { 
                      setChange(true);
                      setReviewId(e.target.value)}}>
                        <option value="cycle">Select Review Cycle</option>
                        {
                        reviewNames.map((value)=>{  
                          return(
                            <option value={value.review_cycle_id}>{value.review_cycle_name}</option>
                            )
                          })
                        }                     
                    </select>
                </div>
            </div>
            {
                // eslint-disable-next-line array-callback-return
                assignTemplate.map(value => {
                    let b = {
                    id: value.emp_id,
                    firstName : value.first_name,
                    lastName : value.last_name,
                    TempName : value.TempName                    
                    }
                    a.push(b);
                })
            }
            <div style={{ height: 370, width: '85%', background:'white' }}>
                <DataGrid
                    rows={a}
                    columns={columns}
                    pageSize={5}
                    disableSelectionOnClick   
                />
            </div> 
            <br/>      
            </center>
        </div>
      )}
    </>
  )
}
export default AssignTemplate;

