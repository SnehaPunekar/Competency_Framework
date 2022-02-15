import '../../assests/css/Style.css';
import React from 'react';
import Axios from 'axios';
import {useState, useEffect} from 'react';
import '../../assests/css/Preloader.css';

function AddTemplate() {   
      
    const[tempName, setTempName] = useState('');
    
    const AddTemplateName = ()=> {
        if(!tempName){
            alert('Please fill the field');
        }else{
            Axios.post('http://localhost:3001/addTemplateName',
                {tempName:tempName,
            }).then(res => {
                console.log(res.data.flag);
                if(res.data.flag === false){
                  alert('This Name already exits. Please enter new name.')
                }
                else{
                  alert('Added successfully!')
                }
                setChange(!change);
            });
        }               
    }

    const[change, setChange] = useState(false);
    const [loading, setloading] = useState(undefined);
    const [completed, setcompleted] = useState(undefined);
    const[tempnames, setTempNames] = useState([]);

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
            <h1>Add Template</h1>
            <div class="row">
                <div class="col-25">
                    <label for="tname">Template Name</label>
                </div>
                <div class="col-75">
                    <input type="text" id="tname" name="template_name" 
                    placeholder="Template Name" required
                    onChange={(e)=>{
                    setTempName(e.target.value);}}/>
                </div>
            </div>
            <br/><br/>
            <button onClick={AddTemplateName}>Add Template Name</button><br/>
            <h3>List of Template Names</h3>            
            <table id="templateName">
                <tr><th>Sr. No.</th><th>Template Name</th></tr>
                {
                    tempnames.map((value)=>{  
                        return(
                            <tr><td>{value.Temp_id}</td><td>{value.TempName}</td></tr> 
                        )
                    })
                }
            </table><br/><br/><br/><br/>
            </center><br/>
        </div>
         )}
     </>
    )
}

export default AddTemplate;
