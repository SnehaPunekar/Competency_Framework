import '../../assests/css/ChangePassword.css';
import React from 'react';
import Axios from 'axios';
import {useState} from 'react'

function AddTemplate() {

    const[tempName,setTempName] = useState('');
    const[change,setChange]=useState(false)

    const AddTemplateName = ()=> {
                 Axios.post('http://localhost:3001/addTemplateName',
                 {tempName:tempName,
               }).then(res => {
        
                   setChange(!change);

               })
           }
    return (
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
                {/* {
                    ratings.map((value)=>{  
                        return(
                            <tr><td>{value.rating_id}</td><td>{value.rating_name}</td><td>{value.description}</td></tr> 
                        ) */}
                    {/* })
                } */}
            </table><br/><br/><br/><br/>
            </center><br/>
        </div>
    )
}

export default AddTemplate

// import '../../assests/css/ChangePassword.css';
// import React from 'react';
// import Axios from 'axios';
// import {useState} from 'react'

// function AddTemplate() {

//     const[tempName,setTempName] = useState('');
//     const[change,setChange]=useState(false)

//     const AddTemplateName = ()=> {
//                  Axios.post('http://localhost:3001/addTemplateName',
//                  {tempName:tempName,
//                }).then(res => {
        
//                    setChange(!change);

//                })
//            }
//     return (
//         <div className="content">
//             <center>
//             <h1>Add Template</h1>
//             <div class="row">
//                 <div class="col-25">
//                     <label for="tname">Template Name</label>
//                 </div>
//                 <div class="col-75">
//                     <input type="text" id="tname" name="template_name" 
//                     placeholder="Template Name" required
//                     onChange={(e)=>{
//                     setTempName(e.target.value);}}/>
//                 </div>
//             </div>
//             <br/><br/>
//             <button onClick={AddTemplateName}>Add Template Name</button><br/>
//             </center><br/>
//         </div>
//     )
// }

// export default AddTemplate
