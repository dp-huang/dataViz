import urllib2
import json
import random
import sys
import time

__author__ = 'admin'


class DataGenerator:
    def __init__(self, url):
        self._url = url
        self._interval = 1

    def generate(self):
        spike = 0
        while True:
            sleep_time = random.randint(1, 5)
            time.sleep(sleep_time)
            spike += 1
            value = random.randint(0, 20)
            if spike % 5 == 0:
                value = random.randint(20, 30)
            self._send_data('dimension', value)

            value = random.randint(0, 30)
            if spike % 5 == 0:
                value = random.randint(20, 30)
            if spike % 200 == 0:
                value = random.randint(200, 300)
            self._send_data('dimension1', value)

            value = random.randint(10, 60)
            if spike % 5 == 0:
                value = random.randint(20, 30)
            self._send_data('dimension2', value)

    def _send_data(self, dimension, value):
        data = {
          'metric': 'metric',
          'dimension': dimension,
          'value': value
        }
        data_encoded = json.dumps(data)
        req = urllib2.Request(self._url, data_encoded, {'Content-Type': 'application/json'})
        response = urllib2.urlopen(req)
        print(data_encoded + ' , ' + str(response.getcode()))


if __name__ == '__main__':
    host = 'http://127.0.0.1:8080'
    if len(sys.argv) > 1:
        host = sys.argv[1]
    url = host + '/api/metrics'

    data_generator = DataGenerator(url)
    data_generator.generate()
