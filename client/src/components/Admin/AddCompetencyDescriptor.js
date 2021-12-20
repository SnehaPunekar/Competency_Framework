import '../../assests/css/Style.css';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DataGrid } from '@material-ui/data-grid';
import { useState,useEffect } from 'react';
import Axios from 'axios';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import { randomPrice } from '@mui/x-data-grid-generator';

const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  {
    field: 'descriptor',
    headerName: 'Descriptor',
    width: 660,
    sortable:true,
    editable:true,
  },
  { field: 'role', headerName: 'Role', width: 110 },
  { field: 'track', headerName: 'Track', width: 130 },
  { field: 'status', headerName: 'Status', width: 120,type: 'boolean', editable: true},
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

const StyledBox = styled(Box)(({ theme }) => ({
  height: 400,
  width: '100%',
  '& .MuiDataGrid-cell--editing': {
    backgroundColor: 'rgb(255,215,115, 0.19)',
    color: '#1a3e72',
  },
  '& .Mui-error': {
    backgroundColor: `rgb(126,10,15, ${theme.palette.mode === 'dark' ? 0 : 0.1})`,
    color: theme.palette.error.main,
  },
}));

export default function AddCompetencyDescriptor() {

    const[names,setNames] = useState([]);
    const[value, setValue ] = useState('');
    const[desc, setDesc] = useState('');    
    const[role, setRole ] = useState('');
    const[track, setTrack ] = useState('');
    const[status, setStatus ] = useState('');
    const[descriptor,setDescriptor] = useState(true);
    const[details,setDetails] = useState([]);
    const apiRef = useGridApiRef();

    
    useEffect(() => {
        Axios.get('http://localhost:3001/getCompetencyAreaNames')
        .then(response =>{
            setNames(response.data.data);
        })
    }, [])
    
    useEffect(()=>{
      Axios.get('http://localhost:3001/getDescriptor')
      .then(response =>{
        setDetails(response.data.data);
      })
    },[descriptor])
    
    const[roleName, setRoleNames] = useState([]);
    useEffect(() => {
      Axios.get('http://localhost:3001/getRole')
      .then(response =>{
          setRoleNames(response.data.data);
      })
    }, [])

    const classes = useStyles();
  
    let a = [];

    const AddDesc = ()=>{ 
      if(!value || !desc || !role || !track || !status){
        alert('Please fill all the fields');
      }else{
        Axios.post('http://localhost:3001/AddDescriptor',{
          value:value,
          desc: desc,
          role : role,
          track : track,
          status : status
        }).then(res=>{
          console.log(res);
          if(res.data.data.success === true){
              setDescriptor(!descriptor);
              alert("Descriptor added Successfully....");
          }else{
              alert("Unable to add Descriptor");
          }
        });
      }      
    }
    // function ConditionalValidationGrid() {
    //   const apiRef = useGridApiRef();
    // }
    
    return (
     
      <div className="content"><br/><br/>
        <center><h1>Competency Descriptor</h1><br/>
          <div class="row">
            <div class="col-25">
                <label for="competency_area">Competency Area</label>  
            </div>
            <div class="col-75">
              <select id="competency_area" name="competency_area" onChange={e=> setValue(e.target.value)} >
                <option value="competency">Select Competency Area </option>
                  {
                    names.map((value)=>{  
                      return(<option value={value.Area_id}>{value.AreaName}</option>)
                    })
                  }
              </select>                {/* /{console.log(value)} */}
            </div>
          </div>          
        <div class="row">
          <div class="col-25">
            <label for="competencydescriptor">Competency Descriptor</label>
          </div>
          <div class="col-75">
            <textarea type='text' id="competencydescriptor" name='competencydescriptor' placeholder="Competency Descriptor" 
              onChange={e=>{
                setDesc(e.target.value)
            }} required/> 
          </div>
        </div>
        <div class="row">
            <div class="col-25">
                <label for="role">Select Role</label>  
            </div>
            <div class="col-75">
              <select id="role" name="role" onChange={e=> setRole(e.target.value)} >
                <option value="role">Select Role </option>
                  {
                    roleName.map((roleNameValue)=>{  
                      return(<option value={roleNameValue.role_id}>{roleNameValue.role_name}</option>)
                    })
                  }
              </select>                {/* /{console.log(value)} */}
            </div>
          </div>
          <div class="row">
            <div class="col-25">
              <label for="track">Track</label>
            </div>
            <div class="col-75">
              <select id="track" name="track" onChange={e=> setTrack(e.target.value)} >
                <option value="track"> Select Track </option>
                <option value="CRM_QA_Track"> CRM QA Track </option>                  
                <option value="CRM_DEV_Track"> CRM DEV Track </option>  
              </select>     
            </div>
          </div>
          <div class="row">
            <div class="col-25">
                <label for="status">Select Status</label>  
            </div>
            <div class="col-75">
              <select id="status" name="status" onChange={e=> setStatus(e.target.value)} >
                <option value="status"> Select Status </option>
                <option value="Active"> Active </option>                  
                <option value="Inactive"> Inactive </option>  
              </select>               
            </div>
          </div>        
        <br/>
        <button onClick={AddDesc}>Save</button><br/>
        <h3>List of Competency Descriptor</h3>
          <div className={classes.root}>
            {
              names.map((value)=>{   
                a = []
                return(
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                      <Typography className={classes.heading}>{value.AreaName}</Typography>
                    </AccordionSummary>
                    {              
                      roleName.map((val) => {  
                        details.map((value1) => {
                          if(value1.Area_id === value.Area_id && val.role_id === value1.Role_id){                                                     
                              let b = {
                                id : value1.Desc_id,
                                descriptor : value1.Description,                              
                                role : val.role_name,                             
                                track : value1.Track,
                                status : value1.Status
                              }
                              a.push(b);
                          }                              
                        })  
                      })  
                    }
                    <AccordionDetails>
                      <div style={{ height: 380, width: '100%', backgroundColor: 'white' }}>
                        <DataGrid
                          rows = {a}
                          columns = {columns}
                          pageSize = {5}
                          //  disableSelectionOnClick
                          // onSelectionModelChange={(id) => {
                          //   alert(id);
                          //   //setValue();
                          //   setDesc(descriptor);
                          // }}
                          />
                      </div>
                    </AccordionDetails>
                  </Accordion>
                )
              })
            }  
          </div>
        </center><br/>
        
      </div>

    );
}
