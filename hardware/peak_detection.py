import numpy as np


class real_time_peak_detection:
    def __init__(self, array, lag, threshold, influence):
        self.y = list(array)
        self.rng = np.random.default_rng()
        self.length = len(self.y)
        self.lag = lag
        self.threshold = threshold
        self.influence = influence
        self.signals = [0] * len(self.y)
        self.filteredY = np.array(self.y).tolist()
        self.avgFilter = [0] * len(self.y)
        self.stdFilter = [0] * len(self.y)
        self.avgFilter[self.lag - 1] = np.mean(self.y[0 : self.lag]).tolist()
        self.stdFilter[self.lag - 1] = np.std(self.y[0 : self.lag]).tolist()
        self.count = 0
        self.peak_found = False

    def thresholding_algo(self, new_value):
        self.y.append(new_value + self.rng.normal(0, 0.001))
        i = len(self.y) - 1
        self.length = len(self.y)
        if i < self.lag:
            return 0, self.y
        elif i == self.lag:
            self.signals = [0] * len(self.y)
            self.filteredY = np.array(self.y).tolist()
            self.avgFilter = [0] * len(self.y)
            self.stdFilter = [0] * len(self.y)
            self.avgFilter[self.lag] = np.mean(self.y[0 : self.lag]).tolist()
            self.stdFilter[self.lag] = np.std(self.y[0 : self.lag]).tolist()
            return 0, self.y

        self.signals += [0]
        self.filteredY += [0]
        self.avgFilter += [0]
        self.stdFilter += [0]

        return_peak_data = 0
        if self.peak_found:
            self.count += 1
            if self.count == 10:
                return_peak_data = 1
                self.signals[i] = 1
                self.peak_found = False
                self.count = 0

        if (
            abs(self.y[i] - self.avgFilter[i - 1])
            > self.threshold * self.stdFilter[i - 1]
        ):
            print(self.peak_found, self.count, self.y[i])
#             if self.peak_found and self.count == 30:
#                 # self.signals[i] = 1
#                 return_peak_data = 1
#                 print("AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
#                 self.signals[i] = 1
#                 self.peak_found = False
#                 self.count = 0
            if self.y[i] > self.avgFilter[i - 1]:
                self.signals[i] = 1
                # self.signals[i] = 0
                #self.count += 1
                self.peak_found = True
                print("1")
            else:
                self.signals[i] = -1
                # self.signals[i] = 0
                # self.count += 1
                # self.peak_found = True
                print("-1")

            self.filteredY[i] = (
                self.influence * self.y[i]
                + (1 - self.influence) * self.filteredY[i - 1]
            )
            self.avgFilter[i] = np.mean(self.filteredY[(i - self.lag) : i])
            self.stdFilter[i] = np.std(self.filteredY[(i - self.lag) : i])
        else:
            self.signals[i] = 0
            self.filteredY[i] = self.y[i]
            self.avgFilter[i] = np.mean(self.filteredY[(i - self.lag) : i])
            self.stdFilter[i] = np.std(self.filteredY[(i - self.lag) : i])

        return return_peak_data, self.y[-60:]
