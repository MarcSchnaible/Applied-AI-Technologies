import { Component, ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { Plugins } from "@capacitor/core"
const { CameraPreview } = Plugins;
import { CameraPreviewOptions, CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';
import * as posenet from '@tensorflow-models/posenet';
import {drawbody, drawKeypoints, drawLeftArm, drawLeftLeg, drawRightArm, drawRightLeg, drawSkeleton, setColorFalse, setColorTrue} from '../drawing.service';
import '@capacitor-community/camera-preview';
import { ActivatedRoute, Router } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { DataServiceSquad } from './classes/data/dataServiceSquad';
import { CompareService } from './classes/CompareService';

@Component({
  selector: 'app-video',
  templateUrl: './video.page.html',
  styleUrls: ['./video.page.scss'],
})
export class VideoPage implements OnInit{

  model = null;
  image = null;
  cameraActive = false;
  intervallRef: any;
  cssProberty: any;
  cssProbertyCloseButton: any;
  videoSource: string;
  orientation: string;
  video: string;
  coachPose: any;
  counterPose = 1;
  positionCorrect = false;
  mode = "lernModus";

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  constructor(
    private router: Router,
    private activatedRout: ActivatedRoute,
    private screenOrientation: ScreenOrientation,
    private dataServiceSquad: DataServiceSquad
  ) { }

  ngOnInit() {
    this.video = this.activatedRout.snapshot.params['video'];
    if(this.video == 'yoga') {
      this.videoSource = "../../assets/videos/Yoga.mp4"
    }
    if(this.video == 'squad') {
      this.dataServiceSquad.initDataServiceSquad();
      this.videoSource = "../../assets/videos/Squad.mp4"
    }
    this.orientation = this.screenOrientation.type;
    this.screenOrientation.onChange().subscribe(
      () => {
          this.orientation = this.screenOrientation.type;
          this.setCssProberty();
      }
   );
    this.loadModel();
    this.setCssProberty();
    this.openCamera();
    /*
    setTimeout(() => {
      let vid = <HTMLVideoElement>document.getElementById("myVideo");
      vid.pause();
    }, 1500);*/
  }

  setCssProberty(){
    if(this.orientation == "portrait-primary"){
      this.cssProberty = 'max-height: ' + (window.innerHeight) + 'px; top: ' + (0) + 'px;'; //'max-height: ' + (window.innerWidth / 1.8962963) + 'px; top: ' + ((window.innerHeight / 2) - ((window.innerWidth / 1.8962963) / 2)) + 'px;
      this.cssProbertyCloseButton = 'left: 30px; top: 45px;'
    } else {
      this.cssProberty = 'max-height: ' + window.innerHeight + 'px; top: 0px';
      this.cssProbertyCloseButton = 'left: 75px; top: 20px;'
    }
    
  }

  //load the TensorflowModel PoseNet
  async loadModel() {

    // genaues Model aber sehr langsam
    /*
    this.model = await posenet.load({
      architecture: 'ResNet50',
      outputStride: 16,
      inputResolution: { width: 257, height: 200},
      quantBytes: 2
    });
    */

    //ungenaues Model aber schnell...
    this.model = await posenet.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: { width: 257, height: 200},
      multiplier: 0.5
    });
  }

  //opens the front camera
  openCamera() {
    const cameraPreviewOptions: CameraPreviewOptions = {
      position: 'front',
      parent: 'cameraPreview',
      className: 'cameraPreview',
      toBack: true
    };
    CameraPreview.start(cameraPreviewOptions);
    this.cameraActive = true;

    //starts a interval
    this.intervall()
  }

  intervall(){
    this.intervallRef = setInterval(() => {
      this.takePicture();
    }, 100);
  }

  // take a picture
  async takePicture() {
    const cameraPreviewPictureOptions: CameraPreviewPictureOptions = {
      quality: 90
    };

    const result = await CameraPreview.capture(cameraPreviewPictureOptions);
    this.image = `data:image/jpeg;base64,${result.value}`;
    const base64PictureData = result.value;
    if (base64PictureData != 'data:,'){
      this.detect(base64PictureData);
    }
  }

  //detect the joints in image. Gives back a json with the coordinates 
  async detect(image) {
    const pose = await this.model.estimateSinglePose(document.getElementById('image'), {
      flipHorizontal: false
    });

    var video = <HTMLVideoElement>document.getElementById('myVideo');
    video.height = window.innerHeight;
    const poseVideo = await this.model.estimateSinglePose(video, {
      flipHorizontal: false
    });

    if(pose["keypoints"][0]["score"] >= 0.5 && pose["keypoints"][15]["score"] >= 0.5 && pose["keypoints"][16]["score"] >= 0.5) {
      this.positionCorrect = true;
    } else {
      this.positionCorrect = false;
    }

    if (this.mode == "lernModus") {
      this.learning(pose, poseVideo);
    } else if(this.mode == "trainModus") {
      this.training(pose, poseVideo)
    }
  }

  training(pose, poseVideo) {
    let vid = <HTMLVideoElement>document.getElementById("myVideo");
    vid.play();

    const imageWidth = document.getElementById('image').clientWidth;
    const imageHeight = document.getElementById('image').clientHeight;

    this.drawCanvas(pose, this.image, imageWidth, imageHeight, true, true, true, true);
  }

  learning(pose, poseVideo) {
    this.coachPose = this.dataServiceSquad.getPose(this.counterPose);
    let compareService = new CompareService(this.coachPose, poseVideo);
    if (this.counterPose == 1) {
      if (compareService.compareCompleteBody()) {
        let vid = <HTMLVideoElement>document.getElementById("myVideo");
        vid.pause();
      }
    } else {
      if (compareService.compareLegs()) {
        let vid = <HTMLVideoElement>document.getElementById("myVideo");
        vid.pause();
      }
    }
    let vid = <HTMLVideoElement>document.getElementById("myVideo");
    if (vid.paused) {
      let compareService2 = new CompareService(pose, this.coachPose);
      if (compareService2.compareLegs()) {
        let vid = <HTMLVideoElement>document.getElementById("myVideo");
        vid.play();
        if(this.counterPose == 2){
          this.counterPose = 1;
        } else {
          this.counterPose = 2;
        }
      }
    }

    let compareService2 = new CompareService(pose, this.coachPose);

    const imageWidth = document.getElementById('image').clientWidth;
    const imageHeight = document.getElementById('image').clientHeight;

    this.drawCanvas(pose, this.image, imageWidth, imageHeight, compareService2.compareRightArm(), compareService2.compareLeftArm(), compareService2.compareLeftLeg(), compareService2.compareRightLeg());
    

    /*
    let userPose = pose;
    if(this.durchlauf == 1){
      let coachPose = this.dataServiceSquad.getPose(1);
      let compareService = new CompareService(userPose, coachPose);
      if (compareService.compareCompleteBody()) {
        this.durchlauf = 2;
        let vid = <HTMLVideoElement>document.getElementById("myVideo");
        vid.play();
        setTimeout(() => {
          let vid = <HTMLVideoElement>document.getElementById("myVideo");
          vid.pause();
        },750);
      }
    }

    if(this.durchlauf == 2) {
      let coachPose = this.dataServiceSquad.getPose(2);
      let compareService = new CompareService(userPose, coachPose);
      if (compareService.compareLegs()) {
        this.durchlauf = 3;
        let vid = <HTMLVideoElement>document.getElementById("myVideo");
        vid.play();
      }
    }

    */
  }

  onModeUpdate(mode: string){
    this.mode = mode;
  }

  //draw Canvas
  drawCanvas(pose, image, imageWidth, imageHeight, rightArm, leftArm, leftLeg, rightLeg) {
    //const ctx = this.canvas.nativeElement.getContext('2d');
    var canvas = <HTMLCanvasElement> document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    
    ctx.canvas.width = imageWidth;
    ctx.canvas.height = imageHeight;

    

    drawbody(pose, ctx);
    if (rightArm) {
      drawRightArm(pose, ctx, "rgba(185, 219, 154, 0.603)")
    } else {
      drawRightArm(pose, ctx, "rgba(236, 17, 17, 0.603)")
    }
    if (leftArm) {
      drawLeftArm(pose, ctx, "rgba(185, 219, 154, 0.603)")
    } else {
      drawLeftArm(pose, ctx, "rgba(236, 17, 17, 0.603)")
    }
    if (leftLeg) {
      drawLeftLeg(pose, ctx, "rgba(185, 219, 154, 0.603)")
    } else {
      drawLeftLeg(pose, ctx, "rgba(236, 17, 17, 0.603)")
    }
    if (rightLeg) {
      drawRightLeg(pose, ctx, "rgba(185, 219, 154, 0.603)")
    } else {
      drawRightLeg(pose, ctx, "rgba(236, 17, 17, 0.603)")
    }
  }

  //stop the cameraPreview
  async stopCamera() {
    await CameraPreview.stop();
    clearInterval(this.intervallRef);
    this.cameraActive = false;
    this.image = null;
    this.router.navigate(['/']);
  }
}
