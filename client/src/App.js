import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import LoginPage from './components/Login/LoginPage';
import ChangePassword from './components/Login/ChangePassword';
import Navbarmenu from './components/Navbar/NavbarAdmin';
import NavbarLead from './components/Navbar/NavbarLead';
import NavbarEmployee from './components/Navbar/NavbarEmployee';
import AddCompetencyArea from './components/Admin/AddCompetencyArea';
import AddCompetencyDescriptor from './components/Admin/AddCompetencyDescriptor'
import AddTemplate from './components/Admin/AddTemplate';
import CreateTemplate from './components/Admin/CreateTemplate';
import ViewTemplate from './components/Admin/ViewTemplate';
import AssignTemplate from './components/Admin/AssignTemplate';
import ViewAssignedTemplate from './components/Admin/ViewAssignedTemplate';
import AddRatings from './components/Admin/AddRatings';
import ReviewCycle from './components/Admin/ReviewCycle';
import SelfAssessment from './components/common/SelfAssessment';
import LastSelfAssessment from './components/common/LastSelfAssessment';
import LeadAssessment from './components/Lead/LeadAssessment';
import LastLeadAssessment from './components/Lead/LastLeadAssessment';
import NotFound from './components/common/NotFound';
import Dashboard from './components/Admin/Dashboard';

function App() {

  return (
    <div className="App">
    <Router>
      <Switch>
        <Route path='/login' component={LoginPage}/>
        <Route path='/ChangePassword' component={ChangePassword}/>
        {! (localStorage.getItem('id')) && <Redirect push to='/login'></Redirect>}
        {
          localStorage.getItem('id') && localStorage.getItem('role') ==='Admin' &&
            <div>             
                <Navbarmenu />
                <Route path='/Dashboard' component={Dashboard}/>
                <Route path='/AddCompetencyArea' component={AddCompetencyArea}/>
                <Route path='/AddCompetencyDescriptor' component={AddCompetencyDescriptor}/>
                <Route path='/AddRatings' component={AddRatings}/>
                <Route path='/ReviewCycle' component={ReviewCycle}/>
            
                <Route path='/AddTemplate' component={AddTemplate}/>
                <Route path='/createTemplate' component={CreateTemplate}/>
                <Route path='/viewTemplate' component={ViewTemplate}/>
                <Route path='/AssignTemplate' component={AssignTemplate}/> 
                <Route path='/viewAssignedTemplate' component={ViewAssignedTemplate}/>
                
                <Route path='/selfAssessment' component={SelfAssessment}/>
                <Route path='/lastselfassessment' component={LastSelfAssessment}/>
                <Route path='/Logout' render={()=>{ localStorage.clear(); window.location.reload()}} />
            </div> 
         }
         {
           localStorage.getItem('id') && localStorage.getItem('role') ==='Lead' &&
           <div>             
               <Route path='/ChangePassword' component={ChangePassword}/>
               <NavbarLead />
               <Route path='/selfAssessment' component={SelfAssessment}/>
               <Route path='/lastselfassessment' component={LastSelfAssessment}/>
               <Route path='/leadAssessment' component={LeadAssessment}/>
               <Route path='/lastLeadAssessment' component={LastLeadAssessment}/>
               <Route path='/Logout' render={()=>{ localStorage.clear(); window.location.reload()}} />
           </div> 
         }
         {
           localStorage.getItem('id') && localStorage.getItem('role') ==='Developer' &&
           <div>             
               <Route path='/ChangePassword' component={ChangePassword}/>
               <NavbarEmployee />
                                           
               <Route path='/selfAssessment' component={SelfAssessment}/>
               <Route path='/lastselfassessment' component={LastSelfAssessment}/>
               <Route path='/leadAssessment' component={LeadAssessment}/>
               <Route path='/lastLeadAssessment' component={LastLeadAssessment}/>
               <Route path='/Logout' render={()=>{ localStorage.clear(); window.location.reload()}} />
           </div> 
         }
      </Switch>
      </Router>
    </div>    
  );
}


export default App;
