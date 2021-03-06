const CompetencyArea  = require( '../libs/db/actions/CompetencyAreaActions');
const Roles = require('../libs/db/actions/RolesAction');
const CompetencyDescriptor = require('../libs/db/actions/CompetencyDescriptorActions');
const Rating = require('../libs/db/actions/RatingAction');
const Review = require('../libs/db/actions/ReviewCycleAction');
const TemplateName = require('../libs/db/actions/TemplateNameAction');
const AssignTemp = require('../libs/db/actions/AssignTemplateAction');
const SelfAssessment = require('../libs/db/actions/SelfAssessmentAction');
const LeadAssessment = require('../libs/db/actions/LeadAssessmentAction');
const AverageRatingDashboard = require('../libs/db/actions/AverageRatingDashboardAction');
const TotalAssessmentDashboard = require('../libs/db/actions/TotalAssessmentDashboardAction');
const AssessmentStatusDashboard = require('../libs/db/actions/AssessmentStatusDashboardAction');

class AdminServices{

    constructor(){
        this.getCompetencyArea = new CompetencyArea();
        this.getRoles = new Roles();
        this.getCompetencyDescriptor = new CompetencyDescriptor();
        this.getRating = new Rating();
        this.getReview = new Review();
        this.getAssignTemp = new AssignTemp();
        this.getTemplate = new TemplateName();
        this.getSelfAssessment = new SelfAssessment();
        this.getLeadAssessment = new LeadAssessment();
        this.averageRatingDashboard = new AverageRatingDashboard();
        this.totalAssessmentDashboard = new TotalAssessmentDashboard();
        this.assessmentStatusDashboard = new AssessmentStatusDashboard();
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

    changeStatusById = async function (descriptorId, descriptorStatus) {
        let response = await this.getCompetencyDescriptor.ChangeStatusById(descriptorId, descriptorStatus);
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

    updateAllReview = async function(reviewId, status){
        let response = await this.getReview.UpdateReviewCycle(reviewId, status);
        return response;
    }

    addReview = async function(reviewName,start,end,status){
        let response = await this.getReview.AddReviewCycle(reviewName,start,end,status);
        return response;
    }
    
    getAllTemplateName = async function(){
        let response = await this.getTemplate.GetTemplateName();
        return response;
    }

    getRoleName = async function(temp_id){
        let response = await this.getTemplate.GetRoleName(temp_id);
        return response;
    }

    addTemplateName = async function(tempName){
        let response = await this.getTemplate.AddTemplateName(tempName);
        return response;
    }

    addTemplate = async function(tid, roleid, s){
        let response = await this.getTemplate.AddTemplate(tid, roleid, s);
        return response;
    }

    deleteTemplate = async function(tid,s){
        let response = await this.getTemplate.DeleteDescriptor(tid, s);
        return response;
    }

    getAllTemplateDescriptor = async function(temp_id){
        let response = await this.getTemplate.GetTemplateDescriptor(temp_id);
        return response;
    }

    getAllDescriptorByRole = async function(roleId){
        let response = await this.getTemplate.GetDescriptorByRole(roleId);
        return response;
    }

    getAllEmpNames = async function(roleId){
        let response = await this.getAssignTemp.GetEmpNames(roleId);
        return response;
    }

    addAssignTemp = async function (tempId,reviewCId,empId) {
        let response = await this.getAssignTemp.AddAssignTemp(tempId,reviewCId,empId);
        return response;
    }
    
    getEmpNamesByTemplate = async function (reviewCId) {
        let response = await this.getAssignTemp.ViewAssignedTemplate(reviewCId);
        return response;
    }

    getActiveReviewCycle = async function(){
        let response = await this.getSelfAssessment.GetActiveReviewCycle();
        return response;
    }

    getAllSelfAssessment = async function (review_id, emp_id) {
        let response = await this.getSelfAssessment.GetSelfAssessment(review_id, emp_id);
        return response;
    }

    ViewAllSelfAssessment = async function (review_id, emp_id) {
        let response = await this.getSelfAssessment.ViewSelfAssessment(review_id, emp_id);
        return response;
    }

    addSelfAssessment = async function (review_id, emp_id, assessmentArr, draft) {
        let response = await this.getSelfAssessment.AddSelfAssessment(review_id, emp_id, assessmentArr, draft);
        return response;
    }

    getEmployee = async function (leadName) {
        let response = await this.getLeadAssessment.GetEmployee(leadName);
        return response;
    }

    getAllLeadAssessment = async function (review_id, emp_id) {
        let response = await this.getLeadAssessment.GetLeadAssessment(review_id, emp_id);
        return response;
    }

    ViewAllLeadAssessment = async function (review_id, emp_id) {
        let response = await this.getLeadAssessment.ViewLeadAssessment(review_id, emp_id);
        return response;
    }

    addLeadAssessment = async function (review_id, emp_id, assessmentArr, lead_draft) {
        let response = await this.getLeadAssessment.AddLeadAssessment(review_id, emp_id, assessmentArr, lead_draft);
        return response;
    }

    getRatingValue = async function (roleId, reviewId) {
        let response = await this.averageRatingDashboard.GetRatingValue(roleId, reviewId);
        return response;
    }

    getSelfAssessmentByRole = async function (roleId, reviewId) {
        let response = await this.assessmentStatusDashboard.GetSelfAssessmentByRole(roleId, reviewId);
        return response;
    }

    getLeadAssessmentByRole = async function (roleId, reviewId) {
        let response = await this.assessmentStatusDashboard.GetLeadAssessmentByRole(roleId, reviewId);
        return response;
    }

    getTotalEmployee = async function () {
        let response = await this.totalAssessmentDashboard.GetTotalEmp();
        return response;
    }

    getTotalSelfAssessment = async function (reviewId) {
        let response = await this.totalAssessmentDashboard.GetSelfAssessmentCount(reviewId);
        return response;
    }

    getTotalLead = async function () {
        let response = await this.totalAssessmentDashboard.GetTotalLead();
        return response;
    }

    getTotalLeadAssessment = async function (reviewId) {
        let response = await this.totalAssessmentDashboard.GetLeadAssessmentCount(reviewId);
        return response;
    }

}
module.exports = AdminServices;
