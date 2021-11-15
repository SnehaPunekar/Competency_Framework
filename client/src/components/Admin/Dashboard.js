import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState , useEffect} from 'react';
import Axios from 'axios';

const data = [
  {
    name: 'Developer',
    Emp: 17.5,
    Lead: 8,
  },
  {
    name: 'Leadership',
    Emp: 15,
    Lead: 4,
  },
  {
    name: 'Consulting',
    Emp: 8,
    Lead: 19,
  },  
];

export default function Dashboard() {
    
  const[AreaRating, setAreaRating] = useState([]);
  //const[change,setChange] = useState(false);

  useEffect(() => {
      Axios.get('http://localhost:3001/getCompetencyAreaRating')
      .then(response =>{
          console.log(response.data);
          setAreaRating(response.data.data);
      })
  }, [])

    return (
        <div className="content">
        <center>
        <h1>Dashboard</h1></center>
        <h2>Average Rating</h2><center>
        <div class="row">
            <div class="col-70">
            <ResponsiveContainer width="70%" aspect={2}>
                <BarChart
                width={500}
                height={300}
                data={AreaRating}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name"/>
                <YAxis />
                <Tooltip />
                <Legend />          
                <Bar dataKey="Emp" fill="#82ca9d"/>
                <Bar dataKey="Lead" fill="#8884d8"/>
                </BarChart>
            </ResponsiveContainer>        
            </div>
            <div class="col-20">
                <table height='80' width ='40'>
                    <tr><th>Rating </th><th>Value</th></tr>
                    <tr><td>A</td><td>20</td></tr>
                    <tr><td>B</td><td>15</td></tr>
                    <tr><td>C</td><td>10</td></tr>
                    <tr><td>I</td><td>5</td></tr>
                </table>
            </div>
            <div class="col-10"></div>
      </div>
      </center></div>
    );
}
