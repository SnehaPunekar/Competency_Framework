const TemplateName = require('../libs/db/actions/TemplateNameAction');
const CompetencyArea  = require( '../libs/db/actions/CompetencyAreaActions');
const Rating = require('../libs/db/actions/RatingAction');
const Review = require('../libs/db/actions/ReviewCycleAction');
const AssignTemp = require('../libs/db/actions/AssignTemplateAction');
class AdminServices{

    constructor(){
        this.getCompetencyArea = new CompetencyArea();
        this.getRating = new Rating();
        this.getReview = new Review();
        this.AssignTemp = new AssignTemp();
        this.getTemplateName = new TemplateName();
    }

    getAllCompetencyAreas = async function() {
        let response = await this.getCompetencyArea.GetCompetencyArea();
        return response;
    }

    addCompetencyAreas = async function(AreaName){
        let response = await this.getCompetencyArea.AddCompetencyArea(AreaName);
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

    getAllReview = async function(){
        let response = await this.getReview.GetReviewCycle();
        return response;
    }

    addReview = async function(reviewName,start,end){
        let response = await this.getReview.AddReviewCycle(reviewName,start,end);
        return response;
    }

}
module.exports = AdminServices;
