// Libraries
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <AccelStepper.h>
#include <Servo.h>

// Pins here
const int stepPin = 2;
const int dirPin = 3;
const int enablePin = 4;
const int sonarTrigPin = 8;
const int frontEchoPin = 11;
const int rightEchoPin = 9;
const int leftEchoPin = 10;
const int servoRightPin = 13;
const int servoLeftPin = 12;
const int IRPin = A1;
const int binTrigPin = A0;
const int bottlesEchoPin = 5;
const int generalEchoPin = 6;
const int paperEchoPin = 7;
const int stop = 1500;
const int forward = 2100;
const int backward = 1000;
const int openTime = 250;
const int closeTime = 700;

// Variable needed
String ip;

// Global Flags
bool isUserDropping = false;
bool isCapturing = false;
bool laserDetected = false;

// Varibles for Sonars
const int sonarDistanceTreshold = 20;
const int sonarPulseIn = 10000;
const int clearConfirmCount = 25;
const int detectConfirmCount = 5;

// Sonar tresholds
const float rightTreshold = 20;
const float leftTreshold = 20;
const float frontTreshold = 20;
const int detectTreshold = 15;
const int tolerance = 4;
const float plasticTreshold = 40;
const float generalTreshold = 35;
const float paperTreshold = 38;
  
int baseTop = 0;
int baseLeft = 0;
int baseRight = 0;

// Sonar filters
bool frontSonarLastState = false;
int frontDetectCount =  0;
int frontClearCount = 0;

bool rightSonarLastState = false;
int rightDetectCount = 0;
int rightClearCount = 0;

bool leftSonarLastState = false;
int leftDetectCount = 0;
int leftClearCount = 0;

// IR filters
bool IRLastState = false;
int hasObjectDetectCount = 0;
int hasOjectCount = 5;

// Variables of Stepper Motor
const float stepsPerRevolution = 200;
int microStepSetting = 8;

// Servos
Servo servoRight;
Servo servoLeft;

// Objects
LiquidCrystal_I2C lcd(0x27, 16, 2);
AccelStepper stepper(AccelStepper::DRIVER, stepPin, dirPin);

// Helper functions
void calibratePlatform() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Calibrating...");
  delay(2000);

  baseTop = readSonarDistance(trigPin, frontEchoPin);
  delay(200);
  baseLeft = readDistance(trigPin, leftEchoPin);
  delay(200);
  baseRight = readDistance(trigPin, rightEchoPin);
  delay(200);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Baseline Set!");
  delay(2000);
}

void respondAndDisplay(String lcdTitle, String lcdMsg, String serialMsg) {
  lcd.setCursor(0, 0);
  lcd.print(lcdTitle + "                ");
  lcd.setCursor(0, 1);
  lcd.print(lcdMsg + "                ");
  Serial.println(serialMsg);
}

long readSonarDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, sonarPulseIn);
  if (duration == 0) return 999;
  long distanceCm = duration * 0.0343 / 2;
  if (distanceCm > 100) return 999;
  return distanceCm;
}

bool sonarObjectDetected(int trigPin, int echoPin, int treshold, int margin = 1) {
  long distance = readSonarDistance(trigPin, echoPin);

  if (distance == 999) return false;

  return (distance < treshold - margin);
}

void resetSonar() {
  frontSonarLastState = false;
  frontDetectCount =  0;
  frontClearCount = 0;

  rightSonarLastState = false;
  rightDetectCount = 0;
  rightClearCount = 0;

  leftSonarLastState = false;
  leftDetectCount = 0;
  leftClearCount = 0;
}

// bool atLeastDetected(int min = 2) {
//   int count = 0;
//   if (frontSonarLastState) count++;
//   if (rightSonarLastState) count++;
//   if (leftSonarLastState) count++;
//   return count >= min;
// }

bool anySonarDetected() {
  return frontSonarLastState || rightSonarLastState || leftSonarLastState;
}
void openGate(Servo servoLeft, Servo servoRight) {
  // servoRight.write(0);
  // servoLeft.write(180);
  // Move both servos simultaneously
  // servoLeft.writeMicroseconds(backward);
  // servoRight.writeMicroseconds(forward);
  // delay(openTime);

  servoLeft.writeMicroseconds(forward);
  servoRight.writeMicroseconds(backward);
  delay(openTime);

  // Stop both servos
  servoLeft.writeMicroseconds(stop);
  servoRight.writeMicroseconds(stop);
}

void closeGate(Servo servoLeft, Servo servoRight) {
  // servoRight.write(90);
  // servoLeft.write(80);
  // servoLeft.writeMicroseconds(forward);
  // servoRight.writeMicroseconds(backward);
  // delay(closeTime);

  servoLeft.writeMicroseconds(backward);
  servoRight.writeMicroseconds(forward);
  delay(closeTime);

  // Stop both servos
  servoLeft.writeMicroseconds(stop);
  servoRight.writeMicroseconds(stop);
}

void runPlatform(String objectType) {
  if (objectType.equalsIgnoreCase("Plastic Bottle")) {
    stepper.moveTo(convertRotationalPositionToSteps(0.15));
    while (stepper.distanceToGo() != 0) {
      stepper.run();
    }
    delay(2000);
    stepper.moveTo(convertRotationalPositionToSteps(0));
    while (stepper.distanceToGo() != 0) {
      stepper.run();
    }
    delay(2000);
  }
  else if (objectType.equalsIgnoreCase("Paper")) {
    stepper.moveTo(convertRotationalPositionToSteps(-0.15));
    while (stepper.distanceToGo() != 0) {
      stepper.run();
    }
    delay(2000);
    stepper.moveTo(convertRotationalPositionToSteps(0));
    while (stepper.distanceToGo() != 0) {
      stepper.run();
    }
    delay(2000);
  }
  else if (objectType.equalsIgnoreCase("General Waste")) {
    openGate(servoLeft, servoRight);
    delay(2000);
    closeGate(servoLeft, servoRight);
    delay(2000);
  } else {
    openGate(servoLeft, servoRight);
    delay(2000);
    closeGate(servoLeft, servoRight);
  }
}

float convertRotationalPositionToSteps(float rotations) {
  return rotations * stepsPerRevolution * microStepSetting;
}

void controlMotor(String state) {
  if (state == "enable") {
    digitalWrite(enablePin, LOW);
  } else if (state == "disable") {
    digitalWrite(enablePin, HIGH);
  }
}

void setup() {
  // Pinmode for Sonars
  pinMode(sonarTrigPin, OUTPUT);
  pinMode(frontEchoPin, INPUT);
  pinMode(rightEchoPin, INPUT);
  pinMode(leftEchoPin, INPUT);
  pinMode(enablePin, OUTPUT);
  pinMode(IRPin, INPUT);
  
  controlMotor("enable");

  // Servos
  servoRight.attach(servoRightPin);
  servoLeft.attach(servoLeftPin);

  // Stepper Motor setup
  float maxRPM = 30;
  float accelRPMPerSec = 80;

  float maxSpeedStepsPerSec = microStepSetting * stepsPerRevolution * maxRPM / 60.0;

  float accelStepsPerSec2 = microStepSetting * stepsPerRevolution * accelRPMPerSec / 60.0;

  stepper.setMaxSpeed(maxSpeedStepsPerSec);
  stepper.setAcceleration(accelStepsPerSec2);
  stepper.setCurrentPosition(0);

  Serial.println("READY");

  digitalWrite(sonarTrigPin, LOW);

  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Ultrasonic Ready");
  delay(2000);
  lcd.clear();

  Serial.begin(9600);
  Serial.println("READY");

  // servoRight.write(90);
  // servoLeft.write(80);

  openGate(servoLeft, servoRight);
  delay(1000);
  closeGate(servoLeft, servoRight);

  servoLeft.writeMicroseconds(stop);
  servoRight.writeMicroseconds(stop);

  delay(1000);
  stepper.moveTo(convertRotationalPositionToSteps(0.15));
  while (stepper.distanceToGo() != 0) {
    stepper.run();
  }
  delay(2000);
  
  stepper.moveTo(convertRotationalPositionToSteps(-0.15));
  while (stepper.distanceToGo() != 0) {
    stepper.run();
  }
  delay(2000);

  stepper.moveTo(convertRotationalPositionToSteps(0));
  while (stepper.distanceToGo() != 0) {
    stepper.run();
  }
  delay(2000);

  calibratePlatform();
  controlMotor("disable");
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();

    int separatorIndex = cmd.indexOf(":");
    String command, value;

    if (separatorIndex > 0) {
      command = cmd.substring(0, separatorIndex);
      value = cmd.substring(separatorIndex + 1);
      value.trim();
    } else {
      command = cmd;
      value = "";
    }

    if (command == "DETECT") {
      respondAndDisplay("DETECT", value, "MODEL DETECTED");
      runPlatform(value);
      isCapturing = false;
      resetSonar();
    }
    else if (command == "HELLO") {
      respondAndDisplay("HELLO", "HELLO FROM NODE", "HELLO DISPLAYED");
    } 
    else if (command == "STATUS") {
      respondAndDisplay("STATUS", "IDLE", "STATUS DISPLAYED");
    }
    else if (command == "IP") {
      respondAndDisplay("IP", value, "IP DISPLAYED");
      ip = value;
    }
    else if (command == "DROPPING") {
      respondAndDisplay("DROPPING", value, "DROPPING STATUS DISPLAYED");
      isUserDropping = true;
      controlMotor("enable");
    }
    else if (command == "DONE DROP") {
      respondAndDisplay("DONE DROP", value, "DONE DROP");
      isUserDropping = false;
      openGate(servoLeft, servoRight);
      delay(2000);
      closeGate(servoLeft, servoRight);
      delay(2000);
      controlMotor("disable");
    }
    else if (command == "DONE CAPTURE" || command == "IGNORE") {
      respondAndDisplay("", "", "DONE CAPTURE");
      // isCapturing = false;
      // resetSonar();
    }
    else {
      respondAndDisplay("UNKNOWN", command, "UNKNOWN COMMAND");
    }
  }

  if (!isCapturing && isUserDropping) {

    // bool irDetected = !digitalRead(IRPin);

    // if (irDetected) { hasObjectDetectCount++;}
    // else { hasObjectDetectCount = 0; }

    // if (!IRLastState && hasObjectDetectCount >= hasOjectCount) {
    //   IRLastState = true;
    //   hasObjectDetectCount = 0;
    // }

    // if (IRLastState && !irDetected) {
    //   IRLastState = false;
    // }

    // if (irDetected) {
    //   respondAndDisplay("IR DETECTED", "Object Close", "IR TRIGGERED");
    //   isCapturing = true;
    //   return;   // Skip sonars
    // }

    // Sequential reading with small delays to avoid interference
    long frontDistance = sonarObjectDetected(sonarTrigPin, frontEchoPin, frontTreshold);
    delay(100);
    long rightDistance = sonarObjectDetected(sonarTrigPin, rightEchoPin, rightTreshold);
    delay(100);
    long leftDistance = sonarObjectDetected(sonarTrigPin, leftEchoPin, leftTreshold);
    delay(100);

    bool frontDetected = (frontDistance < (baseTop - detectTreshold - tolerance));
    bool rightDetected = (rightDistance < (baseRight - detectTreshold - tolerance));
    bool leftDetected  = (leftDistance  < (baseLeft - detectTreshold - tolerance));

    Serial.print("Front: "); Serial.print(frontDistance);
    Serial.print("  Right: "); Serial.print(rightDistance);
    Serial.print("  Left: "); Serial.println(leftDistance);

    lcd.setCursor(0, 0);
    lcd.print("F:");
    lcd.print(frontDetected);
    lcd.print("/");
    lcd.print(frontTreshold);

    lcd.print(" L:");
    lcd.print(leftDetected);
    lcd.print("/");
    lcd.print(leftTreshold);

    lcd.setCursor(0, 1);
    lcd.print(" R:");
    lcd.print(rightDetected);
    lcd.print("/");
    lcd.print(rightTreshold);


    // ---------------- TOP SONAR FILTER ----------------
    if (frontDetected) { frontDetectCount++; frontClearCount = 0; } 
    else { frontClearCount++; frontDetectCount = 0; }

    if (!frontSonarLastState && frontDetectCount >= detectConfirmCount) {
      frontSonarLastState = true; frontDetectCount = 0;
    }
    if (frontSonarLastState && frontClearCount >= clearConfirmCount) {
      frontSonarLastState = false; frontClearCount = 0;
    }

    // ---------------- SIDE1 SONAR FILTER ----------------
    if (rightDetected) { rightDetectCount++; rightClearCount = 0; } 
    else { rightClearCount++; rightDetectCount = 0; }

    if (!rightSonarLastState && rightDetectCount >= detectConfirmCount) {
      rightSonarLastState = true; rightDetectCount = 0;
    }
    if (rightSonarLastState && rightClearCount >= clearConfirmCount) {
      rightSonarLastState = false; rightClearCount = 0;
    }

    // ---------------- SIDE2 SONAR FILTER ----------------
    if (leftDetected) { leftDetectCount++; leftClearCount = 0; } 
    else { leftClearCount++; leftDetectCount = 0; }

    if (!leftSonarLastState && leftDetectCount >= detectConfirmCount) {
      leftSonarLastState = true; leftDetectCount = 0;
    }
    if (leftSonarLastState && leftClearCount >= clearConfirmCount) {
      leftSonarLastState = false; leftClearCount = 0;
    }

    // ---------------- FINAL CONFIRM ----------------
    if (anySonarDetected()) {
      respondAndDisplay("DETECTED", "Object Present", "SONAR DETECTED");
      isCapturing = true;
    }
  }
}
