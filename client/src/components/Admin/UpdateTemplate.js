import React from 'react';
import '../../assests/css/Style.css';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DataGrid } from '@material-ui/data-grid';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import '../../assests/css/Preloader.css';


const columns = [
  { field: 'id', headerName: 'ID', width: 100, type: 'rightAligned'},
  {
    field: 'AreaName',
    headerName: 'AreaName',
    width: 150,
    sortable: true,
    editable: false,
  },
  {
    field: 'descriptor',
    headerName: 'Descriptor',
    width: 800,
    sortable: true,
    editable: true,
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: '90%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

function UpdateTemplate() {
  let a = [];
  let descId = [];
  const[TempNames,setTempNames] = useState([]); 
  const[tempValue, setTempValue ] = useState(0);
  const[roleValue, setRoleValue ] = useState(0);
  const[details,setDetails] = useState([]);
  const[names,setNames] =useState([]);
  const[roles,setRoles] = useState([]);
  const classes = useStyles();
  const [loading, setloading] = useState(undefined);
  const [completed, setcompleted] = useState(undefined);
  // eslint-disable-next-line no-unused-vars
  const[roleName, setRoleName] = useState('');
  // eslint-disable-next-line no-unused-vars
  const[change,setChange] = useState(false);
  const[value,setValue] = useState('');
  const [viewAddDescriptor, setViewAddDescriptor] = useState(false);
  const[viewDeleteDescriptor, setViewDeleteDescriptor] = useState(false);

  const AddCompDesc = ()=>{
    Axios.post('http://localhost:3001/addTemplate',{
      tid : tempValue,
      roleid : roleValue,
      descId : descId
    }).then(response =>{
      if(response.data.data.success === true){
        alert('Template Created Successfully');
        setDetails([]);
      }else{
        alert("Unable to Create Template");
        setDetails([]);
      }
    })  
    alert('Template Updated.');
    setViewAddDescriptor(false);    
  }

  useEffect(() => {
    setTimeout(()=> {
    Axios.get('http://localhost:3001/getTemplateNames')
    .then(response =>{
      setTempNames(response.data.data);
      setloading(true);

            setTimeout(() => {
                 setcompleted(true);
              }, 0);
        })
    }, 1500);
  }, []);

  useEffect(() => {
    Axios.get('http://localhost:3001/getCompetencyAreaNames')
      .then(response =>{
        setNames(response.data.data);
    })
  }, [])

  useEffect(() => {
    Axios.get('http://localhost:3001/getRole')
      .then(response =>{
        setRoles(response.data.data);
    })
  }, [])

  useEffect(() => {
    if(change){
    Axios.post('http://localhost:3001/getRoleName',{temp_id:value})
    .then(response =>{
      if(response.data.data.success === true){  
        setRoleName(response.data.data.data);
      }else{
        setRoleName('');
      }         
    })}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(()=>{
    if(change){
      Axios.post('http://localhost:3001/getTemplateDescriptor', {temp_id:value,
        }).then(response =>{
          if(response.data.data.success === true){  
            setDetails(response.data.data.data);//setAssignTemplate(response.data.data.data);
          }else{
            setDetails([]);
          }            
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[value])

  const AddDescriptor = ()=> {
    if(!tempValue)
    {        
      alert('Please fill the field');
    }
    else{
       setViewAddDescriptor(true);
       setViewDeleteDescriptor(false);
    }  
  }

  const getDescriptorByRole = ()=>{
    if(!roleValue)
    {        
      alert('Please fill the field');
    }else{
      Axios.post('http://localhost:3001/getDescriptorByRole',{
        role : roleValue
      }).then(res =>{
        if(res.data){
          setDetails(res.data.data);
          alert('Descriptors fetched.');
        }
      });
    }      
  }

  const DeleteDescriptor = ()=> {
    if(!tempValue){
      alert('Please select the field');
    }
    else{
      setViewDeleteDescriptor(true);
    }
    // alert('Template Updated.');
    setViewAddDescriptor(false); 
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
      <center>
        <h1>Update Template</h1>
        <div class="row">
          <div class="col-25">
            <label for="template_name">Template Name</label>  
          </div>
          <div class="col-75">
            <select id="template_name" name="template_name"
              onChange={
                e=> {
                  setTempValue(e.target.value);
                  setValue(e.target.value);
                  }
                }>
                <option value="template_1">Select Template Name </option>
                {/* {
                  tempnames.map((value)=>{  
                    return(
                      <option value={value.Temp_id}>{value.TempName}</option>
                    )
                  })
                } */}
                {
                    TempNames.map((value)=>{  
                      return(
                        <option value={value.Temp_id}>{value.TempName}</option>
                      )
                    })
                  }
            </select>
          </div>
        </div>
        <br/> 
        <div class="row">
            <div>
                <button className="inline-button" onClick={AddDescriptor}>Add Descriptors</button>
                <button className="inline-button" onClick={DeleteDescriptor}>Delete Descriptors</button>
            </div>
        </div>
        <br/>
        {
          viewAddDescriptor === true && 
          <section>
            <div class="row">
              <div class="col-25">
                <label for="role_name">Select Role</label>  
              </div>
              <div class="col-75">
                <select id="role_name" name="role_name"
                  onChange={e=> setRoleValue(e.target.value)}>
                    <option value="role_1">Select Role</option>
                      {
                        roles.map((value)=>{  
                          return(
                            <option value={value.role_id}>{value.role_name}</option>
                          )
                        })
                      }
                </select>
              </div>
              <div class="roleSearch">
                <button onClick={getDescriptorByRole}>Search</button>
              </div>
            </div>
            <div className={classes.root}>
              {               
                names.map((value)=>{ 
                a = [];
                return(
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"                     
                      id="panel1a-header">
                      <Typography className={classes.heading}>{value.AreaName}</Typography>
                  </AccordionSummary>                     
                  {
                    // eslint-disable-next-line array-callback-return
                    details.map(value1=>{
                        if(value1.Area_id === value.Area_id){
                          let b = {
                            id: value1.Desc_id,
                            descriptor : value1.Description
                          }
                          a.push(b);
                        }
                      }) 
                  }
                    <AccordionDetails>
                        <div style={{ height: 400, width: '100%', backgroundColor: 'white' }}>
                        <DataGrid
                          rows={a}
                          columns={columns}
                          pageSize={5}
                          checkboxSelection = {true}
                          disableSelectionOnClick
                          onSelectionModelChange={(id) => {
                            // eslint-disable-next-line array-callback-return
                            id.map(v => {
                              descId.push(v)
                            })
                          }}
                        />               
                      </div>
                    </AccordionDetails>
                  </Accordion>
                );                         
             })
            }
            </div>
              <br/><br/>
              <button onClick={AddCompDesc}>Save</button><br/>
          </section>
        } 
        {
          viewDeleteDescriptor === true && 
          <section>
            <div class="row">
            <div class="col-25">
              <label for="competency_area">Role Name</label>  
            </div>
            <div class="col-25">
              <label for="competency_area">{roleName}</label> 
            </div>
          </div>
          <br/><br/>
          {
            // eslint-disable-next-line array-callback-return
            details.map(value => {  
              let b = {
                id: value.Desc_id,
                AreaName : value.AreaName,
                descriptor:value.Description
              }
              a.push(b);
            })
          }
          <div style={{ height: 385, width: '85%', background:'white' }}>
            <DataGrid
              rows={a}
              columns={columns}
              pageSize={5}
              disableSelectionOnClick/>
          </div>
    </section>
        }      
      </center><br/>
    </div>
    )}
  </>
  )
}


export default UpdateTemplate;
