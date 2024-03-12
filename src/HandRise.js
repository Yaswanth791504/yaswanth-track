// // Import dependencies
import {Finger, FingerCurl, FingerDirection, GestureDescription} from 'fingerpose'; 

// Define Gesture Description
export const handRiseGesture = new GestureDescription('hand rise seen'); 

// Thumb 
handRiseGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0)
handRiseGesture.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);

// handRiseGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
// handRiseGesture.addDirection(Finger.Thumb, FingerDirection.HorizontalLeft, 0.25);
// handRiseGesture.addDirection(Finger.Thumb, FingerDirection.Horizontalright, 0.25);


// Index

handRiseGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
handRiseGesture.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.25);

// Pinky
handRiseGesture.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0)
handRiseGesture.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.25);

handRiseGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0)
handRiseGesture.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.25);

handRiseGesture.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0)
handRiseGesture.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.25);

// for(let finger of [Finger.Middle, Finger.Ring]){
//     loveYouGesture.addCurl(finger, FingerCurl.FullCurl, .75); 
//     loveYouGesture.addDirection(finger, FingerDirection.VerticalDown, 0.25);
// }



