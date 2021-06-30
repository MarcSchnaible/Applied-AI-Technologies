/*
*  Class which transform a pose in differents body parts as vectors
*/
class PoseService {
    /**
    * Class to separate a JSON object of Posenet into differents parts of the human body
    * 
    * The keys are:
    * 
    * 0	    Nase
    * 1	    linkes Auge
    * 2	    rechtes Auge
    * 3	    linkes Ohr
    * 4	    rechtes Ohr
    * 5	    linke Schulter
    * 6	    rechte Schulter
    * 7	    leftElbow
    * 8	    rechter Ellbogen
    * 9	    linkes Handgelenk
    * 10	rechtes Handgelenk
    * 11	linke Hüfte
    * 12	Rechte Hüfte
    * 13	linkes Knie
    * 14	rechtes Knie
    * 15	linker Knöchel
    * 16	rechter Knöchel
    */
    private rightUpperArm_keys = [6,8];
    private leftUpperArm_keys = [5,7];
    private rightLowerArm_keys = [8,10];
    private leftLowerArm_keys = [7,9];
    private rightUpperLeg_keys = [12,14];
    private leftUpperLeg_keys = [11,13];
    private rightLowerLeg_keys = [14,16];
    private leftLowerLeg_keys = [13,15];

    private shoulders_keys = [5,6];
    private waists_keys  = [11,12];
    
    //The body parts
    private rightUpperArm: any; 
    private leftUpperArm: any;
    private rightLowerArm: any;
    private leftLowerArm: any;
    private rightUpperLeg: any;
    private leftUpperLeg: any;
    private rightLowerLeg: any;
    private leftLowerLeg: any;
    private shoulders: any;
    private waists: any;

    /**
     * Constructor of PoseService. Transform a pose in differents body parts
     * @param pose - pose of a user or coach
     */
    constructor(pose: JSON){
        const keypoints = pose["keypoints"];
        this.rightUpperArm  = this.createVector(keypoints, this.rightUpperArm_keys);
        this.leftUpperArm   = this.createVector(keypoints, this.leftUpperArm_keys);
        this.rightLowerArm  = this.createVector(keypoints, this.rightLowerArm_keys);
        this.leftLowerArm   = this.createVector(keypoints, this.leftLowerArm_keys);
        this.rightUpperLeg  = this.createVector(keypoints, this.rightUpperLeg_keys);
        this.leftUpperLeg   = this.createVector(keypoints, this.leftUpperLeg_keys);
        this.rightLowerLeg  = this.createVector(keypoints, this.rightLowerLeg_keys);
        this.leftLowerLeg   = this.createVector(keypoints, this.leftLowerLeg_keys);
        this.shoulders      = this.createVector(keypoints, this.shoulders_keys);
        this.waists         = this.createVector(keypoints, this.waists_keys);
    }

    public getRightUpperArm(){
        return this.rightUpperArm;
    }

    public getLeftUpperArm(){
        return this.leftUpperArm;
    }

    public getLeftLowerArm(){
        return this.leftLowerArm;
    }

    public getRightUpperLeg(){
        return this.rightUpperLeg;
    }

    public getRightLowerArm(){
        return this.rightLowerArm;
    }

    public getLeftUpperLeg(){
        return this.leftUpperLeg;
    }

    public getRightLowerLeg(){
        return this.rightLowerLeg;
    }

    public getLeftLowerLeg(){
        return this.leftLowerLeg;
    }

    public getShoulders(){
        return this.shoulders;
    }

    public getWaists(){
        return this.waists;
    }

    /**
     * Create a vector from a pose keypoints and the keys which defines each body part
     * @param keypoints - Keypoints of the JSON pose
     * @param points    - keys that defines a body part
     * @returns body part as vector
     */
   private createVector(keypoints: any, points: any){
    const xfirstPoint = keypoints[points[0]]["position"]["x"];
    const yfirstPoint = keypoints[points[0]]["position"]["y"];
    const xsecondPoint = keypoints[points[1]]["position"]["x"];
    const ysecondPoint = keypoints[points[1]]["position"]["y"];
    
    const xVector = xsecondPoint - xfirstPoint;
    const yVector = ysecondPoint - yfirstPoint;
    const vector = {xVector, yVector};
    return vector;
   }
}

export {PoseService};
