# Running the Backend

```
export FLASK_APP=server
flask run
```

# Running the Raspberry Pi Emulator

this is for testing the UI without having the Raspberry Pi and other hardware.
In the backend folder:

```
python ./fakePi/fakePi.py
```

Input 1 for a hard tap and 2 for a soft tap, which will be sent to the backend.



## Extending for other applications

There are two ways of doing this, with tradeoffs.

1. It's possible to listen for tap events globally by subscribing to the
   `frontend` event. This means multiple applications can potentially "hear" and
   respond to the same gesture.
2. Alternatively, it's also possible to namespace events for specific
   applications. However, this requires a method to switch the active
   application on the Raspberry Pi. This method is currently implemented in the
   backend for `bubbaspace`, but not in the hardware code for the Raspberry Pi.
