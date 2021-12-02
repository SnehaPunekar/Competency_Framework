import '../../assests/css/Style.css';
import React from 'react';
import {useState, useEffect} from 'react';
import Axios from 'axios';

function AddRatings() {

    const[ratingSymbol, setRatingSymbol] = useState('');
    const[ratingDesc, setRatingDesc] = useState('');    
    const[ratings, setRatings] = useState([]);    

    const addRatings = ()=>{
        if(!ratingSymbol || !ratingDesc){
            alert('Please fill all the fields');
        }else{
            Axios.post('http://localhost:3001/addRatings',
            {
                ratingName:ratingSymbol,
                ratingDesc:ratingDesc
            }
            ).then(response =>{
                setChange(!change);
            });
        }        
    }

    const[change, setChange] = useState(false);

    useEffect(() => {
        Axios.get('http://localhost:3001/getRatingDetails')
        .then(response =>{
            console.log('response');
            console.log(response);
            setRatings(response.data.data);
           // setChange(false);
        })
    }, [change])

    return (
        <div className="content">
            <center><h1>Add Ratings</h1>
            <div class="row">
                <div class="col-25">
                    <label for="ratingname">Rating Name</label>
                </div>
                <div class="col-75">
                    <input type="text" id="ratingname" name="ratingname" 
                    placeholder="Rating Name" required
                    onChange={(e)=>{
                      //  setChange(!change);
                    setRatingSymbol(e.target.value);
                      }}/>
                </div>
            </div>
            <div class="row">
                <div class="col-25">
                    <label for="description">Description</label>
                </div>
                <div class="col-75">
                    <input type="text" id="description" name="discription" 
                    placeholder="Description" required
                    onChange={(e)=>{
                        setRatingDesc(e.target.value);
                      }}/>
                </div>
            </div>
            <button onClick={addRatings}>Save</button><br/>
            <h3>List of Assessment Ratings</h3>            
            <table id="rating">
                <tr><th>Sr. No.</th><th>Rating</th><th>Description</th></tr>
                {
                    ratings.map((value)=>{  
                        return(
                            <tr><td>{value.rating_id}</td><td>{value.rating_name}</td><td>{value.description}</td></tr> 
                        )
                    })
                }
            </table><br/><br/><br/><br/>
            </center> 
        </div>
    )
}

export default AddRatings;