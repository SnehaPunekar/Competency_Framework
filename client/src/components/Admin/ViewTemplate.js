import '../../assests/css/Style.css';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import { useState, useEffect } from 'react';
import Axios from 'axios';

const columns = [
  { field: 'id', headerName: 'ID', width: 100,type: 'rightAligned',},
  {
    field: 'AreaName',
    headerName: 'AreaName',
    width: 150,
    sortable:true,
    editable: false,
  },
  {
    field: 'descriptor',
    headerName: 'Descriptor',
    width: 800,
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
export default function ViewTemplate() {

  const classes = useStyles();
  
  let a =[];
  let arr = [];
  const[TempNames,setTempNames] = useState([]);
  const[value,setValue] = useState('');
  const[names,setNames] = useState([]);
  const[details,setDetails] = useState([]);
  const[change,setChange] = useState(false);

  useEffect(() => {
    Axios.get('http://localhost:3001/getTemplateNames')
    .then(response =>{
        setTempNames(response.data.data);
    })
}, [])

  useEffect(() => {
  Axios.get('http://localhost:3001/getCompetencyAreaNames')
  .then(response =>{
   setNames(response.data.data);
  })
}, [value])

  useEffect(()=>{
    if(change){
      Axios.post('http://localhost:3001/getTemplateDescriptor',
          {temp_id:value,
        }).then(response =>{
            setDetails(response.data.data);
        })
    }
  },[value])

  return (
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
                  setChange(true)
                   setValue(e.target.value)}} >
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
      <br/><br/><br/>
      {
      details.map(value => {
        let b = {
          id: value.Desc_id,
          AreaName : value.AreaName,
          descriptor:value.Description
        }
        a.push(b);
      })
    }
    <div style={{ height: 400, width: '85%', background:'white' }}>
      <DataGrid
        rows={a}
        columns={columns}
        pageSize={5}
        disableSelectionOnClick
        
      />
      </div>

    </center><br/>
    </div>
  );
}
