import { Injectable } from "@angular/core";
import {PoseService} from "./PoseService";

@Injectable({
    providedIn: 'root'
})
/**
 * Class that compare two PoseServices
 */
  export class CompareService {
    private userPoseService: PoseService;
    private coachPoseService: PoseService;

    /**
     * Constructor of CompareService. It transform the two poses of user and coach into PoseService
     * @param userPose - Pose of the user
     * @param coachPose - Pose of the coach
     */
    constructor(userPose: any, coachPose: any){
        this.userPoseService = new PoseService(userPose);
        this.coachPoseService = new PoseService(coachPose);
    }

    /**
     * Compare if the position of the right arm is the same with the coach
     * @returns true if are the same, otherwise false
     */
    compareRightArm(){
        var areRightUpperArmSame = this.compare(this.userPoseService.getRightUpperArm(), this.coachPoseService.getRightUpperArm());
        var areRightLowerArmSame = this.compare(this.userPoseService.getRightLowerArm(), this.coachPoseService.getRightLowerArm());
        return areRightUpperArmSame && areRightLowerArmSame
    }

    /**
     * Compare if the position of the left arm is the same with the coach
     * @returns true if are the same, otherwise false
     */
    compareLeftArm(){
        var areLeftUpperArmSame = this.compare(this.userPoseService.getLeftUpperArm(), this.coachPoseService.getLeftUpperArm());
        var areLeftLowerArmSame = this.compare(this.userPoseService.getLeftLowerArm(), this.coachPoseService.getLeftLowerArm());
        return areLeftUpperArmSame && areLeftLowerArmSame
    }

    /**
     * Compare if the positions of the left and right arm are the same with the coach
     * @returns true if are the same, otherwise false
     */
    compareArms(){
        return this.compareRightArm() && this.compareLeftArm();
    }

    /**
     * Compare if the position of the left leg is the same with the coach
     * @returns true if are the same, otherwise false
     */
    compareLeftLeg(){
        var areLeftUpperLegSame = this.compare(this.userPoseService.getLeftUpperLeg(), this.coachPoseService.getLeftUpperLeg());
        var areLeftLowerLegSame = this.compare(this.userPoseService.getLeftLowerLeg(), this.coachPoseService.getLeftLowerLeg());
        return areLeftLowerLegSame && areLeftUpperLegSame;
    }

    /**
     * Compare if the position of the right leg is the same with the coach
     * @returns true if are the same, otherwise false
     */
    compareRightLeg(){
        var areRightUpperLegSame = this.compare(this.userPoseService.getRightUpperLeg(), this.coachPoseService.getRightUpperLeg());
        var areRightLowerLegSame = this.compare(this.userPoseService.getRightLowerLeg(), this.coachPoseService.getRightLowerLeg());
        return areRightLowerLegSame && areRightUpperLegSame;
    }

    /**
     * Compare if the positions of the left and right leg are the same with the coach
     * @returns true if are the same, otherwise false
     */
    compareLegs(){
        return this.compareLeftLeg() && this.compareRightLeg()
    }

     /**
     * Compare if the position of the shoulder is the same with the coach
     * @returns true if are the same, otherwise false
     */
    compareShoulders(){
        return this.compare(this.userPoseService.getShoulders(), this.coachPoseService.getShoulders());
    }

    /**
     * Compare if the position of the waist is the same with the coach
     * @returns true if are the same, otherwise false
     */
    compareWaists(){
        return this.compare(this.userPoseService.getWaists(), this.coachPoseService.getWaists());
    }

    /**
     * Compare if the posture (back) is the same with the coach. Here shoulders and waists will be compared
     * @returns true if are the same, otherwise false
     */
    comparePosture(){
        return this.compareShoulders() && this.compareWaists();
    }

    /**
     * Compare if the posture of the whole bode is the same with the coach
     * @returns true if are the same, otherwise false
     */
    compareCompleteBody(){
        return this.compareLegs() && this.compareArms();
    }

    /**
     * Compare the two vectors of user and coach using the angle between them.
     * @param userPoseVectorPart  - Vector of the body part of the user
     * @param coachPoseVectorPart - Vector of the body part of the coach
     * @returns true if the angle is between some range, otherwise false
     */
    private compare(userPoseVectorPart: any, coachPoseVectorPart: any) {
        const angle = this.calculateAngle(userPoseVectorPart, coachPoseVectorPart);
        return (angle < 1.08 && angle > 0.92)
      }

    /**
    * Calculate the angle between two vectors 
    * @param vector_1 vector of the user 
    * @param vector_2 vector of the coach
    * @returns the angle between the two coaches
    */
    private calculateAngle(vector_1: any, vector_2: any){
        const xVector1 = vector_1.xVector;
        const yVector1 = vector_1.yVector;
        const xVector2 = vector_2.xVector;
        const yVector2 = vector_2.yVector;
        const lengthVector1 = (Math.sqrt((yVector1 * yVector1) + (xVector1 * xVector1)));
        const lengthVector2 = (Math.sqrt((yVector2 * yVector2) + (xVector2 * xVector2)));
        
        const angle = (((yVector1 * yVector2) + (xVector1 * xVector2))/(lengthVector1 * lengthVector2));
        return angle;
    }
}

