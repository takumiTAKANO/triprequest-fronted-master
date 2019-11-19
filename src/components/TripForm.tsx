import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { TripData } from '../types';
import { JobTitles, TripClasses, CostClasses } from '../constants';

type Props = {
  tripData: TripData;
  onChange: (tripData: TripData) => void;
  onSubmit: (e: React.MouseEvent) => void;
};

export default function TripForm(props: Props) {
  const { tripData, onChange, onSubmit } = props;
  const { jobTitle, tripClass, costClass, startDate, endDate, destination } = tripData;

  const isValid =
    jobTitle !== '' &&
    tripClass !== '' &&
    costClass !== '' &&
    startDate !== '' &&
    endDate !== '' &&
    destination !== '';

  return (
    <div style={styles.form}>
      <Typography variant="headline">出張全体</Typography>
      <div style={styles.wrapper}>
        <TextField
          select
          label="職名"
          value={jobTitle}
          onChange={e => {
            onChange({ ...tripData, jobTitle: e.target.value });
          }}
          SelectProps={{ native: true }}
        >
          {JobTitles.map(j => (
            <option key={j} value={j}>
              {j}
            </option>
          ))}
        </TextField>
      </div>
      <div style={styles.wrapper}>
        <TextField
          select
          label="出張分類"
          value={tripClass}
          onChange={e => {
            onChange({ ...tripData, tripClass: e.target.value });
          }}
          SelectProps={{ native: true }}
        >
          {TripClasses.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </TextField>
        </div>
        <div style={styles.wrapper}>
        <TextField
          select
          label="費用分類"
          value={costClass}
          onChange={e => {
            onChange({ ...tripData, costClass: e.target.value });
          }}
          SelectProps={{ native: true }}
        >
          {CostClasses.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </TextField>
      </div>
      <div style={styles.wrapper}>
        <TextField
          type="date"
          label="開始日"
          inputProps={{ max: endDate }}
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={e => {
            onChange({ ...tripData, startDate: e.target.value });
          }}
        />
      </div>
      <div style={styles.wrapper}>
        <TextField
          type="date"
          label="終了日"
          inputProps={{ min: startDate }}
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={e => {
            onChange({ ...tripData, endDate: e.target.value });
          }}
        />
      </div>
      <div style={styles.wrapper}>
        <TextField
          label="目的地"
          value={destination}
          onChange={e => {
            onChange({ ...tripData, destination: e.target.value });
          }}
        />
      </div>
      <div style={styles.wrapper}>
        <Button
          variant="contained"
          color="primary"
          disabled={!isValid}
          onClick={onSubmit}
        >
          次へ
        </Button>
      </div>
    </div>
  );
}

const styles = {
  form: {
    margin: 16,
  },
  wrapper: {
    marginTop: 16,
  },
};
