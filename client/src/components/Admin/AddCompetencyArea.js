import '../../assests/css/Style.css';
import React from 'react';
import { useState , useEffect} from 'react';
import Axios from 'axios';
import '../../assests/css/Preloader.css';

function AddCompetencyArea() {

    const [AreaName,SetAreaName]=useState('');
    
    const addcompetencyarea = ()=>{
        if(!AreaName)
        {
            alert("Please enter the Competency Area Name");
        }else{
            Axios.post('http://localhost:3001/AddCompetencyArea',{
                AreaName:AreaName
            }).then(response => {
                setChange(!change);
            });
        }        
    }

    const[names,setNames] = useState([]);
    const[change,setChange] = useState(false);
    const [loading, setloading] = useState(undefined);
    const [completed, setcompleted] = useState(undefined);

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
    }, [change]);
    
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
                <h1>Competency Area</h1>
                <div class="row">
                    <div class="col-25">
                        <label for="competencyarea">Competency Area</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="competencyarea" 
                        name="competencyarea" 
                        placeholder="Enter Competency Area" required onChange={(e)=>{
                        SetAreaName(e.target.value);
            }}/>
                    </div>
                </div>
                <button onClick={addcompetencyarea}>Add</button><br/>
                <h3>List of Competency Area</h3>            
                <table id="competencyarea">
                    <tr><th>Sr. No</th><th>Competency Area</th></tr>
                    {
                    names.map((value)=>{  
                        return(
                            <tr><td>{value.Area_id}</td><td>{value.AreaName}</td></tr> 
                        )
                    })
                }
                </table><br/><br/><br/><br/>
            </center> <br/><br/>
        </div>
        )}
       </>
    ) 
}

export default AddCompetencyArea;
