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
