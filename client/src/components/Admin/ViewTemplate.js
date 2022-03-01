import '../../assests/css/Style.css';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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

export default function ViewTemplate() {
  // eslint-disable-next-line no-unused-vars
  const classes = useStyles();  
  let a =[];
  const[TempNames,setTempNames] = useState([]);
  const[value,setValue] = useState('');
  const[roleName, setRoleName] = useState('');
  // eslint-disable-next-line no-unused-vars
  const[names,setNames] = useState([]);
  const[details,setDetails] = useState([]);
  const[change,setChange] = useState(false);
  const [loading, setloading] = useState(undefined);
  const [completed, setcompleted] = useState(undefined);

  useEffect(() => {
    Axios.get('http://localhost:3001/getTemplateNames')
    .then(response =>{
        setTempNames(response.data.data);
    })
  }, [change])

  useEffect(() => {
    setTimeout(()=> {
    Axios.get('http://localhost:3001/getCompetencyAreaNames')
    .then(response =>{
      setNames(response.data.data);
      setloading(true);

            setTimeout(() => {
                 setcompleted(true);
              }, 0);
        })
    }, 1500);
  }, [value])

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
        <h1>View Template</h1>
        <br/><br/>      
          <div class="row">
            <div class="col-25">
                <label for="competency_area">Template Name</label>  
            </div>
            <div class="col-75">
              <select id="competency_area" name="competency_area"
                onChange={e=>{ 
                setChange(true);
                setValue(e.target.value);}} >
                <option value="competency">Select Template Name</option>
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
          <div style={{ height: 890, width: '85%', background:'white' }}>
            <DataGrid
              rows={a}
              columns={columns}
              pageSize={15}
              disableSelectionOnClick/>
          </div>
      </center><br/>
    </div>
      )}
    </>
  );
}
