# Bubba-Band

## Installation

The backend is written with Python 3 using the Flask web framework. To install
dependencies, first create and activate a virtual environment.
```
python3 -m venv env
source env/bin/activate
```
Then install the dependencies in `requirements.txt`
```
pip install -r backend/requirements.txt
```

The frontend is written with Node. To install dependencies, navigate into the
`frontend/` folder and run `yarn` or `npm` to install the node dependencies.

```
cd frontend/
yarn install
```
or
```
cd frontend/
npm install
```

## Running the application

Open up 3 terminals

### Terminal 1: Server

While you're in the root directory, run:
```
cd backend/
export FLASK_APP=server
flask run
```
This will start the webserver in the backend.

### Terminal 2: Raspberry Pi Emulator

If you don't want to use the Pi emulator to explore the UI, you can skip this step/terminal and just use the buttons (for testing) in the interpretation screen.

If you don't have the hardware (Raspberry Pi, pressure sensor, circuit), you can run the Raspberry Pi emulator file `fakePi/fakePi.py` to mimic its signals.

In the root directory:
```
python ./fakePi/fakePi.py
```

To send a signal to the frontend, you either input a 1 (hard type) or 2 (soft tap) in the terminal.

1 hard tap = "Yes"
2 hard taps = "Hi"
> 3 hard taps = "Can someone come here?"
1 soft tap = "Maybe..."

### Terminal 3: Frontend

To run the frontend, run the following (depending on `yarn` or `npm`):
```
cd frontend/
yarn start
```
or
```
cd frontend/
npm start
```

