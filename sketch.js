
// Assignment ! HRI 2020 Rustam Chibar

//Variables
let video;
let poseNet;
let pose;
let skeleton;
let sec_happy = 0;
let sec_disgust = 0;
let sec_scary = 0;

//General set for capturing the video from webcam
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

//function for pose variables
function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}
//function for poseNet() as a callback
function modelLoaded() {
  console.log('poseNet ready');
}

// showing poses in inspect -> console section
function mousePressed(){
  console.log(JSON.stringify(pose))
}

// Functions for showing states
function happy(){
  return "State : HAPPY!!!";
}
function disgust(){
  return "State : DISGUSTING!!!";
}
function scary(){
  return "State : SCARY!!!";
}

//by experienced way the coefficient 320 was selected for seconds count
function show_second_happy(){
  return "Time the user in Happy state: " + Math.floor(sec_happy++/320) + "sec";
}
function show_second_disgust(){
  return "Time the user in Disgusting state: " + Math.floor(sec_disgust++/320) + "sec";
}
function show_second_scary(){
  return "Time the user in scary state: " + Math.floor(sec_scary++/320) + "sec";
}


//MAIN function 
function draw() {
  //inverting image for being mirrored
  image(video, 0, 0, width, height);
  translate(video.width, 0);
  scale(-1,1);
  image(video, 0, 0, video.width, video.height);
  //if any poses are created
  if (pose) {
    //showing poses
    mousePressed();
    //going through all poses for creating x,y-coordinates
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0, 255, 0);
      ellipse(x, y, 16, 16);
      //happy state
      if ((pose.keypoints[9].position.y || pose.keypoints[10].position.y) < (pose.keypoints[0].position.y)){
        document.getElementById("emotions").style.color = "red";
        document.getElementById("show_second").style.color = "red";   
        //showing happy state     
        document.getElementById("emotions").innerHTML = happy();
        document.getElementById("show_second").innerHTML = show_second_happy();
        //disgusting state
      }else if ((pose.keypoints[9].position.x || pose.keypoints[10].position.x) < (pose.keypoints[0].position.x)){
        document.getElementById("emotions").style.color = "green";
        document.getElementById("show_second").style.color = "green";
        //showing disgusting state
        document.getElementById("emotions").innerHTML = disgust();        
        document.getElementById("show_second").innerHTML = show_second_disgust();
        //scary state
      }else if (pose.keypoints[9].position.x < pose.keypoints[5].position.x  
        && 
        pose.keypoints[10].position.x > pose.keypoints[6].position.x 
        && 
        pose.keypoints[9].position.y < pose.keypoints[7].position.y
        && 
        pose.keypoints[10].position.y < pose.keypoints[8].position.y){
          document.getElementById("emotions").style.color = "blue";
          document.getElementById("show_second").style.color = "blue";
          //showing scary state
          document.getElementById("emotions").innerHTML = scary();
          document.getElementById("show_second").innerHTML = show_second_scary();
      }else{
        //showing nothing state
        document.getElementById("emotions").style.color = "black";
        document.getElementById("emotions").innerHTML = "nothing";

      }
    }
    //creating skeleton
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
  }
}