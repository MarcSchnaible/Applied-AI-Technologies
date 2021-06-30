import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as posenet from '@tensorflow-models/posenet';
import {drawbody, drawRightArm, drawLeftArm, drawRightLeg, drawLeftLeg} from '../tab1/drawing.service';
import { ComparePoseService } from '../tab1/video/classes/comparePoseService';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  safeUrl: SafeUrl;

  video: any;
  showVideo = false;

  videoIsPlaying = false;
  
  model = null;
  intervallRef: any;

  cssProberty = 'max-height: ' + (window.innerHeight) + 'px; top: ' + (0) + 'px;';

  @ViewChild('canvasVideo', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  constructor(
    private comparePoseService: ComparePoseService,
    private camera: Camera,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadModel();
  }

  //load the TensorflowModel PoseNet
  async loadModel() {

    // genaues Model aber sehr langsam
    this.model = await posenet.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: { width: 257, height: 200},
      multiplier: 0.5
    });

    /*
    //ungenaues Model aber schnell...
    this.model = await posenet.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: { width: 257, height: 200},
      multiplier: 0.5
    });
    */
  }

  startVideo() {
    this.pickVideo();
  }

  stopVideo(){
    this.showVideo = false;
  }

  videoStop() {
    let video = <HTMLVideoElement>document.getElementById('myVideo');
    video.pause();
    this.videoIsPlaying = false;
  }

  videoPlay() {
    let video = <HTMLVideoElement>document.getElementById('myVideo');
    video.play();
    this.videoIsPlaying = true;
  }

  pickVideo() {
    let options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.NATIVE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.VIDEO
    }

    this.camera.getPicture(options).then((data) => {
      this.safeUrl = this.sanitizer.bypassSecurityTrustUrl(
        Capacitor.convertFileSrc(data)
      );
      this.showVideo = true
      this.videoIsPlaying = true;
      this.intervall()
     }, (err) => {
      console.log(err);
     });
  }

  intervall(){
    this.intervallRef = setInterval(() => {
      this.detect();
    }, 100);
  }

  async detect() {
    var video = <HTMLVideoElement>document.getElementById('myVideo');
    video.height = window.innerHeight;
    video.width = window.innerWidth;
    const poseVideo = await this.model.estimateSinglePose(video, {
      flipHorizontal: false
    });

    console.log(poseVideo);
    
    const videoWidth = window.innerWidth;
    const videoHeight = window.innerHeight;

    this.drawCanvas(poseVideo, videoWidth, videoHeight);
  }

  //draw Canvas
  drawCanvas(pose, imageWidth, imageHeight) {
    //const ctx = this.canvas.nativeElement.getContext('2d');
    var canvas = <HTMLCanvasElement> document.getElementById("canvasVideo");
    var ctx = canvas.getContext("2d");
    
    ctx.canvas.width = imageWidth;
    ctx.canvas.height = imageHeight;

    drawbody(pose, ctx);
    drawRightArm(pose, ctx, "rgba(128, 128, 128, 0.603)")
    drawLeftArm(pose, ctx, "rgba(128, 128, 128, 0.603)")
    drawLeftLeg(pose, ctx, "rgba(128, 128, 128, 0.603)")
    drawRightLeg(pose, ctx, "rgba(128, 128, 128, 0.603)")
  }
}
