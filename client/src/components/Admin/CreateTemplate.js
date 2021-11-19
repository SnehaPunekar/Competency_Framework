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


const columns = [
  { field: 'id', headerName: 'ID', width: 120 },
  {
    field: 'descriptor',
    headerName: 'Descriptor',
    width: 920,
    sortable:true,
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
function CreateTemplate() {
  let a = [];
  let descId = [];
  const[tempnames,setTempNames] = useState([]); 
  const[tempValue, setTempValue ] = useState(0);
  const[roleValue, setRoleValue ] = useState(0);
  const[change,setChange] = useState(false);
  const[details,setDetails] = useState([]);
  const[names,setNames] =useState([]);
  const[roles,setRoles] = useState([]);


    const classes = useStyles();

    const AddCompDesc = ()=>{
        Axios.post('http://localhost:3001/addTemplate',{
          tid:tempValue,
          descId :descId
        }).then(response =>{
          console.log(response);
          if(response.data.data.success === true){
              alert('Template Created Successfully');
          }else{
              alert("Unable to Create Template");
          }
        })      
    }

    useEffect(() => {
      Axios.get('http://localhost:3001/getTemplateNames')
      .then(response =>{
          setTempNames(response.data.data);
      })
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


    const getDescriptorByRole = ()=>{
      if(!roleValue)
      {        
        alert('Please fill the field');
      }else{
        Axios.post('http://localhost:3001/getDescriptorByRole',{
          role : roleValue
        }).then(res =>{
          console.log("In Response");
          if(res.data){
            console.log(res.data.data);
            setDetails(res.data.data);
            console.log(details);
            alert('Descriptors fetched.');
          }
        });
      }      
    }
    return (
        <div className="content">
            <center>
            <h1>Create Template</h1>
            <div class="row">
              <div class="col-25">
                  <label for="template_name">Template Name</label>  
              </div>
              <div class="col-75">
                  <select id="template_name" name="template_name"
                   onChange={e=> setTempValue(e.target.value)}>
                      <option value="template_1">Select Template Name </option>
                      {
                        tempnames.map((value)=>{  
                        return(
                            <option value={value.Temp_id}>{value.TempName}</option>
                        )
                    })
                }
                  </select>
              </div>
            </div> 
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
                <div class="col-25">
                    <button onClick={getDescriptorByRole}>Search</button>
                </div>
              </div>
              </div>
              

            <div className={classes.root}>
             {
               
              names.map((value)=>{ 
                   a = []
                   return(
                  <Accordion>
                   <AccordionSummary
                     expandIcon={<ExpandMoreIcon />}
                   aria-controls="panel1a-content"                     
                   id="panel1a-header"
                  >
                 <Typography className={classes.heading}>{value.AreaName}</Typography>
                   </AccordionSummary>                     {
                  details.map(value1=>{
                  // {console.log("Value 001",value1)}
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
                id.map(v=>{
                     descId.push(v)
                  })
              }}
               />
              </div>
         </AccordionDetails>
           </Accordion>
        )
        }
      )
    }
</div>       
            <br/><br/>
            <button onClick={AddCompDesc}>Save</button><br/>
            </center><br/>
        </div>
    )
}

export default CreateTemplate;
