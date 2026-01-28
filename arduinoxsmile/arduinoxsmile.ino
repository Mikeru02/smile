#include "Event.h"
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

const int QUEUE_SIZE = 5;
Event eventQueue[QUEUE_SIZE]; // queue of events
int qHead = 0;
int qTail = 0;
int qCount = 0;

Event event; // incoming event

void addEventToQueue(const Event &e) {
  eventQueue[qTail] = e; // copy event into queue
  qTail = (qTail + 1) % QUEUE_SIZE;

  if (qCount < QUEUE_SIZE) {
    qCount++;
  } else {
    qHead = (qHead + 1) % QUEUE_SIZE; // overwrite oldest if full
  }
}

void displayAllEventsInQueue() {
  if (qCount == 0) return;

  for (int i = 0; i < qCount; i++) {
    int index = (qHead + i) % QUEUE_SIZE;
    Event &e = eventQueue[index];

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(e.eventType);
    lcd.print("|");
    lcd.print(e.eventTitle);
    lcd.setCursor(0, 1);
    lcd.print(e.eventContent);
    delay(1000);
    lcd.clear();
  }
}

void displayCurrentEvent() {
  if (qCount == 0) return;
  int lastIndex = (qTail - 1 + QUEUE_SIZE) % QUEUE_SIZE;
  Event &e = eventQueue[lastIndex];

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(e.eventType);
  lcd.print("|");
  lcd.print(e.eventTitle);
  lcd.setCursor(0, 1);
  lcd.print(e.eventContent);
  delay(1000);
  lcd.clear();
}

void setup() {
  Serial.begin(9600);
  lcd.init();
  lcd.backlight();
  while (!Serial) {}
}

void loop() {
  // Receive event into 'event'
  event.receiveEvent();

  // If an event is received (check if type is non-empty)
  if (event.eventType.length() > 0) {
    addEventToQueue(event); // save full Event object
    displayCurrentEvent();
    event.clearEvent();
  }
  delay(1000);
}
