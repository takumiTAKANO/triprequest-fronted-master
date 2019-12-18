import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DayData, TripData } from '../types';

import { checkAccommodation, checkDailyAllowance } from '../lib/rule';
import BusinessScheduleFormDialog from '../components/BusinessScheduleFormDialog';
import MoveScheduleFormDialog from '../components/MoveScheduleFormDialog';

type Props = {
  tripData: TripData;
  dayData: DayData;
  onChange: (dayData: DayData) => void;
  onSubmit: (e: React.MouseEvent) => void;
};

type State = {
  loading: boolean;
  showBusinessForm: boolean;
  showMoveForm: boolean;
};

export default class DayForm extends React.PureComponent<Props, State> {
  state = {
    loading: false,
    showBusinessForm: false,
    showMoveForm: false,
  };

  calcAmount = () => {
    this.setState({ loading: true });
    const { tripData, dayData, onChange } = this.props;
    const {
      jobTitle,
      tripClass,
      costClass,
      startDate,
      endDate,
      destination,
      maxDistance,
    } = tripData;
    const { date, schedules } = dayData;

    const isOnMove = schedules.some(schedule => schedule.type === 'move');
    const isOnBusiness = schedules.some(
      schedule => schedule.type === 'business'
    );
    const oneWayDistanceFromDayData = schedules.reduce((distance, schedule) => {
      if (schedule.type !== 'move') return distance;
      return schedule.distance + distance;
    }, 0); // 移動日程のdistanceを合計したものを使う
    const oneWayDistance =
      oneWayDistanceFromDayData > maxDistance
        ? oneWayDistanceFromDayData
        : maxDistance; // これまでの移動距離で最大のものをルール実行では使う
    const roundTripDistance = oneWayDistance * 2;
    const stayClass = (() => {
      if (startDate === endDate) return '日帰り';
      if (date === startDate) return '宿泊(出発日)';
      if (date === endDate) return '宿泊(帰着日)';
      return '宿泊(滞在日)';
    })();
    const firstMoveData = schedules.find(schedule => schedule.type === 'move');
    const departureHour =
      firstMoveData != null && firstMoveData.type === 'move'
        ? firstMoveData.startHour
        : 0;
    const returnHour = schedules.reduce((hour, schedule) => {
      if (schedule.type !== 'move') return hour;
      return schedule.endHour;
    }, 24); // 最後の移動日程のendHourをセットする

    const isInFlightNight = false; // 移動データからチェックしたい
    const transportation = '鉄道'; // 移動データからチェックしたい

    Promise.all([
      checkAccommodation({
        tripClass,
        date,
        jobTitle,
        destination,
        isOnMove,
        isOnBusiness,
        isInFlightNight,
        oneWayDistance,
        stayClass,
      }),
      checkDailyAllowance({
        tripClass,
        date,
        jobTitle,
        destination,
        isOnMove,
        isOnBusiness,
        stayClass,
        transportation,
        roundTripDistance,
        departureHour,
        returnHour,
      }),
    ]).then(([accommodationData, dailyAllowanceData]) => {
      const {
        accommodationAmount,
        accommodationIsReasonStatementNecessary,
        accommodationDescription,
      } = accommodationData;
      const {
        dailyAllowanceAmount,
        dailyAllowanceDescription,
      } = dailyAllowanceData;

      onChange({
        ...dayData,
        accommodationAmount,
        accommodationIsReasonStatementNecessary,
        accommodationDescription,
        dailyAllowanceAmount,
        dailyAllowanceDescription,
      });
      this.setState({ loading: false });
    });
  };

  render() {
    const { loading, showBusinessForm, showMoveForm } = this.state;
    const { dayData,tripData, onChange, onSubmit } = this.props;
    const {
      date,
      schedules,
      accommodationAmount,
      accommodationIsReasonStatementNecessary,
      accommodationDescription,
      dailyAllowanceAmount,
      dailyAllowanceDescription,
    } = dayData;
   
    const isValid = accommodationAmount != null && dailyAllowanceAmount != null;

    return (
      <div style={{ margin: 16 }}>
        <Typography variant="headline">{date}</Typography>
        <div>
          {schedules.map(s => (
            <Paper key={s.text} style={{ marginTop: 8, padding: 8 }}>
              {s.text + (s.type === 'move' ? `(${s.fare}円)` : '')}
            </Paper>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <Button
            variant="contained"
            onClick={() => {
              this.setState({ showBusinessForm: true });
            }}
          >
            用務を追加
          </Button>
          <span style={{ margin: 8 }} />
          <Button
            variant="contained"
            onClick={() => {
              this.setState({ showMoveForm: true });
            }}
          >
            移動を追加
          </Button>
        </div>
        <div
          style={{
            display: 'inline-block',
            position: 'relative',
            marginTop: 16,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={this.calcAmount}
          >
            宿泊料、日当を計算する
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              color="secondary"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -12,
                marginLeft: -12,
              }}
            />
          )}
        </div>
        <div>
          {accommodationAmount != null && (
            <p>宿泊料：{accommodationAmount}円</p>
          )}
          {accommodationIsReasonStatementNecessary != null && (
            <p>
              宿泊料のために理由書が必要か：
              {accommodationIsReasonStatementNecessary}
            </p>
          )}
          {accommodationDescription != null && (
            <p>宿泊料についての説明：{accommodationDescription}</p>
          )}
          {dailyAllowanceAmount != null && (
            <p>日当：{dailyAllowanceAmount}円</p>
          )}
          {dailyAllowanceDescription != null && (
            <p>日当についての説明：{dailyAllowanceDescription}</p>
          )}
        </div>
        <div style={{ marginTop: 16 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={!isValid}
            onClick={onSubmit}
          >
            完了
          </Button>
        </div>
        <BusinessScheduleFormDialog
          open={showBusinessForm}
          onClose={() => this.setState({ showBusinessForm: false })}
          onSubmit={data => {
            onChange({ ...dayData, schedules: [...dayData.schedules, data] });
            this.setState({ showBusinessForm: false });
          }}
        />
        <MoveScheduleFormDialog
          date={date}
          open={showMoveForm}
        
          tripData={tripData}
         
          onClose={() => this.setState({ showMoveForm: false })}
          onSubmit={data => {
            onChange({ ...dayData, schedules: [...dayData.schedules, data] });
            this.setState({ showMoveForm: false });
          }}
        />
      </div>
    );
  }
}
