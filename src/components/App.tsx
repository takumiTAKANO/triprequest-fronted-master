import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { JobTitles, TripClasses, CostClasses, InitialDayData } from '../constants';
import { TripData, DayData } from '../types';
import TripForm from '../components/TripForm';
import DayForm from '../components/DayForm';
import Result from '../components/Result';

type Props = {};

type State = {
  step: number;
  tripData: TripData;
  editingDayDataIndex: number;
  dayData: Array<DayData>;
};

export default class App extends React.PureComponent<Props, State> {
  state = {
    step: 1,
    tripData: {
      jobTitle: JobTitles[0],
      tripClass: TripClasses[0],
      costClass: CostClasses[0],
      startDate: '',
      endDate: '',
      destination: '',
      maxDistance: 0,
    },
    editingDayDataIndex: 0,
    dayData: [],
  };

  onTripFormChange = (tripData: TripData) => this.setState({ tripData });
  onTripFormSubmit = (_: React.MouseEvent<any>) =>
    this.setState(state => ({
      ...state,
      step: state.step + 1,
      editingDayDataIndex: 0,
      dayData: [InitialDayData(state.tripData, 0)],
    }));

  onDayFormChange = (dayData: DayData) =>
    this.setState(state => ({
      ...state,
      dayData: [
        ...state.dayData.slice(0, state.editingDayDataIndex),
        dayData,
        ...state.dayData.slice(state.editingDayDataIndex + 1),
      ],
    }));
  onDayFormSubmit = (_: React.MouseEvent<any>) =>
    this.setState(state => {
      const dayData = state.dayData[state.editingDayDataIndex];
      const dayDataDistance = dayData.schedules.reduce((distance, schedule) => {
        if (schedule.type !== 'move') return distance;
        return schedule.distance + distance;
      }, 0);
      const maxDistance =
        dayDataDistance > state.tripData.maxDistance
          ? dayDataDistance
          : state.tripData.maxDistance;

      if (
        state.dayData[state.editingDayDataIndex].date === state.tripData.endDate
      ) {
        return {
          ...state,
          tripData: {
            ...state.tripData,
            maxDistance,
          },
          step: state.step + 1,
        };
      } else {
        return {
          ...state,
          tripData: {
            ...state.tripData,
            maxDistance,
          },
          editingDayDataIndex: state.editingDayDataIndex + 1,
          dayData: [
            ...state.dayData,
            InitialDayData(state.tripData, state.editingDayDataIndex + 1),
          ],
        };
      }
    });

  render() {
    const { step, tripData, editingDayDataIndex, dayData } = this.state;

    return (
      <>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              出張旅費申請
            </Typography>
          </Toolbar>
        </AppBar>
        {step === 1 && (
          <TripForm
            tripData={tripData}
            onChange={this.onTripFormChange}
            onSubmit={this.onTripFormSubmit}
          />
        )}
        {step === 2 && (
          <DayForm
            tripData={tripData}
            dayData={dayData[editingDayDataIndex]}
            onChange={this.onDayFormChange}
            onSubmit={this.onDayFormSubmit}
          />
        )}
        {step === 3 && <Result dayData={dayData} />}
      </>
    );
  }
}
