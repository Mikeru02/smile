#include <Wire.h>
#include <Servo.h>
#include <AccelStepper.h>
#include <LiquidCrystal_I2C.h>

const int stepPin = 2;
const int dirPin = 3;
const int enablePin = 4;
const int servoLeftPin = 12;
const int servoRightPin = 13;
const int trigPin = 8;
const int sideEcho1 = 9;
const int sideEcho2 = 10;
const int topEcho = 11;
const int binTrigPin = A0;
const int bottlesEchoPin = 5;
const int generalEchoPin = 6;
const int paperEchoPin = 7;

const int stop = 1500;
const int forward = 2100;
const int backward = 1000;
const int openTime = 250;
const int closeTime = 700;

const int rightTreshold = 22;
const int leftTreshold = 22;
const int frontTreshold = 22;
const int plasticTreshold = 40;
const int generalTreshold = 35;
const int paperTreshold = 38;

Servo servoRight;
Servo servoLeft;
LiquidCrystal_I2C lcd(0x27, 16, 2);
AccelStepper stepper(AccelStepper::DRIVER, stepPin, dirPin);

long readDistance(int echoPin);
void openGate(Servo servoLeft, Servo servoRight);
void closeGate(Servo servoLeft, Servo servoRight);

void setup() {
  servoLeft.attach(servoLeftPin);
  servoRight.attach(servoRightPin);

  // servoRight.write(90);
  // servoLeft.write(90);

  pinMode(trigPin, OUTPUT);
  pinMode(topEcho, INPUT);
  pinMode(sideEcho1, INPUT);
  pinMode(sideEcho2, INPUT);

  pinMode(binTrigPin, OUTPUT);
  pinMode(bottlesEchoPin, INPUT);
  pinMode(generalEchoPin, INPUT);
  pinMode(paperEchoPin, INPUT);

  digitalWrite(trigPin, LOW);
  digitalWrite(binTrigPin, LOW);

  lcd.init();
  lcd.backlight();

  lcd.setCursor(0, 0);
  lcd.print("Ultrasonic Ready");
  delay(2000);
  lcd.clear();

  openGate(servoLeft, servoRight);
  delay(1000);
  closeGate(servoLeft, servoRight);

  servoLeft.writeMicroseconds(stop);
  servoRight.writeMicroseconds(stop);

}

void loop() {
    // Read distances
    long topDistance   = readDistance(trigPin, topEcho);
    delay(100);

    long side1Distance = readDistance(trigPin, sideEcho1);
    delay(100);

    long side2Distance = readDistance(trigPin, sideEcho2);
    delay(100);

    // Display top, left, right distances and thresholds on first line
    lcd.setCursor(0, 0);
    lcd.print("T:");
    lcd.print(topDistance);
    lcd.print("/");
    lcd.print(frontTreshold);

    lcd.print(" L:");
    lcd.print(side1Distance);
    lcd.print("/");
    lcd.print(leftTreshold);

    lcd.setCursor(0, 1);
    lcd.print(" R:");
    lcd.print(side2Distance);
    lcd.print("/");
    lcd.print(rightTreshold);

    delay(200);
}

// void loop() {

//   long topDistance   = readDistance(trigPin, topEcho);
//   delay(60);

//   long side1Distance = readDistance(trigPin, sideEcho1);
//   delay(60);

//   long side2Distance = readDistance(trigPin, sideEcho2);
//   delay(60);

//   long bottlesDistance = readDistance(binTrigPin, bottlesEchoPin);
//   delay(60);

//   long generalDistance = readDistance(binTrigPin, generalEchoPin);
//   delay(60);

//   long paperDistance = readDistance(binTrigPin, paperEchoPin);
//   delay(60);

//   lcd.setCursor(0, 0);
//   lcd.print("T:");
//   lcd.print(topDistance);
//   lcd.print(" S1:");
//   lcd.print(side1Distance);
//   lcd.print(" S2:");
//   lcd.print(side2Distance);

//   lcd.setCursor(0, 1);
//   lcd.print("B:");
//   lcd.print(bottlesDistance);
//   lcd.print(" G:");
//   lcd.print(generalDistance);
//   lcd.print(" P:");
//   lcd.print(paperDistance);

//   // Object detection threshold (example: 15 cm)
//   // int threshold = 25;

//   // if (topDistance < threshold || 
//   //     side1Distance < threshold || 
//   //     side2Distance < threshold) {

//   //     lcd.setCursor(10, 1);
//   //     lcd.print("OBJ ");
//   // } else {
//   //     lcd.setCursor(10, 1);
//   //     lcd.print("    ");
//   // }

//   delay(200);
// }

long readDistance(int trigPin, int echoPin) {

  // Clear trigger
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  // Send 10us pulse
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Measure echo time
  long duration = pulseIn(echoPin, HIGH, 30000); // 30ms timeout

  // Convert to cm
  long distance = duration * 0.034 / 2;

  if (duration == 0) {
    return 999; // No object detected
  }

  return distance;
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
