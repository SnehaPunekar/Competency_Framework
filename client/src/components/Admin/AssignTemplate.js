import '../../assests/css/Style.css';
import React from 'react';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@material-ui/data-grid';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import '../../assests/css/Preloader.css';

 const columns = [
  { field: 'id', headerName: 'ID', width: 160 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 300,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 300,
    editable: true,
  }, 
];

function AssignTemplate() {

  let a = [];
  const[TempNames, setTempNames] = useState([]);
  const[reviewNames, setReviewNames] = useState([]);
  const[empNames, setEmpNames] = useState([]);
  const[change,  setChange] = useState(false);
  const[value, setValue] = useState(0);
  const[tempValue, setTempValue] = useState(0);
  const[roleValue, setRoleValue] = useState(0);
  const[RoleNames, setRoleNames] = useState([]);
  const[empId, setEmpId] = useState([]);
  const [loading, setloading] = useState(undefined);
  const [completed, setcompleted] = useState(undefined);

  useEffect(() => {
    Axios.get('http://localhost:3001/getTemplateNames')
    .then(response =>{
        setTempNames(response.data.data);
    })
  }, [])

  useEffect(() => {
    setTimeout(()=> {
    Axios.get('http://localhost:3001/selfAssessment/getReview')
    .then(response =>{
        setReviewNames(response.data.data);
        setloading(true);

            setTimeout(() => {
                 setcompleted(true);
              }, 0);
        })
    }, 1500);
  }, [])

  useEffect(() => {
    Axios.get('http://localhost:3001/getRole')
      .then(response =>{
          setRoleNames(response.data.data);
      })
  }, [])

  useEffect(()=>{
    if(change){
        Axios.post('http://localhost:3001/getEmpNames',{roleId : roleValue})
      .then(response =>{
        setEmpNames(response.data.data);
      });
      setChange(false);
    }  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[roleValue]);

  const assign = ()=>{
    if(tempValue !== 0 && value !== 0 && empId.length !== 0 && value !== 'R' && tempValue !== 'T')
    {
      Axios.post('http://localhost:3001/assignTemplate',{
        tempId : tempValue,
        reviewCId : value,
        empId : empId 
      })
      .then(res=>{
        if(res.data.data.success === true){
            alert('Template Assign Successfully');
            setEmpId([]);
            setValue('');
            setTempValue('');
            setRoleValue('');
        }else{
            alert(`This template is already assigned to ${empId}`);
        }
      })
    }else{
      alert('Please select all the fields');
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
        <div className="content">
            <center><h1>Assign Template</h1>
            <div class="row">
                <div class="col-25">
                    <label for="cycles">Select Review Cycle</label>                                
                </div>
                <div class="col-75">
                    <select id="level" name="level" 
                     onChange={e=> { 
                      setValue(e.target.value)}}>
                        <option value='R'>Select Review Cycle</option>
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
            <div class="row">
                <div class="col-25">
                    <label for="templates">Select Template</label>  
                </div>
                <div class="col-75">
                    <select id="templates" name="templates"
                    onChange={ e=> {
                        setTempValue(e.target.value)}
                      }>
                        <option value='T'>Select Template</option>
                        {
                        TempNames.map((val)=>{  
                        return(
                            <option value={val.Temp_id}>{val.TempName}</option>
                            )
                          })
                        }  
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-25">
                    <label for="role">Select Role</label>  
                </div>
                <div class="col-75">
                    <select id="roles" name="roles"
                    onChange={ e=> {setChange(true)
                        setRoleValue(e.target.value)}
                      }>
                        <option value="selectRole">Select Role</option>
                        {
                        RoleNames.map((v)=>{  
                        return(
                            <option value={v.role_id}>{v.role_name}</option>
                            )
                          })
                        }  
                    </select>
                </div>
            </div>           
            <h3>Select the employees</h3> 
                {
                  // eslint-disable-next-line array-callback-return
                  empNames.map(value => {
                    let b = {
                      id: value.Emp_id,
                      lastName : value.last_name,
                      firstName : value.first_name
                    }
                    a.push(b);
                  })
                }
                <div style={{ height: 650, width: '80%', background:'white' }}>
                  <DataGrid
                    rows={a}
                    columns={columns}
                    pageSize={10}
                    checkboxSelection
                    disableSelectionOnClick
                    onSelectionModelChange={(id) => {
                      setEmpId(id)
                    }}

                    components={{
                      NoRowsOverlay: () => (
                        <Stack height="100%" alignItems="center" justifyContent="center">
                          No Employees found
                        </Stack>
                      )
                    }}
                  />
                </div>        
            <br/>
		        <button onClick={assign}>Save</button><br/></center><br/>
        </div>
      )}
      </>
    )
}
export default AssignTemplate;

