data acquirement observations
==================================

### average value for each day

date | mq2 | mq135
--- | ---
17.07 | 155.22 | 180.68
30.07 | 61.81 | 105.24

### data for baseline

- `mq135: 85`
- `mq2: 61`

file | command
--- | ---
wholeday.csv | `node src/process-data.js --pattern ./data/2-8-23.csv --mq135 98.90 --mq2 61 --output './data/wholeday.csv' --timestamp`

### measurement reports

- 06.08
    - `6-12-*.csv`: drone data
    - `6-2*.csv`: balcony data
- 14.07
    - `14.13.42.csv`: altitude data

#### 14.07

time | observation
--- | ---
14:33 | aus der Bahn raus
14:40 | Lidl
14:51 | aus Lidl
15:28 | freiflug 1
15:42 | freiflug 2 - hoch
16:36 | Heimweg
