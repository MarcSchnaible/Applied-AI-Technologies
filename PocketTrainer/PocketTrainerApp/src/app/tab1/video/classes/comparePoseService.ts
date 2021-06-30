import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class ComparePoseService {
    pose: any;

    rightUpperArm = [6,8];
    leftUpperArm = [5,7];
    rightLowerArm = [8,10];
    leftLowerArm = [7,9];
    rightUpperLeg = [12,14];
    leftUpperLeg = [11,13];
    rightLowerLeg = [14,16];
    leftLowerLeg = [13,15];

    compareTwoPoses(pose1: any, pose2: any) {
      var same = false
      const keypoints1 = pose1["keypoints"];
      const keypoints2 = pose2["keypoints"];

      if(this.compare(keypoints1,keypoints2,this.rightUpperArm)){
        if(this.compare(keypoints1,keypoints2,this.leftUpperArm)){
          if(this.compare(keypoints1,keypoints2,this.rightLowerArm)){
            if(this.compare(keypoints1,keypoints2,this.leftLowerArm)){
              if(this.compare(keypoints1,keypoints2,this.rightUpperLeg)){
                if(this.compare(keypoints1,keypoints2,this.leftUpperLeg)){
                  if(this.compare(keypoints1,keypoints2,this.rightLowerLeg)){
                    if(this.compare(keypoints1,keypoints2,this.leftLowerLeg)){
                      same = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
      return same;
    }

    compareTwoPosesOnlyLegs(pose1: any, pose2: any) {
      var same = false
      const keypoints1 = pose1["keypoints"];
      const keypoints2 = pose2["keypoints"];

      if(this.compare(keypoints1,keypoints2,this.rightUpperLeg)){
        if(this.compare(keypoints1,keypoints2,this.leftUpperLeg)){
          if(this.compare(keypoints1,keypoints2,this.rightLowerLeg)){
            if(this.compare(keypoints1,keypoints2,this.leftLowerLeg)){
              same = true;
            }
          }
        }
      }
      return same;
    }

    getVector(keypoints: any, points: any) {
      const xfirstPoint = keypoints[points[0]]["position"]["x"];
      const yfirstPoint = keypoints[points[0]]["position"]["y"];
      const xsecondPoint = keypoints[points[1]]["position"]["x"];
      const ysecondPoint = keypoints[points[1]]["position"]["y"];
      
      const xVektor = xsecondPoint - xfirstPoint;
      const yVektor = ysecondPoint - yfirstPoint;

      const vektor = {xVektor, yVektor}
      
      return vektor
    }

    compare(keypoints1: any, keypoints2: any, points: any) {
      var same = false;

      const xVektor1 = this.getVector(keypoints1, points).xVektor;
      const yVektor1 = this.getVector(keypoints1, points).yVektor;
      const xVektor2 = this.getVector(keypoints2, points).xVektor;
      const yVektor2 = this.getVector(keypoints2, points).yVektor;
      const lengthVektor1 = (Math.sqrt((yVektor1 * yVektor1) + (xVektor1 * xVektor1)));
      const lengthVektor2 = (Math.sqrt((yVektor2 * yVektor2) + (xVektor2 * xVektor2)));

      const angle = (((yVektor1 * yVektor2) + (xVektor1 * xVektor2))/(lengthVektor1 * lengthVektor2));

      if(angle < 1.08 && angle > 0.92) {
        same = true;
      } else {
        same = false;
      }
      return same;
    }

    writePose(pose: any) {
      this.pose = pose;
      this.saveText(JSON.stringify(pose), "pose1.json");
    }

    getPose() {
      return this.pose;
    }

    saveText(text, filename){
      var a = document.createElement('a');
      a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
      a.setAttribute('download', filename);
      a.click()
    }

  }