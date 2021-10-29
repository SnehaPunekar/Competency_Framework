const CompetencyArea  = require( '../libs/db/actions/CompetencyAreaActions');
const Roles = require('../libs/db/actions/RolesAction');
const CompetencyDescriptor = require('../libs/db/actions/CompetencyDescriptorActions');
const Rating = require('../libs/db/actions/RatingAction');
const Review = require('../libs/db/actions/ReviewCycleAction');
const TemplateName = require('../libs/db/actions/TemplateNameAction');
const AssignTemp = require('../libs/db/actions/AssignTemplateAction');
const SelfAssessment = require('../libs/db/actions/SelfAssessmentAction');
const LeadAssessment = require('../libs/db/actions/LeadAssessmentAction');

class AdminServices{

    constructor(){
        this.getCompetencyArea = new CompetencyArea();
        this.getRoles = new Roles();
        this.getCompetencyDescriptor = new CompetencyDescriptor();
        this.getRating = new Rating();
        this.getReview = new Review();
        this.getAssignTemp = new AssignTemp();
        this.getTemplateName = new TemplateName();
        this.getSelfAssessment = new SelfAssessment();
        this.getLeadAssessment = new LeadAssessment();
    }

    getAllCompetencyAreas = async function() {
        let response = await this.getCompetencyArea.GetCompetencyArea();
        return response;
    }

    addCompetencyAreas = async function(AreaName){
        let response = await this.getCompetencyArea.AddCompetencyArea(AreaName);
        return response;
    }

    getAllRoles = async function (){
        let response = await this.getRoles.GetRoles();
        return response;
    }

    getAllCompetencyDescriptor = async function () {
        let response = await this.getCompetencyDescriptor.GetCompetencyDescriptor();
        return response;
    }

    addCompetencyDescriptor = async function(areaName, desc, role, track, status){
        let response = await this.getCompetencyDescriptor.AddCompetencyDescriptor(areaName, desc, role, track, status);
        return response;
    }

    getAllRating = async function(){
        let response = await this.getRating.GetRating();
        return response;
    }

    addRating = async function(ratingName, ratingDesc){
        let response = await this.getRating.AddRating(ratingName, ratingDesc);
        return response;
    }
    
    getAllReview = async function(){
        let response = await this.getReview.GetReviewCycle();
        return response;
    }

    addReview = async function(reviewName,start,end){
        let response = await this.getReview.AddReviewCycle(reviewName,start,end);
        return response;
    }
    
    getAllTemplateName = async function(){
        let response = await this.getTemplateName.GetTemplateName();
        return response;
    }

    addTemplateName = async function(tempName){
        let response = await this.getTemplateName.AddTemplateName(tempName);
        return response;
    }

    addTemplate = async function(tid,s){
        let response = await this.getTemplateName.AddTemplate(tid,s);
        return response;
    }

    addAssignTemp = async function (tempId,reviewCId,empId) {
        let response = await this.getAssignTemp.AddAssignTemp(tempId,reviewCId,empId);
        return response;
    }

    getAllSelfAssessment = async function (review_id, emp_id) {
        let response = await this.getSelfAssessment.GetSelfAssessment(review_id, emp_id);
        return response;
    }

    addSelfAssessment = async function (review_id, emp_id, assessmentArr) {
        let response = await this.getSelfAssessment.AddSelfAssessment(review_id, emp_id, assessmentArr);
        return response;
    }

    getAllLeadAssessment = async function (review_id, emp_id) {
        let response = await this.getLeadAssessment.GetLeadAssessment(review_id, emp_id);
        return response;
    }

    addLeadAssessment = async function (review_id, emp_id, assessmentArr) {
        let response = await this.getLeadAssessment.AddLeadAssessment(review_id, emp_id, assessmentArr);
        return response;
    }
}
module.exports = AdminServices;
