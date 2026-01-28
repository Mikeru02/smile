#include "Event.h"

Event::Event(String type, String title, String content) {
  eventType = type;
  eventTitle = title;
  eventContent = content;
}

void Event::displayEvent() {
  Serial.print(eventType); 
  Serial.print("|"); 
  Serial.print(eventTitle); 
  Serial.print("|"); 
  Serial.println(eventContent);
}

void scrollContent(LiquidCrystal_I2C &lcd, String text, int delayMs = 500) {
  int len = text.length();
  // for (int i = 0; i < len; i++) {
  //   lcd.scrollDisplayLeft();
  //   delay(delayMs);
  // }
  while (true) {
    lcd.scrollDisplayLeft();
    delay(delayMs);
  }

}

void Event::displayEventLCD(LiquidCrystal_I2C &lcd) {
  lcd.clear();

  // Line 1: type | title
  String line1 = eventType + "|" + eventTitle;
  lcd.setCursor(1, 0);
  lcd.print(line1);          // initial display

  // Line 2: content
  lcd.setCursor(1, 1);
  lcd.print(eventContent);   // initial display
  scrollContent(lcd, eventContent); // scroll once if too long
}

void Event::receiveEvent() {
  if (Serial.available()) {
    String line = Serial.readStringUntil('\n');
    line.trim();
    Serial.println(line);

    int firstOpen   = line.indexOf('[');
    int firstClose  = line.indexOf(']');
    int secondOpen  = line.indexOf('[', firstClose + 1);
    int secondClose = line.indexOf(']', secondOpen + 1);
    int thirdOpen   = line.indexOf('[', secondClose + 1);
    int thirdClose  = line.indexOf(']', thirdOpen + 1);

    if (firstOpen != -1 && firstClose != -1 &&
        secondOpen != -1 && secondClose != -1 &&
        thirdOpen != -1 && thirdClose != -1) {

      eventType    = line.substring(firstOpen + 1, firstClose);
      eventTitle   = line.substring(secondOpen + 1, secondClose);
      eventContent = line.substring(thirdOpen + 1, thirdClose);

    } else {
      eventType    = "UNKNOWN";
      eventTitle   = "---";
      eventContent = line;
    }
  }
}

void Event::clearLCD(LiquidCrystal_I2C &lcd) {
  lcd.clear();
}

void Event::clearEvent() {
  eventType = "";
  eventTitle = "";
  eventContent = "";
}

void Event::handleQueue();


void Event::modifyContent() {

}