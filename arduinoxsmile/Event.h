#ifndef EVENT_H
#define EVENT_H

#include <Arduino.h>
#include <LiquidCrystal_I2C.h>

class Event {
  public:
    String eventType;
    String eventTitle;
    String eventContent;


    Event(String type = "", String title = "", String content = "");

    void displayEvent();
    void displayEventLCD(LiquidCrystal_I2C &lcd);
    void clearLCD(LiquidCrystal_I2C &lcd);
    void sendEvent();
    void receiveEvent();
    void clearEvent();
    void modifyContent();
    void handleQueue();
};

#endif